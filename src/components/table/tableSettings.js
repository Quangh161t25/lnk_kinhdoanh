import { useCallback, useState } from "react";

// Tùy chỉnh cột của từng bảng, lưu trong trình duyệt (localStorage) theo id bảng.
const storageKey = (tableId) => `lk.table.${tableId}`;

export const DEFAULT_SETTINGS = {
  order: [],        // thứ tự key cột do người dùng kéo thả
  hidden: [],       // key cột đang ẩn
  pinned: [],       // key cột cố định bên trái khi cuộn ngang
  align: {},        // key → "left" | "center" | "right"
  width: {},        // key → độ rộng px
  label: {},        // key → tên cột tự đặt
  wrap: {},         // key → true: cho chữ xuống dòng
  bold: {},         // key → true: chữ đậm
  density: "normal", // "compact" | "normal" | "comfortable"
  striped: false,
  headerWrap: false
};

function load(tableId) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(tableId)));
    return saved && typeof saved === "object" ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useTableSettings(tableId) {
  const [settings, setSettings] = useState(() => load(tableId));

  const update = useCallback((patch) => {
    setSettings((current) => {
      const next = typeof patch === "function" ? patch(current) : { ...current, ...patch };
      try { localStorage.setItem(storageKey(tableId), JSON.stringify(next)); } catch { }
      return next;
    });
  }, [tableId]);

  const reset = useCallback(() => {
    try { localStorage.removeItem(storageKey(tableId)); } catch { }
    setSettings(DEFAULT_SETTINGS);
  }, [tableId]);

  return [settings, update, reset];
}

// Ghép định nghĩa cột trong code với tùy chỉnh đã lưu. Cột mới (chưa có trong thứ tự đã lưu)
// được chèn ngay sau cột đứng trước nó trong định nghĩa gốc. Cột cố định luôn đứng đầu.
export function resolveColumns(columns, settings) {
  const byKey = new Map(columns.map((column) => [column.key, column]));
  const order = settings.order.filter((key) => byKey.has(key));
  columns.forEach((column, index) => {
    if (order.includes(column.key)) return;
    const prev = columns[index - 1]?.key;
    const at = prev ? order.indexOf(prev) + 1 : 0;
    order.splice(at, 0, column.key);
  });

  const list = order.map((key) => {
    const column = byKey.get(key);
    return {
      ...column,
      defaultLabel: column.label,
      label: settings.label[key] || column.label,
      align: settings.align[key] || column.align || "left",
      width: settings.width[key] > 0 ? Math.max(40, settings.width[key]) : column.width || null,
      wrap: Boolean(settings.wrap[key]),
      bold: Boolean(settings.bold[key]),
      hidden: settings.hidden.includes(key),
      pinned: settings.pinned.includes(key)
    };
  });
  return [...list.filter((c) => c.pinned), ...list.filter((c) => !c.pinned)];
}

export const isCustomized = (settings) => JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS);
