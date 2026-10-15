import { useEffect, useState } from "react";

const ALIGNS = [
  { value: "left", title: "Căn trái", icon: <path d="M4 6h16M4 12h10M4 18h14" /> },
  { value: "center", title: "Căn giữa", icon: <path d="M4 6h16M7 12h10M5 18h14" /> },
  { value: "right", title: "Căn phải", icon: <path d="M4 6h16M10 12h10M6 18h14" /> }
];
const DENSITIES = [["compact", "Gọn"], ["normal", "Vừa"], ["comfortable", "Thoáng"]];

const Icon = ({ children }) => <svg viewBox="0 0 24 24" aria-hidden="true">{children}</svg>;

// Popup tùy chỉnh cột. Mọi thay đổi áp dụng ngay lên bảng và tự lưu.
export default function ColumnSettings({ name, columns, settings, update, reset, onClose }) {
  const [dragKey, setDragKey] = useState(null);
  const [overKey, setOverKey] = useState(null);

  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const keys = columns.map((c) => c.key);
  const visibleCount = columns.filter((c) => !c.hidden).length;

  const setMap = (field, key, value) => update((s) => {
    const map = { ...s[field] };
    if (value === undefined || value === "" || value === false) delete map[key];
    else map[key] = value;
    return { ...s, [field]: map };
  });
  const toggleList = (field, key, on) => update((s) => ({
    ...s,
    [field]: on ? [...new Set([...s[field], key])] : s[field].filter((k) => k !== key)
  }));

  const move = (from, to) => {
    if (to < 0 || to >= keys.length || from === to) return;
    const order = [...keys];
    const [key] = order.splice(from, 1);
    order.splice(to, 0, key);
    update({ order });
  };

  const dropOn = (targetKey) => {
    if (dragKey && targetKey !== dragKey) move(keys.indexOf(dragKey), keys.indexOf(targetKey));
    setDragKey(null);
    setOverKey(null);
  };

  const showAll = () => update({ hidden: [] });
  const hideAll = () => update({ hidden: keys.slice(1) }); // luôn giữ lại ít nhất một cột

  return (
    <div className="modal-backdrop open" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal cs-modal" role="dialog" aria-label="Tùy chỉnh cột">
        <div className="modal-head">
          <div>
            <h3>Tùy chỉnh cột</h3>
            <p>{name ? `Bảng: ${name}. ` : ""}Kéo ⋮⋮ để đổi thứ tự. Thay đổi được lưu tự động trên trình duyệt này.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={onClose}>Đóng</button>
        </div>

        <div className="cs-options">
          <div className="cs-option">
            <span>Mật độ dòng</span>
            <div className="cs-segment">
              {DENSITIES.map(([value, label]) => (
                <button key={value} type="button" className={settings.density === value ? "active" : ""} onClick={() => update({ density: value })}>{label}</button>
              ))}
            </div>
          </div>
          <label className="cs-check"><input type="checkbox" checked={settings.striped} onChange={(e) => update({ striped: e.target.checked })} /> Sọc vằn xen kẽ</label>
          <label className="cs-check"><input type="checkbox" checked={settings.headerWrap} onChange={(e) => update({ headerWrap: e.target.checked })} /> Tiêu đề xuống dòng</label>
          <div className="cs-links">
            <button type="button" onClick={showAll}>Hiện tất cả</button>
            <button type="button" onClick={hideAll}>Ẩn tất cả</button>
          </div>
        </div>

        <div className="cs-head">
          <span></span><span>Hiện</span><span>Tên cột</span><span>Căn lề</span><span>Rộng (px)</span><span>Tùy chọn</span><span></span>
        </div>
        <ul className="cs-list">
          {columns.map((column, index) => (
            <li
              key={column.key}
              className={`cs-row${column.hidden ? " is-hidden" : ""}${dragKey === column.key ? " dragging" : ""}${overKey === column.key && dragKey !== column.key ? " drop-target" : ""}`}
              onDragOver={(e) => { if (dragKey) { e.preventDefault(); setOverKey(column.key); } }}
              onDrop={(e) => { e.preventDefault(); dropOn(column.key); }}
            >
              <span
                className="cs-handle"
                draggable
                title="Kéo để đổi thứ tự"
                onDragStart={(e) => { setDragKey(column.key); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", column.key); }}
                onDragEnd={() => { setDragKey(null); setOverKey(null); }}
              >⋮⋮</span>

              <input
                type="checkbox"
                title={column.hidden ? "Hiện cột" : "Ẩn cột"}
                checked={!column.hidden}
                disabled={!column.hidden && visibleCount <= 1}
                onChange={(e) => toggleList("hidden", column.key, !e.target.checked)}
              />

              <input
                className="cs-label"
                value={settings.label[column.key] ?? ""}
                placeholder={column.defaultLabel}
                title={`Tên gốc: ${column.defaultLabel}`}
                onChange={(e) => setMap("label", column.key, e.target.value)}
              />

              <div className="cs-segment cs-align">
                {ALIGNS.map((a) => (
                  <button key={a.value} type="button" title={a.title} className={column.align === a.value ? "active" : ""} onClick={() => setMap("align", column.key, a.value)}>
                    <Icon>{a.icon}</Icon>
                  </button>
                ))}
              </div>

              <input
                className="cs-width"
                type="number"
                min="40"
                step="10"
                placeholder="Tự động"
                value={settings.width[column.key] ?? ""}
                onChange={(e) => setMap("width", column.key, e.target.value ? Number(e.target.value) : undefined)}
              />

              <div className="cs-toggles">
                <button type="button" title="Cố định cột bên trái khi cuộn ngang" className={column.pinned ? "active" : ""} onClick={() => toggleList("pinned", column.key, !column.pinned)}>
                  <Icon><path d="M9 4h6l-1 6 3 3H7l3-3-1-6zM12 13v7" /></Icon>
                </button>
                <button type="button" title="Cho chữ xuống dòng" className={column.wrap ? "active" : ""} onClick={() => setMap("wrap", column.key, !column.wrap)}>
                  <Icon><path d="M4 6h16M4 12h13a3 3 0 0 1 0 6h-4m0 0 2-2m-2 2 2 2M4 18h5" /></Icon>
                </button>
                <button type="button" title="Chữ đậm" className={column.bold ? "active" : ""} onClick={() => setMap("bold", column.key, !column.bold)}>
                  <Icon><path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" /></Icon>
                </button>
              </div>

              <div className="cs-move">
                <button type="button" title="Lên" disabled={index === 0} onClick={() => move(index, index - 1)}>↑</button>
                <button type="button" title="Xuống" disabled={index === columns.length - 1} onClick={() => move(index, index + 1)}>↓</button>
              </div>
            </li>
          ))}
        </ul>

        <div className="cs-foot">
          <button className="btn btn-secondary" type="button" onClick={reset}>Khôi phục mặc định</button>
          <button className="btn btn-primary" type="button" onClick={onClose}>Xong</button>
        </div>
      </div>
    </div>
  );
}
