import { useMemo } from "react";
import { useData } from "../store/DataContext.jsx";
import { usePersistentState } from "../store/persistentState.js";
import { computeBonusRows, computeStaffDebtRows } from "../lib/bonus.js";
import { money, debtColor } from "../lib/format.js";
import DataTable from "../components/table/DataTable.jsx";

const FILTER_BOX = { display: "flex", alignItems: "center", background: "#fff", border: "1px solid var(--line)", borderRadius: 8, padding: "0 10px", height: 38 };
const FILTER_LABEL = { fontSize: 12, color: "var(--muted)", fontWeight: 600, marginRight: 8 };
const FILTER_SELECT = { border: "none", outline: "none", fontSize: 13, background: "transparent", cursor: "pointer", minWidth: 110 };
const CODE = { background: "#e2e8f0", padding: "1px 4px", borderRadius: 3 };

// Màu theo tỉ lệ thu nợ: ≥ 90% thưởng đủ, ≥ 50% thưởng một phần, còn lại không thưởng.
const rateTone = (rate) => {
  if (rate >= 90) return { badge: "thuong-badge-full", bg: "#f0fdf4" };
  if (rate >= 50) return { badge: "thuong-badge-partial", bg: "#fefce8" };
  return { badge: "thuong-badge-none", bg: "#fff1f2" };
};

// sumDs: tổng doanh số KHÔNG tính dòng quản lý (Tuyến, Nguyệt) vì doanh số của họ là tổng của người khác.
const BONUS_COLUMNS = (sum, sumDs) => [
  { key: "thang", label: "THÁNG", headerStyle: { width: 110 }, style: { fontWeight: 600 }, render: (r) => r.thang },
  { key: "nv", label: "ID NV", headerStyle: { width: 180 }, className: "mono", style: { fontWeight: 600, color: "var(--brand)" }, render: (r) => r.nvId },
  { key: "ds_chinh", label: "DS SP CHÍNH", align: "right", render: (r) => money(r.ds_chinh), footer: money(sumDs("ds_chinh")) },
  { key: "ds_thuong", label: "DS SP THƯỜNG", align: "right", render: (r) => money(r.ds_thuong), footer: money(sumDs("ds_thuong")) },
  { key: "ds_r1", label: "DS SP R1", align: "right", style: { color: "#0ea5e9" }, render: (r) => money(r.ds_r1 || 0), footer: money(sumDs("ds_r1")), footerStyle: { color: "#0ea5e9" } },
  { key: "thuong_chinh", label: "THƯỞNG SP CHÍNH", align: "right", style: { color: "#2563eb" }, render: (r) => money(r.thuong_sp_chinh), footer: money(sum("thuong_sp_chinh")), footerStyle: { color: "#2563eb" } },
  { key: "thuong_thuong", label: "THƯỞNG SP THƯỜNG", align: "right", style: { color: "#7c3aed" }, render: (r) => money(r.thuong_sp_thuong), footer: money(sum("thuong_sp_thuong")), footerStyle: { color: "#7c3aed" } },
  { key: "thuong_r1", label: "THƯỞNG SP R1", align: "right", style: { color: "#0ea5e9" }, render: (r) => money(r.thuong_sp_r1 || 0), footer: money(sum("thuong_sp_r1")), footerStyle: { color: "#0ea5e9" } },
  { key: "thuong_ds", label: "THƯỞNG DOANH SỐ", align: "right", style: { fontWeight: 700 }, render: (r) => money(r.thuong_doanh_so), footer: money(sum("thuong_doanh_so")) },
  { key: "ti_le", label: "TỈ LỆ THÁNG NÀY", align: "right", headerStyle: { width: 130 }, sortValue: (r) => (r.isManager ? null : r.ti_le_thu_no), render: (r) => (r.isManager
    ? <span style={{ color: "var(--muted)" }} title="Dòng quản lý: thưởng không phụ thuộc tỉ lệ thu nợ">—</span>
    : <span className={`badge ${rateTone(r.ti_le_thu_no).badge}`} style={{ fontSize: 12 }}>{r.ti_le_thu_no.toFixed(0) + "%"}</span>), footer: "" },
  { key: "tong_thuong", label: "TỔNG TIỀN THƯỞNG", align: "right", headerStyle: { background: "#fff7ed", fontWeight: 700 }, style: (r) => ({ fontWeight: 700, background: r.isManager ? "#fff7ed" : rateTone(r.ti_le_thu_no).bg }), render: (r) => money(r.tong_tien_thuong), footer: money(sum("tong_tien_thuong")), footerStyle: { color: "#e11d48", background: "#fff7ed" } },
  { key: "thuc_nhan", label: "TỔNG THỰC NHẬN", align: "right", headerStyle: { background: "#f0fdf4", fontWeight: 700 }, style: { fontWeight: 800, background: "#f0fdf4", color: "#16a34a" }, render: (r) => money(r.tong_thuc_nhan), footer: money(sum("tong_thuc_nhan")), footerStyle: { color: "#16a34a", background: "#f0fdf4" } }
];

