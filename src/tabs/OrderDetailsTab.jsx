import { useMemo, useRef, useState } from "react";
import { useData } from "../store/DataContext.jsx";
import { useDrawer } from "../components/Drawer.jsx";
import { appendRows } from "../store/data.js";
import { showBusyToast, hideToast } from "../components/Toast.jsx";
import SearchDropdown from "../components/common/SearchDropdown.jsx";
import { readWorkbook, excelSerialToDate, toAmount } from "../lib/excel.js";
import { money, formatDateVi, parseDateSort, randomId } from "../lib/format.js";

const MAX_ROWS = 150;
const EMPTY_PICK = { text: "", value: "" };
const EMPTY_FILTERS = { search: "", nv: EMPTY_PICK, sp: EMPTY_PICK, npp: EMPTY_PICK };

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
  const [filters, setFilters] = useState(EMPTY_FILTERS);
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
    const fSp = filters.sp.value.toLowerCase();
    const fNpp = filters.npp.value.toLowerCase();
    return data.DH_CT
      .filter((item) => {
        if (fNv && !(item.id_nv || "").toLowerCase().includes(fNv)) return false;
        if (fSp && !(item.id_sp || "").toLowerCase().includes(fSp)) return false;
        if (fNpp && !(item.npp || "").toLowerCase().includes(fNpp)) return false;
        if (q && ![item.id, item.id_dh, item.id_sp, productName(item.id_sp), item.npp, item.id_nv].join(" ").toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => parseDateSort(b.ngay).localeCompare(parseDateSort(a.ngay)));
  }, [data.DH_CT, filters, productName]);

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
          {pickFilter("sp", "Lọc ID Sản phẩm...")}
          {pickFilter("npp", "Lọc Nhà phân phối...")}
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
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID đơn hàng</th><th>Ngày</th><th>Nhà phân phối</th><th>ID nhân viên</th><th>ID sản phẩm</th><th>Loại SP</th><th style={{ textAlign: "right" }}>Đơn giá</th><th style={{ textAlign: "center" }}>Số lượng</th><th style={{ textAlign: "right" }}>Thành tiền</th></tr></thead>
          <tbody>
            {!rows.length && <tr><td colSpan="9" className="empty">Không tìm thấy chi tiết đơn hàng.</td></tr>}
            {rows.slice(0, MAX_ROWS).map((item, index) => (
              <tr key={`${item.id}-${index}`} data-action="view-order-detail" style={{ cursor: "pointer" }} onDoubleClick={() => openOrderDrawer(drawer, data, item.id_dh)}>
                <td className="mono"><span className="badge" style={{ background: "#e0f2fe", color: "#0284c7" }}>{item.id_dh}</span></td>
                <td>{formatDateVi(item.ngay)}</td>
                <td>{labelWithName(item.npp, customerName(item.npp))}</td>
                <td>{staffName(item.id_nv) || item.id_nv}</td>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>{labelWithName(item.id_sp, productName(item.id_sp))}</td>
                <td><span className="badge" style={{ background: "#f1f5f9", color: "#475569" }}>{item.sp_chinh_thuong || "-"}</span></td>
                <td style={{ textAlign: "right" }}>{money(item.don_gia)}</td>
                <td style={{ textAlign: "center" }}>{item.slg}</td>
                <td style={{ textAlign: "right" }}><strong style={{ color: "var(--brand)" }}>{money(item.thanh_tien)}</strong></td>
              </tr>
            ))}
            {rows.length > MAX_ROWS && (
              <tr><td colSpan="9" style={{ textAlign: "center", padding: 12, color: "var(--muted)", fontSize: 13, background: "#f9fafb" }}>... và <strong>{rows.length - MAX_ROWS}</strong> dòng khác (Hãy lọc chi tiết hơn)</td></tr>
            )}
          </tbody>
          <tfoot style={{ fontWeight: "bold", background: "#f8fafc" }}>
            {rows.length > 0 && (
              <tr><td colSpan="7" style={{ textAlign: "right" }}><strong>TỔNG CỘNG:</strong></td><td style={{ textAlign: "center", color: "var(--brand)" }}>{sumQty}</td><td style={{ textAlign: "right", color: "var(--brand)" }}>{money(sumTotal)}</td></tr>
            )}
          </tfoot>
        </table>
      </div>
    </div>
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
      <div className="table-wrap" style={{ border: "1px solid var(--line)", borderRadius: 10 }}>
        <table style={{ minWidth: "100%" }}>
          <thead>
            <tr>
              <th>ID sản phẩm</th>
              <th>Loại SP</th>
              <th style={{ textAlign: "right" }}>Đơn giá</th>
              <th style={{ textAlign: "center" }}>Số lượng</th>
              <th style={{ textAlign: "right" }}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <tr key={`${item.id}-${index}`}>
                <td className="mono">{labelWithName(item.id_sp, productName(item.id_sp))}</td>
                <td>{item.sp_chinh_thuong || "-"}</td>
                <td style={{ textAlign: "right" }}>{money(item.don_gia)}</td>
                <td style={{ textAlign: "center" }}>{item.slg}</td>
                <td style={{ textAlign: "right" }}><strong>{money(item.thanh_tien)}</strong></td>
              </tr>
            ))}
          </tbody>
          <tfoot style={{ fontWeight: 800, background: "#f8fafc" }}>
            <tr>
              <td colSpan="3" style={{ textAlign: "right" }}>Tổng cộng</td>
              <td style={{ textAlign: "center", color: "var(--brand)" }}>{totalQty}</td>
              <td style={{ textAlign: "right", color: "var(--brand)" }}>{money(totalMoney)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
