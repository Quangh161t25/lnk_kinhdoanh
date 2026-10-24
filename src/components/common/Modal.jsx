import { useEffect } from "react";

// Hộp thoại đơn giản: bấm nền tối hoặc Esc để đóng.
export default function Modal({ title, subtitle, onClose, children, footer, width = 520 }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop open" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal" style={{ width: `min(${width}px, 100%)` }} role="dialog" aria-label={title}>
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="btn btn-secondary" type="button" onClick={onClose}>Đóng</button>
        </div>
        {children}
        {footer && <div className="cp-actions">{footer}</div>}
      </div>
    </div>
  );
}

// Thanh hiện khi đang chọn dòng: số đã chọn, chọn hết theo bộ lọc, bỏ chọn, và các nút thao tác.
export function SelectionBar({ count, total, noun, onSelectAll, onClear, children }) {
  if (!count) return null;
  return (
    <div className="selection-bar">
      <span>Đã chọn {count.toLocaleString("vi-VN")} {noun}</span>
      {onSelectAll && count < total && (
        <button type="button" className="link-btn" onClick={onSelectAll}>Chọn tất cả {total.toLocaleString("vi-VN")} {noun} đang lọc</button>
      )}
      <button type="button" className="link-btn" onClick={onClear}>Bỏ chọn</button>
      <span className="spacer" />
      {children}
    </div>
  );
}
