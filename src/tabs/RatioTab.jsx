import { useMemo, useState } from "react";
import { useData } from "../store/DataContext.jsx";
import { usePersistentState } from "../store/persistentState.js";
import SearchDropdown from "../components/common/SearchDropdown.jsx";
import Pagination, { paginate } from "../components/common/Pagination.jsx";
import { money, parseLooseNumber } from "../lib/format.js";
import DataTable from "../components/table/DataTable.jsx";

const PAGE_SIZE = 50;
const FILTER_BOX = { display: "flex", alignItems: "center", background: "#fff", border: "1px solid var(--line)", borderRadius: 8, padding: "0 10px", height: 38 };
const FILTER_LABEL = { fontSize: 12, color: "var(--muted)", fontWeight: 600, marginRight: 8 };
const FILTER_SELECT = { border: "none", outline: "none", fontSize: 13, background: "transparent", cursor: "pointer" };
const NO_FILTERS = { kh: "", khText: "", nv: "", kenh: "" };
const SUMMARY_CELL = { padding: "10px 8px" };

// Chỉ tính doanh thu hàng của hai nhà cung cấp này.
const isAllowedNcc = (ncc) => {
  const n = String(ncc || "").trim().toLowerCase();
  return n === "lock&king" || n === "takin";
};

function SummaryCard({ label, value, color, labelColor, background, border }) {
  return (
    <div className="card" style={{ padding: 16, background, border: `1px solid ${border}` }}>
      <small style={{ color: labelColor, fontWeight: 700, textTransform: "uppercase", fontSize: 11 }}>{label}</small>
      <strong style={{ display: "block", fontSize: 20, marginTop: 4, color }}>{value}</strong>
    </div>
  );
}

const SUMMARY_HEAD = { ...SUMMARY_CELL, background: "#f8fafc" };
const RATIO_STAFF_COLUMNS = [
  { key: "nv", label: "NHÂN VIÊN QUẢN LÝ", headerStyle: SUMMARY_HEAD, style: { ...SUMMARY_CELL, fontWeight: 700, color: "#475569" }, render: (s) => s.nv },
  { key: "ds", label: "DOANH THU ĐẠT", align: "right", headerStyle: SUMMARY_HEAD, style: { ...SUMMARY_CELL, fontWeight: 600 }, render: (s) => money(s.ds) },
  { key: "tt", label: "TỈ TRỌNG KPI (%)", align: "right", headerStyle: SUMMARY_HEAD, style: { ...SUMMARY_CELL, color: "#6366f1", fontWeight: 700 }, render: (s) => `${(s.tt_tong * 100).toFixed(2)}%` },
  { key: "kpi", label: "KPI NĂM 2026", align: "right", headerStyle: SUMMARY_HEAD, style: { ...SUMMARY_CELL, fontWeight: 600 }, render: (s) => money(s.kpi) },
  { key: "kpi_thang", label: "KPI TB THÁNG", align: "right", headerStyle: SUMMARY_HEAD, style: { ...SUMMARY_CELL, fontWeight: 600 }, render: (s) => money(s.kpi_thang) },
  { key: "con_thieu", label: "D.THU CÒN THIẾU", align: "right", headerStyle: { ...SUMMARY_HEAD, color: "#ef4444" }, style: (s) => ({ ...SUMMARY_CELL, color: s.ds_con_thieu > 0 ? "#ef4444" : "#16a34a", fontWeight: 700 }), render: (s) => money(s.ds_con_thieu) }
];

const RATIO_CUSTOMER_COLUMNS = [
  { key: "id", label: "ID", headerStyle: { width: 100 }, className: "mono", render: (r) => r.id },
  { key: "ten_kh", label: "KHÁCH HÀNG", style: { fontWeight: 600 }, render: (r) => r.ten_kh },
  { key: "nv", label: "NV QUẢN LÝ", headerStyle: { width: 180 }, render: (r) => r.nv_quan_ly },
  { key: "kenh", label: "KÊNH", headerStyle: { width: 120 }, render: (r) => <span className="badge" style={{ background: r.kenh === "ONLINE" ? "#e0f2fe" : "#f1f5f9", color: r.kenh === "ONLINE" ? "#0369a1" : "#475569" }}>{r.kenh}</span> },
  { key: "doanh_thu", label: "DOANH THU", align: "right", style: { fontWeight: 600 }, render: (r) => money(r.doanh_thu) },
  { key: "ti_trong", label: "TỈ TRỌNG (%)", align: "right", style: { color: "var(--brand)", fontWeight: 700 }, render: (r) => `${(r.ti_trong * 100).toFixed(2)}%` },
  { key: "kpi", label: "KPI 2026", align: "right", style: { color: "#16a34a", fontWeight: 600 }, render: (r) => money(r.kpi_2026) },
  { key: "kpi_thang", label: "KPI THÁNG 2026", align: "right", style: { color: "#16a34a", fontWeight: 600 }, render: (r) => money(r.kpi_thang_2026) }
];

