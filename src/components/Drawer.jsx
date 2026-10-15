import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Ngăn kéo chi tiết bên phải. Các tab gọi useDrawer().open(title, subtitle, <Nội dung />).
const DrawerContext = createContext(null);

export const useDrawer = () => useContext(DrawerContext);

export function DrawerProvider({ children }) {
  const [drawer, setDrawer] = useState({ open: false, key: 0, title: "Chi tiết", subtitle: "Thông tin", content: null });

  const open = useCallback((title, subtitle, content) => {
    setDrawer((current) => ({ open: true, key: current.key + 1, title, subtitle, content }));
  }, []);
  const close = useCallback(() => setDrawer((current) => ({ ...current, open: false })), []);

  useEffect(() => {
    document.body.style.overflow = drawer.open ? "hidden" : "";
    if (drawer.open) return;
    // Giữ nội dung trong lúc ngăn kéo trượt ra, rồi mới xóa.
    const timer = setTimeout(() => setDrawer((current) => (current.open ? current : { ...current, content: null })), 300);
    return () => clearTimeout(timer);
  }, [drawer.open]);

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <DrawerContext.Provider value={value}>
      {children}
      <div className={`drawer-backdrop${drawer.open ? " open" : ""}`} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className="drawer">
          <div className="drawer-head">
            <div>
              <h3>{drawer.title}</h3>
              <p>{drawer.subtitle}</p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={close}>Đóng</button>
          </div>
          <div key={drawer.key}>{drawer.content}</div>
        </div>
      </div>
    </DrawerContext.Provider>
  );
}
