import { NAV_ITEMS, NAV_ICONS } from "../nav.js";

const groups = NAV_ITEMS.reduce((acc, item) => {
  (acc[item.subtitle] ||= []).push(item);
  return acc;
}, {});

export function NavIcon({ item }) {
  return <span className="nav-icon" style={{ color: item.color }} dangerouslySetInnerHTML={{ __html: NAV_ICONS[item.icon] || NAV_ICONS.home }} />;
}

export default function Sidebar({ activeTab, onSelect, syncMeta }) {
  const synced = Boolean(syncMeta?.lastLoadedAt);
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="https://locknking.com/wp-content/uploads/2025/06/logo-lockking.png" alt="Lock&King" />
        <p>ERP Sales</p>
      </div>
      <nav className="sidebar-nav">
        {Object.entries(groups).map(([group, items]) => (
          <div className="menu-group" key={group}>
            <div className="menu-title">{group}</div>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.label}
                className={`nav-btn${item.id === activeTab ? " active" : ""}`}
                onClick={() => onSelect(item.id)}
              >
                <NavIcon item={item} />
                <span className="nav-text">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sync-card">
        <strong><span className={`sync-dot${synced ? " ok" : ""}`} />{synced ? "Đã đồng bộ Google Sheets" : "Chưa đồng bộ"}</strong>
        {synced && <span>Lúc {syncMeta.lastLoadedAt}</span>}
      </div>
    </aside>
  );
}
