import { useEffect, useRef, useState } from "react";
import { showToast } from "./Toast.jsx";

// Chữ cái đầu của từ đầu và từ cuối trong tên, ví dụ "Nguyễn Văn An" → "NA".
const getInitials = (name) => {
  const words = String(name || "U").trim().split(/\s+/);
  return ((words[0]?.[0] || "") + (words.length > 1 ? words[words.length - 1][0] : words[0]?.[1] || "")).toUpperCase();
};

export default function Topbar({ title, subtitle, user, onToggleSidebar, onChangePassword, onLogout, onReload }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reloading, setReloading] = useState(false);
  const wrapRef = useRef(null);

  async function handleReload() {
    setReloading(true);
    try {
      await onReload();
      showToast("Đã tải lại dữ liệu từ Google Sheets.");
    } catch (error) {
      showToast(error.message || "Không tải lại được dữ liệu.", true);
    } finally {
      setReloading(false);
    }
  }

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event) => { if (!wrapRef.current?.contains(event.target)) setMenuOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  const displayName = user?.ho_ten || user?.id || "Chưa đăng nhập";
  const role = user?.quyen === "admin" ? "Quản trị viên" : (user?.chuc_vu || "Nhân viên");
  const initials = getInitials(displayName);
  const pick = (action) => () => { setMenuOpen(false); action(); };
  const notReady = () => showToast("Chức năng đang phát triển");

  return (
    <header className="topbar">
      <div className="page-head">
        <button className="menu-toggle" type="button" title="Đóng/Mở menu" aria-label="Đóng/Mở menu" onClick={onToggleSidebar}>
          <svg className="icon-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6L9 12L15 18" />
          </svg>
          <svg className="icon-menu" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <p className="page-crumb">{subtitle}</p>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="topbar-right">
        {onReload && (
          <button type="button" className={`topbar-icon-btn${reloading ? " spinning" : ""}`} title="Tải lại dữ liệu từ Google Sheets"
            aria-label="Tải lại dữ liệu" onClick={handleReload} disabled={reloading}>
            <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></svg>
          </button>
        )}
        <div className="user-menu-wrap" ref={wrapRef}>
          <button type="button" className="user-menu-toggle" onClick={() => setMenuOpen((open) => !open)}>
            <div className="user-avatar">
              {initials}
              <span className="user-avatar-dot"></span>
            </div>
            <div className="user-menu-name">
              <strong>{displayName}</strong>
              <small>{role}</small>
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#aaa" strokeWidth="2.5">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {menuOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-head">
                <strong>{displayName}</strong>
                <small>{role}</small>
              </div>
              <div>
                <button className="user-menu-item" type="button" onClick={pick(notReady)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  Hồ sơ cá nhân
                </button>
                <button className="user-menu-item" type="button" onClick={pick(notReady)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                  Cài đặt hệ thống
                </button>
                <button className="user-menu-item" type="button" onClick={pick(onChangePassword)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Đổi mật khẩu
                </button>
                <hr className="user-menu-divider" />
                <button className="user-menu-item danger" type="button" onClick={pick(onLogout)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
