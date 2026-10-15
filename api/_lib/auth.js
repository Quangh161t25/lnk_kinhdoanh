import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { AUTH_SHEET } from "../../shared/schema.js";
import { HttpError, ConfigError } from "./http.js";
import { readSheet } from "./sheets.js";

const COOKIE_NAME = "lk_session";
const SESSION_MAX_AGE = 7 * 24 * 3600;
const PASSWORD_COLUMN = "G"; // cột mk trong sheet DSNV

const USER_FIELDS = ["id", "ho_ten", "hinh_anh", "gioi_tinh", "ngay_sinh", "quyen", "mk", "email", "dien_thoai", "chuc_vu", "phong_ban", "trang_thai", "ngay_vao_lam", "chi_nhanh_lam_viec", "file_ho_so"];

export const normalizeRole = (value) => String(value || "").trim().toLowerCase();
export const isAdmin = (user) => normalizeRole(user?.quyen) === "admin";

export function parseUsers(values) {
  return (values || []).slice(1).map((row, index) => {
    const user = { rowNumber: index + 2 };
    USER_FIELDS.forEach((field, col) => { user[field] = String(row[col] || "").trim(); });
    user.quyen = normalizeRole(user.quyen);
    return user;
  }).filter((user) => user.id);
}

// Thông tin user gửi ra trình duyệt: bỏ mật khẩu và số dòng.
export function publicUser(user) {
  const { mk, rowNumber, ...rest } = user;
  return rest;
}

// Danh sách nhân viên cho các ô chọn/hiển thị tên: chỉ id và họ tên.
export const staffList = (users) => users.map((user) => ({ id: user.id, ho_ten: user.ho_ten }));

export const isHashed = (stored) => /^\$2[aby]\$/.test(stored || "");

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export async function verifyPassword(user, password) {
  const input = String(password || "").trim();
  if (!input || !user?.mk) return false;
  if (isHashed(user.mk)) return bcrypt.compare(input, user.mk);
  return safeEqual(user.mk, input);
}

export const hashPassword = (password) => bcrypt.hash(String(password).trim(), 10);
export const passwordCell = (user) => `${PASSWORD_COLUMN}${user.rowNumber}`;

// ---- Cookie phiên đăng nhập (ký HMAC, không lưu gì ở server) ----

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.trim().length < 32) throw new ConfigError("SESSION_SECRET chưa cấu hình trên Vercel hoặc ngắn hơn 32 ký tự.");
  return secret;
}

const sign = (value) => crypto.createHmac("sha256", sessionSecret()).update(value).digest("base64url");

// Dấu vân tay mật khẩu: đổi mật khẩu sẽ làm mọi phiên cũ hết hiệu lực.
const passwordVersion = (user) => sign(`pv:${user.mk}`).slice(0, 12);

function cookie(value, maxAge) {
  const secure = process.env.VERCEL || process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function sessionCookie(user) {
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    pv: passwordVersion(user),
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
  })).toString("base64url");
  return cookie(`${payload}.${sign(payload)}`, SESSION_MAX_AGE);
}

export const clearSessionCookie = () => cookie("", 0);

function readSessionPayload(req) {
  const header = req.headers.cookie || "";
  const raw = header.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return null;
  const [payload, signature] = raw.slice(COOKIE_NAME.length + 1).split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.exp > Date.now() / 1000 ? data : null;
  } catch {
    return null;
  }
}

// Xác thực request. Luôn đọc lại DSNV để quyền và mật khẩu mới nhất có hiệu lực ngay.
export async function requireUser(req, authValues) {
  const session = readSessionPayload(req);
  if (!session) throw new HttpError(401, "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
  const users = parseUsers(authValues || await readSheet(AUTH_SHEET));
  const user = users.find((item) => item.id === session.sub);
  if (!user || session.pv !== passwordVersion(user)) {
    throw new HttpError(401, "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
  }
  return { user, users };
}

export async function requireAdmin(req) {
  const result = await requireUser(req);
  if (!isAdmin(result.user)) throw new HttpError(403, "Chỉ admin mới được ghi dữ liệu lên Google Sheets.");
  return result;
}
