import { Suspense, useEffect, useState } from "react";
import { NAV_ITEMS } from "../nav.js";
import { TABS } from "../tabs/index.js";
import { DataProvider, useData } from "../store/DataContext.jsx";
import { DrawerProvider } from "./Drawer.jsx";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import Toast from "./Toast.jsx";
import ChangePasswordModal from "./ChangePasswordModal.jsx";

const readCollapsed = () => {
  try { return localStorage.getItem("sidebar_collapsed") === "1"; } catch { return false; }
};

export default function MainApp({ user: initialUser, staff, onLogout }) {
  const [user, setUser] = useState(initialUser);
  return (
    <DataProvider user={user} staff={staff} onUser={setUser} onUnauthorized={onLogout}>
      <DrawerProvider>
        <Shell user={user} onLogout={onLogout} />
      </DrawerProvider>
      <Toast />
    </DataProvider>
  );
}

const isMobile = () => window.matchMedia("(max-width: 900px)").matches;

function Shell({ user, onLogout }) {
  const { syncMeta, reload } = useData();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Màn hình nhỏ: nút menu mở/đóng ngăn kéo. Màn hình lớn: thu gọn/mở rộng sidebar.
  const toggleSidebar = () => {
    if (isMobile()) return setMobileOpen((open) => !open);
    setCollapsed((value) => {
      try { localStorage.setItem("sidebar_collapsed", value ? "0" : "1"); } catch { }
      return !value;
    });
  };

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event) => { if (event.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const meta = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0];
  const ActiveTab = TABS[meta.id];

  return (
    <div className={`app${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`}>
      <Sidebar activeTab={meta.id} onSelect={selectTab} syncMeta={syncMeta} />
      <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      <div className="main">
        <Topbar
          title={meta.label}
          subtitle={meta.subtitle}
          user={user}
          onToggleSidebar={toggleSidebar}
          onChangePassword={() => setChangingPassword(true)}
          onLogout={onLogout}
          onReload={reload}
        />
        <main className="content">
          <section id={meta.id} className="section active" key={meta.id}>
            <Suspense fallback={<div className="loading-box"><div className="spinner"></div></div>}>
              <ActiveTab onNavigate={selectTab} />
            </Suspense>
          </section>
        </main>
      </div>
      {changingPassword && <ChangePasswordModal onClose={() => setChangingPassword(false)} />}
    </div>
  );
}
