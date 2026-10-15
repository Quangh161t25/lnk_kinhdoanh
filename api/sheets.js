import { SHEETS } from "../shared/schema.js";
import { route, getBody, HttpError } from "./_lib/http.js";
import { appendRows, replaceRows } from "./_lib/sheets.js";
import { requireAdmin } from "./_lib/auth.js";

const MAX_ROWS = 50000;

function cleanRows(rows, width) {
  if (!Array.isArray(rows) || rows.length > MAX_ROWS) throw new HttpError(400, "Dữ liệu dòng không hợp lệ.");
  return rows.map((row) => {
    if (!Array.isArray(row)) throw new HttpError(400, "Dữ liệu dòng không hợp lệ.");
    return Array.from({ length: width }, (_, index) => {
      const cell = row[index];
      if (cell == null) return "";
      if (typeof cell === "number" || typeof cell === "boolean") return cell;
      return String(cell);
    });
  });
}

// Ghi dữ liệu nghiệp vụ. Chỉ admin, và chỉ các sheet có trong SHEETS (không bao giờ là DSNV).
export default route("POST", async (req, res) => {
  await requireAdmin(req);
  const { action, sheet, rows } = getBody(req);
  const headers = Object.hasOwn(SHEETS, sheet) ? SHEETS[sheet] : null;
  if (!headers) throw new HttpError(400, "Sheet không hợp lệ.");
  const values = cleanRows(rows, headers.length);

  if (action === "append") await appendRows(sheet, values);
  else if (action === "replace") await replaceRows(sheet, values);
  else throw new HttpError(400, "Thao tác không hợp lệ.");

  res.status(200).json({ ok: true });
});
