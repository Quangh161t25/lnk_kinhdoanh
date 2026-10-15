import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SHEETS } from "../../shared/schema.js";
import { api } from "../api.js";
import { showToast } from "../components/Toast.jsx";
import { EMPTY_DATA, normalizeData, appendRows, replaceSheet, loadCache, saveCache, clearCache } from "./data.js";
import { clearPersistentState } from "./persistentState.js";

// Kho dữ liệu dùng chung cho mọi tab (thay cho appState/fullAppState của bản cũ).
// Server đã lọc dữ liệu theo quyền, nên nhân viên chỉ nhận đúng phần của mình.
const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

const isAdminUser = (user) => String(user?.quyen || "").trim().toLowerCase() === "admin";
const nowText = () => new Date().toLocaleString("vi-VN");

// id → giá trị một cột; trùng id thì lấy dòng đầu tiên (như Array.find).
function lookup(rows, field) {
  const map = new Map();
  rows.forEach((row) => { if (!map.has(row.id)) map.set(row.id, row[field]); });
  return map;
}

export function DataProvider({ user, staff, onUser, onUnauthorized, children }) {
  const [initial] = useState(() => loadCache(user.id));
  const [data, setData] = useState(initial?.data || EMPTY_DATA);
  const [users, setUsers] = useState(Array.isArray(staff) ? staff : []);
  const [syncMeta, setSyncMeta] = useState(initial?.syncMeta || { lastLoadedAt: "", sourceSheets: [] });
  const dataRef = useRef(data);
  const isAdmin = isAdminUser(user);
  const isAdminRef = useRef(isAdmin);
  isAdminRef.current = isAdmin;

  // Thay toàn bộ dữ liệu (đã chuẩn hóa lại) và trả về bản mới để dùng tiếp ngay.
  const commit = useCallback((next) => {
    const normalized = normalizeData(next);
    dataRef.current = normalized;
    setData(normalized);
    return normalized;
  }, []);

  const markSynced = useCallback(() => {
    setSyncMeta({ lastLoadedAt: nowText(), sourceSheets: Object.keys(SHEETS) });
  }, []);

  const requireAdmin = useCallback((message = "Bạn không có quyền thực hiện thao tác này.") => {
    if (isAdminRef.current) return true;
    showToast(message, true);
    return false;
  }, []);

  const reload = useCallback(async () => {
    const result = await api.get("/api/data");
    setUsers(Array.isArray(result.staff) ? result.staff : []);
    onUser?.(result.user);
    commit(result.data);
    markSynced();
    return result;
  }, [commit, markSynced, onUser]);

  // Ghi đè toàn bộ các sheet nghiệp vụ bằng dữ liệu hiện tại (dùng khi ghi từng phần bị lỗi).
  const persistAll = useCallback(async (successMessage = "Đã lưu dữ liệu.") => {
    if (!requireAdmin("Chỉ admin mới được ghi dữ liệu lên Google Sheets.")) return;
    const current = commit(dataRef.current);
    for (const sheet of Object.keys(SHEETS)) await replaceSheet(sheet, current[sheet]);
    markSynced();
    showToast(successMessage);
  }, [commit, markSynced, requireAdmin]);

  // Thêm mới (append) hoặc sửa (ghi đè cả sheet) một bản ghi theo id.
  // Trả về false nếu cả lần ghi lại toàn bộ cũng lỗi.
  const saveRecord = useCallback(async (sheet, record, { merge = true, addedMessage, updatedMessage, fallbackMessage = "Đã lưu dữ liệu." }) => {
    const rows = dataRef.current[sheet];
    const index = rows.findIndex((row) => row.id === record.id);
    const isNew = index < 0;
    const nextRows = isNew ? [...rows, record] : rows.map((row, i) => (i === index ? (merge ? { ...row, ...record } : record) : row));
    const next = commit({ ...dataRef.current, [sheet]: nextRows });
    try {
      if (isNew) await appendRows(sheet, [next[sheet][next[sheet].length - 1]]);
      else await replaceSheet(sheet, next[sheet]);
      markSynced();
      showToast(isNew ? addedMessage : updatedMessage);
    } catch (error) {
      console.error(error);
      try {
        await persistAll(fallbackMessage);
      } catch (persistError) {
        console.error(persistError);
        showToast(persistError.message || "Lỗi khi lưu dữ liệu.", true);
        return false;
      }
    }
    return true;
  }, [commit, markSynced, persistAll]);

  useEffect(() => {
    reload().catch((error) => {
      console.error(error);
      if (error.status === 401) return onUnauthorized?.();
      showToast("Không tải được dữ liệu sheet, đang dùng dữ liệu cache.", true);
    });
    return () => {
      clearCache();
      clearPersistentState();
    };
  }, []);

  useEffect(() => { saveCache(user.id, data, syncMeta); }, [user.id, data, syncMeta]);

  const value = useMemo(() => {
    const customerNames = lookup(data.KHACH_HANG, "ten_kh");
    const productNames = lookup(data.DS_SP, "ten_sp");
    const staffNames = lookup(users, "ho_ten");
    return {
      data, users, user, isAdmin, syncMeta,
      getData: () => dataRef.current,
      customerName: (id) => customerNames.get(id) || id,
      productName: (id) => productNames.get(id) || id,
      staffName: (id) => (staffNames.has(id) ? staffNames.get(id) : id),
      commit, markSynced, requireAdmin, reload, persistAll, saveRecord
    };
  }, [data, users, user, isAdmin, syncMeta, commit, markSynced, requireAdmin, reload, persistAll, saveRecord]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
