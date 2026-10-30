import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useData } from "../store/DataContext.jsx";
import MultiSelect from "../components/common/MultiSelect.jsx";
import { computeSalesDashboard } from "../lib/salesDashboard.js";
import { money, debtColor } from "../lib/format.js";
import DataTable from "../components/table/DataTable.jsx";

const PAGE_SIZE = 20;
const TYPE_COLORS = ["#2563eb", "#7c3aed", "#ea580c", "#16a34a", "#db2777", "#0284c7"];
const CARD = { padding: "12px 14px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,.04)" };
const CARD_LABEL = { color: "var(--muted)", fontWeight: 700, fontSize: 10 };
const CARD_VALUE = { display: "block", fontSize: 16, marginTop: 4 };
const TABLE_TITLE = { margin: 0, padding: "14px 16px", background: "#f8fafc", borderBottom: "1px solid var(--line)", fontSize: 14 };
const SALES_CELL = { textAlign: "right", color: "var(--text-main)", fontWeight: 600 };

function SummaryCard({ label, value, color, labelColor }) {
  return (
    <div className="card" style={CARD}>
      <small style={{ ...CARD_LABEL, color: labelColor || CARD_LABEL.color }}>{label}</small>
      <strong style={{ ...CARD_VALUE, color }}>{value}</strong>
    </div>
  );
}

const TOOLBAR = { padding: "8px 12px 0" };

// Các cột nợ dùng chung cho bảng tháng/khách hàng/nhân viên.
const debtColumns = (labels) => [
  { key: "chi", label: labels[0], align: "right", style: { color: "#ef4444" }, render: (row) => money(row.chi) },
  { key: "thu", label: labels[1], align: "right", style: { color: "#16a34a" }, render: (row) => money(row.thu) },
  { key: "rong", label: labels[2], align: "right", style: (row) => ({ color: debtColor(row.chi - row.thu) }), render: (row) => money(row.chi - row.thu) },
  { key: "luy_ke", label: labels[3], align: "right", style: (row) => ({ fontWeight: "bold", color: debtColor(row.luyKe) }), render: (row) => money(row.luyKe) }
];
const MONTH_DEBT_LABELS = ["Nợ phát sinh", "Đã thu", "Nợ ròng tháng", "Dư nợ cuối tháng"];

const NCC_COLUMNS = [
  { key: "name", label: "Tên NCC", render: (row) => row.name },
  { key: "s", label: "Tổng D/số", align: "right", style: { color: "#0f172a" }, render: (row) => <strong>{money(row.s)}</strong> }
];

const MONTH_COLUMNS = [
  { key: "month", label: "Tháng", className: "mono", render: (row) => row.month },
  { key: "s", label: "Doanh số", align: "right", style: SALES_CELL, render: (row) => money(row.s) },
  { key: "c", label: "Số đơn", align: "right", render: (row) => row.c },
  ...debtColumns(MONTH_DEBT_LABELS)
];

const staffRatio = (row) => (row.chiCM > 0 ? (row.thuCM / row.chiCM) * 100 : 0);
const STAFF_COLUMNS = [
  { key: "id", label: "Mã NV", className: "mono", render: (row) => row.id },
  { key: "s", label: "Doanh số", align: "right", style: SALES_CELL, render: (row) => money(row.s) },
  ...debtColumns(["Nợ phát sinh", "Nợ đã thu", "Nợ ròng", "Dư nợ cuối"]),
  { key: "ti_le", label: "Tỉ lệ thu (tháng này)", align: "right", style: (row) => ({ fontWeight: 600, color: staffRatio(row) >= 100 ? "#16a34a" : "#f59e0b" }), render: (row) => staffRatio(row).toFixed(1) + "%" }
];

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

const SALES_TYPES = [
  { key: "thuong", label: "Thường", color: "#2563eb" },
  { key: "chinh", label: "Chính", color: "#7c3aed" },
  { key: "r1", label: "R1", color: "#ea580c" }
];

