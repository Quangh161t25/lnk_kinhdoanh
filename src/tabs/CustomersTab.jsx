import { useMemo, useState } from "react";
import { useData } from "../store/DataContext.jsx";
import { useDrawer } from "../components/Drawer.jsx";
import SearchDropdown from "../components/common/SearchDropdown.jsx";
import DataTable from "../components/table/DataTable.jsx";
import { showToast } from "../components/Toast.jsx";
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
  // Mã các khách hàng đang tick chọn (giữ nguyên khi đổi bộ lọc).
  const [selected, setSelected] = useState(() => new Set());

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

  // Danh sách đã chọn theo thứ tự trên bảng; khách đã chọn nhưng đang bị lọc ẩn thì xếp sau.
  const selectedItems = useMemo(() => {
    const shown = rows.map((r) => r.item).filter((item) => selected.has(item.id));
    const hidden = data.KHACH_HANG.filter((item) => selected.has(item.id) && !shown.includes(item));
    return [...shown, ...hidden];
  }, [rows, data.KHACH_HANG, selected]);

  const copySelected = async (field) => {
    const text = [...new Set(selectedItems.map((item) => String(item[field] || "").trim()).filter(Boolean))].join(", ");
    if (!text) return;
    await copyText(text);
    showToast(`Đã copy ${selectedItems.length} ${field === "id" ? "mã" : "tên"} khách hàng.`);
  };

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
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-secondary" type="button" disabled={!selected.size} onClick={() => copySelected("id")}
            title={selected.size ? "Copy mã các khách hàng đã chọn, cách nhau dấu phẩy" : "Tick chọn khách hàng ở cột đầu bảng trước"}>
            📋 Copy mã KH{selected.size ? ` (${selected.size})` : ""}
          </button>
          {selected.size > 0 && (
            <>
              <button className="btn btn-secondary" type="button" onClick={() => copySelected("ten_kh")} title="Copy tên các khách hàng đã chọn, cách nhau dấu phẩy">Copy tên</button>
              <button className="btn btn-secondary" type="button" onClick={() => setSelected(new Set())} title="Bỏ chọn tất cả">Bỏ chọn</button>
            </>
          )}
          {isAdmin && <button className="btn btn-primary" type="button" style={ADD_BUTTON_STYLE} title="Thêm khách hàng" onClick={() => openCustomerForm(drawer, requireAdmin, "")}>+</button>}
          <button className="btn btn-secondary" type="button" onClick={resetFilters}>Bỏ lọc</button>
        </div>
      </div>
      <DataTable
        id="customers"
        name="Khách hàng"
        selection={{ keyOf: ({ item }) => item.id, selected, onChange: setSelected }}
        columns={CUSTOMER_COLUMNS}
        rows={rows}
        rowKey={({ item }, index) => `${item.id}-${index}`}
        rowProps={({ item, stats }) => ({
          "data-action": "view-customer",
          className: stats.congNo > HIGH_DEBT ? "row-debt-high" : "",
          style: { cursor: "pointer" },
          onDoubleClick: () => openDetail(item.id)
        })}
        empty="Không tìm thấy khách hàng phù hợp."
      />
    </div>
  );
}

const HIGH_DEBT = 10000000;
const CUSTOMER_COLUMNS = [
  { key: "id", label: "ID", className: "mono", render: ({ item }) => item.id },
  { key: "ten_kh", label: "Tên KH", style: ({ stats }) => (stats.congNo > HIGH_DEBT ? { color: "#dc2626", fontWeight: 700 } : undefined), render: ({ item }) => item.ten_kh },
  { key: "dien_thoai", label: "Điện thoại", render: ({ item }) => item.dien_thoai || "" },
  { key: "email", label: "Email", render: ({ item }) => item.email || "" },
  { key: "nv_quan_ly", label: "NV quản lý", render: ({ item }) => item.nv_quan_ly || "" },
  { key: "kenh", label: "KÊNH", style: { fontWeight: 600 }, render: ({ item }) => item.kenh || "" },
  { key: "tt", label: "TT", title: "Tỷ trọng mục tiêu", style: { fontWeight: 600 }, align: "center", render: ({ item }) => item.tt || "" },
  { key: "ban_hang", label: "Tiền bán hàng", render: ({ stats }) => money(stats.banHang) },
  { key: "thu_no", label: "Tiền thu nợ", render: ({ stats }) => money(stats.thuNo) },
  { key: "cong_no", label: "Công nợ", render: ({ stats }) => <strong style={{ color: debtTone(stats.congNo) }}>{money(stats.congNo)}</strong> },
  { key: "trang_thai", label: "Trạng thái", sortValue: ({ stats }) => (stats.congNo > 0 ? "Còn nợ" : stats.congNo < 0 ? "Dư tiền" : "Đã TT"), render: ({ stats }) => <StatusBadge congNo={stats.congNo} paidText="Đã TT" /> }
];

// Ghi vào clipboard; trình duyệt cũ / không có quyền thì dùng cách dự phòng.
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
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
        <DataTable
          id="customer-orders"
          name="Đơn hàng của khách"
          columns={CUSTOMER_ORDER_COLUMNS}
          rows={orders}
          rowKey={(o, i) => `${o.id}-${i}`}
          empty="Chưa có đơn hàng."
          wrapClassName=""
          wrapStyle={{ overflowX: "auto" }}
          tableStyle={{ width: "100%", fontSize: 12 }}
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 6px", fontSize: 13, color: "var(--muted)" }}>LỊCH SỬ THU NỢ ({payments.length})</h4>
        <DataTable
          id="customer-payments"
          name="Lịch sử thu nợ"
          columns={CUSTOMER_PAYMENT_COLUMNS}
          rows={payments}
          rowKey={(p, i) => `${p.id}-${i}`}
          empty="Chưa có giao dịch."
          wrapClassName=""
          wrapStyle={{ overflowX: "auto" }}
          tableStyle={{ width: "100%", fontSize: 12 }}
        />
      </div>
    </div>
  );
}

const CUSTOMER_ORDER_COLUMNS = [
  { key: "id", label: "ID ĐƠN", className: "mono", render: (o) => o.id },
  { key: "ngay", label: "Ngày", render: (o) => formatDateVi(o.ngay) },
  { key: "thanh_tien", label: "Thành tiền", render: (o) => <strong>{money(o.thanh_tien)}</strong> }
];

const CUSTOMER_PAYMENT_COLUMNS = [
  { key: "ngay", label: "Ngày", render: (p) => formatDateVi(p.ngay) },
  {
    key: "loai", label: "Loại",
    render: (p) => <span className={`badge ${p.thu_chi === "thu" ? "badge-thu" : "badge-chi"}`}>{p.thu_chi === "thu" ? "Thu" : "Chi"}</span>
  },
  {
    key: "so_tien", label: "Số tiền",
    render: (p) => <span style={{ color: p.thu_chi === "thu" ? "#16a34a" : "#ef4444" }}>{p.thu_chi === "thu" ? "-" : "+"}{money(p.so_tien)}</span>
  }
];

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
