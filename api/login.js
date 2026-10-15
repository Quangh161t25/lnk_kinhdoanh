import { AUTH_SHEET } from "../shared/schema.js";
import { route, getBody, HttpError } from "./_lib/http.js";
import { readSheet, updateCell } from "./_lib/sheets.js";
import { parseUsers, verifyPassword, isHashed, hashPassword, passwordCell, sessionCookie, publicUser, staffList } from "./_lib/auth.js";

export default route("POST", async (req, res) => {
  const { username, password } = getBody(req);
  const id = String(username || "").trim();
  if (!id || !String(password || "").trim()) throw new HttpError(400, "Vui lòng nhập tài khoản và mật khẩu.");

  const users = parseUsers(await readSheet(AUTH_SHEET));
  const user = users.find((item) => item.id === id);
  if (!user || !(await verifyPassword(user, password))) {
    await new Promise((resolve) => setTimeout(resolve, 400)); // làm chậm dò mật khẩu
    throw new HttpError(401, "Sai tài khoản hoặc mật khẩu.");
  }

  // Mật khẩu cũ còn lưu dạng chữ thường: chuyển sang dạng mã hóa ngay khi đăng nhập đúng.
  if (!isHashed(user.mk)) {
    try {
      const hashed = await hashPassword(password);
      await updateCell(AUTH_SHEET, passwordCell(user), hashed);
      user.mk = hashed;
    } catch (error) {
      console.warn("Không mã hóa được mật khẩu cũ:", error.message);
    }
  }

  res.setHeader("Set-Cookie", sessionCookie(user));
  res.status(200).json({ user: publicUser(user), staff: staffList(users) });
});
