import { useMemo, useRef, useState } from "react";
import { useData } from "../store/DataContext.jsx";
import { useDrawer } from "../components/Drawer.jsx";
import { replaceSheet } from "../store/data.js";
import { showToast, showBusyToast, hideToast } from "../components/Toast.jsx";
import SearchDropdown from "../components/common/SearchDropdown.jsx";
import { readWorkbook, excelSerialToDate, toAmount } from "../lib/excel.js";
import { money, formatDateVi, formatDateInput, parseDateSort, randomId, todayInput } from "../lib/format.js";

const READONLY = { background: "var(--soft)" };

// Công nợ lũy kế theo từng khách hàng, tính lại theo thứ tự ngày (id phiếu → số dư sau phiếu đó).
function virtualDebtMap(debts) {
  const ascending = debts.slice().sort((a, b) => parseDateSort(a.ngay).localeCompare(parseDateSort(b.ngay)) || String(a.id || "").localeCompare(String(b.id || "")));
  const running = {};
  const result = {};
  for (const row of ascending) {
    const customerId = row.id_khach_hang || "";
    const delta = row.thu_chi === "thu" ? -Number(row.so_tien || 0) : Number(row.so_tien || 0);
    running[customerId] = (running[customerId] || 0) + delta;
    result[row.id] = running[customerId];
  }
  return result;
}

const customerStaffMap = (customers) => {
  const map = {};
  customers.forEach((customer) => {
    const customerId = String(customer.id || "").trim();
    if (customerId) map[customerId] = String(customer.nv_quan_ly || "").trim();
  });
  return map;
};

function parseExcelDateValue(value) {
  if (value instanceof Date) return `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, "0")}-${value.getDate().toString().padStart(2, "0")}`;
  if (typeof value === "number" && value > 30000) {
    const date = excelSerialToDate(value);
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
  }
  let str = String(value || "").trim();
  if (str.includes("/")) {
    const parts = str.split("/");
    if (parts.length === 3) str = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }
  return str;
}

// Đọc báo cáo công nợ: từ dòng 5, cột A = mã KH, B = ngày, G = phát sinh nợ, H = phát sinh có.
function debtsFromWorkbook(workbook, customers) {
  const sheetName = workbook.sheetNames.includes("Báo cáo") ? "Báo cáo" : workbook.sheetNames[0];
  const rows = workbook.rows(sheetName);
  const staffOf = customerStaffMap(customers);
  const records = [];
  let skipped = 0;
  for (let i = 4; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    const idKh = String(row[0] || "").trim();
    if (!idKh || idKh.toLowerCase() === "mã khách hàng" || idKh.toLowerCase() === "tổng cộng") continue;
    const base = { ngay: parseExcelDateValue(row[1]) || todayInput(), id_khach_hang: idKh, id_dh: "", cong_no: "", id_nv: staffOf[idKh] || "" };
    const psNo = toAmount(row[6]);
    const psCo = toAmount(row[7]);
    if (psNo > 0) records.push({ id: randomId("CN"), ...base, thu_chi: "chi", so_tien: psNo });
    if (psCo > 0) records.push({ id: randomId("CN"), ...base, thu_chi: "thu", so_tien: psCo });
    if (!(psNo > 0) && !(psCo > 0)) skipped++;
  }
  return { records, skipped };
}

