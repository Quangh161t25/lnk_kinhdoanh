import { useMemo, useState } from "react";
import { useData } from "../store/DataContext.jsx";
import { usePersistentState } from "../store/persistentState.js";
import SearchDropdown from "../components/common/SearchDropdown.jsx";
import Pagination, { paginate } from "../components/common/Pagination.jsx";
import { money, parseLooseNumber } from "../lib/format.js";

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
          <div className="table-wrap">
            <table style={{ fontSize: 12, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid var(--line)" }}>
                  <th style={SUMMARY_CELL}>NHÂN VIÊN QUẢN LÝ</th>
                  <th style={{ ...SUMMARY_CELL, textAlign: "right" }}>DOANH THU ĐẠT</th>
                  <th style={{ ...SUMMARY_CELL, textAlign: "right" }}>TỈ TRỌNG KPI (%)</th>
                  <th style={{ ...SUMMARY_CELL, textAlign: "right" }}>KPI NĂM 2026</th>
                  <th style={{ ...SUMMARY_CELL, textAlign: "right" }}>KPI TB THÁNG</th>
                  <th style={{ ...SUMMARY_CELL, textAlign: "right", color: "#ef4444" }}>D.THU CÒN THIẾU</th>
                </tr>
              </thead>
              <tbody>
                {staffSummary.map((s) => (
                  <tr key={s.nv} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ ...SUMMARY_CELL, fontWeight: 700, color: "#475569" }}>{s.nv}</td>
                    <td style={{ ...SUMMARY_CELL, textAlign: "right", fontWeight: 600 }}>{money(s.ds)}</td>
                    <td style={{ ...SUMMARY_CELL, textAlign: "right", color: "#6366f1", fontWeight: 700 }}>{(s.tt_tong * 100).toFixed(2)}%</td>
                    <td style={{ ...SUMMARY_CELL, textAlign: "right", fontWeight: 600 }}>{money(s.kpi)}</td>
                    <td style={{ ...SUMMARY_CELL, textAlign: "right", fontWeight: 600 }}>{money(s.kpi_thang)}</td>
                    <td style={{ ...SUMMARY_CELL, textAlign: "right", color: s.ds_con_thieu > 0 ? "#ef4444" : "#16a34a", fontWeight: 700 }}>{money(s.ds_con_thieu)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="summary-title" style={{ marginLeft: 4 }}><div style={{ width: 4, height: 14, background: "#00b894", borderRadius: 2 }}></div>CHI TIẾT THEO KHÁCH HÀNG</div>
        <div className="table-wrap" style={{ maxHeight: "calc(100vh - 450px)", overflow: "auto" }}>
          <table style={{ minWidth: 1200, borderCollapse: "separate", borderSpacing: 0 }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#f8fafc", boxShadow: "0 1px 0 var(--line)" }}>
              <tr>
                <th style={{ width: 100 }}>ID</th>
                <th>KHÁCH HÀNG</th>
                <th style={{ width: 180 }}>NV QUẢN LÝ</th>
                <th style={{ width: 120 }}>KÊNH</th>
                <th style={{ textAlign: "right" }}>DOANH THU</th>
                <th style={{ textAlign: "right" }}>TỈ TRỌNG (%)</th>
                <th style={{ textAlign: "right" }}>KPI 2026</th>
                <th style={{ textAlign: "right" }}>KPI THÁNG 2026</th>
              </tr>
            </thead>
            <tbody>
              {current.rows.map((r, index) => (
                <tr key={`${r.id}-${index}`}>
                  <td className="mono">{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.ten_kh}</td>
                  <td>{r.nv_quan_ly}</td>
                  <td><span className="badge" style={{ background: r.kenh === "ONLINE" ? "#e0f2fe" : "#f1f5f9", color: r.kenh === "ONLINE" ? "#0369a1" : "#475569" }}>{r.kenh}</span></td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{money(r.doanh_thu)}</td>
                  <td style={{ textAlign: "right", color: "var(--brand)", fontWeight: 700 }}>{(r.ti_trong * 100).toFixed(2)}%</td>
                  <td style={{ textAlign: "right", color: "#16a34a", fontWeight: 600 }}>{money(r.kpi_2026)}</td>
                  <td style={{ textAlign: "right", color: "#16a34a", fontWeight: 600 }}>{money(r.kpi_thang_2026)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={current.page} pageSize={PAGE_SIZE} totalRows={rows.length} noun="khách hàng" onPage={setPage} />
      </div>
    </div>
  );
}
