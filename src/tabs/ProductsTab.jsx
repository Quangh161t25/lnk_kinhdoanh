import { useMemo, useState } from "react";
import { useData } from "../store/DataContext.jsx";
import { useDrawer } from "../components/Drawer.jsx";
import { usePersistentState } from "../store/persistentState.js";
import SearchDropdown from "../components/common/SearchDropdown.jsx";
import DataTable from "../components/table/DataTable.jsx";
import { money, randomId } from "../lib/format.js";

const MAX_ROWS = 150; // chỉ vẽ 150 dòng đầu cho mượt với dữ liệu lớn
const ADD_BUTTON_STYLE = { padding: "0 12px", fontSize: 20, borderRadius: 8, height: 32, display: "flex", alignItems: "center", justifyContent: "center" };
const READONLY = { background: "var(--soft)" };

// Tô sáng phần khớp với từ khóa tìm kiếm (không phân biệt hoa thường).
function Highlight({ text, query }) {
  const str = String(text || "");
  if (!query || !str) return str;
  const regex = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
  return str.split(regex).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

export default function ProductsTab() {
  const { data, requireAdmin } = useData();
  const drawer = useDrawer();
  const [search, setSearch] = useState("");
  const [nccText, setNccText] = useState("");
  const [sort, setSort] = usePersistentState("products.sort", { col: "", asc: true });

  const nccList = useMemo(() => [...new Set(data.DS_SP.map((p) => p.ncc).filter(Boolean))], [data.DS_SP]);

  const rows = useMemo(() => {
    const q = search.toLowerCase();
    const ncc = nccText.toLowerCase();
    const result = data.DS_SP.filter((item) => {
      if (ncc && !(item.ncc || "").toLowerCase().includes(ncc)) return false;
      if (q && ![item.ten_sp, item.model, item.id, item.ncc, item.thong_so].join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort.col) {
      const value = (row) => (sort.col === "gia_ban" ? Number(row[sort.col] || 0) : String(row[sort.col] || "").toLowerCase());
      result.sort((a, b) => {
        const start = value(a);
        const end = value(b);
        if (start < end) return sort.asc ? -1 : 1;
        if (start > end) return sort.asc ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data.DS_SP, search, nccText, sort]);

  const toggleSort = (col) => setSort((current) => (current.col === col ? { col, asc: !current.asc } : { col, asc: true }));
  const openForm = (id) => openProductForm(drawer, requireAdmin, id);

  // Bấm tiêu đề cột để sắp xếp (như cũ).
  const sortable = (col) => ({
    headerProps: { onClick: () => toggleSort(col), style: { cursor: "pointer", userSelect: "none" } },
    headerExtra: <> <span>{sort.col === col ? (sort.asc ? "▲" : "▼") : ""}</span></>
  });
  const columns = [
    { key: "id", label: "ID", ...sortable("id"), className: "mono", render: (item) => <Highlight text={item.id} query={search} /> },
    { key: "ten_sp", label: "Tên SP", ...sortable("ten_sp"), style: { fontWeight: 600, color: "var(--text-main)" }, render: (item) => <Highlight text={item.ten_sp} query={search} /> },
    { key: "model", label: "Model", ...sortable("model"), render: (item) => <Highlight text={item.model} query={search} /> },
    { key: "ncc", label: "NCC", ...sortable("ncc"), render: (item) => <Highlight text={item.ncc} query={search} /> },
    { key: "gia_ban", label: "Giá bán", ...sortable("gia_ban"), align: "right", render: (item) => <strong style={{ color: "var(--brand)" }}>{money(item.gia_ban)}</strong> }
  ];

  return (
    <div className="card panel">
      <div className="toolbar" style={{ alignItems: "flex-end" }}>
        <div><h2>Sản phẩm</h2><p className="subtle">Sheet DS_SP: id, ten_sp, model, ncc, gia_ban.</p></div>
      </div>
      <div className="toolbar sticky-filter" style={{ borderBottom: "none" }}>
        <div className="toolbar-search" style={{ flexWrap: "wrap", alignItems: "center", flex: 1 }}>
          <input type="text" placeholder="Tìm tên, model, id, ncc, thông số..." style={{ minWidth: 300 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <SearchDropdown
            boxStyle={{ minWidth: 200, position: "relative" }}
            inputStyle={{ paddingRight: 24 }}
            menuStyle={{ maxHeight: 220 }}
            placeholder="NCC: Gõ để tìm..."
            emptyText="Không tìm thấy NCC."
            value={nccText}
            onInput={setNccText}
            getOptions={(query) => nccList.filter((n) => n.toLowerCase().includes(query.toLowerCase())).map((n) => ({ key: n, label: n }))}
            onSelect={(option) => setNccText(option.key)}
            showClear={!!nccText}
            onClear={() => setNccText("")}
          />
          <button className="btn btn-primary" type="button" style={ADD_BUTTON_STYLE} title="Thêm tay sản phẩm" onClick={() => openForm("")}>+</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand)" }}>Hiển thị: {rows.length} sản phẩm</span>
          <button className="btn btn-secondary" type="button" onClick={() => { setSearch(""); setNccText(""); }}>Bỏ lọc</button>
        </div>
      </div>
      <DataTable
        id="products"
        name="Sản phẩm"
        columns={columns}
        rows={rows.slice(0, MAX_ROWS)}
        rowKey={(item, index) => `${item.id}-${index}`}
        rowProps={(item) => ({ "data-action": "view-product", style: { cursor: "pointer" }, onDoubleClick: () => openProductDrawer(drawer, data, item.id) })}
        empty="Không tìm thấy sản phẩm."
        after={rows.length > MAX_ROWS && <>... và <strong>{rows.length - MAX_ROWS}</strong> sản phẩm khác (Hãy lọc chi tiết hơn)</>}
      />
    </div>
  );
}

function openProductDrawer(drawer, data, productId) {
  if (!data.DS_SP.some((row) => row.id === productId)) return;
  drawer.open("Chi tiết Sản phẩm", "Chỉ xem thông tin sản phẩm.", <ProductDetail productId={productId} />);
}

function openProductForm(drawer, requireAdmin, productId) {
  if (!requireAdmin("Chỉ admin mới được thêm hoặc sửa sản phẩm.")) return;
  drawer.open(productId ? "Sửa Sản phẩm" : "Thêm Sản phẩm", "Cập nhật dữ liệu vào Sheet DS_SP.", <ProductForm productId={productId} />);
}

function ProductDetail({ productId }) {
  const { data, isAdmin, requireAdmin } = useData();
  const drawer = useDrawer();
  const item = data.DS_SP.find((row) => row.id === productId);
  if (!item) return null;
  const field = (label, value) => <div className="field"><label>{label}</label><input value={value} readOnly style={READONLY} /></div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {field("ID", item.id)}
      {field("Tên sản phẩm", item.ten_sp || "")}
      {field("Model", item.model || "")}
      {field("NCC (Nhà cung cấp)", item.ncc || "")}
      <div className="field full"><label>Giá bán</label><input value={money(item.gia_ban || 0)} readOnly style={{ background: "var(--brand-soft)", fontWeight: 800, color: "var(--brand)", fontSize: 16 }} /></div>
      {isAdmin && (
        <div className="button-row full" style={{ marginTop: 12 }}>
          <button className="btn btn-secondary" onClick={() => openProductForm(drawer, requireAdmin, item.id)}>Sửa sản phẩm</button>
        </div>
      )}
    </div>
  );
}

function ProductForm({ productId }) {
  const { data, saveRecord } = useData();
  const drawer = useDrawer();
  const [form, setForm] = useState(() => {
    const item = data.DS_SP.find((row) => row.id === productId) || {};
    return { id: item.id || randomId("SP"), ten_sp: item.ten_sp || "", model: item.model || "", ncc: item.ncc || "", gia_ban: item.gia_ban || "" };
  });
  const bind = (name) => ({ name, value: form[name], onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })) });

  async function handleSubmit(event) {
    event.preventDefault();
    const record = { id: String(form.id).trim(), ten_sp: String(form.ten_sp).trim(), model: String(form.model || "").trim(), ncc: String(form.ncc || "").trim(), gia_ban: Number(form.gia_ban || 0) };
    if (await saveRecord("DS_SP", record, { addedMessage: "Đã thêm sản phẩm mới.", updatedMessage: "Đã cập nhật sản phẩm." })) drawer.close();
  }

  return (
    <form style={{ display: "flex", flexDirection: "column", gap: 8 }} onSubmit={handleSubmit}>
      <div className="field"><label>ID</label><input {...bind("id")} readOnly={!!productId} required /></div>
      <div className="field full"><label>Tên sản phẩm</label><input {...bind("ten_sp")} required /></div>
      <div className="field"><label>Model</label><input {...bind("model")} /></div>
      <div className="field"><label>NCC</label><input {...bind("ncc")} /></div>
      <div className="field"><label>Giá bán</label><input type="number" {...bind("gia_ban")} min="0" required style={{ fontSize: 15, fontWeight: 600, color: "var(--brand)" }} /></div>
      <div className="button-row full" style={{ marginTop: 12 }}><button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Lưu Sản phẩm</button></div>
    </form>
  );
}
