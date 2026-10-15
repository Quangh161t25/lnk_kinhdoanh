import { useMemo } from "react";
import { useData } from "../store/DataContext.jsx";
import { usePersistentState } from "../store/persistentState.js";
import { computeBonusRows, computeStaffDebtRows } from "../lib/bonus.js";
import { money, debtColor } from "../lib/format.js";

const FILTER_BOX = { display: "flex", alignItems: "center", background: "#fff", border: "1px solid var(--line)", borderRadius: 8, padding: "0 10px", height: 38 };
const FILTER_LABEL = { fontSize: 12, color: "var(--muted)", fontWeight: 600, marginRight: 8 };
const FILTER_SELECT = { border: "none", outline: "none", fontSize: 13, background: "transparent", cursor: "pointer", minWidth: 110 };
const RIGHT = { textAlign: "right" };
const CODE = { background: "#e2e8f0", padding: "1px 4px", borderRadius: 3 };

// Màu theo tỉ lệ thu nợ: ≥ 90% thưởng đủ, ≥ 50% thưởng một phần, còn lại không thưởng.
const rateTone = (rate) => {
  if (rate >= 90) return { badge: "thuong-badge-full", bg: "#f0fdf4" };
  if (rate >= 50) return { badge: "thuong-badge-partial", bg: "#fefce8" };
  return { badge: "thuong-badge-none", bg: "#fff1f2" };
};

