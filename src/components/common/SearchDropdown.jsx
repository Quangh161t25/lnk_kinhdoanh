import { useEffect, useRef, useState } from "react";

const CLEAR_STYLE = { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 16, cursor: "pointer", color: "#999", zIndex: 2 };
const EMPTY_STYLE = { padding: 10, color: "#aaa", fontSize: 12 };

// Ô nhập có danh sách gợi ý: mở khi focus/gõ, đóng khi chọn hoặc bấm ra ngoài.
// getOptions(text) trả về [{ key, label }]; nút × chỉ hiện khi có onClear và showClear.
export default function SearchDropdown({
  value, onInput, getOptions, onSelect, onClear, showClear = false, emptyText,
  placeholder, className = "dropdown-search", boxStyle, inputStyle, clearStyle = CLEAR_STYLE,
  menuClassName = "dropdown-menu", menuStyle, itemClassName = "dropdown-item", prefix, inputProps
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (event) => { if (!boxRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const options = open ? getOptions(value) : [];

  return (
    <div className={className} style={boxStyle} ref={boxRef}>
      {prefix}
      <input
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        style={inputStyle}
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(event) => { onInput(event.target.value); setOpen(true); }}
        {...inputProps}
      />
      {onClear && (
        <span style={{ ...clearStyle, display: showClear ? "block" : "none" }} onClick={() => { setOpen(false); onClear(); }}>&times;</span>
      )}
      <div className={`${menuClassName}${open ? " show" : ""}`} style={menuStyle}>
        {open && (options.length
          ? options.map((option) => (
            <div key={option.key} className={itemClassName} onClick={() => { setOpen(false); onSelect(option); }}>{option.label}</div>
          ))
          : <div style={EMPTY_STYLE}>{emptyText}</div>)}
      </div>
    </div>
  );
}
