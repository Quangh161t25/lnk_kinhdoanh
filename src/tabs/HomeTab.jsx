import { useMemo } from "react";
import { useData } from "../store/DataContext.jsx";
import { NAV_ITEMS } from "../nav.js";
import { NavIcon } from "../components/Sidebar.jsx";
import { money } from "../lib/format.js";

const ICONS = {
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  orders: <><path d="M8 3h6l4 4v14H8z" /><path d="M14 3v5h5" /></>,
  revenue: <><path d="M4 19V5M4 19h16" /><path d="m7 14 4-4 3 3 5-6" /></>,
  debt: <><circle cx="12" cy="12" r="8" /><path d="M12 7v10M9.5 9.5c.3-1 1.2-1.5 2.5-1.5 1.7 0 2.5.8 2.5 1.9 0 2.7-5 1.3-5 4 0 1.2 1 2.1 2.8 2.1 1.4 0 2.4-.6 2.7-1.7" /></>
};

function Kpi({ label, value, icon, color }) {
  return (
    <div className="kpi">
      <div className="kpi-icon" style={{ color }}><svg viewBox="0 0 24 24">{ICONS[icon]}</svg></div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 11 ? "Chào buổi sáng" : hour < 14 ? "Chào buổi trưa" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";
};

export default function HomeTab({ onNavigate }) {
  const { data, user } = useData();

  const stats = useMemo(() => {
    const revenue = data.DH.reduce((sum, order) => sum + Number(order.thanh_tien || 0), 0);
    const debt = data.CONG_NO.reduce((sum, row) => sum + (row.thu_chi === "thu" ? -1 : 1) * Number(row.so_tien || 0), 0);
    return { revenue, debt };
  }, [data]);

  const today = new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="home-hero">
        <span className="home-hero-date">{today}</span>
        <h2>{greeting()}, {user?.ho_ten || user?.id} 👋</h2>
        <p>Tổng quan nhanh tình hình kinh doanh của bạn.</p>
      </div>

      <div className="kpi-grid">
        <Kpi label="Tổng khách hàng" value={data.KHACH_HANG.length.toLocaleString("vi-VN")} icon="users" color="#10b981" />
        <Kpi label="Đơn hàng ghi nhận" value={data.DH.length.toLocaleString("vi-VN")} icon="orders" color="#0ea5e9" />
        <Kpi label="Tổng doanh số" value={money(stats.revenue)} icon="revenue" color="#2d5bff" />
        <Kpi label="Công nợ còn lại" value={money(stats.debt)} icon="debt" color={stats.debt > 0 ? "#ef4444" : "#10b981"} />
      </div>

      <div className="section-shell">
        <div className="section-header"><div className="section-title"><span className="title-dot"></span><span>Truy cập nhanh</span></div></div>
        <div className="panel">
          <div className="quick-grid">
            {NAV_ITEMS.filter((item) => item.id !== "dashboard").map((item) => (
              <button key={item.id} type="button" className="quick-link" onClick={() => onNavigate?.(item.id)}>
                <NavIcon item={item} />
                {item.label}
                <span className="arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
