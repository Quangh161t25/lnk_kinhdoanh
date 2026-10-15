// Chuẩn hóa dữ liệu nghiệp vụ và ghi xuống Google Sheets qua API.
import { SHEETS } from "../../shared/schema.js";
import { api } from "../api.js";
import { randomId, todayInput } from "../lib/format.js";

export const EMPTY_DATA = { KHACH_HANG: [], DS_SP: [], DH: [], DH_CT: [], KPI: [], CONG_NO: [], DK_THUONG: [] };

const list = (value) => (Array.isArray(value) ? value : []);

// Tạo bảng DH (đơn hàng) từ DH_CT và chuẩn hóa CONG_NO, giống recalcState bản cũ.
export function normalizeData(input = {}) {
  const orderMap = {};
  list(input.DH_CT).forEach((row) => {
    const orderId = String(row.id_dh || "").trim();
    if (!orderId) return;
    if (!orderMap[orderId]) {
      orderMap[orderId] = { id: orderId, ngay: row.ngay || todayInput(), npp: row.npp || "", id_nv: row.id_nv || "", thanh_tien: 0 };
    }
    const order = orderMap[orderId];
    if (!order.npp && row.npp) order.npp = row.npp;
    if (!order.id_nv && row.id_nv) order.id_nv = row.id_nv;
    order.thanh_tien += Number(row.thanh_tien || (Number(row.don_gia || 0) * Number(row.slg || 1)));
  });

  return {
    KHACH_HANG: list(input.KHACH_HANG),
    DS_SP: list(input.DS_SP),
    DH: Object.values(orderMap),
    DH_CT: list(input.DH_CT),
    KPI: list(input.KPI),
    CONG_NO: list(input.CONG_NO).map((row) => ({
      id: row.id || randomId("CN"),
      ngay: row.ngay || todayInput(),
      id_khach_hang: row.id_khach_hang || "",
      id_dh: row.id_dh || "",
      thu_chi: row.thu_chi === "thu" ? "thu" : "chi",
      so_tien: Number(row.so_tien || 0),
      cong_no: row.cong_no === "" || row.cong_no == null ? "" : Number(row.cong_no || 0),
      id_nv: row.id_nv || ""
    })),
    DK_THUONG: list(input.DK_THUONG)
  };
}

function objectsToRows(items, headers) {
  return items.map((item) => headers.map((header) => {
    if (item[header] === null) return null;
    return item[header] === undefined ? "" : item[header];
  }));
}

export const appendRows = (sheet, items) =>
  api.post("/api/sheets", { action: "append", sheet, rows: objectsToRows(items, SHEETS[sheet]) });

export const replaceSheet = (sheet, items) =>
  api.post("/api/sheets", { action: "replace", sheet, rows: objectsToRows(items, SHEETS[sheet]) });

// ---- Bộ nhớ đệm trên trình duyệt (giữ khóa và định dạng của bản cũ) ----

const STORAGE_KEY = "lockking-sales-sheet-session-v2";

export function loadCache(userId) {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed || parsed.userId !== userId) return null;
    return { data: normalizeData(parsed.appState || {}), syncMeta: parsed.syncMeta };
  } catch {
    return null;
  }
}

export function saveCache(userId, data, syncMeta) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId, appState: data, syncMeta })); } catch { }
}

export function clearCache() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { }
}
