const INFO_STYLE = { fontSize: 13, color: "var(--muted)" };

// Thanh phân trang: hiện trang đầu, cuối và ±2 trang quanh trang hiện tại.
export default function Pagination({ page, pageSize, totalRows, noun, onPage }) {
  if (totalRows <= pageSize) {
    return <div className="pagination"><span style={INFO_STYLE}>Hiển thị {totalRows} {noun}.</span></div>;
  }
  const totalPages = Math.ceil(totalRows / pageSize) || 1;
  const boxes = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)) {
      boxes.push(<div key={p} className={`page-box ${p === page ? "active" : ""}`} onClick={() => onPage(p)}>{p}</div>);
    } else if (p === page - 3 || p === page + 3) {
      boxes.push(<div key={p} className="page-box-dots">...</div>);
    }
  }
  return (
    <div className="pagination">
      <span style={INFO_STYLE}>Trang {page} / {totalPages} (Tổng {totalRows} {noun})</span>
      <div className="pager">
        <div className={`page-box ${page === 1 ? "disabled" : ""}`} onClick={() => { if (page > 1) onPage(page - 1); }}>‹</div>
        {boxes}
        <div className={`page-box ${page === totalPages ? "disabled" : ""}`} onClick={() => { if (page < totalPages) onPage(page + 1); }}>›</div>
      </div>
    </div>
  );
}

// Cắt trang hiện tại, tự kéo về trang hợp lệ nếu dữ liệu ít đi.
export function paginate(rows, page, pageSize) {
  const totalPages = Math.ceil(rows.length / pageSize) || 1;
  const current = Math.min(Math.max(page, 1), totalPages);
  return { page: current, rows: rows.slice((current - 1) * pageSize, current * pageSize) };
}
