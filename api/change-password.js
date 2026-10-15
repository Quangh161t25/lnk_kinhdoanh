import { AUTH_SHEET } from "../shared/schema.js";
import { route, getBody, HttpError } from "./_lib/http.js";
import { updateCell } from "./_lib/sheets.js";
import { requireUser, verifyPassword, hashPassword, passwordCell, sessionCookie } from "./_lib/auth.js";

// Chỉ ghi đúng ô mật khẩu của người dùng (bản cũ ghi lại cả sheet và làm lệch dòng).
export default route("POST", async (req, res) => {
  const { user } = await requireUser(req);
  const { oldPassword, newPassword } = getBody(req);
  const next = String(newPassword || "").trim();

  if (!(await verifyPassword(user, oldPassword))) throw new HttpError(400, "Mật khẩu hiện tại không đúng!");
  if (next.length < 4) throw new HttpError(400, "Mật khẩu mới phải có ít nhất 4 ký tự!");

  user.mk = await hashPassword(next);
  await updateCell(AUTH_SHEET, passwordCell(user), user.mk);

  // Cấp lại cookie: các phiên đăng nhập khác của tài khoản này sẽ hết hiệu lực.
  res.setHeader("Set-Cookie", sessionCookie(user));
  res.status(200).json({ ok: true });
});
