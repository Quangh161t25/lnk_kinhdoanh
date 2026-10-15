import { SHEETS, AUTH_SHEET } from "../shared/schema.js";
import { route } from "./_lib/http.js";
import { listSheetTitles } from "./_lib/sheets.js";

const ENV_VARS = ["SPREADSHEET_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "SESSION_SECRET"];

// Kiểm tra cấu hình khi deploy: mở /api/health trên trình duyệt.
// Chỉ báo biến nào đã có / thiếu và kết nối được Google hay không, không lộ giá trị nào.
export default route("GET", async (req, res) => {
  const env = Object.fromEntries(ENV_VARS.map((name) => [name, Boolean(process.env[name]?.trim())]));
  const sessionSecretOk = (process.env.SESSION_SECRET || "").trim().length >= 32;

  let google = "ok";
  let missingSheets = [];
  try {
    const titles = new Set(await listSheetTitles());
    missingSheets = [AUTH_SHEET, ...Object.keys(SHEETS)].filter((name) => !titles.has(name));
  } catch (error) {
    google = error.message;
  }

  const ok = Object.values(env).every(Boolean) && sessionSecretOk && google === "ok" && !missingSheets.includes(AUTH_SHEET);
  res.status(ok ? 200 : 500).json({
    ok,
    env,
    sessionSecret: sessionSecretOk ? "ok" : "Thiếu hoặc ngắn hơn 32 ký tự",
    google,
    missingSheets
  });
});
