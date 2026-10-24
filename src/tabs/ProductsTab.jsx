import { useMemo, useState } from "react";
import { useData } from "../store/DataContext.jsx";
import { useDrawer } from "../components/Drawer.jsx";
import SearchDropdown from "../components/common/SearchDropdown.jsx";
import DataTable from "../components/table/DataTable.jsx";
import Modal, { SelectionBar } from "../components/common/Modal.jsx";
import { showToast } from "../components/Toast.jsx";
import { replaceSheet } from "../store/data.js";
import { money, randomId, removeDiacritics } from "../lib/format.js";

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
  const { data, isAdmin, requireAdmin } = useData();
  const drawer = useDrawer();
  const [search, setSearch] = useState("");
  const [nccText, setNccText] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [bulkOpen, setBulkOpen] = useState(false);

  const nccList = useMemo(() => [...new Set(data.DS_SP.map((p) => p.ncc).filter(Boolean))], [data.DS_SP]);

  const rows = useMemo(() => {
    const q = search.toLowerCase();
    const ncc = nccText.toLowerCase();
    const result = data.DS_SP.filter((item) => {
      if (ncc && !(item.ncc || "").toLowerCase().includes(ncc)) return false;
      if (q && ![item.ten_sp, item.model, item.id, item.ncc, item.thong_so, item.sp_chinh_thuong].join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
    return result;
  }, [data.DS_SP, search, nccText]);

  const openForm = (id) => openProductForm(drawer, requireAdmin, id);

  const columns = [
    { key: "id", label: "ID", className: "mono", render: (item) => <Highlight text={item.id} query={search} /> },
    { key: "ten_sp", label: "Tên SP", style: { fontWeight: 600, color: "var(--text-main)" }, render: (item) => <Highlight text={item.ten_sp} query={search} /> },
    { key: "model", label: "Model", render: (item) => <Highlight text={item.model} query={search} /> },
    { key: "ncc", label: "NCC", render: (item) => <Highlight text={item.ncc} query={search} /> },
    { key: "gia_ban", label: "Giá bán", align: "right", sortValue: (item) => Number(item.gia_ban || 0), render: (item) => <strong style={{ color: "var(--brand)" }}>{money(item.gia_ban)}</strong> },
    { key: "sp_chinh_thuong", label: "Loại SP", align: "center", render: (item) => <TypeBadge value={item.sp_chinh_thuong} /> }
  ];

  return (
    <div className="card panel">
      <div className="toolbar" style={{ alignItems: "flex-end" }}>
        <div><h2>Sản phẩm</h2><p className="subtle">Sheet DS_SP: id, ten_sp, model, ncc, gia_ban, sp_chinh_thuong.</p></div>
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
      <SelectionBar count={selected.size} total={rows.length} noun="sản phẩm"
        onSelectAll={() => setSelected(new Set(rows.map((item) => item.id)))} onClear={() => setSelected(new Set())}>
        {isAdmin && <button className="btn btn-primary" type="button" onClick={() => setBulkOpen(true)}>✎ Sửa NCC / loại SP ({selected.size})</button>}
      </SelectionBar>
      <DataTable
        id="products"
        selection={{ keyOf: (item) => item.id, selected, onChange: setSelected }}
        name="Sản phẩm"
        columns={columns}
        rows={rows}
        limit={MAX_ROWS}
        limitNoun="sản phẩm"
        rowKey={(item, index) => `${item.id}-${index}`}
        rowProps={(item) => ({ "data-action": "view-product", style: { cursor: "pointer" }, onDoubleClick: () => openProductDrawer(drawer, data, item.id) })}
        empty="Không tìm thấy sản phẩm."
      />
      {bulkOpen && <BulkProductEdit ids={selected} nccList={nccList} onClose={() => setBulkOpen(false)} onDone={() => { setBulkOpen(false); setSelected(new Set()); }} />}
    </div>
  );
}

const PRODUCT_TYPES = [["", "— Không đổi —"], ["chinh", "Chính"], ["thuong", "Thường"], ["r1", "R1"]];
const TYPE_LABELS = { chinh: "Chính", thuong: "Thường", r1: "R1" };
const TYPE_COLORS = { chinh: ["#e0e7ff", "#3730a3"], thuong: ["#f3e8ff", "#6b21a8"], r1: ["#e0f2fe", "#0369a1"] };
const typeKey = (value) => removeDiacritics(value).toLowerCase().trim();

// Nhãn loại SP: chinh → "Chính", thuong → "Thường", r1 → "R1"; giá trị lạ thì hiện nguyên văn.
function TypeBadge({ value }) {
  const key = typeKey(value);
  if (!key) return <span style={{ color: "var(--muted)" }}>—</span>;
  const [bg, color] = TYPE_COLORS[key] || ["#f1f5f9", "#475569"];
  return <span className="badge" style={{ background: bg, color }}>{TYPE_LABELS[key] || value}</span>;
}

// Sửa hàng loạt NCC (và tùy chọn loại SP) cho các sản phẩm đã chọn, ghi lại sheet DS_SP.
function BulkProductEdit({ ids, nccList, onClose, onDone }) {
  const { getData, commit, markSynced, requireAdmin } = useData();
  const [ncc, setNcc] = useState("");
  const [changeNcc, setChangeNcc] = useState(true);
  const [type, setType] = useState("");
  const [saving, setSaving] = useState(false);
  const count = ids.size;
  const sample = getData().DS_SP.filter((p) => ids.has(p.id)).slice(0, 5).map((p) => p.ten_sp || p.id);

  async function save() {
    if (!requireAdmin("Chỉ admin mới được sửa sản phẩm.")) return;
    if (!changeNcc && !type) return showToast("Chưa chọn thay đổi nào.", true);
    if (changeNcc && !ncc.trim() && !confirm("NCC đang để trống: các sản phẩm đã chọn sẽ bị xóa NCC. Tiếp tục?")) return;
    setSaving(true);
    try {
      const current = getData();
      const next = commit({
        ...current,
        DS_SP: current.DS_SP.map((p) => (ids.has(p.id)
          ? { ...p, ...(changeNcc ? { ncc: ncc.trim() } : null), ...(type ? { sp_chinh_thuong: type } : null) }
          : p))
      });
      await replaceSheet("DS_SP", next.DS_SP);
      markSynced();
      showToast(`Đã cập nhật ${count} sản phẩm. Vào "Đơn hàng chi tiết" → chọn dòng → "Đồng bộ lại" để áp dụng cho đơn đã có.`);
      onDone();
    } catch (error) {
      console.error(error);
      showToast(error.message || "Lỗi khi lưu sản phẩm.", true);
      setSaving(false);
    }
  }

  return (
    <Modal
      title={`Sửa ${count} sản phẩm`}
      subtitle="Áp dụng cùng lúc cho tất cả sản phẩm đã chọn, ghi vào sheet DS_SP."
      onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" type="button" onClick={onClose}>Hủy</button>
        <button className="btn btn-primary" type="button" onClick={save} disabled={saving}>{saving ? "Đang lưu…" : "Lưu thay đổi"}</button>
      </>}
    >
      <p className="bulk-note">{sample.join(", ")}{count > sample.length ? ` và ${count - sample.length} sản phẩm khác` : ""}.</p>
      <label className="check-line"><input type="checkbox" checked={changeNcc} onChange={(e) => setChangeNcc(e.target.checked)} /><span>Đổi NCC (nhà cung cấp)</span></label>
      {changeNcc && (
        <div className="field">
          <input list="bulk-ncc-list" value={ncc} onChange={(e) => setNcc(e.target.value)} placeholder="Gõ hoặc chọn NCC, ví dụ Lock&King" autoFocus />
          <datalist id="bulk-ncc-list">{nccList.map((n) => <option key={n} value={n} />)}</datalist>
        </div>
      )}
      <div className="field">
        <label>Loại SP (chính / thường / R1)</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {PRODUCT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
    </Modal>
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
      {field("Loại SP (sp_chinh_thuong)", TYPE_LABELS[typeKey(item.sp_chinh_thuong)] || item.sp_chinh_thuong || "")}
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
    return { id: item.id || randomId("SP"), ten_sp: item.ten_sp || "", model: item.model || "", ncc: item.ncc || "", gia_ban: item.gia_ban || "", sp_chinh_thuong: item.sp_chinh_thuong || "" };
  });
  const bind = (name) => ({ name, value: form[name], onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })) });

  async function handleSubmit(event) {
    event.preventDefault();
    const record = { id: String(form.id).trim(), ten_sp: String(form.ten_sp).trim(), model: String(form.model || "").trim(), ncc: String(form.ncc || "").trim(), gia_ban: Number(form.gia_ban || 0), sp_chinh_thuong: String(form.sp_chinh_thuong || "").trim() };
    if (await saveRecord("DS_SP", record, { addedMessage: "Đã thêm sản phẩm mới.", updatedMessage: "Đã cập nhật sản phẩm." })) drawer.close();
  }

  return (
    <form style={{ display: "flex", flexDirection: "column", gap: 8 }} onSubmit={handleSubmit}>
      <div className="field"><label>ID</label><input {...bind("id")} readOnly={!!productId} required /></div>
      <div className="field full"><label>Tên sản phẩm</label><input {...bind("ten_sp")} required /></div>
      <div className="field"><label>Model</label><input {...bind("model")} /></div>
      <div className="field"><label>NCC</label><input {...bind("ncc")} /></div>
      <div className="field">
        <label>Loại SP (sp_chinh_thuong)</label>
        <select {...bind("sp_chinh_thuong")}>
          <option value="">— Chưa phân loại —</option>
          {PRODUCT_TYPES.slice(1).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          {form.sp_chinh_thuong && !TYPE_LABELS[typeKey(form.sp_chinh_thuong)] && <option value={form.sp_chinh_thuong}>{form.sp_chinh_thuong}</option>}
        </select>
      </div>
      <div className="field"><label>Giá bán</label><input type="number" {...bind("gia_ban")} min="0" required style={{ fontSize: 15, fontWeight: 600, color: "var(--brand)" }} /></div>
      <div className="button-row full" style={{ marginTop: 12 }}><button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Lưu Sản phẩm</button></div>
    </form>
  );
}
