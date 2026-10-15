import { useLayoutEffect, useRef, useState } from "react";
import { useTableSettings, resolveColumns, isCustomized } from "./tableSettings.js";
import ColumnSettings from "./ColumnSettings.jsx";

// Bảng dùng chung có nút "Tùy chỉnh cột": kéo thả thứ tự, ẩn/hiện, căn lề, độ rộng,
// đổi tên, xuống dòng, chữ đậm, cố định cột, mật độ dòng, sọc vằn. Tùy chỉnh lưu theo `id`.
//
// columns: [{ key, label, title?, align?, width?, className?, style?(row,i)|obj,
//             render(row, i), headerStyle?, headerProps?, headerExtra?, footer?, footerStyle? }]
const resolveStyle = (style, row, index) => (typeof style === "function" ? style(row, index) : style);

export default function DataTable({
  id, name, columns, rows, rowKey, rowProps,
  empty = "Trống", after, footerLabel, footerRowStyle,
  wrapClassName = "table-wrap", wrapStyle, tableStyle, theadStyle, tfootStyle, toolbarStyle
}) {
  const [settings, update, reset] = useTableSettings(id);
  const [open, setOpen] = useState(false);
  const all = resolveColumns(columns, settings);
  const visible = all.filter((c) => !c.hidden);
  const span = Math.max(visible.length, 1);

  // Vị trí "left" của các cột cố định = tổng độ rộng các cột cố định đứng trước.
  const headRefs = useRef({});
  const [lefts, setLefts] = useState({});
  useLayoutEffect(() => {
    const next = {};
    let x = 0;
    for (const column of visible) {
      if (!column.pinned) break;
      next[column.key] = x;
      x += headRefs.current[column.key]?.offsetWidth || 0;
    }
    if (JSON.stringify(next) !== JSON.stringify(lefts)) setLefts(next);
  });

  const sizeStyle = (column) => {
    const style = { textAlign: column.align };
    if (column.width) {
      style.width = column.width;
      style.minWidth = column.width;
      style.maxWidth = column.width;
      if (!column.wrap) { style.overflow = "hidden"; style.textOverflow = "ellipsis"; }
    }
    if (column.wrap) style.whiteSpace = "normal";
    if (column.pinned) { style.position = "sticky"; style.left = lefts[column.key] ?? 0; }
    return style;
  };

  // Kéo mép phải tiêu đề cột để đổi độ rộng.
  const startResize = (event, column) => {
    event.preventDefault();
    event.stopPropagation();
    const th = headRefs.current[column.key];
    const startX = event.clientX;
    const startWidth = th?.offsetWidth || 120;
    let last = 0;
    const move = (e) => {
      const width = Math.max(48, Math.round(startWidth + e.clientX - startX));
      if (width === last) return;
      last = width;
      update((s) => ({ ...s, width: { ...s.width, [column.key]: width } }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      document.body.classList.remove("dt-resizing");
    };
    document.body.classList.add("dt-resizing");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const hasFooter = visible.some((c) => c.footer !== undefined);
  const leading = visible.findIndex((c) => c.footer !== undefined);
  const labelSpan = leading < 0 ? visible.length : leading;

  const classes = [
    "dt-table",
    settings.density !== "normal" && `dt-${settings.density}`,
    settings.striped && "dt-striped",
    settings.headerWrap && "dt-head-wrap"
  ].filter(Boolean).join(" ");

  return (
    <>
      <div className="dt-toolbar" style={toolbarStyle}>
        <button type="button" className={`dt-settings-btn${isCustomized(settings) ? " active" : ""}`} onClick={() => setOpen(true)}
          title="Tùy chỉnh cột: thứ tự, ẩn/hiện, căn lề, độ rộng…">
          <svg viewBox="0 0 24 24"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg>
          Tùy chỉnh cột
        </button>
      </div>
      <div className={wrapClassName} style={wrapStyle}>
        <table className={classes} style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              {visible.map((column) => {
                const { style: headerPropStyle, ...headerProps } = column.headerProps || {};
                return (
                  <th
                    key={column.key}
                    ref={(el) => { headRefs.current[column.key] = el; }}
                    title={column.title || column.label}
                    {...headerProps}
                    className={column.pinned ? "dt-pinned" : undefined}
                    style={{ ...column.headerStyle, ...headerPropStyle, ...sizeStyle(column) }}
                  >
                    {column.label}{column.headerExtra}
                    <span className="dt-resize" onPointerDown={(e) => startResize(e, column)} onClick={(e) => e.stopPropagation()} title="Kéo để đổi độ rộng" />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {!rows.length && <tr><td colSpan={span} className="empty">{empty}</td></tr>}
            {rows.map((row, index) => {
              const props = rowProps ? rowProps(row, index) : {};
              return (
                <tr key={rowKey ? rowKey(row, index) : index} {...props}>
                  {visible.map((column) => (
                    <td
                      key={column.key}
                      className={[resolveStyle(column.className, row, index), column.pinned && "dt-pinned"].filter(Boolean).join(" ") || undefined}
                      style={{ ...resolveStyle(column.style, row, index), ...sizeStyle(column), ...(column.bold ? { fontWeight: 700 } : null) }}
                    >
                      {column.render(row, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
            {after && <tr><td colSpan={span} style={{ textAlign: "center", padding: 12, color: "var(--muted)", fontSize: 13, background: "#f9fafb" }}>{after}</td></tr>}
          </tbody>
          {hasFooter && rows.length > 0 && (
            <tfoot style={tfootStyle}>
              <tr style={footerRowStyle}>
                {labelSpan > 0 && <td colSpan={labelSpan} style={{ textAlign: "right", fontWeight: 700 }}>{footerLabel}</td>}
                {visible.slice(labelSpan).map((column) => (
                  <td key={column.key} style={{ ...column.footerStyle, ...sizeStyle(column), position: undefined, left: undefined }}>
                    {column.footer}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {open && (
        <ColumnSettings
          name={name}
          columns={all}
          settings={settings}
          update={update}
          reset={reset}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
