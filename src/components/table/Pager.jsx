export const PAGE_SIZES = [25, 50, 100, 200, 500, 0]; // 0 = tất cả

// Cắt trang hiện tại, tự kéo về trang hợp lệ nếu dữ liệu ít đi. pageSize 0 = hiện tất cả.
export function paginate(rows, page, pageSize) {
  if (!pageSize) return { page: 1, totalPages: 1, start: 0, rows };
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = (current - 1) * pageSize;
  return { page: current, totalPages, start, rows: rows.slice(start, start + pageSize) };
}

// Các số trang hiển thị: hiển thị tối đa 5 trang liên tiếp quanh trang hiện tại, luôn có trang đầu/cuối.
function pageNumbers(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 4) {
    return [1, 2, 3, 4, 5, "…", totalPages];
  }
  if (page >= totalPages - 3) {
    return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "…", page - 1, page, page + 1, "…", totalPages];
}

// Thanh phân trang: "Hiển thị 1 - 25 / 42 dòng", chọn cỡ trang, nút « ‹ 1 2 3 › ».
export default function Pager({ total, page, totalPages, start, shown, pageSize, noun = "dòng", onPage, onPageSize }) {
  const from = total ? start + 1 : 0;
  const to = start + shown;
  return (
    <div className="pager-bar">
      <span className="pager-info">
        Hiển thị <b>{from.toLocaleString("vi-VN")} - {to.toLocaleString("vi-VN")}</b> / {total.toLocaleString("vi-VN")} {noun}
      </span>
      <label className="pager-size">
        Cỡ trang:
        <select value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))}>
          {PAGE_SIZES.map((size) => <option key={size} value={size}>{size ? `${size} dòng` : "Tất cả"}</option>)}
        </select>
      </label>
      {totalPages > 1 && (
        <div className="pager-nav" role="navigation" aria-label="Phân trang">
          <span className="pager-label">Trang</span>
          <button type="button" title="Trang đầu" disabled={page <= 1} onClick={() => onPage(1)}>«</button>
          <button type="button" title="Trang trước" disabled={page <= 1} onClick={() => onPage(page - 1)}>‹</button>
          {pageNumbers(page, totalPages).map((p, i) => (p === "…"
            ? <span key={`gap-${i}`} className="pager-gap">…</span>
            : <button key={p} type="button" className={p === page ? "active" : ""} aria-current={p === page ? "page" : undefined} onClick={() => onPage(p)}>{p}</button>))}
          <button type="button" title="Trang sau" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>›</button>
          <button type="button" title="Trang cuối" disabled={page >= totalPages} onClick={() => onPage(totalPages)}>»</button>
        </div>
      )}
    </div>
  );
}
