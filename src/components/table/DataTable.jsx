import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTableSettings, resolveColumns, isCustomized } from "./tableSettings.js";
import { sortRows } from "./sorting.js";
import ColumnSettings from "./ColumnSettings.jsx";
import Pagination, { paginate } from "../common/Pagination.jsx";

// Bảng dùng chung có nút "Tùy chỉnh cột": kéo thả thứ tự, ẩn/hiện, căn lề, độ rộng,
// đổi tên, xuống dòng, chữ đậm, cố định cột, mật độ dòng, sọc vằn. Tùy chỉnh lưu theo `id`.
//
// columns: [{ key, label, title?, align?, width?, className?, style?(row,i)|obj,
//             render(row, i), headerStyle?, headerProps?, headerExtra?, footer?, footerStyle? }]
// selection (tùy chọn): { keyOf(row), selected: Set<string>, onChange(nextSet) } → thêm cột ô chọn ở đầu bảng.
// Bấm tiêu đề để sắp xếp (tăng → giảm → bỏ); cột tự sắp theo chữ hiển thị, hoặc theo sortValue(row) nếu có;
// sortable: false để tắt. rows là TOÀN BỘ dòng: bảng tự sắp xếp rồi mới cắt theo limit hoặc phân trang
// (pageSize + page + onPage + pageNoun), nhờ đó sắp xếp đúng trên cả danh sách chứ không chỉ trang đang xem.
const resolveStyle = (style, row, index) => (typeof style === "function" ? style(row, index) : style);

export default function DataTable({
  id, name, columns, rows: allRows, rowKey, rowProps,
  empty = "Trống", after, footerLabel, footerRowStyle, selection,
  limit, limitNoun = "dòng", pageSize, page = 1, onPage, pageNoun = "dòng",
  wrapClassName = "table-wrap", wrapStyle, tableStyle, theadStyle, tfootStyle, toolbarStyle
}) {
  const [settings, update, reset] = useTableSettings(id);
  const [open, setOpen] = useState(false);
  const all = resolveColumns(columns, settings);
  const visible = all.filter((c) => !c.hidden);
  const span = Math.max(visible.length, 1) + (selection ? 1 : 0);

  const sort = settings.sort;
  const sortColumn = sort ? all.find((c) => c.key === sort.key && c.sortable !== false) : null;
  const sorted = useMemo(() => sortRows(allRows, sortColumn, sortColumn && sort.dir), [allRows, sortColumn, sort?.dir]);
  const paged = pageSize ? paginate(sorted, page, pageSize) : null;
  const rows = paged ? paged.rows : limit ? sorted.slice(0, limit) : sorted;
  const hiddenByLimit = !pageSize && limit && sorted.length > limit ? sorted.length - limit : 0;

  // Bấm tiêu đề: tăng dần → giảm dần → bỏ sắp xếp.
  const toggleSort = (column) => {
    if (column.sortable === false) return;
    update((s) => {
      const { sort: current, ...rest } = s;
      if (!current || current.key !== column.key) return { ...rest, sort: { key: column.key, dir: "asc" } };
      if (current.dir === "asc") return { ...rest, sort: { key: column.key, dir: "desc" } };
      return rest;
    });
    if (pageSize && onPage) onPage(1);
  };

  const rowKeys = selection ? rows.map((row) => selection.keyOf(row)) : [];
  const checkedCount = selection ? rowKeys.filter((k) => selection.selected.has(k)).length : 0;
  const allChecked = rowKeys.length > 0 && checkedCount === rowKeys.length;
  const toggleAll = () => {
    const next = new Set(selection.selected);
    rowKeys.forEach((k) => (allChecked ? next.delete(k) : next.add(k)));
    selection.onChange(next);
  };
  const toggleOne = (key) => {
    const next = new Set(selection.selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    selection.onChange(next);
  };

  // Vị trí "left" của các cột cố định = tổng độ rộng các cột cố định đứng trước.
  const headRefs = useRef({});
  const checkRef = useRef(null);
  const anyPinned = visible.some((c) => c.pinned);
  // Khi có cột cố định, cột ô chọn cũng cố định ở mép trái.
  const checkStyle = anyPinned ? { position: "sticky", left: 0, zIndex: 3 } : undefined;
  const [lefts, setLefts] = useState({});
  useLayoutEffect(() => {
    const next = {};
    let x = selection ? (checkRef.current?.offsetWidth || 0) : 0;
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
          title="Tùy chỉnh cột: thứ tự, ẩn/hiện, căn lề, độ rộng…" aria-label="Tùy chỉnh cột">
          <svg viewBox="0 0 24 24"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg>
        </button>
      </div>
      <div className={wrapClassName} style={wrapStyle}>
        <table className={classes} style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              {selection && (
                <th className="dt-check dt-pinned" ref={checkRef} style={checkStyle}>
                  <input type="checkbox" title={allChecked ? "Bỏ chọn tất cả" : "Chọn tất cả dòng đang hiện"} checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = checkedCount > 0 && !allChecked; }} onChange={toggleAll} />
                </th>
              )}
              {visible.map((column) => {
                const { style: headerPropStyle, ...headerProps } = column.headerProps || {};
                const canSort = column.sortable !== false;
                const dir = sortColumn?.key === column.key ? sort.dir : null;
                return (
                  <th
                    key={column.key}
                    ref={(el) => { headRefs.current[column.key] = el; }}
                    title={canSort ? `${column.title || column.label} — bấm để sắp xếp` : column.title || column.label}
                    onClick={canSort ? () => toggleSort(column) : undefined}
                    aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : undefined}
                    {...headerProps}
                    className={[column.pinned && "dt-pinned", canSort && "dt-sortable", dir && "dt-sorted"].filter(Boolean).join(" ") || undefined}
                    style={{ ...column.headerStyle, ...headerPropStyle, ...sizeStyle(column) }}
                  >
                    {column.label}{column.headerExtra}
                    {canSort && <span className="dt-sort-ind" aria-hidden="true">{dir === "asc" ? "▲" : dir === "desc" ? "▼" : "↕"}</span>}
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
              const selKey = selection ? selection.keyOf(row) : null;
              const isSelected = selection ? selection.selected.has(selKey) : false;
              return (
                <tr key={rowKey ? rowKey(row, index) : index} {...props} className={[props.className, isSelected && "dt-selected"].filter(Boolean).join(" ") || undefined}>
                  {selection && (
                    <td className={`dt-check${anyPinned ? " dt-pinned" : ""}`} style={checkStyle && { ...checkStyle, zIndex: 1 }} onDoubleClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleOne(selKey)} onClick={(e) => e.stopPropagation()} />
                    </td>
                  )}
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
            {(after || hiddenByLimit > 0) && (
              <tr><td colSpan={span} style={{ textAlign: "center", padding: 12, color: "var(--muted)", fontSize: 13, background: "#f9fafb" }}>
                {after || <>... và <strong>{hiddenByLimit.toLocaleString("vi-VN")}</strong> {limitNoun} khác (Hãy lọc chi tiết hơn)</>}
              </td></tr>
            )}
          </tbody>
          {hasFooter && rows.length > 0 && (
            <tfoot style={tfootStyle}>
              <tr style={footerRowStyle}>
                {labelSpan + (selection ? 1 : 0) > 0 && <td colSpan={labelSpan + (selection ? 1 : 0)} style={{ textAlign: "right", fontWeight: 700 }}>{footerLabel}</td>}
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
      {paged && <Pagination page={paged.page} pageSize={pageSize} totalRows={sorted.length} noun={pageNoun} onPage={onPage} />}
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
