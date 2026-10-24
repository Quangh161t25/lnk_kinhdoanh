import { useEffect, useMemo, useRef, useState } from "react";
import { removeDiacritics } from "../../lib/format.js";

const fold = (value) => removeDiacritics(value).toLowerCase().trim();

// Tách chuỗi "a, b; c" (hoặc xuống dòng) thành danh sách giá trị không trùng.
export const splitTokens = (text) => [...new Set(String(text || "").split(/[,;\n\t]+/).map((t) => t.trim()).filter(Boolean))];

// Hàm lọc dùng chung: một dòng khớp nếu khớp BẤT KỲ giá trị nào đã chọn.
// Giá trị trùng đúng một mã có sẵn → so khớp chính xác mã; còn lại → tìm "chứa" trong mã hoặc tên.
export function makeTokenMatcher(tokens, options) {
  if (!tokens.length) return () => true;
  const ids = new Set(options.map((o) => fold(o.id)));
  const exact = new Set();
  const partial = [];
  tokens.forEach((t) => (ids.has(fold(t)) ? exact.add(fold(t)) : partial.push(fold(t))));
  return (id, name) => {
    const fid = fold(id);
    if (exact.has(fid)) return true;
    if (!partial.length) return false;
    const fname = fold(name);
    return partial.some((t) => fid.includes(t) || fname.includes(t));
  };
}

// Ô lọc nhiều giá trị: tick chọn trong danh sách, hoặc gõ/dán "mã1, mã2, ..." rồi Enter.
export default function MultiValueFilter({ options, values, onChange, placeholder, noun = "mục", width = 240 }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (event) => { if (!boxRef.current?.contains(event.target)) { setOpen(false); commitText(); } };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  });

  const labelOf = useMemo(() => {
    const map = new Map(options.map((o) => [fold(o.id), o]));
    return (value) => map.get(fold(value));
  }, [options]);

  const selected = new Set(values.map(fold));
  const add = (tokens) => {
    const next = [...values];
    tokens.forEach((t) => { if (!next.some((v) => fold(v) === fold(t))) next.push(t); });
    if (next.length !== values.length) onChange(next);
  };
  const remove = (value) => onChange(values.filter((v) => fold(v) !== fold(value)));
  const toggle = (option) => (selected.has(fold(option.id)) ? remove(option.id) : add([option.id]));

  function commitText() {
    const tokens = splitTokens(text);
    if (tokens.length) add(tokens);
    setText("");
  }

  const q = fold(text.split(/[,;]/).pop());
  const shown = options.filter((o) => !q || fold(o.id).includes(q) || fold(o.text).includes(q)).slice(0, 80);

  const onKeyDown = (event) => {
    if (event.key === "Enter") { event.preventDefault(); commitText(); }
    else if (event.key === "Backspace" && !text && values.length) remove(values[values.length - 1]);
    else if (event.key === "Escape") setOpen(false);
  };
  const onPaste = (event) => {
    const pasted = event.clipboardData.getData("text");
    if (/[,;\n\t]/.test(pasted)) {
      event.preventDefault();
      add(splitTokens(text + pasted));
      setText("");
    }
  };

  const visibleChips = values.slice(0, 2);

  return (
    <div className="mvf" ref={boxRef} style={{ width }}>
      <div className={`mvf-box${open ? " focus" : ""}`} onClick={() => { setOpen(true); inputRef.current?.focus(); }}>
        {visibleChips.map((value) => (
          <span key={value} className={`mvf-chip${labelOf(value) ? "" : " free"}`} title={labelOf(value)?.text || `Chứa "${value}"`}>
            {value}
            <button type="button" onClick={(e) => { e.stopPropagation(); remove(value); }} aria-label={`Bỏ ${value}`}>×</button>
          </span>
        ))}
        {values.length > 2 && <span className="mvf-more" title={values.join(", ")}>+{values.length - 2}</span>}
        <input
          ref={inputRef}
          value={text}
          placeholder={values.length ? "" : placeholder}
          onChange={(e) => { setText(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
        />
        {values.length > 0 && (
          <button type="button" className="mvf-clear" title="Xóa lọc" onClick={(e) => { e.stopPropagation(); onChange([]); setText(""); }}>×</button>
        )}
      </div>

      {open && (
        <div className="mvf-menu">
          <div className="mvf-hint">Tick để chọn, hoặc dán/gõ nhiều giá trị cách nhau dấu phẩy rồi nhấn <b>Enter</b>.</div>
          {text.trim() && (
            <button type="button" className="mvf-add" onClick={commitText}>
              + Lọc theo: <b>{splitTokens(text).join(", ")}</b>
            </button>
          )}
          <div className="mvf-options">
            {shown.map((option) => (
              <label key={option.id} className="mvf-option">
                <input type="checkbox" checked={selected.has(fold(option.id))} onChange={() => toggle(option)} />
                <span className="mvf-id">{option.id}</span>
                {option.text && option.text !== option.id && <span className="mvf-name">{option.text}</span>}
              </label>
            ))}
            {!shown.length && <div className="mvf-empty">Không có gợi ý.</div>}
          </div>
          <div className="mvf-foot">
            <span>Đã chọn {values.length} {noun}</span>
            {values.length > 0 && <button type="button" onClick={() => onChange([])}>Bỏ chọn tất cả</button>}
          </div>
        </div>
      )}
    </div>
  );
}
