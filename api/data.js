import { SHEETS, AUTH_SHEET } from "../shared/schema.js";
import { route } from "./_lib/http.js";
import { readSheets } from "./_lib/sheets.js";
import { requireUser, publicUser, staffList } from "./_lib/auth.js";
import { rowsToObjects, filterDataForUser } from "./_lib/access.js";

// Tải toàn bộ dữ liệu nghiệp vụ trong một lần gọi, đã lọc theo quyền người dùng.
export default route("GET", async (req, res) => {
  const values = await readSheets([AUTH_SHEET, ...Object.keys(SHEETS)]);
  const { user, users } = await requireUser(req, values[AUTH_SHEET]);

  const data = Object.fromEntries(Object.entries(SHEETS).map(([name, headers]) => [name, rowsToObjects(values[name], headers)]));
  res.status(200).json({
    user: publicUser(user),
    staff: staffList(users),
    data: filterDataForUser(data, user)
  });
});