export default function RatioTab() {
  const { data } = useData();
  const [filters, setFilters] = usePersistentState("tiTrong.filters", NO_FILTERS);
  const [page, setPage] = usePersistentState("tiTrong.page", 1);
  // Chữ đang gõ trong ô khách hàng; chỉ thành bộ lọc khi chọn một gợi ý.
  const [khInput, setKhInput] = useState(filters.khText);

  const applyFilters = (patch) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    setPage(1);
    setKhInput(next.khText);
  };

  const { allRows, nvOptions, kenhOptions } = useMemo(() => {
    const sales = data.DH_CT.filter((row) => isAllowedNcc(row.ncc));
    const total = sales.reduce((sum, row) => sum + Number(row.thanh_tien || 0), 0);
    const byCustomer = {};
    sales.forEach((row) => {
      const npp = String(row.npp || "").trim();
      if (npp) byCustomer[npp] = (byCustomer[npp] || 0) + Number(row.thanh_tien || 0);
    });
    return {
      allRows: data.KHACH_HANG.map((kh) => {
        const doanh_thu = byCustomer[kh.id] || 0;
        const ti_trong = total > 0 ? doanh_thu / total : 0;
        const kpi_2026 = Math.round(ti_trong * parseLooseNumber(kh.tt));
        return { id: kh.id, ten_kh: kh.ten_kh, nv_quan_ly: kh.nv_quan_ly, kenh: kh.kenh, doanh_thu, ti_trong, kpi_2026, kpi_thang_2026: Math.round(kpi_2026 / 12) };
      }),
      nvOptions: [...new Set(data.KHACH_HANG.map((kh) => kh.nv_quan_ly).filter(Boolean))].sort(),
      kenhOptions: [...new Set(data.KHACH_HANG.map((kh) => kh.kenh).filter(Boolean))].sort()
    };
  }, [data.DH_CT, data.KHACH_HANG]);

  const rows = allRows
    .filter((r) => {
      if (filters.kh && !(`${r.id} ${r.ten_kh}`).toLowerCase().includes(filters.kh.toLowerCase())) return false;
      if (filters.nv && r.nv_quan_ly !== filters.nv) return false;
      if (filters.kenh && r.kenh !== filters.kenh) return false;
      return true;
    })
    .sort((a, b) => b.doanh_thu - a.doanh_thu);
  const current = paginate(rows, page, PAGE_SIZE);

  const byStaff = {};
  rows.forEach((r) => {
    const nv = r.nv_quan_ly || "Chưa phân công";
    if (!byStaff[nv]) byStaff[nv] = { nv, ds: 0, tt_tong: 0, kpi: 0, kpi_thang: 0 };
    byStaff[nv].ds += r.doanh_thu;
    byStaff[nv].tt_tong += r.ti_trong;
    byStaff[nv].kpi += r.kpi_2026;
    byStaff[nv].kpi_thang += r.kpi_thang_2026;
  });
  const staffSummary = Object.values(byStaff).map((s) => ({ ...s, ds_con_thieu: s.kpi - s.ds })).sort((a, b) => b.ds - a.ds);

  const totalSales = rows.reduce((sum, r) => sum + r.doanh_thu, 0);
  const totalKpi = rows.reduce((sum, r) => sum + r.kpi_2026, 0);
  const achieved = totalKpi > 0 ? totalSales / totalKpi : 0;

  return (
    <div className="section-shell">
      <div className="section-header">
        <div className="section-title"><span className="title-dot"></span><span>PHÂN TÍCH TỈ TRỌNG DOANH THU</span></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <SearchDropdown
            className="ti-trong-dropdown"
            boxStyle={{ ...FILTER_BOX, minWidth: 200 }}
            prefix={<label style={FILTER_LABEL}>KHÁCH HÀNG:</label>}
            placeholder="Gõ để tìm..."
            clearStyle={{ fontSize: 16, cursor: "pointer", color: "#999", marginLeft: 5 }}
            menuClassName="ti-trong-menu"
            itemClassName="ti-trong-item"
            emptyText="Không tìm thấy khách hàng."
            value={khInput}
            onInput={(text) => {
              setKhInput(text);
              if (!text) applyFilters({ kh: "", khText: "" });
            }}
            getOptions={(query) => {
              const q = (query || "").toLowerCase().trim();
              return data.KHACH_HANG
                .filter((kh) => (`${kh.id} ${kh.ten_kh}`).toLowerCase().includes(q))
                .slice(0, 50)
                .map((kh, i) => ({ key: `${kh.id}-${i}`, id: kh.id, name: kh.ten_kh, label: <><b>{kh.id}</b><span>{kh.ten_kh}</span></> }));
            }}
            onSelect={(option) => applyFilters({ kh: option.id, khText: option.name })}
            showClear={!!filters.kh}
            onClear={() => applyFilters({ kh: "", khText: "" })}
          />
          <div style={FILTER_BOX}>
            <label style={FILTER_LABEL}>NV QUẢN LÝ:</label>
            <select style={{ ...FILTER_SELECT, minWidth: 110 }} value={filters.nv} onChange={(e) => applyFilters({ nv: e.target.value })}>
              <option value="">Tất cả</option>
              {nvOptions.map((nv) => <option key={nv} value={nv}>{nv}</option>)}
            </select>
          </div>
          <div style={FILTER_BOX}>
            <label style={FILTER_LABEL}>KÊNH:</label>
            <select style={{ ...FILTER_SELECT, minWidth: 90 }} value={filters.kenh} onChange={(e) => applyFilters({ kenh: e.target.value })}>
              <option value="">Tất cả</option>
              {kenhOptions.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <button className="btn btn-secondary" style={{ height: 38 }} onClick={() => applyFilters(NO_FILTERS)}>Xóa lọc</button>
        </div>
      </div>

      <div className="panel">
        <div className="summary-card-wrap">
          <SummaryCard label="Tổng Doanh thu theo lọc" value={money(totalSales)} color="#16a34a" labelColor="#16a34a" background="#f0fdf4" border="#bbf7d0" />
          <SummaryCard label="Tỉ lệ đạt" value={`${(achieved * 100).toFixed(1)}%`} color="#ea580c" labelColor="#c2410c" background="#fff7ed" border="#fed7aa" />
          <SummaryCard label="Tỉ lệ còn lại" value={`${(Math.max(0, 1 - achieved) * 100).toFixed(1)}%`} color="#9333ea" labelColor="#7e22ce" background="#faf5ff" border="#e9d5ff" />
          <SummaryCard label="Tổng DT còn thiếu" value={money(totalKpi - totalSales)} color="#e11d48" labelColor="#be123c" background="#fff1f2" border="#fecdd3" />
        </div>

        <div style={{ background: "#fff7ed", border: "1px solid #ffedd5", padding: "10px 14px", borderRadius: 10, fontSize: 12, color: "#9a3412", marginBottom: 20 }}>
          <strong>Điều kiện tính toán:</strong> Chỉ tính doanh thu của các đơn hàng có Nhà cung cấp (NCC) là <strong>Lock&amp;king</strong> hoặc <strong>Takin</strong>.
        </div>

        <div className="summary-card-inner" style={{ marginBottom: 24 }}>
          <div className="summary-title"><div style={{ width: 4, height: 14, background: "#6366f1", borderRadius: 2 }}></div>TỔNG HỢP THEO NHÂN VIÊN (KPI 2026)</div>
          <DataTable
            id="ratio-staff"
            name="Tổng hợp theo nhân viên"
            columns={RATIO_STAFF_COLUMNS}
            rows={staffSummary}
            rowKey={(s) => s.nv}
            rowProps={() => ({ style: { borderBottom: "1px solid #f1f5f9" } })}
            tableStyle={{ fontSize: 12, borderCollapse: "collapse" }}
          />
        </div>

        <div className="summary-title" style={{ marginLeft: 4 }}><div style={{ width: 4, height: 14, background: "#00b894", borderRadius: 2 }}></div>CHI TIẾT THEO KHÁCH HÀNG</div>
        <DataTable
          id="ratio-customers"
          name="Chi tiết theo khách hàng"
          columns={RATIO_CUSTOMER_COLUMNS}
          rows={current.rows}
          rowKey={(r, index) => `${r.id}-${index}`}
          wrapStyle={{ maxHeight: "calc(100vh - 450px)", overflow: "auto" }}
          tableStyle={{ minWidth: 1200, borderCollapse: "separate", borderSpacing: 0 }}
          theadStyle={{ position: "sticky", top: 0, zIndex: 10, background: "#f8fafc", boxShadow: "0 1px 0 var(--line)" }}
        />
        <Pagination page={current.page} pageSize={PAGE_SIZE} totalRows={rows.length} noun="khách hàng" onPage={setPage} />
      </div>
    </div>
  );
}
