import crypto from "node:crypto";
import { requiredEnv, ConfigError } from "./http.js";
import * as mock from "./mock.js";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

// Dữ liệu giả lập chỉ dùng khi chạy ở máy, không bao giờ bật trên Vercel.
const useMock = () => process.env.MOCK_SHEETS === "1" && !process.env.VERCEL;

let tokenCache = { token: "", expiresAt: 0 };

const stripQuotes = (value) => value.replace(/^(['"])([\s\S]*)\1$/, "$2").trim();

// Chấp nhận cả 3 cách dán: chuỗi có "\n", chuỗi nhiều dòng, hoặc dán nguyên file JSON của service account.
function serviceAccount() {
  let key = stripQuotes(requiredEnv("GOOGLE_PRIVATE_KEY"));
  let email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? stripQuotes(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.trim()) : "";
  if (key.startsWith("{")) {
    try {
      const json = JSON.parse(key);
      key = json.private_key || "";
      email ||= json.client_email || "";
    } catch {
      throw new ConfigError("GOOGLE_PRIVATE_KEY trông giống file JSON nhưng không đọc được. Hãy dán riêng giá trị private_key.");
    }
  }
  key = key.replace(/\\n/g, "\n").replace(/\r/g, "");
  if (!/-----BEGIN PRIVATE KEY-----[\s\S]+-----END PRIVATE KEY-----/.test(key)) {
    throw new ConfigError("GOOGLE_PRIVATE_KEY không đúng định dạng: phải bắt đầu bằng -----BEGIN PRIVATE KEY----- và kết thúc bằng -----END PRIVATE KEY-----.");
  }
  if (!email) requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  return { key, email };
}

// Cho phép dán cả URL của Google Sheet thay vì chỉ ID.
function spreadsheetId() {
  const raw = stripQuotes(requiredEnv("SPREADSHEET_ID"));
  return /\/d\/([a-zA-Z0-9_-]+)/.exec(raw)?.[1] || raw;
}

async function getAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt - 300000) return tokenCache.token;
  const { key, email } = serviceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })).toString("base64url");
  let signature;
  try {
    signature = crypto.sign("RSA-SHA256", Buffer.from(`${header}.${claims}`), key).toString("base64url");
  } catch {
    throw new ConfigError("GOOGLE_PRIVATE_KEY không hợp lệ (không ký được). Hãy dán lại đúng private key của service account.");
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!data.access_token) {
    const reason = data.error_description || data.error || `HTTP ${response.status}`;
    throw new ConfigError(`Google từ chối service account (${reason}). Kiểm tra GOOGLE_SERVICE_ACCOUNT_EMAIL có khớp với key, và key chưa bị xóa.`);
  }
  tokenCache = { token: data.access_token, expiresAt: Date.now() + Number(data.expires_in || 3600) * 1000 };
  return tokenCache.token;
}

function explainSheetsError(status, message) {
  if (status === 403) return `Service account không có quyền với spreadsheet (${message}). Hãy Share sheet cho email service account với quyền Editor, và bật Google Sheets API trong Google Cloud.`;
  if (status === 404) return "Không tìm thấy spreadsheet. Kiểm tra lại SPREADSHEET_ID.";
  return `Google Sheets trả về lỗi: ${message}`;
}

async function sheetsRequest(path, init = {}) {
  const token = await getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId())}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    throw new ConfigError(explainSheetsError(response.status, data.error?.message || `HTTP ${response.status}`));
  }
  return data;
}

// Danh sách tên các tab trong spreadsheet (dùng cho /api/health).
export async function listSheetTitles() {
  if (useMock()) return Object.keys(mock.all());
  const data = await sheetsRequest("?fields=sheets.properties.title");
  return (data.sheets || []).map((sheet) => sheet.properties.title);
}

const rangePath = (range) => `/values/${encodeURIComponent(range)}`;

export async function readSheet(sheetName) {
  if (useMock()) return mock.read(sheetName);
  const data = await sheetsRequest(rangePath(`${sheetName}!A:Z`));
  return data.values || [];
}

// Đọc nhiều sheet trong một lần gọi. Sheet nào lỗi (ví dụ chưa tạo) sẽ trả về mảng rỗng.
export async function readSheets(sheetNames) {
  if (useMock()) return Object.fromEntries(sheetNames.map((name) => [name, mock.read(name)]));
  try {
    const query = sheetNames.map((name) => `ranges=${encodeURIComponent(`${name}!A:Z`)}`).join("&");
    const data = await sheetsRequest(`/values:batchGet?${query}`);
    return Object.fromEntries(sheetNames.map((name, index) => [name, data.valueRanges?.[index]?.values || []]));
  } catch (error) {
    console.warn("batchGet lỗi, đọc từng sheet:", error.message);
    const entries = await Promise.all(sheetNames.map(async (name) => {
      try {
        return [name, await readSheet(name)];
      } catch (err) {
        console.warn(`Bỏ qua lỗi tải sheet ${name}:`, err.message);
        return [name, []];
      }
    }));
    return Object.fromEntries(entries);
  }
}

export async function appendRows(sheetName, rows) {
  if (!rows.length) return;
  if (useMock()) return mock.append(sheetName, rows);
  await sheetsRequest(`${rangePath(`${sheetName}!A:A`)}:append?valueInputOption=USER_ENTERED`, {
    method: "POST",
    body: JSON.stringify({ values: rows })
  });
}

// Ghi đè toàn bộ dữ liệu (giữ dòng tiêu đề). Ghi dữ liệu mới trước rồi mới xóa phần thừa
// phía dưới, để sheet không bao giờ bị trống nếu lỗi mạng xảy ra giữa chừng.
export async function replaceRows(sheetName, rows) {
  if (useMock()) return mock.replace(sheetName, rows);
  if (rows.length) {
    await sheetsRequest(`${rangePath(`${sheetName}!A2`)}?valueInputOption=USER_ENTERED`, {
      method: "PUT",
      body: JSON.stringify({ values: rows })
    });
  }
  await sheetsRequest(`${rangePath(`${sheetName}!A${rows.length + 2}:Z`)}:clear`, { method: "POST", body: "{}" });
}

export async function updateCell(sheetName, cell, value) {
  if (useMock()) return mock.updateCell(sheetName, cell, value);
  await sheetsRequest(`${rangePath(`${sheetName}!${cell}`)}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({ values: [[value]] })
  });
}
