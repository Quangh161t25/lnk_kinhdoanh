import { useEffect, useState } from "react";
import { NAV_ITEMS } from "../nav.js";
import { initLegacy, startSession, endSession, showTab } from "../legacy/erp.js";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import LegacyHost from "./LegacyHost.jsx";
import ChangePasswordModal from "./ChangePasswordModal.jsx";

const readCollapsed = () => {
  try { return localStorage.getItem("sidebar_collapsed") === "1"; } catch { return false; }
};

export default function MainApp({ user: initialUser, staff, onLogout }) {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [syncMeta, setSyncMeta] = useState(null);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [changingPassword, setChangingPassword] = useState(false);

  // Khởi động phần nghiệp vụ khi khung giao diện đã có trên trang (effect chạy sau khi DOM được tạo).
  useEffect(() => {
    initLegacy({ onSyncMeta: setSyncMeta });
    startSession(initialUser, staff)
      .then((result) => { if (result?.user) setUser(result.user); })
      .catch((error) => { if (error.status === 401) onLogout(); });
    return () => endSession();
  }, []);

  useEffect(() => { showTab(activeTab); }, [activeTab]);

  const toggleSidebar = () => {
    setCollapsed((value) => {
      try { localStorage.setItem("sidebar_collapsed", value ? "0" : "1"); } catch { }
      return !value;
    });
  };

  const meta = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0];

  return (
    <div className={`app${collapsed ? " collapsed" : ""}`}>
      <Sidebar activeTab={activeTab} onSelect={setActiveTab} syncMeta={syncMeta} />
      <div className="main">
        <Topbar
          title={meta.label}
          subtitle={meta.subtitle}
          user={user}
          onToggleSidebar={toggleSidebar}
          onChangePassword={() => setChangingPassword(true)}
          onLogout={onLogout}
        />
        <LegacyHost />
      </div>
      {changingPassword && <ChangePasswordModal onClose={() => setChangingPassword(false)} />}
    </div>
  );
}
