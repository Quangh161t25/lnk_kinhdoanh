import { useMemo, useRef, useState } from "react";
import { useData } from "../store/DataContext.jsx";
import { useDrawer } from "../components/Drawer.jsx";
import { appendRows, replaceSheet } from "../store/data.js";
import { showToast, showBusyToast, hideToast } from "../components/Toast.jsx";
import SearchDropdown from "../components/common/SearchDropdown.jsx";
import { readWorkbook, excelSerialToDate, toAmount } from "../lib/excel.js";
import { money, formatDateVi, parseDateSort, randomId } from "../lib/format.js";
import DataTable from "../components/table/DataTable.jsx";
import Modal, { SelectionBar } from "../components/common/Modal.jsx";
import MultiValueFilter, { makeTokenMatcher } from "../components/common/MultiValueFilter.jsx";
import { usePersistentState } from "../store/persistentState.js";

const MAX_ROWS = 150;
const EMPTY_PICK = { text: "", value: "" };
const EMPTY_FILTERS = { search: "", nv: EMPTY_PICK, sp: [], npp: [], from: "", to: "" };

// "yyyy-mm-dd" → "yyyymmdd" để so sánh với parseDateSort(ngay).
const dayKey = (iso) => String(iso || "").replace(/-/g, "");
const isoOf = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
// Khoảng ngày của tháng hiện tại (offset 0) hoặc tháng trước (offset -1).
const monthRange = (offset) => {
  const now = new Date();
  return { from: isoOf(new Date(now.getFullYear(), now.getMonth() + offset, 1)), to: isoOf(new Date(now.getFullYear(), now.getMonth() + offset + 1, 0)) };
};

// "ID - Tên" khi tên khác ID, ngược lại chỉ ID.
const labelWithName = (id, name) => (name && name !== id ? `${id} - ${name}` : id);

// Đọc sheet "Báo cáo": từ dòng 4, C = mã đơn, B = ngày, H = NPP, J/K = mã/tên SP, M = SL, N = đơn giá, O = thành tiền.
function orderDetailsFromWorkbook(workbook, data) {
  const rows = workbook.rows("Báo cáo");
  const staffOf = {};
  data.KHACH_HANG.forEach((customer) => {
    const customerId = String(customer.id || "").trim();
    if (customerId) staffOf[customerId] = String(customer.nv_quan_ly || "").trim();
  });
  const products = [...data.DS_SP];
  const knownProducts = new Set(products.map((product) => String(product.id || "").trim()).filter(Boolean));
  const newProducts = [];
  const newDetails = [];

  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    const id_dh = String(row[2] || "").trim();
    if (!id_dh) continue;

    let ngay = String(row[1] || "").trim();
    if (typeof row[1] === "number") {
      const date = excelSerialToDate(row[1]);
      ngay = `${date.getUTCDate().toString().padStart(2, "0")}/${(date.getUTCMonth() + 1).toString().padStart(2, "0")}/${date.getUTCFullYear()}`;
    }
    const npp = String(row[7] || "").trim();
    const id_sp = String(row[9] || "").trim();
    const ten_sp = String(row[10] || "").trim();
    if (!id_sp) continue;
    const don_gia = toAmount(String(row[13] || "0"));
    const slg = toAmount(String(row[12] || "0"));
    const thanh_tien = toAmount(String(row[14] || "0"));

    if (!knownProducts.has(id_sp)) {
      const product = { id: id_sp, ten_sp: ten_sp || id_sp, model: "", ncc: "", gia_ban: don_gia || 0, sp_chinh_thuong: "" };
      products.push(product);
      newProducts.push(product);
      knownProducts.add(id_sp);
    }
    const product = products.find((x) => String(x.id).trim() === id_sp);

    newDetails.push({
      id: randomId().toLowerCase() + randomId().toLowerCase().substring(0, 2),
      id_dh, ngay, npp,
      id_nv: staffOf[npp] || "",
      id_sp, don_gia, slg, thanh_tien,
      ncc: null,
      sp_chinh_thuong: (product ? product.sp_chinh_thuong : null) || null
    });
  }
  return { newProducts, newDetails };
}