const staffRatio = (st) => (st.chiCM > 0 ? (st.thuCM / st.chiCM) * 100 : 0);
const STAFF_COLUMNS = [
  { key: "id", label: "Mã NV", className: "mono", render: (st) => st.id },
  { key: "s", label: "Doanh số", align: "right", style: { color: "var(--text-main)", fontWeight: 600 }, render: (st) => money(st.s) },
  { key: "chi", label: "Nợ phát sinh", align: "right", style: { color: "#ef4444" }, render: (st) => money(st.chi) },
  { key: "thu", label: "Nợ đã thu", align: "right", style: { color: "#16a34a" }, render: (st) => money(st.thu) },
  { key: "rong", label: "Nợ ròng", align: "right", style: (st) => ({ color: debtColor(st.chi - st.thu) }), render: (st) => money(st.chi - st.thu) },
  { key: "luy_ke", label: "Dư nợ cuối", align: "right", style: (st) => ({ fontWeight: "bold", color: debtColor(st.luyKe) }), render: (st) => money(st.luyKe) },
  { key: "ti_le", label: "Tỉ lệ thu (tháng này)", align: "right", style: (st) => ({ fontWeight: 600, color: staffRatio(st) >= 100 ? "#16a34a" : "#f59e0b" }), render: (st) => staffRatio(st).toFixed(1) + "%" }
];

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
  const sumDs = (field) => filtered.reduce((s, r) => s + (r.isManager ? 0 : r[field] || 0), 0);

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
        <DataTable
          id="bonus"
          name="Thưởng nhân viên theo tháng"
          columns={BONUS_COLUMNS(sum, sumDs)}
          rows={filtered}
          rowKey={(r) => `${r.thang}||${r.nvId}`}
          empty="Không có dữ liệu thưởng. Vui lòng kiểm tra dữ liệu DH_CT và DK_THUONG."
          footerLabel="TỔNG CỘNG:"
          wrapStyle={{ maxHeight: "calc(100vh - 400px)", overflow: "auto" }}
          tableStyle={{ minWidth: 1200, borderCollapse: "separate", borderSpacing: 0 }}
          theadStyle={{ position: "sticky", top: 0, zIndex: 10, background: "#f8fafc", boxShadow: "0 1px 0 var(--line)" }}
          tfootStyle={{ background: "#f8fafc", fontWeight: 700, position: "sticky", bottom: 0 }}
        />
        <div style={{ marginTop: 12, fontSize: 13, color: "var(--muted)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Hiển thị <strong>{filtered.length}</strong> dòng kết quả.</span>
          <span style={{ fontStyle: "italic" }}>* Dữ liệu tính từ DH_CT (doanh số) + CONG_NO (thu nợ) + DK_THUONG (điều kiện).</span>
        </div>
      </div>

      <div className="panel" style={{ padding: 0, overflow: "hidden", marginTop: 20 }}>
        <h3 style={{ margin: 0, padding: "14px 16px", background: "#f8fafc", borderBottom: "1px solid var(--line)", fontSize: 14 }}>Bảng Nhân viên (Mã NV)</h3>
        <DataTable
          id="bonus-staff"
          name="Bảng Nhân viên (Mã NV)"
          columns={STAFF_COLUMNS}
          rows={staffRows}
          rowKey={(st) => st.id}
          toolbarStyle={{ padding: "8px 12px" }}
          tableStyle={{ minWidth: "100%" }}
        />
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
