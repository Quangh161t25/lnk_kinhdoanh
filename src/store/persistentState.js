import { useCallback, useState } from "react";

// State giữ lại khi chuyển qua lại giữa các tab (bộ lọc, sắp xếp...), xóa khi đăng xuất.
const saved = new Map();

export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => (saved.has(key) ? saved.get(key) : initialValue));
  const update = useCallback((next) => {
    setValue((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      saved.set(key, resolved);
      return resolved;
    });
  }, [key]);
  return [value, update];
}

export const clearPersistentState = () => saved.clear();
