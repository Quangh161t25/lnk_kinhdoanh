import { useEffect, useRef, useState } from "react";

// Ô chọn nhiều giá trị có tìm kiếm, "Chọn tất cả" và "Xóa chọn".
// items: [{ value, label }]; selected: mảng value đang chọn.
export default function MultiSelect({ items, selected, onChange, label, searchPlaceholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (event) => { if (!boxRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const chosen = new Set(selected);
  const q = query.toLowerCase();
  const visible = items.filter((it) => String(it.label ?? "").toLowerCase().includes(q) || String(it.value).toLowerCase().includes(q));
  const allChecked = chosen.size > 0 && chosen.size === items.length;
  const buttonText = chosen.size === 0 ? label : allChecked ? "Tất cả " + label : `Đã chọn (${chosen.size})`;

  const toggle = (value) => {
    const next = new Set(chosen);
    if (next.has(value)) next.delete(value); else next.add(value);
    onChange([...next]);
  };

  return (
    <div className="ms-container" ref={boxRef}>
      <button type="button" className="ms-btn" onClick={() => setOpen((value) => !value)}><span>{buttonText}</span></button>
      <div className={`ms-dropdown${open ? " show" : ""}`}>
        <div className="ms-search-box"><input type="text" placeholder={searchPlaceholder} autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <div className="ms-options-wrap">
          {visible.map((it, index) => (
            <div key={`${it.value}-${index}`} className="ms-option" onClick={() => toggle(it.value)}>
              <input type="checkbox" value={it.value} checked={chosen.has(it.value)} readOnly />
              <label>{it.label} <small>({it.value})</small></label>
            </div>
          ))}
        </div>
        <div className="ms-footer">
          <label><input type="checkbox" checked={allChecked} onChange={(e) => onChange(e.target.checked ? [...new Set(items.map((it) => it.value))] : [])} /> Chọn tất cả</label>
          <button type="button" className="ms-btn-clear" onClick={() => { setQuery(""); onChange([]); }}>Xóa chọn</button>
        </div>
      </div>
    </div>
  );
}
