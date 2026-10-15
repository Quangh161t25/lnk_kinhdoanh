import { STAFF_SCOPED_SHEETS } from "../../shared/schema.js";
import { isAdmin } from "./auth.js";

export function rowsToObjects(values, headers) {
  return (values || []).slice(1)
    .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] == null ? "" : row[index]])));
}

// Lọc dữ liệu theo quyền NGAY TẠI SERVER: nhân viên không nhận được dòng của người khác.
// Quy tắc giữ giống bản cũ (filterStateByUser).
export function filterDataForUser(data, user) {
  if (isAdmin(user)) return data;
  const userId = String(user.id || "").trim();
  const filtered = { ...data };
  STAFF_SCOPED_SHEETS.forEach((sheet) => {
    filtered[sheet] = (data[sheet] || []).filter((row) => String(row.id_nv || "").trim() === userId);
  });

  const customerIds = new Set([
    ...filtered.DH_CT.map((row) => String(row.npp || "").trim()),
    ...filtered.CONG_NO.map((row) => String(row.id_khach_hang || "").trim())
  ].filter(Boolean));
  const productIds = new Set(filtered.DH_CT.map((row) => String(row.id_sp || "").trim()).filter(Boolean));

  filtered.KHACH_HANG = (data.KHACH_HANG || []).filter((row) => customerIds.has(String(row.id || "").trim()));
  filtered.DS_SP = (data.DS_SP || []).filter((row) => productIds.has(String(row.id || "").trim()));
  return filtered;
}