export default function BonusTab() {
  const { data } = useData();
  const [filterMonth, setFilterMonth] = usePersistentState("thuong.month", "");
  const [filterNv, setFilterNv] = usePersistentState("thuong.nv", "");

  const rows = useMemo(() => computeBonusRows(data), [data]);
  const staffRows = useMemo(() => computeStaffDebtRows(data, filterMonth, filterNv), [data, filterMonth, filterNv]);

  const months = [...new Set(rows.map((r) => r.thang))].sort().reverse();
  const nvIds = [...new Set(rows.map((r) => r.nvId))].sort();
  const filtered = rows.filter((r) => (!filterMonth || r.thang === filterMonth) && (!filterNv || r.nvId === filterNv));
  const sum = (field) => filtered.reduce((s, r) => s + (r[field] || 0), 0);

  const rules = data.DK_THUONG;
  const ruleKinds = [...new Set(rules.map((r) => JSON.stringify({ loai: r.loai, kieu: r.kieu })))];
  const productTypes = [...new Set(data.DH_CT.map((r) => r.sp_chinh_thuong || "(trống)"))];

  return (
    <div className="section-shell">
      <div className="section-header">
        <div className="section-title"><span className="title-dot"></span><span>THƯỞNG NHÂN VIÊN THEO THÁNG</span></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={FILTER_BOX}>
            <label style={FILTER_LABEL}>THÁNG:</label>
            <select style={FILTER_SELECT} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option value="">Tất cả</option>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={FILTER_BOX}>
            <label style={FILTER_LABEL}>MÃ NV:</label>
            <select style={FILTER_SELECT} value={filterNv} onChange={(e) => setFilterNv(e.target.value)}>
              <option value="">Tất cả</option>
              {nvIds.map((nv) => <option key={nv} value={nv}>{nv}</option>)}
            </select>
          </div>
          <button className="btn btn-secondary" style={{ height: 38 }} onClick={() => { setFilterMonth(""); setFilterNv(""); }}>Xóa lọc</button>
        </div>
      </div>

      <div className="panel" style={{ paddingTop: 16 }}>
        <div className="table-wrap" style={{ maxHeight: "calc(100vh - 400px)", overflow: "auto" }}>
          <table style={{ minWidth: 1200, borderCollapse: "separate", borderSpacing: 0 }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#f8fafc", boxShadow: "0 1px 0 var(--line)" }}>
              <tr>
                <th style={{ width: 110 }}>THÁNG</th>
                <th style={{ width: 180 }}>ID NV</th>
                <th style={RIGHT}>DS SP CHÍNH</th>
                <th style={RIGHT}>DS SP THƯỜNG</th>
                <th style={RIGHT}>DS SP R1</th>
                <th style={RIGHT}>THƯỞNG SP CHÍNH</th>
                <th style={RIGHT}>THƯỞNG SP THƯỜNG</th>
                <th style={RIGHT}>THƯỞNG SP R1</th>
                <th style={RIGHT}>THƯỞNG DOANH SỐ</th>
                <th style={{ textAlign: "right", width: 130 }}>TỈ LỆ THÁNG NÀY</th>
                <th style={{ textAlign: "right", background: "#fff7ed", fontWeight: 700 }}>TỔNG TIỀN THƯỞNG</th>
                <th style={{ textAlign: "right", background: "#f0fdf4", fontWeight: 700 }}>TỔNG THỰC NHẬN</th>
              </tr>
            </thead>
            <tbody>
              {!filtered.length && <tr><td colSpan="12" className="empty">Không có dữ liệu thưởng. Vui lòng kiểm tra dữ liệu DH_CT và DK_THUONG.</td></tr>}
              {filtered.map((r) => {
                const tone = rateTone(r.ti_le_thu_no);
                return (
                  <tr key={`${r.thang}||${r.nvId}`}>
                    <td style={{ fontWeight: 600 }}>{r.thang}</td>
                    <td className="mono" style={{ fontWeight: 600, color: "var(--brand)" }}>{r.nvId}</td>
                    <td style={RIGHT}>{money(r.ds_chinh)}</td>
                    <td style={RIGHT}>{money(r.ds_thuong)}</td>
                    <td style={{ textAlign: "right", color: "#0ea5e9" }}>{money(r.ds_r1 || 0)}</td>
                    <td style={{ textAlign: "right", color: "#2563eb" }}>{money(r.thuong_sp_chinh)}</td>
                    <td style={{ textAlign: "right", color: "#7c3aed" }}>{money(r.thuong_sp_thuong)}</td>
                    <td style={{ textAlign: "right", color: "#0ea5e9" }}>{money(r.thuong_sp_r1 || 0)}</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>{money(r.thuong_doanh_so)}</td>
                    <td style={RIGHT}><span className={`badge ${tone.badge}`} style={{ fontSize: 12 }}>{r.ti_le_thu_no.toFixed(0) + "%"}</span></td>
                    <td style={{ textAlign: "right", fontWeight: 700, background: tone.bg }}>{money(r.tong_tien_thuong)}</td>
                    <td style={{ textAlign: "right", fontWeight: 800, background: "#f0fdf4", color: "#16a34a" }}>{money(r.tong_thuc_nhan)}</td>
                  </tr>
                );
              })}
            </tbody>
            {filtered.length > 0 && (
              <tfoot style={{ background: "#f8fafc", fontWeight: 700, position: "sticky", bottom: 0 }}>
                <tr>
                  <td colSpan="2" style={{ textAlign: "right", color: "var(--muted)" }}>TỔNG CỘNG:</td>
                  <td style={RIGHT}>{money(sum("ds_chinh"))}</td>
                  <td style={RIGHT}>{money(sum("ds_thuong"))}</td>
                  <td style={{ textAlign: "right", color: "#0ea5e9" }}>{money(sum("ds_r1"))}</td>
                  <td style={{ textAlign: "right", color: "#2563eb" }}>{money(sum("thuong_sp_chinh"))}</td>
                  <td style={{ textAlign: "right", color: "#7c3aed" }}>{money(sum("thuong_sp_thuong"))}</td>
                  <td style={{ textAlign: "right", color: "#0ea5e9" }}>{money(sum("thuong_sp_r1"))}</td>
                  <td style={RIGHT}>{money(sum("thuong_doanh_so"))}</td>
                  <td></td>
                  <td style={{ textAlign: "right", color: "#e11d48", background: "#fff7ed" }}>{money(sum("tong_tien_thuong"))}</td>
                  <td style={{ textAlign: "right", color: "#16a34a", background: "#f0fdf4" }}>{money(sum("tong_thuc_nhan"))}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: "var(--muted)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Hiển thị <strong>{filtered.length}</strong> dòng kết quả.</span>
          <span style={{ fontStyle: "italic" }}>* Dữ liệu tính từ DH_CT (doanh số) + CONG_NO (thu nợ) + DK_THUONG (điều kiện).</span>
        </div>
      </div>

      <div className="panel" style={{ padding: 0, overflow: "hidden", marginTop: 20 }}>
        <h3 style={{ margin: 0, padding: "14px 16px", background: "#f8fafc", borderBottom: "1px solid var(--line)", fontSize: 14 }}>Bảng Nhân viên (Mã NV)</h3>
        <div className="table-wrap">
          <table style={{ minWidth: "100%" }}>
            <thead>
              <tr>
                <th>Mã NV</th>
                <th style={RIGHT}>Doanh số</th>
                <th style={RIGHT}>Nợ phát sinh</th>
                <th style={RIGHT}>Nợ đã thu</th>
                <th style={RIGHT}>Nợ ròng</th>
                <th style={RIGHT}>Dư nợ cuối</th>
                <th style={RIGHT}>Tỉ lệ thu (tháng này)</th>
              </tr>
            </thead>
            <tbody>
              {!staffRows.length && <tr><td colSpan="7" className="empty">Trống</td></tr>}
              {staffRows.map((st) => {
                const ratio = st.chiCM > 0 ? (st.thuCM / st.chiCM) * 100 : 0;
                return (
                  <tr key={st.id}>
                    <td className="mono">{st.id}</td>
                    <td style={{ textAlign: "right", color: "var(--text-main)", fontWeight: 600 }}>{money(st.s)}</td>
                    <td style={{ textAlign: "right", color: "#ef4444" }}>{money(st.chi)}</td>
                    <td style={{ textAlign: "right", color: "#16a34a" }}>{money(st.thu)}</td>
                    <td style={{ textAlign: "right", color: debtColor(st.chi - st.thu) }}>{money(st.chi - st.thu)}</td>
                    <td style={{ textAlign: "right", fontWeight: "bold", color: debtColor(st.luyKe) }}>{money(st.luyKe)}</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: ratio >= 100 ? "#16a34a" : "#f59e0b" }}>{ratio.toFixed(1) + "%"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ margin: "12px 16px 16px", padding: "12px 14px", background: "#f1f5f9", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 12, fontFamily: "Consolas,monospace" }}>
        <strong style={{ color: "#334155", fontSize: 11, textTransform: "uppercase", letterSpacing: ".04em" }}>🔍 DEBUG – Trạng thái dữ liệu</strong>
        <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
          <div>
            <b>DK_THUONG:</b> <span style={{ color: rules.length ? "#16a34a" : "#dc2626" }}>{rules.length} rule đã tải</span>
            {rules.length
              ? <span style={{ color: "#64748b" }}> | loai+kieu: {ruleKinds.map((v, i) => <span key={i}>{i > 0 && " "}<code style={CODE}>{v}</code></span>)}</span>
              : <span style={{ color: "#dc2626" }}> ← Chưa có dữ liệu trong sheet DK_THUONG!</span>}
          </div>
          <div>
            <b>DH_CT sp_chinh_thuong:</b> {productTypes.map((v, i) => <span key={i}>{i > 0 && " "}<code style={CODE}>{v}</code></span>)} <span style={{ color: "#94a3b8" }}>(code nhận: "chính"/"chinh" và "thường"/"thuong")</span>
          </div>
        </div>
      </div>
    </div>
  );
}