const CHART_MODES = [
  { id: 1, title: "Tổng doanh số" },
  { id: 2, title: "Cột chồng: chia 3 khúc theo loại" },
  { id: 3, title: "Cột nhóm: tách 3 cột theo loại" },
  { id: 4, title: "Đường xu hướng từng loại" },
  { id: 5, title: "Tỉ trọng % từng loại" }
];
const CHART_MODE_KEY = "dash_chart_mode";

const readChartMode = () => {
  try {
    const saved = Number(localStorage.getItem(CHART_MODE_KEY));
    return CHART_MODES.some((m) => m.id === saved) ? saved : 1;
  } catch {
    return 1;
  }
};

// Tổng 3 loại của một tháng, dùng làm mẫu số cho tỉ trọng.
const typeSum = (row) => SALES_TYPES.reduce((sum, t) => sum + Math.max(0, row[t.key] || 0), 0);
const percentOf = (row, key) => {
  const total = typeSum(row);
  return total > 0 ? (Math.max(0, row[key] || 0) / total) * 100 : 0;
};

function buildChartConfig(rows, mode) {
  const labels = rows.map((r) => r.month);
  if (mode === 1) {
    return {
      type: "bar",
      data: { labels, datasets: [{ data: rows.map((r) => r.s), backgroundColor: "#2d5bff", borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    };
  }
  const isLine = mode === 4;
  const isPercent = mode === 5;
  const isStacked = mode === 2 || isPercent;
  return {
    type: isLine ? "line" : "bar",
    data: {
      labels,
      datasets: SALES_TYPES.map((t) => ({
        label: t.label,
        data: rows.map((r) => (isPercent ? percentOf(r, t.key) : r[t.key] || 0)),
        backgroundColor: t.color,
        borderColor: t.color,
        ...(isLine ? { tension: 0.25, pointRadius: 3, borderWidth: 2 } : { borderRadius: isStacked ? 0 : 3 })
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { stacked: isStacked },
        y: { stacked: isStacked, ...(isPercent ? { max: 100, ticks: { callback: (value) => `${value}%` } } : null) }
      },
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12, boxHeight: 12 } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const row = rows[ctx.dataIndex];
              const key = SALES_TYPES[ctx.datasetIndex].key;
              return `${ctx.dataset.label}: ${money(row[key] || 0)} (${percentOf(row, key).toFixed(1)}%)`;
            },
            footer: (items) => {
              const row = rows[items[0].dataIndex];
              const lines = [`Tổng doanh số: ${money(row.s)}`];
              if (Math.round(row.khac)) lines.push(`Chưa phân loại: ${money(row.khac)}`);
              return lines;
            }
          }
        }
      }
    }
  };
}

