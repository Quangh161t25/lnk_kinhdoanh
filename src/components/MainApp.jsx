import { Suspense, useState } from "react";
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

function Shell({ user, onLogout }) {
  const { syncMeta } = useData();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [changingPassword, setChangingPassword] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((value) => {
      try { localStorage.setItem("sidebar_collapsed", value ? "0" : "1"); } catch { }
      return !value;
    });
  };

  const meta = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0];
  const ActiveTab = TABS[meta.id];

  return (
    <div className={`app${collapsed ? " collapsed" : ""}`}>
      <Sidebar activeTab={meta.id} onSelect={setActiveTab} syncMeta={syncMeta} />
      <div className="main">
        <Topbar
          title={meta.label}
          subtitle={meta.subtitle}
          user={user}
          onToggleSidebar={toggleSidebar}
          onChangePassword={() => setChangingPassword(true)}
          onLogout={onLogout}
        />
        <main className="content">
          <section id={meta.id} className="section active"><Suspense fallback={null}><ActiveTab /></Suspense></section>
        </main>
      </div>
      {changingPassword && <ChangePasswordModal onClose={() => setChangingPassword(false)} />}
    </div>
  );
}
