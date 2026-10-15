// Các hàm định dạng và chuẩn hóa dùng chung cho mọi tab (giữ nguyên cách tính của bản cũ).

export const money = (value) => Number(value || 0).toLocaleString("vi-VN") + " đ";
export const todayInput = () => new Date().toISOString().slice(0, 10);
export const randomId = (prefix = "") => prefix + Math.random().toString(36).slice(2, 8).toUpperCase();

// "yyyy-mm-dd" hoặc "dd/mm/yyyy" → chuỗi "yyyymmdd" để so sánh/sắp xếp.
export const parseDateSort = (str) => {
  if (!str) return "0";
  if (str.includes("-")) return str.replace(/-/g, "");
  const p = str.split("/");
  return p.length === 3 ? p[2] + p[1].padStart(2, "0") + p[0].padStart(2, "0") : str;
};

export const formatDateVi = (str) => {
  if (!str) return "";
  if (str.includes("-")) {
    const p = str.split("-");
    return `${p[2]}/${p[1]}/${p[0]}`;
  }
  return str;
};

export const formatDateInput = (str) => {
  if (!str) return todayInput();
  if (str.includes("/")) {
    const p = str.split("/");
    return p.length === 3 ? `${p[2]}-${p[1].padStart(2, "0")}-${p[0].padStart(2, "0")}` : str;
  }
  return str;
};

// Ngày ("yyyy-mm-dd" hoặc "dd/mm/yyyy") → "yyyy-mm", rỗng nếu không đọc được.
export const toYearMonth = (ngay) => {
  if (!ngay) return "";
  if (ngay.includes("-")) return ngay.slice(0, 7);
  const p = ngay.split("/");
  return p.length >= 3 ? p[2] + "-" + p[1].padStart(2, "0") : "";
};

// Ngày → "mm/yyyy" dùng làm nhãn tháng, "N/A" nếu không đọc được.
export const toMonthLabel = (ngay) => {
  if (!ngay) return "N/A";
  if (ngay.includes("-")) return ngay.split("-").slice(0, 2).reverse().join("/");
  if (ngay.includes("/") && ngay.split("/").length >= 3) return ngay.split("/")[1].padStart(2, "0") + "/" + ngay.split("/")[2];
  return "N/A";
};

export const currentYearMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
};

export const removeDiacritics = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/đ/g, "d")
  .replace(/Đ/g, "D");

export const normalizeBonusKey = (value) => removeDiacritics(value).toLowerCase().replace(/[\s_\-]/g, "");

// Đọc số "lỏng": chấp nhận 1.000.000 / 1,000,000 / 1,5 / "2 %"...
export const parseLooseNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  let text = String(value ?? "").trim();
  if (!text) return 0;
  text = text.replace(/\s+/g, "").replace(/[^0-9,.\-]/g, "");
  if (!text || text === "-" || text === "," || text === ".") return 0;

  const hasDot = text.includes(".");
  const hasComma = text.includes(",");

  if (hasDot && hasComma) {
    if (text.lastIndexOf(",") > text.lastIndexOf(".")) {
      text = text.replace(/\./g, "").replace(",", ".");
    } else {
      text = text.replace(/,/g, "");
    }
  } else if (hasComma) {
    const commaCount = (text.match(/,/g) || []).length;
    if (commaCount > 1) text = text.replace(/,/g, "");
    else text = text.replace(",", ".");
  } else if (hasDot) {
    const dotCount = (text.match(/\./g) || []).length;
    if (dotCount > 1) {
      text = text.replace(/\./g, "");
    } else {
      const parts = text.split(".");
      if (parts.length === 2 && parts[1].length === 3 && parts[0].length > 0) text = parts.join("");
    }
  }

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const normalizeProductType = (value) => {
  const normalized = normalizeBonusKey(value);
  if (normalized === "chinh") return "chinh";
  if (normalized === "thuong") return "thuong";
  if (normalized === "r1") return "r1";
  return "";
};

export const normalizeMonthKey = (value) => {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^\d{4}-\d{1,2}$/.test(text)) {
    const [year, month] = text.split("-");
    return `${year}-${month.padStart(2, "0")}`;
  }
  if (/^\d{1,2}\/\d{4}$/.test(text)) {
    const [month, year] = text.split("/");
    return `${year}-${month.padStart(2, "0")}`;
  }
  if (/^\d{4}\/\d{1,2}$/.test(text)) {
    const [year, month] = text.split("/");
    return `${year}-${month.padStart(2, "0")}`;
  }
  return text;
};

// Màu dùng chung cho số dương (nợ tăng) / âm (nợ giảm).
export const debtColor = (value) => (value > 0 ? "#ef4444" : (value < 0 ? "#16a34a" : "inherit"));