export default function DebtsTab() {
  const { data, isAdmin, requireAdmin, customerName, getData, commit, markSynced } = useData();
  const drawer = useDrawer();
  const fileRef = useRef(null);
  const [filters, setFilters] = useState({ start: "", end: "", type: "", customerId: "", customerText: "" });
  const setFilter = (patch) => setFilters((current) => ({ ...current, ...patch }));

  const vMap = useMemo(() => virtualDebtMap(data.CONG_NO), [data.CONG_NO]);
  const rows = useMemo(() => {
    const custText = filters.customerText.toLowerCase();
    return data.CONG_NO
      .slice()
      .sort((a, b) => parseDateSort(b.ngay).localeCompare(parseDateSort(a.ngay)) || String(b.id || "").localeCompare(String(a.id || "")))
      .filter((item) => {
        if (filters.type && item.thu_chi !== filters.type) return false;
        if (filters.start && parseDateSort(item.ngay) < parseDateSort(filters.start)) return false;
        if (filters.end && parseDateSort(item.ngay) > parseDateSort(filters.end)) return false;
        if (filters.customerId) return item.id_khach_hang === filters.customerId;
        if (custText) return String(customerName(item.id_khach_hang)).toLowerCase().includes(custText);
        return true;
      });
  }, [data.CONG_NO, filters, customerName]);

  async function handleExcel(event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    showBusyToast("Đang xử lý file Excel Công nợ...");
    try {
      const { records, skipped } = debtsFromWorkbook(await readWorkbook(file), getData().KHACH_HANG);
      if (records.length > 0) {
        const next = commit({ ...getData(), CONG_NO: [...getData().CONG_NO, ...records] });
        await replaceSheet("CONG_NO", next.CONG_NO);
        markSynced();
        alert(`Import thành công: ${records.length} dòng công nợ.${skipped ? ` Bỏ qua ${skipped} dòng không hợp lệ hoặc trùng ID.` : ""}`);
      } else {
        alert("Import thất bại: Không có dòng hợp lệ. Cần có id_khach_hang, thu_chi là thu/chi và so_tien > 0.");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi xử lý Excel: " + error.message);
    } finally {
      hideToast();
      input.value = "";
    }
  }

  return (
    <div className="card panel">
      <div className="toolbar" style={{ alignItems: "flex-end" }}>
        <div><h2>Công nợ</h2><p className="subtle">Sheet CONG_NO: Quản lý chi tiết Thu/Chi.</p></div>
        <div style={{ display: "flex", gap: 8 }}>
          {isAdmin && (
            <>
              <button className="btn btn-accent" type="button" onClick={() => fileRef.current?.click()}>+ Tải Excel</button>
              <input type="file" ref={fileRef} accept=".xlsx, .xls" style={{ display: "none" }} onChange={handleExcel} />
              <button className="btn btn-primary" type="button" onClick={() => openDebtForm(drawer, requireAdmin, "")}>Thêm phiếu</button>
            </>
          )}
        </div>
      </div>
      <div className="toolbar sticky-filter" style={{ borderBottom: "none" }}>
        <div className="toolbar-search">
          <input type="date" title="Từ ngày" value={filters.start} onChange={(e) => setFilter({ start: e.target.value })} />
          <input type="date" title="Đến ngày" value={filters.end} onChange={(e) => setFilter({ end: e.target.value })} />
          <select value={filters.type} onChange={(e) => setFilter({ type: e.target.value })}>
            <option value="">-- Tất cả phiếu --</option><option value="thu">Phiếu Thu</option><option value="chi">Phiếu Chi</option>
          </select>
          <SearchDropdown
            boxStyle={{ minWidth: 200, position: "relative" }}
            inputStyle={{ paddingRight: 24, minWidth: 180 }}
            inputProps={{ title: "Lọc theo khách hàng" }}
            menuStyle={{ maxHeight: 220 }}
            placeholder="Lọc Khách hàng: Gõ để tìm..."
            emptyText="Không tìm thấy khách."
            value={filters.customerText}
            onInput={(text) => setFilter({ customerId: "", customerText: text })}
            getOptions={(query) => {
              const q = query.toLowerCase();
              return data.KHACH_HANG
                .filter((c) => String(c.ten_kh || "").toLowerCase().includes(q) || String(c.id || "").toLowerCase().includes(q))
                .map((c, i) => ({ key: `${c.id}-${i}`, id: c.id, name: String(c.ten_kh || "").trim(), label: <>{c.ten_kh} <small>({c.id})</small></> }));
            }}
            onSelect={(option) => setFilter({ customerId: option.id, customerText: option.name })}
            showClear={!!filters.customerText}
            onClear={() => setFilter({ customerId: "", customerText: "" })}
          />
        </div>
        <div className="toolbar-right">
          <button className="btn btn-secondary" type="button" onClick={() => setFilters({ start: "", end: "", type: "", customerId: "", customerText: "" })}>Bỏ lọc</button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Ngày</th><th>Khách hàng</th><th>ID đơn</th><th>Thu/Chi</th><th>Số tiền</th><th>Công nợ Ảo</th></tr></thead>
          <tbody>
            {!rows.length && <tr><td colSpan="7" className="empty">Không tìm thấy dữ liệu phù hợp.</td></tr>}
            {rows.map((item, index) => {
              const isThu = item.thu_chi === "thu";
              return (
                <tr key={`${item.id}-${index}`} data-action="view-debt" style={{ cursor: "pointer" }} onDoubleClick={() => openDebtDrawer(drawer, data, item.id)}>
                  <td className="mono">{item.id}</td>
                  <td>{formatDateVi(item.ngay)}</td>
                  <td>{customerName(item.id_khach_hang)}</td>
                  <td>{item.id_dh || ""}</td>
                  <td><span className={`badge ${isThu ? "badge-thu" : "badge-chi"}`}>{isThu ? "Thu" : "Chi"}</span></td>
                  <td><span style={{ color: isThu ? "#16a34a" : "#ef4444" }}>{isThu ? "-" : "+"}{money(item.so_tien)}</span></td>
                  <td><strong style={{ color: "var(--brand)" }}>{money(vMap[item.id])}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function openDebtDrawer(drawer, data, debtId) {
  if (!data.CONG_NO.some((row) => row.id === debtId)) return;
  drawer.open("Chi tiết phiếu", "Xem thông tin phiếu công nợ.", <DebtDetail debtId={debtId} />);
}

function openDebtForm(drawer, requireAdmin, debtId) {
  if (!requireAdmin("Chỉ admin mới được thêm hoặc sửa công nợ.")) return;
  drawer.open(debtId ? "Sửa phiếu công nợ" : "Thêm phiếu công nợ", "Bảng công nợ sẽ bỏ qua cột công nợ tĩnh.", <DebtForm debtId={debtId} />);
}

function DebtDetail({ debtId }) {
  const { data, requireAdmin, customerName, staffName, getData, commit, markSynced } = useData();
  const drawer = useDrawer();
  const vMap = useMemo(() => virtualDebtMap(data.CONG_NO), [data.CONG_NO]);
  const item = data.CONG_NO.find((row) => row.id === debtId);
  if (!item) return null;
  const isThu = item.thu_chi === "thu";
  const field = (label, value, style = READONLY) => <div className="field"><label>{label}</label><input value={value} readOnly style={style} /></div>;

  async function handleDelete() {
    if (!requireAdmin("Chỉ admin mới được xóa công nợ.")) return;
    if (!confirm("Xóa phiếu công nợ này?")) return;
    const next = commit({ ...getData(), CONG_NO: getData().CONG_NO.filter((row) => row.id !== debtId) });
    try {
      await replaceSheet("CONG_NO", next.CONG_NO);
    } catch (error) {
      console.error(error);
      return showToast(error.message || "Lỗi khi xóa công nợ.", true);
    }
    markSynced();
    showToast("Đã xóa công nợ.");
    drawer.close();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {field("ID Phiếu", item.id)}
      {field("Ngày phát sinh", formatDateVi(item.ngay))}
      {field("Khách hàng", customerName(item.id_khach_hang))}
      {field("Nhân viên phụ trách", staffName(item.id_nv || ""))}
      {field("Liên kết Đơn hàng", item.id_dh || "Không có")}
      {field("Loại Phiếu", isThu ? "Phiếu Thu (Giảm nợ)" : "Phiếu Chi (Tăng nợ)", { ...READONLY, color: isThu ? "#16a34a" : "#ef4444", fontWeight: "bold" })}
      {field("Số tiền", money(item.so_tien))}
      <div className="field full"><label>Công nợ Ảo (Tính lại theo ngày)</label><input value={money(vMap[item.id])} readOnly style={{ background: "var(--brand-soft)", fontWeight: 800, color: "var(--brand)", fontSize: 16 }} /></div>
      <div className="button-row full" style={{ marginTop: 12 }}>
        <button className="btn btn-secondary" type="button" onClick={() => openDebtForm(drawer, requireAdmin, item.id)} style={{ flex: 1 }}>Sửa phiếu</button>
        <button className="btn btn-danger" type="button" onClick={handleDelete} style={{ flex: 1 }}>Xóa phiếu</button>
      </div>
    </div>
  );
}

function DebtForm({ debtId }) {
  const { data, users, customerName, saveRecord } = useData();
  const drawer = useDrawer();
  const [item] = useState(() => data.CONG_NO.find((row) => row.id === debtId) || {});
  const [form, setForm] = useState(() => ({
    id: item.id || randomId("CN"),
    ngay: formatDateInput(item.ngay),
    customerText: item.id_khach_hang === undefined ? "" : String(customerName(item.id_khach_hang) || ""),
    id_khach_hang: item.id_khach_hang || "",
    // Giống <select> thường: giá trị không có trong danh sách thì về lựa chọn đầu tiên.
    id_dh: data.DH.some((order) => order.id === item.id_dh) ? item.id_dh : "",
    id_nv: users.some((u) => u.id === item.id_nv) ? item.id_nv : "",
    thu_chi: debtId ? (item.thu_chi === "thu" ? "thu" : "chi") : "thu",
    so_tien: item.so_tien || ""
  }));
  const setField = (patch) => setForm((current) => ({ ...current, ...patch }));
  const bind = (name) => ({ name, value: form[name], onChange: (e) => setField({ [name]: e.target.value }) });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.id_khach_hang) return alert("Vui lòng chọn chính xác khách hàng từ danh sách tìm kiếm gợi ý.");
    const idKhachHang = String(form.id_khach_hang).trim();
    const record = {
      id: String(form.id).trim(),
      ngay: formatDateVi(String(form.ngay)),
      id_khach_hang: idKhachHang,
      id_dh: String(form.id_dh || "").trim(),
      thu_chi: String(form.thu_chi || "chi"),
      so_tien: Number(form.so_tien || 0),
      cong_no: Number(item.cong_no || 0),
      id_nv: customerStaffMap(data.KHACH_HANG)[idKhachHang] || ""
    };
    const saved = await saveRecord("CONG_NO", record, {
      merge: false,
      addedMessage: "Đã thêm phiếu công nợ (Tối ưu tốc độ).",
      updatedMessage: "Đã cập nhật công nợ.",
      fallbackMessage: "Đã lưu phiếu công nợ (Đồng bộ)."
    });
    if (saved) drawer.close();
  }

  return (
    <form className="debt-form" style={{ display: "flex", flexDirection: "column", gap: 8 }} onSubmit={handleSubmit}>
      <div className="field"><label>ID</label><input {...bind("id")} readOnly={!!debtId} required /></div>
      <div className="field"><label>Ngày phát sinh</label><input type="date" {...bind("ngay")} required /></div>
      <div className="field"><label>Khách hàng</label>
        <SearchDropdown
          placeholder="Gõ tên để tìm..."
          emptyText="Không tìm thấy khách hàng."
          inputProps={{ required: true }}
          value={form.customerText}
          onInput={(text) => setField({ customerText: text, id_khach_hang: "" })}
          getOptions={(query) => {
            const q = query.toLowerCase();
            return data.KHACH_HANG
              .filter((c) => Object.values(c).join(" ").toLowerCase().includes(q))
              .map((c, i) => ({ key: `${c.id}-${i}`, id: c.id, name: String(c.ten_kh || "").trim(), label: <>{c.ten_kh} <small>({c.dien_thoai || c.id})</small></> }));
          }}
          onSelect={(option) => setField({ customerText: option.name, id_khach_hang: option.id })}
        />
      </div>
      <div className="field"><label>Liên kết Đơn hàng (Tuỳ chọn)</label>
        <select {...bind("id_dh")}>
          <option value="">Không gắn đơn hàng</option>
          {data.DH.map((order) => <option key={order.id} value={order.id}>{order.id} - {order.npp}</option>)}
        </select>
      </div>
      <div className="field"><label>Nhân viên phụ trách</label>
        <select {...bind("id_nv")}>
          <option value="">Không phân bổ NV</option>
          {users.map((u, i) => <option key={`${u.id}-${i}`} value={u.id}>{u.ho_ten} - {u.id}</option>)}
        </select>
      </div>
      <div className="field"><label>Thu / Chi</label>
        <select {...bind("thu_chi")} required>
          <option value="thu">Thu (Khách trả giảm nợ)</option>
          <option value="chi">Chi (Phát sinh tăng nợ)</option>
        </select>
      </div>
      <div className="field"><label>Số tiền (VNĐ)</label><input type="number" {...bind("so_tien")} min="0" required placeholder="Ví dụ: 1000000" style={{ fontSize: 15, fontWeight: 600, color: "var(--brand)" }} /></div>
      <div className="button-row full" style={{ marginTop: 12 }}><button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Lưu phiếu</button></div>
    </form>
  );
}