export default function OrderDetailsTab() {
  const { data, users, isAdmin, customerName, productName, staffName, getData, commit, markSynced } = useData();
  const drawer = useDrawer();
  const fileRef = useRef(null);
  const [filters, setFilters] = usePersistentState("orders.filters", EMPTY_FILTERS);
  const [selected, setSelected] = useState(() => new Set());
  const [resyncOpen, setResyncOpen] = useState(false);
  const setFilter = (patch) => setFilters((current) => ({ ...current, ...patch }));

  const pickLists = useMemo(() => {
    const unique = (field) => [...new Set(data.DH_CT.map((d) => d[field]).filter(Boolean))];
    return {
      nv: unique("id_nv").map((id) => ({ id, text: users.find((x) => x.id === id)?.ho_ten || id })),
      sp: unique("id_sp").map((id) => ({ id, text: data.DS_SP.find((x) => x.id === id)?.ten_sp || id })),
      npp: unique("npp").map((id) => ({ id, text: data.KHACH_HANG.find((x) => x.id === id)?.ten_kh || id }))
    };
  }, [data.DH_CT, data.DS_SP, data.KHACH_HANG, users]);

  const rows = useMemo(() => {
    const q = filters.search.toLowerCase();
    const fNv = filters.nv.value.toLowerCase();
    const matchSp = makeTokenMatcher(filters.sp, pickLists.sp);
    const matchNpp = makeTokenMatcher(filters.npp, pickLists.npp);
    const from = dayKey(filters.from);
    const to = dayKey(filters.to);
    return data.DH_CT
      .filter((item) => {
        if (fNv && !(item.id_nv || "").toLowerCase().includes(fNv)) return false;
        if (filters.sp.length && !matchSp(item.id_sp, productName(item.id_sp))) return false;
        if (filters.npp.length && !matchNpp(item.npp, customerName(item.npp))) return false;
        if (from || to) {
          const day = parseDateSort(item.ngay);
          if (from && day < from) return false;
          if (to && day > to) return false;
        }
        if (q && ![item.id, item.id_dh, item.id_sp, productName(item.id_sp), item.npp, item.id_nv].join(" ").toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => parseDateSort(b.ngay).localeCompare(parseDateSort(a.ngay)));
  }, [data.DH_CT, filters, productName, customerName, pickLists]);

  const thisMonth = monthRange(0);
  const lastMonth = monthRange(-1);
  const isRange = (range) => filters.from === range.from && filters.to === range.to;
  const toggleRange = (range) => setFilter(isRange(range) ? { from: "", to: "" } : range);

  const sumQty = rows.reduce((sum, r) => sum + Number(r.slg || 0), 0);
  const sumTotal = rows.reduce((sum, r) => sum + Number(r.thanh_tien || 0), 0);

  const pickFilter = (key, placeholder) => (
    <SearchDropdown
      boxStyle={{ minWidth: 180, position: "relative" }}
      inputStyle={{ paddingRight: 24 }}
      menuStyle={{ maxHeight: 220 }}
      placeholder={placeholder}
      emptyText="Không tìm thấy."
      value={filters[key].text}
      // Gõ chữ chưa lọc ngay; chỉ khi chọn một gợi ý (hoặc xóa trắng) bộ lọc mới đổi.
      onInput={(text) => setFilter({ [key]: { text, value: text ? filters[key].value : "" } })}
      getOptions={(query) => {
        const q = query.toLowerCase();
        return pickLists[key]
          .filter((n) => String(n.text || "").toLowerCase().includes(q) || String(n.id || "").toLowerCase().includes(q))
          .slice(0, 50)
          .map((n) => ({ key: n.id, id: n.id, label: n.text }));
      }}
      onSelect={(option) => setFilter({ [key]: { text: String(option.label), value: option.id } })}
      showClear={!!filters[key].text}
      onClear={() => setFilter({ [key]: EMPTY_PICK })}
    />
  );

  async function handleExcel(event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    showBusyToast("Đang xử lý file Excel...");
    try {
      const workbook = await readWorkbook(file);
      if (!workbook.sheetNames.includes("Báo cáo")) {
        alert("Không tìm thấy Sheet 'Báo cáo' trong file Excel.");
        return;
      }
      const { newProducts, newDetails } = orderDetailsFromWorkbook(workbook, getData());
      if (newDetails.length > 0) {
        const current = getData();
        commit({ ...current, DS_SP: [...current.DS_SP, ...newProducts], DH_CT: [...current.DH_CT, ...newDetails] });
        if (newProducts.length > 0) await appendRows("DS_SP", newProducts);
        await appendRows("DH_CT", newDetails);
        markSynced();
        alert(`Import thành công: ${newDetails.length} dòng chi tiết vào DH_CT.${newProducts.length ? ` Đã thêm ${newProducts.length} sản phẩm mới vào DS_SP.` : ""}`);
      } else {
        alert("Import thất bại: Không có dữ liệu hợp lệ.");
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
        <div><h2>Chi tiết Đơn hàng</h2><p className="subtle">Sheet DH_CT: Liệt kê chi tiết từng sản phẩm được bán ra trong kho.</p></div>
      </div>
      <div className="toolbar sticky-filter" style={{ borderBottom: "none" }}>
        <div className="toolbar-search" style={{ flexWrap: "wrap", alignItems: "center", flex: 1 }}>
          <input type="text" placeholder="Tìm ID đơn, sản phẩm, NPP, NV..." style={{ minWidth: 250 }} value={filters.search} onChange={(e) => setFilter({ search: e.target.value })} />
          {pickFilter("nv", "Lọc Nhân viên...")}
          <MultiValueFilter options={pickLists.sp} values={filters.sp} onChange={(sp) => setFilter({ sp })} placeholder="Lọc sản phẩm (nhiều, cách dấu ,)" noun="sản phẩm" width={250} />
          <MultiValueFilter options={pickLists.npp} values={filters.npp} onChange={(npp) => setFilter({ npp })} placeholder="Lọc NPP (nhiều, cách dấu ,)" noun="NPP" width={250} />
          <div className="date-range">
            <input type="date" title="Từ ngày" value={filters.from} onChange={(e) => setFilter({ from: e.target.value })} />
            <span>→</span>
            <input type="date" title="Tới ngày" value={filters.to} onChange={(e) => setFilter({ to: e.target.value })} />
            <button type="button" className={`quick-chip${isRange(thisMonth) ? " active" : ""}`} onClick={() => toggleRange(thisMonth)}>Tháng này</button>
            <button type="button" className={`quick-chip${isRange(lastMonth) ? " active" : ""}`} onClick={() => toggleRange(lastMonth)}>Tháng trước</button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isAdmin && (
            <>
              <button className="btn btn-primary" type="button" onClick={() => fileRef.current?.click()}>+ Tải Excel</button>
              <input type="file" ref={fileRef} accept=".xlsx, .xls" style={{ display: "none" }} onChange={handleExcel} />
            </>
          )}
          <button className="btn btn-secondary" type="button" onClick={() => setFilters(EMPTY_FILTERS)}>Bỏ lọc</button>
        </div>
      </div>
      <SelectionBar count={selected.size} total={rows.length} noun="dòng"
        onSelectAll={() => setSelected(new Set(rows.map((item) => item.id)))} onClear={() => setSelected(new Set())}>
        {isAdmin && <button className="btn btn-primary" type="button" onClick={() => setResyncOpen(true)}>⟳ Đồng bộ lại ({selected.size})</button>}
      </SelectionBar>
      <DataTable
        id="order-details"
        selection={{ keyOf: (item) => item.id, selected, onChange: setSelected }}
        name="Đơn hàng chi tiết"
        columns={[
          { key: "id_dh", label: "ID đơn hàng", className: "mono", render: (item) => <span className="badge" style={{ background: "#e0f2fe", color: "#0284c7" }}>{item.id_dh}</span> },
          { key: "ngay", label: "Ngày", render: (item) => formatDateVi(item.ngay) },
          { key: "npp", label: "Nhà phân phối", render: (item) => labelWithName(item.npp, customerName(item.npp)) },
          { key: "id_nv", label: "ID nhân viên", render: (item) => staffName(item.id_nv) || item.id_nv },
          { key: "id_sp", label: "ID sản phẩm", style: { fontWeight: 600, color: "var(--text)" }, render: (item) => labelWithName(item.id_sp, productName(item.id_sp)) },
          { key: "loai_sp", label: "Loại SP", render: (item) => <span className="badge" style={{ background: "#f1f5f9", color: "#475569" }}>{item.sp_chinh_thuong || "-"}</span> },
          { key: "don_gia", label: "Đơn giá", align: "right", render: (item) => money(item.don_gia) },
          { key: "slg", label: "Số lượng", align: "center", render: (item) => item.slg, footer: sumQty, footerStyle: { color: "var(--brand)" } },
          { key: "thanh_tien", label: "Thành tiền", align: "right", render: (item) => <strong style={{ color: "var(--brand)" }}>{money(item.thanh_tien)}</strong>, footer: money(sumTotal), footerStyle: { color: "var(--brand)" } }
        ]}
        rows={rows}
        limit={MAX_ROWS}
        rowKey={(item, index) => `${item.id}-${index}`}
        rowProps={(item) => ({ "data-action": "view-order-detail", style: { cursor: "pointer" }, onDoubleClick: () => openOrderDrawer(drawer, data, item.id_dh) })}
        empty="Không tìm thấy chi tiết đơn hàng."
        footerLabel={<strong>TỔNG CỘNG:</strong>}
        tfootStyle={{ fontWeight: "bold", background: "#f8fafc" }}
      />
      {resyncOpen && <ResyncOrders ids={selected} onClose={() => setResyncOpen(false)} onDone={() => { setResyncOpen(false); setSelected(new Set()); }} />}
    </div>
  );
}

// Tính các dòng DH_CT sẽ đổi khi đồng bộ lại theo dữ liệu gốc hiện tại.
// Chỉ ghi đè khi dữ liệu gốc có giá trị (sản phẩm chưa có NCC thì giữ NCC cũ của dòng).
function planResync(data, ids, opts) {
  const products = new Map(data.DS_SP.map((p) => [String(p.id || "").trim(), p]));
  const customers = new Map(data.KHACH_HANG.map((c) => [String(c.id || "").trim(), c]));
  const counts = { ncc: 0, type: 0, nv: 0, rows: 0 };
  const DH_CT = data.DH_CT.map((row) => {
    if (!ids.has(row.id)) return row;
    const product = products.get(String(row.id_sp || "").trim());
    const customer = customers.get(String(row.npp || "").trim());
    const next = { ...row };
    let changed = false;
    const ncc = String(product?.ncc || "").trim();
    if (opts.ncc && ncc && ncc !== String(row.ncc || "").trim()) { next.ncc = ncc; counts.ncc++; changed = true; }
    const type = String(product?.sp_chinh_thuong || "").trim();
    if (opts.type && type && type !== String(row.sp_chinh_thuong || "").trim()) { next.sp_chinh_thuong = type; counts.type++; changed = true; }
    const nv = String(customer?.nv_quan_ly || "").trim();
    if (opts.nv && nv && nv !== String(row.id_nv || "").trim()) { next.id_nv = nv; counts.nv++; changed = true; }
    if (changed) counts.rows++;
    return changed ? next : row;
  });
  return { DH_CT, counts };
}

// Đồng bộ lại các dòng đơn hàng đã chọn theo DS_SP (NCC, loại SP) và KHACH_HANG (NV quản lý).
function ResyncOrders({ ids, onClose, onDone }) {
  const { getData, commit, markSynced, requireAdmin } = useData();
  const [opts, setOpts] = useState({ ncc: true, type: true, nv: false });
  const [saving, setSaving] = useState(false);
  const plan = useMemo(() => planResync(getData(), ids, opts), [getData, ids, opts]);
  const toggle = (key) => setOpts((o) => ({ ...o, [key]: !o[key] }));

  async function run() {
    if (!requireAdmin("Chỉ admin mới được đồng bộ lại đơn hàng.")) return;
    if (!plan.counts.rows) { showToast("Các dòng đã chọn đã khớp, không có gì thay đổi."); return onDone(); }
    setSaving(true);
    try {
      const fresh = planResync(getData(), ids, opts);
      const next = commit({ ...getData(), DH_CT: fresh.DH_CT });
      await replaceSheet("DH_CT", next.DH_CT);
      markSynced();
      showToast(`Đã đồng bộ lại ${fresh.counts.rows} dòng đơn hàng.`);
      onDone();
    } catch (error) {
      console.error(error);
      showToast(error.message || "Lỗi khi đồng bộ đơn hàng.", true);
      setSaving(false);
    }
  }

  return (
    <Modal
      title={`Đồng bộ lại ${ids.size.toLocaleString("vi-VN")} dòng đơn hàng`}
      subtitle="Lấy lại thông tin mới nhất từ danh sách sản phẩm và khách hàng, ghi vào sheet DH_CT."
      onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" type="button" onClick={onClose}>Hủy</button>
        <button className="btn btn-primary" type="button" onClick={run} disabled={saving}>{saving ? "Đang đồng bộ…" : `Đồng bộ ${plan.counts.rows} dòng`}</button>
      </>}
    >
      <label className="check-line">
        <input type="checkbox" checked={opts.ncc} onChange={() => toggle("ncc")} />
        <span>NCC theo danh sách sản phẩm <b className="count">({plan.counts.ncc} dòng đổi)</b><small>Dùng cho bảng Doanh số theo NCC và tab Tỉ trọng.</small></span>
      </label>
      <label className="check-line">
        <input type="checkbox" checked={opts.type} onChange={() => toggle("type")} />
        <span>Loại SP (chính / thường / R1) theo sản phẩm <b className="count">({plan.counts.type} dòng đổi)</b><small>Ảnh hưởng cách tính thưởng nhân viên.</small></span>
      </label>
      <label className="check-line">
        <input type="checkbox" checked={opts.nv} onChange={() => toggle("nv")} />
        <span>Nhân viên theo NV quản lý của khách hàng <b className="count">({plan.counts.nv} dòng đổi)</b><small>Đổi người được tính doanh số/thưởng của các dòng này — chỉ bật khi chắc chắn.</small></span>
      </label>
      <p className="bulk-note" style={{ marginTop: 6 }}>
        Sẽ thay đổi <b>{plan.counts.rows}</b> / {ids.size.toLocaleString("vi-VN")} dòng đã chọn. Dòng nào đã khớp hoặc sản phẩm/khách chưa có dữ liệu thì giữ nguyên.
      </p>
    </Modal>
  );
}

function openOrderDrawer(drawer, data, orderId) {
  const key = String(orderId || "").trim();
  if (!data.DH_CT.some((r) => String(r.id_dh || "").trim() === key)) return;
  drawer.open("Chi tiết Đơn hàng", `ID đơn hàng: ${orderId}`, <OrderDetail orderId={orderId} />);
}

function OrderDetail({ orderId }) {
  const { data, customerName, productName } = useData();
  const key = String(orderId || "").trim();
  const details = data.DH_CT.filter((r) => String(r.id_dh || "").trim() === key);
  if (!details.length) return null;
  const first = details[0];
  const totalQty = details.reduce((sum, item) => sum + Number(item.slg || 0), 0);
  const totalMoney = details.reduce((sum, item) => sum + Number(item.thanh_tien || 0), 0);
  const readonly = { background: "var(--soft)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <div className="field"><label>ID đơn hàng</label><input value={orderId} readOnly style={{ background: "var(--brand-soft)", color: "var(--brand)", fontWeight: 700 }} /></div>
        <div className="field"><label>Ngày</label><input value={formatDateVi(first.ngay)} readOnly style={readonly} /></div>
        <div className="field"><label>Nhà phân phối</label><input value={labelWithName(first.npp || "", customerName(first.npp || ""))} readOnly style={readonly} /></div>
        <div className="field"><label>ID nhân viên</label><input value={first.id_nv || ""} readOnly style={readonly} /></div>
      </div>
      <DataTable
        id="order-detail-items"
        name="Sản phẩm trong đơn"
        columns={[
          { key: "id_sp", label: "ID sản phẩm", className: "mono", render: (item) => labelWithName(item.id_sp, productName(item.id_sp)) },
          { key: "loai_sp", label: "Loại SP", render: (item) => item.sp_chinh_thuong || "-" },
          { key: "don_gia", label: "Đơn giá", align: "right", render: (item) => money(item.don_gia) },
          { key: "slg", label: "Số lượng", align: "center", render: (item) => item.slg, footer: totalQty, footerStyle: { color: "var(--brand)" } },
          { key: "thanh_tien", label: "Thành tiền", align: "right", render: (item) => <strong>{money(item.thanh_tien)}</strong>, footer: money(totalMoney), footerStyle: { color: "var(--brand)" } }
        ]}
        rows={details}
        rowKey={(item, index) => `${item.id}-${index}`}
        footerLabel="Tổng cộng"
        wrapStyle={{ border: "1px solid var(--line)", borderRadius: 10 }}
        tableStyle={{ minWidth: "100%" }}
        tfootStyle={{ fontWeight: 800, background: "#f8fafc" }}
      />
    </div>
  );
}
