import { useMemo, useState } from "react";
import { useData } from "../store/DataContext.jsx";
import { useDrawer } from "../components/Drawer.jsx";
import SearchDropdown from "../components/common/SearchDropdown.jsx";
import { money, formatDateVi, parseDateSort, randomId, todayInput } from "../lib/format.js";

const ADD_BUTTON_STYLE = { padding: "0 12px", fontSize: 20, borderRadius: 8, height: 32, display: "flex", alignItems: "center", justifyContent: "center" };
const READONLY = { background: "var(--soft)" };

function customerStats(debts, customerId) {
  let banHang = 0;
  let thuNo = 0;
  debts.forEach((row) => {
    if (row.id_khach_hang !== customerId) return;
    if (row.thu_chi === "chi") banHang += Number(row.so_tien || 0);
    if (row.thu_chi === "thu") thuNo += Number(row.so_tien || 0);
  });
  return { banHang, thuNo, congNo: banHang - thuNo };
}

const debtTone = (congNo) => (congNo > 0 ? "#ef4444" : congNo < 0 ? "#0284c7" : "#16a34a");

export default function CustomersTab() {
  const { data, isAdmin, requireAdmin } = useData();
  const drawer = useDrawer();
  const [search, setSearch] = useState("");
  const [nvText, setNvText] = useState("");

  const nvList = useMemo(() => [...new Set(data.KHACH_HANG.map((c) => c.nv_quan_ly).filter(Boolean))], [data.KHACH_HANG]);

  const rows = useMemo(() => {
    const q = search.toLowerCase();
    const nv = nvText.toLowerCase();
    return data.KHACH_HANG
      .filter((item) => {
        if (nv && !(item.nv_quan_ly || "").toLowerCase().includes(nv)) return false;
        if (q && ![item.ten_kh, item.dien_thoai, item.email].join(" ").toLowerCase().includes(q)) return false;
        return true;
      })
      .map((item) => ({ item, stats: customerStats(data.CONG_NO, item.id) }))
      .sort((a, b) => b.stats.congNo - a.stats.congNo);
  }, [data.KHACH_HANG, data.CONG_NO, search, nvText]);

  const openDetail = (id) => openCustomerDrawer(drawer, data, id);
  const resetFilters = () => { setSearch(""); setNvText(""); };

  return (
    <div className="card panel">
      <div className="toolbar" style={{ alignItems: "flex-end" }}>
        <div><h2>Khách hàng</h2><p className="subtle">Sheet KHACH_HANG — Sắp xếp theo công nợ giảm dần.</p></div>
      </div>
      <div className="toolbar sticky-filter" style={{ borderBottom: "none" }}>
        <div className="toolbar-search" style={{ flexWrap: "wrap", alignItems: "center" }}>
          <input type="text" placeholder="Tìm tên, điện thoại, email..." style={{ minWidth: 200 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <SearchDropdown
            boxStyle={{ minWidth: 180, position: "relative" }}
            inputStyle={{ paddingRight: 24 }}
            menuStyle={{ maxHeight: 220 }}
            placeholder="NV quản lý: Gõ để tìm..."
            emptyText="Không tìm thấy nhân viên."
            value={nvText}
            onInput={setNvText}
            getOptions={(query) => nvList.filter((nv) => nv.toLowerCase().includes(query.toLowerCase())).map((nv) => ({ key: nv, label: nv }))}
            onSelect={(option) => setNvText(option.key)}
            showClear={!!nvText}
            onClear={() => setNvText("")}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isAdmin && <button className="btn btn-primary" type="button" style={ADD_BUTTON_STYLE} title="Thêm khách hàng" onClick={() => openCustomerForm(drawer, requireAdmin, "")}>+</button>}
          <button className="btn btn-secondary" type="button" onClick={resetFilters}>Bỏ lọc</button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Tên KH</th><th>Điện thoại</th><th>Email</th><th>NV quản lý</th><th title="KÊNH">KÊNH</th><th title="Tỷ trọng mục tiêu">TT</th><th>Tiền bán hàng</th><th>Tiền thu nợ</th><th>Công nợ</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {!rows.length && <tr><td colSpan="9" className="empty">Không tìm thấy khách hàng phù hợp.</td></tr>}
            {rows.map(({ item, stats: { banHang, thuNo, congNo } }, index) => {
              const highDebt = congNo > 10000000;
              return (
                <tr key={`${item.id}-${index}`} data-action="view-customer" className={highDebt ? "row-debt-high" : ""} style={{ cursor: "pointer" }} onDoubleClick={() => openDetail(item.id)}>
                  <td className="mono">{item.id}</td>
                  <td style={highDebt ? { color: "#dc2626", fontWeight: 700 } : undefined}>{item.ten_kh}</td>
                  <td>{item.dien_thoai || ""}</td>
                  <td>{item.email || ""}</td>
                  <td>{item.nv_quan_ly || ""}</td>
                  <td style={{ fontWeight: 600 }}>{item.kenh || ""}</td>
                  <td style={{ fontWeight: 600, textAlign: "center" }}>{item.tt || ""}</td>
                  <td>{money(banHang)}</td>
                  <td>{money(thuNo)}</td>
                  <td><strong style={{ color: debtTone(congNo) }}>{money(congNo)}</strong></td>
                  <td><StatusBadge congNo={congNo} paidText="Đã TT" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ congNo, paidText }) {
  if (congNo === 0) return <span className="badge-status bs-paid">{paidText}</span>;
  if (congNo > 0) return <span className="badge-status bs-owe">Còn nợ</span>;
  return <span className="badge-status bs-credit">Dư tiền</span>;
}

function openCustomerDrawer(drawer, data, customerId) {
  const item = data.KHACH_HANG.find((row) => row.id === customerId);
  if (!item) return;
  drawer.open("Chi tiết Khách hàng", `${item.ten_kh} — ${item.dien_thoai || ""}`, <CustomerDetail customerId={customerId} />);
}

// Kiểm tra quyền trước khi mở biểu mẫu thêm/sửa.
function openCustomerForm(drawer, requireAdmin, customerId) {
  if (!requireAdmin("Chỉ admin mới được thêm hoặc sửa khách hàng.")) return;
  drawer.open(customerId ? "Sửa Khách hàng" : "Thêm Khách hàng", "Cập nhật dữ liệu vào Sheet KHACH_HANG.", <CustomerForm customerId={customerId} />);
}

function CustomerDetail({ customerId }) {
  const { data, isAdmin, requireAdmin } = useData();
  const drawer = useDrawer();
  const item = data.KHACH_HANG.find((row) => row.id === customerId);
  if (!item) return null;
  const { banHang, thuNo, congNo } = customerStats(data.CONG_NO, item.id);
  const orders = data.DH.filter((o) => o.npp === customerId && (!o.nhap_xuat || String(o.nhap_xuat).toLowerCase() === "xuat"));
  const payments = data.CONG_NO.filter((c) => c.id_khach_hang === customerId).sort((a, b) => parseDateSort(b.ngay).localeCompare(parseDateSort(a.ngay)));
  const tone = debtTone(congNo);
  const field = (label, value) => <div className="field"><label>{label}</label><input value={value} readOnly style={READONLY} /></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {field("ID", item.id)}
        {field("Tên khách hàng", item.ten_kh || "")}
        {field("Điện thoại", item.dien_thoai || "")}
        {field("Email", item.email || "")}
        {field("NV quản lý", item.nv_quan_ly || "")}
        {field("Kênh", item.kenh || "")}
        {field("TT (Tỉ trọng mục tiêu)", item.tt || "")}
        <div className="field full"><label>Địa chỉ</label><textarea readOnly style={{ ...READONLY, minHeight: 60 }} value={item.dia_chi || ""} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 12, textAlign: "center" }}><small style={{ color: "#16a34a", fontWeight: 600 }}>TIỀN BÁN HÀNG</small><br /><strong style={{ fontSize: 15 }}>{money(banHang)}</strong></div>
        <div style={{ background: "#e0f2fe", borderRadius: 10, padding: 12, textAlign: "center" }}><small style={{ color: "#0284c7", fontWeight: 600 }}>TIỀN THU NỢ</small><br /><strong style={{ fontSize: 15 }}>{money(thuNo)}</strong></div>
        <div style={{ background: congNo > 0 ? "#fff1f1" : congNo < 0 ? "#e0f2fe" : "#f0fdf4", borderRadius: 10, padding: 12, textAlign: "center" }}><small style={{ color: tone, fontWeight: 600 }}>CÔNG NỢ</small><br /><strong style={{ fontSize: 15, color: tone }}>{money(congNo)}</strong></div>
      </div>
      <div style={{ textAlign: "right" }}><StatusBadge congNo={congNo} paidText="Đã thanh toán" /></div>
      {isAdmin && (
        <div className="button-row full">
          <button className="btn btn-secondary" onClick={() => openCustomerForm(drawer, requireAdmin, item.id)}>Sửa khách hàng</button>
        </div>
      )}
      <div>
        <h4 style={{ margin: "0 0 6px", fontSize: 13, color: "var(--muted)" }}>DANH SÁCH ĐƠN HÀNG ({orders.length})</h4>
        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", fontSize: 12 }}><thead><tr><th>ID ĐƠN</th><th>Ngày</th><th>Thành tiền</th></tr></thead><tbody>
          {orders.length
            ? orders.map((o, i) => <tr key={`${o.id}-${i}`}><td className="mono">{o.id}</td><td>{formatDateVi(o.ngay)}</td><td><strong>{money(o.thanh_tien)}</strong></td></tr>)
            : <tr><td colSpan="3" className="empty">Chưa có đơn hàng.</td></tr>}
        </tbody></table></div>
      </div>
      <div>
        <h4 style={{ margin: "0 0 6px", fontSize: 13, color: "var(--muted)" }}>LỊCH SỬ THU NỢ ({payments.length})</h4>
        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", fontSize: 12 }}><thead><tr><th>Ngày</th><th>Loại</th><th>Số tiền</th></tr></thead><tbody>
          {payments.length
            ? payments.map((p, i) => {
              const isThu = p.thu_chi === "thu";
              return (
                <tr key={`${p.id}-${i}`}>
                  <td>{formatDateVi(p.ngay)}</td>
                  <td><span className={`badge ${isThu ? "badge-thu" : "badge-chi"}`}>{isThu ? "Thu" : "Chi"}</span></td>
                  <td><span style={{ color: isThu ? "#16a34a" : "#ef4444" }}>{isThu ? "-" : "+"}{money(p.so_tien)}</span></td>
                </tr>
              );
            })
            : <tr><td colSpan="3" className="empty">Chưa có giao dịch.</td></tr>}
        </tbody></table></div>
      </div>
    </div>
  );
}

function CustomerForm({ customerId }) {
  const { data, user, saveRecord } = useData();
  const drawer = useDrawer();
  const [form, setForm] = useState(() => {
    const item = data.KHACH_HANG.find((row) => row.id === customerId) || {};
    return {
      id: item.id || randomId("KH"),
      ten_kh: item.ten_kh || "",
      dien_thoai: item.dien_thoai || "",
      email: item.email || "",
      dia_chi: item.dia_chi || "",
      nv_quan_ly: item.nv_quan_ly || user?.id || "",
      kenh: item.kenh || "",
      tt: item.tt || ""
    };
  });
  const bind = (name) => ({ name, value: form[name], onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })) });

  async function handleSubmit(event) {
    event.preventDefault();
    const record = {
      id: String(form.id || "").trim(),
      ten_kh: String(form.ten_kh || "").trim(),
      dien_thoai: String(form.dien_thoai || "").trim(),
      email: String(form.email || "").trim(),
      dia_chi: String(form.dia_chi || "").trim(),
      ngay_cap_nhat: todayInput(),
      nv_quan_ly: String(form.nv_quan_ly || "").trim(),
      kenh: String(form.kenh || "").trim(),
      tt: String(form.tt || "").trim()
    };
    if (!record.id || !record.ten_kh) return alert("Vui lòng nhập ID và Tên khách hàng.");
    if (await saveRecord("KHACH_HANG", record, { addedMessage: "Đã thêm khách hàng mới.", updatedMessage: "Đã cập nhật khách hàng." })) drawer.close();
  }

  return (
    <form style={{ display: "flex", flexDirection: "column", gap: 8 }} onSubmit={handleSubmit}>
      <div className="field"><label>ID</label><input {...bind("id")} readOnly={!!customerId} required /></div>
      <div className="field full"><label>Tên khách hàng</label><input {...bind("ten_kh")} required /></div>
      <div className="field"><label>Điện thoại</label><input {...bind("dien_thoai")} /></div>
      <div className="field"><label>Email</label><input type="email" {...bind("email")} /></div>
      <div className="field full"><label>Địa chỉ</label><textarea {...bind("dia_chi")} style={{ minHeight: 70 }} /></div>
      <div className="field"><label>NV quản lý</label><input {...bind("nv_quan_ly")} /></div>
      <div className="field"><label>Kênh</label><input {...bind("kenh")} /></div>
      <div className="field"><label>TT</label><input {...bind("tt")} /></div>
      <div className="button-row full" style={{ marginTop: 12 }}><button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Lưu Khách hàng</button></div>
    </form>
  );
}
