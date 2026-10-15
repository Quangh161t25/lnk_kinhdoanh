import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useData } from "../store/DataContext.jsx";
import MultiSelect from "../components/common/MultiSelect.jsx";
import Pagination, { paginate } from "../components/common/Pagination.jsx";
import { computeSalesDashboard } from "../lib/salesDashboard.js";
import { money, debtColor } from "../lib/format.js";

const PAGE_SIZE = 20;
const TYPE_COLORS = ["#2563eb", "#7c3aed", "#ea580c", "#16a34a", "#db2777", "#0284c7"];
const CARD = { padding: "12px 14px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,.04)" };
const CARD_LABEL = { color: "var(--muted)", fontWeight: 700, fontSize: 10 };
const CARD_VALUE = { display: "block", fontSize: 16, marginTop: 4 };
const TABLE_TITLE = { margin: 0, padding: "14px 16px", background: "#f8fafc", borderBottom: "1px solid var(--line)", fontSize: 14 };
const RIGHT = { textAlign: "right" };
const SALES_CELL = { textAlign: "right", color: "var(--text-main)", fontWeight: 600 };

function SummaryCard({ label, value, color, labelColor }) {
  return (
    <div className="card" style={CARD}>
      <small style={{ ...CARD_LABEL, color: labelColor || CARD_LABEL.color }}>{label}</small>
      <strong style={{ ...CARD_VALUE, color }}>{value}</strong>
    </div>
  );
}

// Các ô nợ dùng chung cho bảng tháng/khách hàng/nhân viên.
function DebtCells({ chi, thu, luyKe }) {
  return (
    <>
      <td style={{ textAlign: "right", color: "#ef4444" }}>{money(chi)}</td>
      <td style={{ textAlign: "right", color: "#16a34a" }}>{money(thu)}</td>
      <td style={{ textAlign: "right", color: debtColor(chi - thu) }}>{money(chi - thu)}</td>
      <td style={{ textAlign: "right", fontWeight: "bold", color: debtColor(luyKe) }}>{money(luyKe)}</td>
    </>
  );
}

const EmptyRow = ({ cols, className }) => (className
  ? <tr className="empty"><td colSpan={cols}>Trống</td></tr>
  : <tr><td colSpan={cols} className="empty">Trống</td></tr>);

// Thanh lọc dính dưới topbar khi cuộn (position: fixed vì khung cuộn là cả cửa sổ).
function useStickyFilter(wrapRef, filterRef) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const filter = filterRef.current;
    const section = wrap?.closest("section");
    if (!wrap || !filter || !section) return;
    const sync = () => {
      const topbar = document.querySelector(".topbar");
      const topOffset = topbar ? Math.ceil(topbar.getBoundingClientRect().height) : 0;
      const wrapRect = wrap.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const filterHeight = filter.offsetHeight;
      wrap.style.minHeight = filterHeight + "px";
      const shouldFix = wrapRect.top <= topOffset && sectionRect.bottom > (topOffset + filterHeight + 16);
      filter.classList.toggle("is-fixed", shouldFix);
      filter.style.top = shouldFix ? topOffset + "px" : "";
      filter.style.left = shouldFix ? wrapRect.left + "px" : "";
      filter.style.width = shouldFix ? wrapRect.width + "px" : "";
    };
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    const frame = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [wrapRef, filterRef]);
}

