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
              <a
                key={item.id}
                href={item.path}
                title={item.label}
                aria-current={item.id === activeTab ? "page" : undefined}
                className={`nav-btn${item.id === activeTab ? " active" : ""}`}
                onClick={(event) => {
                  // Giữ Ctrl/Cmd/Shift/chuột giữa để mở module ở tab trình duyệt mới.
                  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  onSelect(item.id);
                }}
              >
                <NavIcon item={item} />
                <span className="nav-text">{item.label}</span>
              </a>
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
