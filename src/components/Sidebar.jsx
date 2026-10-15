import { NAV_ITEMS, NAV_ICONS } from "../nav.js";
import { SHEETS } from "../../shared/schema.js";

const groups = NAV_ITEMS.reduce((acc, item) => {
  (acc[item.subtitle] ||= []).push(item);
  return acc;
}, {});

export default function Sidebar({ activeTab, onSelect, syncMeta }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="https://locknking.com/wp-content/uploads/2025/06/logo-lockking.png" alt="Lock&King" />
        <p>ERP SALES</p>
      </div>
      <div>
        {Object.entries(groups).map(([group, items]) => (
          <div className="menu-group" key={group}>
            <div className="menu-title">{group}</div>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-btn${item.id === activeTab ? " active" : ""}`}
                onClick={() => onSelect(item.id)}
              >
                <span className="nav-icon" style={{ color: item.color }} dangerouslySetInnerHTML={{ __html: NAV_ICONS[item.icon] || NAV_ICONS.home }} />
                <span className="nav-text">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="menu-group">
        <div className="menu-title">s</div>
        <div className="helper">
          {syncMeta ? `Đã tải lúc: ${syncMeta.lastLoadedAt || "chưa có"} | Sheets: ${Object.keys(SHEETS).join(", ")}` : "Chưa đồng bộ."}
        </div>
      </div>
    </aside>
  );
}