function MonthChart({ rows, mode }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const chart = new Chart(canvasRef.current, buildChartConfig(rows, mode));
    return () => chart.destroy();
  }, [rows, mode]);
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

  const chartRows = useMemo(() => stats.monthRows.slice().reverse(), [stats.monthRows]);
  const [chartMode, setChartMode] = useState(readChartMode);
  const pickChartMode = (mode) => {
    setChartMode(mode);
    try { localStorage.setItem(CHART_MODE_KEY, String(mode)); } catch { }
  };

  const resetPages = () => { setKhPage(1); setSpPage(1); };
  const changeFilter = (setter) => (value) => { setter(value); resetPages(); };

  const term = productSearch.trim().toLowerCase();
  const products = stats.productRows
    .map((row) => ({ ...row, name: productName(row.id) }))
    .filter((row) => !term || row.id.toLowerCase().includes(term) || (row.name && String(row.name).toLowerCase().includes(term)));
  const totalQty = products.reduce((sum, row) => sum + (row.slg || 0), 0);
  const totalRevenue = products.reduce((sum, row) => sum + (row.thanh_tien || 0), 0);

  const customerColumns = [
    { key: "id", label: "Mã KH", className: "mono", render: (row) => row.id },
    { key: "ten_kh", label: "Tên KH", render: (row) => customerName(row.id) },
    { key: "s", label: "Doanh số", align: "right", style: SALES_CELL, render: (row) => money(row.s) },
    { key: "c", label: "Số đơn", align: "right", render: (row) => row.c },
    ...debtColumns(MONTH_DEBT_LABELS)
  ];
  const productColumns = [
    { key: "id", label: "Mã sản phẩm", className: "mono", render: (row) => row.id },
    { key: "name", label: "Tên sản phẩm", render: (row) => row.name },
    { key: "slg", label: "Số lượng bán", align: "right", style: { fontWeight: 600 }, render: (row) => Number(row.slg || 0).toLocaleString("vi-VN"), footer: totalQty.toLocaleString("vi-VN") },
    { key: "thanh_tien", label: "Thành tiền", align: "right", style: SALES_CELL, render: (row) => money(row.thanh_tien), footer: money(totalRevenue), footerStyle: { color: "var(--brand)" } }
  ];

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
          <DataTable
            id="dash-ncc"
            name="Doanh số theo NCC"
            columns={NCC_COLUMNS}
            rows={stats.nccRows}
            rowKey={(row) => row.name}
            toolbarStyle={TOOLBAR}
            wrapStyle={{ flex: 1, maxHeight: 260, overflowY: "auto" }}
            tableStyle={{ minWidth: "100%" }}
          />
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="chart-head">
            <h3>Doanh số theo tháng</h3>
            <div className="cs-segment" role="group" aria-label="Kiểu biểu đồ">
              {CHART_MODES.map((m) => (
                <button key={m.id} type="button" title={m.title} aria-label={m.title} aria-pressed={chartMode === m.id}
                  className={chartMode === m.id ? "active" : ""} onClick={() => pickChartMode(m.id)}>{m.id}</button>
              ))}
            </div>
          </div>
          <div style={{ height: 260 }}><MonthChart rows={chartRows} mode={chartMode} /></div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 20, marginBottom: 40 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <h3 style={TABLE_TITLE}>Bảng Doanh số theo tháng</h3>
          <DataTable
            id="dash-month"
            name="Doanh số theo tháng"
            columns={MONTH_COLUMNS}
            rows={stats.monthRows}
            rowKey={(row) => row.month}
            toolbarStyle={TOOLBAR}
            tableStyle={{ minWidth: "100%" }}
          />
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <h3 style={TABLE_TITLE}>Bảng Nhân viên (Mã NV)</h3>
          <DataTable
            id="dash-staff"
            name="Nhân viên (Mã NV)"
            columns={STAFF_COLUMNS}
            rows={stats.nvRows}
            rowKey={(row) => row.id}
            toolbarStyle={TOOLBAR}
            tableStyle={{ minWidth: "100%" }}
          />
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <h3 style={TABLE_TITLE}>Bảng Doanh số theo Khách hàng</h3>
          <DataTable
            id="dash-customers"
            name="Doanh số theo khách hàng"
            columns={customerColumns}
            rows={stats.khRows}
            pageSize={PAGE_SIZE}
            page={khPage}
            onPage={setKhPage}
            pageNoun="khách hàng"
            rowKey={(row) => row.id}
            toolbarStyle={TOOLBAR}
            tableStyle={{ minWidth: "100%" }}
          />
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#f8fafc", borderBottom: "1px solid var(--line)", flexWrap: "wrap", gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 14 }}>Bảng Danh sách sản phẩm</h3>
            <input type="text" placeholder="Tìm mã, tên sản phẩm..." value={productSearch} onChange={(e) => { setProductSearch(e.target.value); setSpPage(1); }}
              style={{ border: "1px solid var(--line)", padding: "5px 10px", borderRadius: 6, fontSize: 13, outline: "none", background: "#fff", width: 220 }} />
          </div>
          <DataTable
            id="dash-products"
            name="Danh sách sản phẩm"
            columns={productColumns}
            rows={products}
            pageSize={PAGE_SIZE}
            page={spPage}
            onPage={setSpPage}
            pageNoun="sản phẩm"
            rowKey={(row) => row.id}
            footerLabel="Tổng cộng"
            footerRowStyle={{ background: "#f8fafc", fontWeight: 700, borderTop: "1px solid var(--line)" }}
            toolbarStyle={TOOLBAR}
            tableStyle={{ minWidth: "100%" }}
          />
        </div>
      </div>
    </>
  );
}
