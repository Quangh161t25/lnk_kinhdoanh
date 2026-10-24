// Sắp xếp dòng theo một cột cho DataTable.

// Lấy chữ hiển thị từ nội dung React (chuỗi, số, thẻ lồng nhau, component có prop text/value).
export function textOf(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  const props = node.props;
  if (props) {
    if (props.children !== undefined) return textOf(props.children);
    if (props.text !== undefined) return textOf(props.text);
    if (props.value !== undefined) return textOf(props.value);
  }
  return "";
}

const DATE_VI = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const DATE_ISO = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

// Đổi giá trị hiển thị thành giá trị so sánh được: số tiền "1.234.567 đ", "+21.000.000 đ",
// phần trăm "54.35%", ngày "dd/mm/yyyy" → số; còn lại giữ chuỗi.
export function sortKey(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const text = String(value ?? "").trim();
  if (!text || text === "—" || text === "-") return null;

  let m = DATE_VI.exec(text);
  if (m) return Number(`${m[3]}${m[2].padStart(2, "0")}${m[1].padStart(2, "0")}`);
  m = DATE_ISO.exec(text);
  if (m) return Number(`${m[1]}${m[2].padStart(2, "0")}${m[3].padStart(2, "0")}`);

  const compact = text.replace(/\s+/g, "");
  if (/^[+-]?\d[\d.,]*%$/.test(compact)) return parseFloat(compact.replace(",", "."));
  if (/^[+-]?\d[\d.]*(,\d+)?(đ|vnđ|vnd)?$/i.test(compact)) {
    const sign = compact.startsWith("-") ? -1 : 1;
    const digits = compact.replace(/^[+-]/, "").replace(/(đ|vnđ|vnd)$/i, "");
    // "1.234.567" hoặc "1.234,5" → dấu chấm là phân cách hàng nghìn; "12.5" (một dấu chấm, ≠3 số sau) là thập phân.
    const thousands = /\.\d{3}(\.|,|$)/.test(digits) || /,/.test(digits);
    const number = thousands ? Number(digits.replace(/\./g, "").replace(",", ".")) : Number(digits);
    if (Number.isFinite(number)) return sign * number;
  }
  return text;
}

const collator = new Intl.Collator("vi", { numeric: true, sensitivity: "base" });

// Ô trống luôn nằm cuối, số so với số, chữ so theo tiếng Việt.
export function compareKeys(a, b) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "number") return -1;
  if (typeof b === "number") return 1;
  return collator.compare(a, b);
}

export function sortRows(rows, column, dir) {
  if (!column || !dir) return rows;
  const valueOf = column.sortValue || ((row, index) => textOf(column.render(row, index)));
  const sign = dir === "desc" ? -1 : 1;
  return rows
    .map((row, index) => ({ row, index, key: sortKey(valueOf(row, index)) }))
    .sort((x, y) => {
      if (x.key === null || y.key === null) return compareKeys(x.key, y.key) || x.index - y.index;
      return sign * compareKeys(x.key, y.key) || x.index - y.index;
    })
    .map((item) => item.row);
}