function MonthChart({ labels, values }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: { labels, datasets: [{ data: values, backgroundColor: "#2d5bff", borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    return () => chart.destroy();
  }, [labels, values]);
  return <canvas ref={canvasRef} />;
}

export default function SalesDashboardTab() {
  const { data, users, customerName, productName } = useData();
  const [month, setMonth] = useState("");
  const [nvs, setNvs] = useState([]);
  const [khs, setKhs] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [khPage, setKhPage] = useState(1);
  const [spPage, setSpPage] = useState(1);
  const wrapRef = useRef(null);
  const filterRef = useRef(null);
  useStickyFilter(wrapRef, filterRef);

  // Chỉ những nhân viên có dữ liệu mà người dùng được xem.
  const nvOptions = useMemo(() => {
    const visibleIds = new Set([...data.DH, ...data.DH_CT, ...data.CONG_NO, ...data.KPI].map((row) => row.id_nv).filter(Boolean));
    return users.filter((user) => visibleIds.has(user.id)).map((user) => ({ value: user.id, label: user.ho_ten }));
  }, [data, users]);
  const khOptions = useMemo(() => data.KHACH_HANG.map((c) => ({ value: c.id, label: c.ten_kh })).filter((k) => k.value), [data.KHACH_HANG]);

  const stats = useMemo(
    () => computeSalesDashboard(data, nvOptions.map((o) => o.value), { month, nvs, khs }),
    [data, nvOptions, month, nvs, khs]
  );

  const chart = useMemo(() => {
    const ascending = stats.monthRows.slice().reverse();
    return { labels: ascending.map((r) => r.month), values: ascending.map((r) => r.s) };
  }, [stats.monthRows]);

  const resetPages = () => { setKhPage(1); setSpPage(1); };
  const changeFilter = (setter) => (value) => { setter(value); resetPages(); };

  const kh = paginate(stats.khRows, khPage, PAGE_SIZE);
  const term = productSearch.trim().toLowerCase();
  const products = stats.productRows
    .map((row) => ({ ...row, name: productName(row.id) }))
    .filter((row) => !term || row.id.toLowerCase().includes(term) || (row.name && String(row.name).toLowerCase().includes(term)));
  const sp = paginate(products, spPage, PAGE_SIZE);
  const totalQty = products.reduce((sum, row) => sum + (row.slg || 0), 0);
  const totalRevenue = products.reduce((sum, row) => sum + (row.thanh_tien || 0), 0);

  return (
    <>
      <div className="sales-dash-filter-wrap" ref={wrapRef}>
        <div className="sales-dash-filter" ref={filterRef}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1px solid var(--line)", borderRadius: 8, padding: "0 8px", height: 36 }}>
              <input type="month" value={month} onChange={(e) => changeFilter(setMonth)(e.target.value)} style={{ border: "none", outline: "none", fontSize: 13, color: "var(--text)", background: "transparent" }} title="Lọc theo tháng" />
              <button onClick={() => changeFilter(setMonth)("")} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 16, color: "#ef4444", display: month ? "block" : "none" }}>&times;</button>
            </div>
            <MultiSelect items={nvOptions} selected={nvs} onChange={changeFilter(setNvs)} label="ID Nhân viên" searchPlaceholder="Tìm ID nhân viên..." />
            <MultiSelect items={khOptions} selected={khs} onChange={changeFilter(setKhs)} label="ID Khách hàng" searchPlaceholder="Tìm ID khách hàng..." />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
        <SummaryCard label="TỔNG DOANH SỐ" value={money(stats.totalSales)} color="#2d5bff" />
        {stats.typeTotals.map(([type, total], index) => {
          const color = TYPE_COLORS[index % TYPE_COLORS.length];
          return <SummaryCard key={type} label={type} value={money(total)} color={color} labelColor={color} />;
        })}
        <SummaryCard label="TỔNG NỢ PHÁT SINH" value={money(stats.totalIncurred)} color="#ef4444" />
        <SummaryCard label="TỔNG NỢ ĐÃ THU" value={money(stats.totalCollected)} color="#16a34a" />
        <SummaryCard label="NỢ CÒN LẠI" value={money(stats.totalIncurred - stats.totalCollected)} color="#8b5cf6" />
        <SummaryCard label="SỐ ĐƠN HÀNG" value={stats.orderCount} color="#0ea5e9" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <h3 style={TABLE_TITLE}>Bảng Doanh số theo NCC</h3>
          <div className="table-wrap" style={{ flex: 1, maxHeight: 260, overflowY: "auto" }}>
            <table style={{ minWidth: "100%" }}>
              <thead><tr><th>Tên NCC</th><th style={RIGHT}>Tổng D/số</th></tr></thead>
              <tbody>
                {stats.nccRows.length
                  ? stats.nccRows.map((row) => <tr key={row.name}><td>{row.name}</td><td style={{ textAlign: "right", color: "#0f172a" }}><strong>{money(row.s)}</strong></td></tr>)
                  : <EmptyRow cols={2} className />}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14 }}>Doanh số theo tháng</h3>
          <div style={{ height: 260 }}><MonthChart labels={chart.labels} values={chart.values} /></div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 20, marginBottom: 40 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <h3 style={TABLE_TITLE}>Bảng Doanh số theo tháng</h3>
          <div className="table-wrap"><table style={{ minWidth: "100%" }}>
            <thead><tr><th>Tháng</th><th style={RIGHT}>Doanh số</th><th style={RIGHT}>Số đơn</th><th style={RIGHT}>Nợ phát sinh</th><th style={RIGHT}>Đã thu</th><th style={RIGHT}>Nợ ròng tháng</th><th style={RIGHT}>Dư nợ cuối tháng</th></tr></thead>
            <tbody>
              {stats.monthRows.length
                ? stats.monthRows.map((row) => (
                  <tr key={row.month}>
                    <td className="mono">{row.month}</td>
                    <td style={SALES_CELL}>{money(row.s)}</td>
                    <td style={RIGHT}>{row.c}</td>
                    <DebtCells chi={row.chi} thu={row.thu} luyKe={row.luyKe} />
                  </tr>
                ))
                : <EmptyRow cols={7} />}
            </tbody>
          </table></div>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <h3 style={TABLE_TITLE}>Bảng Nhân viên (Mã NV)</h3>
          <div className="table-wrap"><table style={{ minWidth: "100%" }}>
            <thead><tr><th>Mã NV</th><th style={RIGHT}>Doanh số</th><th style={RIGHT}>Nợ phát sinh</th><th style={RIGHT}>Nợ đã thu</th><th style={RIGHT}>Nợ ròng</th><th style={RIGHT}>Dư nợ cuối</th><th style={RIGHT}>Tỉ lệ thu (tháng này)</th></tr></thead>
            <tbody>
              {stats.nvRows.length
                ? stats.nvRows.map((row) => {
                  const ratio = row.chiCM > 0 ? (row.thuCM / row.chiCM) * 100 : 0;
                  return (
                    <tr key={row.id}>
                      <td className="mono">{row.id}</td>
                      <td style={SALES_CELL}>{money(row.s)}</td>
                      <DebtCells chi={row.chi} thu={row.thu} luyKe={row.luyKe} />
                      <td style={{ textAlign: "right", fontWeight: 600, color: ratio >= 100 ? "#16a34a" : "#f59e0b" }}>{ratio.toFixed(1) + "%"}</td>
                    </tr>
                  );
                })
                : <EmptyRow cols={7} className />}
            </tbody>
          </table></div>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <h3 style={TABLE_TITLE}>Bảng Doanh số theo Khách hàng</h3>
          <div className="table-wrap"><table style={{ minWidth: "100%" }}>
            <thead><tr><th>Mã KH</th><th>Tên KH</th><th style={RIGHT}>Doanh số</th><th style={RIGHT}>Số đơn</th><th style={RIGHT}>Nợ phát sinh</th><th style={RIGHT}>Đã thu</th><th style={RIGHT}>Nợ ròng tháng</th><th style={RIGHT}>Dư nợ cuối tháng</th></tr></thead>
            <tbody>
              {kh.rows.length
                ? kh.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="mono">{row.id}</td>
                    <td>{customerName(row.id)}</td>
                    <td style={SALES_CELL}>{money(row.s)}</td>
                    <td style={RIGHT}>{row.c}</td>
                    <DebtCells chi={row.chi} thu={row.thu} luyKe={row.luyKe} />
                  </tr>
                ))
                : <EmptyRow cols={8} className />}
            </tbody>
          </table></div>
          <Pagination page={kh.page} pageSize={PAGE_SIZE} totalRows={stats.khRows.length} noun="khách hàng" onPage={setKhPage} />
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#f8fafc", borderBottom: "1px solid var(--line)", flexWrap: "wrap", gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 14 }}>Bảng Danh sách sản phẩm</h3>
            <input type="text" placeholder="Tìm mã, tên sản phẩm..." value={productSearch} onChange={(e) => { setProductSearch(e.target.value); setSpPage(1); }}
              style={{ border: "1px solid var(--line)", padding: "5px 10px", borderRadius: 6, fontSize: 13, outline: "none", background: "#fff", width: 220 }} />
          </div>
          <div className="table-wrap">
            <table style={{ minWidth: "100%" }}>
              <thead>
                <tr>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th style={RIGHT}>Số lượng bán</th>
                  <th style={RIGHT}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {sp.rows.length
                  ? sp.rows.map((row) => (
                    <tr key={row.id}>
                      <td className="mono">{row.id}</td>
                      <td>{row.name}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{Number(row.slg || 0).toLocaleString("vi-VN")}</td>
                      <td style={SALES_CELL}>{money(row.thanh_tien)}</td>
                    </tr>
                  ))
                  : <EmptyRow cols={4} className />}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f8fafc", fontWeight: 700, borderTop: "1px solid var(--line)" }}>
                  <td colSpan="2">Tổng cộng</td>
                  <td style={RIGHT}>{totalQty.toLocaleString("vi-VN")}</td>
                  <td style={{ textAlign: "right", color: "var(--brand)" }}>{money(totalRevenue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <Pagination page={sp.page} pageSize={PAGE_SIZE} totalRows={products.length} noun="sản phẩm" onPage={setSpPage} />
        </div>
      </div>
    </>
  );
}
