// Số liệu cho tab Dashboard Kinh doanh (chuyển nguyên cách tính từ bản cũ).
import { currentYearMonth, toMonthLabel, toYearMonth } from "./format.js";

const prevMonth = (ym) => {
  if (!ym) return null;
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
};

// "mm/yyyy" → "yyyymm" để so sánh.
const sortKey = (label) => {
  if (label === "N/A") return "000000";
  const p = label.split("/");
  return p.length === 2 ? p[1] + p[0] : "000000";
};

const newNvStats = () => ({ c: 0, s: 0, chi: 0, thu: 0, chiCM: 0, thuCM: 0, chiLM: 0, luyKe: 0 });
const newKhStats = () => ({ c: 0, s: 0, chi: 0, thu: 0, luyKe: 0 });

// Doanh số giảm dần, bằng nhau thì dư nợ giảm dần.
const bySalesThenDebt = (stats) => (a, b) => {
  const sa = stats[a].s || 0;
  const sb = stats[b].s || 0;
  if (sb !== sa) return sb - sa;
  return (stats[b].luyKe || 0) - (stats[a].luyKe || 0);
};

/**
 * @param data      dữ liệu đã chuẩn hóa (DH, DH_CT, CONG_NO)
 * @param staffIds  mã NV hiển thị sẵn trong bảng nhân viên (kể cả khi chưa có số liệu)
 * @param filters   { month: "yyyy-mm" | "", nvs: string[], khs: string[] }
 */
export function computeSalesDashboard(data, staffIds, { month, nvs, khs }) {
  const matchesFilters = (row, customerField) => {
    if (month && toYearMonth(row.ngay) !== month) return false;
    if (nvs.length > 0 && !nvs.includes(row.id_nv)) return false;
    if (khs.length > 0 && !khs.includes(row[customerField])) return false;
    return true;
  };

  const orders = data.DH.filter((d) => {
    if (d.nhap_xuat && d.nhap_xuat.toLowerCase() !== "xuat") return false;
    return matchesFilters(d, "npp");
  });

  const totalSales = orders.reduce((s, d) => s + Number(d.thanh_tien || 0), 0);

  // Doanh số theo loại SP (chính/thường/...) từ DH_CT; bỏ qua dòng chưa phân loại.
  const typeTotals = {};
  data.DH_CT.filter((item) => matchesFilters(item, "npp")).forEach((item) => {
    const type = String(item.sp_chinh_thuong || "").trim().toUpperCase();
    if (!type) return;
    typeTotals[type] = (typeTotals[type] || 0) + Number(item.thanh_tien || 0);
  });

  const nvStats = {};
  const khStats = {};
  staffIds.forEach((id) => { nvStats[id] = newNvStats(); });

  // Tháng tính tỉ lệ thu: tháng đang lọc, không lọc thì tháng hiện tại.
  const effectiveMonth = month || currentYearMonth();
  const lastMonth = prevMonth(effectiveMonth);
  const salesByMonth = {};
  orders.forEach((d) => {
    const m = toMonthLabel(d.ngay);
    if (!salesByMonth[m]) salesByMonth[m] = { c: 0, s: 0 };
    salesByMonth[m].c++;
    salesByMonth[m].s += Number(d.thanh_tien || 0);

    const n = d.id_nv || "N/A";
    if (!nvStats[n]) nvStats[n] = newNvStats();
    nvStats[n].c++;
    nvStats[n].s += Number(d.thanh_tien || 0);

    const k = d.npp || "N/A";
    if (!khStats[k]) khStats[k] = newKhStats();
    khStats[k].c++;
    khStats[k].s += Number(d.thanh_tien || 0);
  });

  const monthLabel = month ? month.split("-").reverse().join("/") : null;
  const debtByMonth = {};
  data.CONG_NO.forEach((c) => {
    if (khs.length > 0) {
      let matched = khs.includes(c.id_khach_hang);
      if (!matched && c.id_dh) {
        const order = data.DH.find((dh) => dh.id === c.id_dh);
        if (order && khs.includes(order.npp)) matched = true;
      }
      if (!matched) return;
    }
    if (nvs.length > 0 && !nvs.includes(c.id_nv)) return;

    const m = toMonthLabel(c.ngay);
    if (!debtByMonth[m]) debtByMonth[m] = { chi: 0, thu: 0 };
    const soTien = Number(c.so_tien || 0);
    const isChi = c.thu_chi === "chi";
    const isThu = c.thu_chi === "thu";
    if (isChi) debtByMonth[m].chi += soTien;
    if (isThu) debtByMonth[m].thu += soTien;

    const kId = c.id_khach_hang || "N/A";
    const nId = c.id_nv || "N/A";
    if (!khStats[kId]) khStats[kId] = newKhStats();
    if (!nvStats[nId]) nvStats[nId] = newNvStats();

    const cym = toYearMonth(c.ngay);
    if (lastMonth && cym === lastMonth && isChi) nvStats[nId].chiLM += soTien;
    if (cym === effectiveMonth && isChi) nvStats[nId].chiCM += soTien;
    if (cym === effectiveMonth && isThu) nvStats[nId].thuCM += soTien;

    // Dư nợ cộng dồn tới hết tháng lọc; nợ phát sinh/đã thu chỉ tính trong tháng lọc.
    let upToMonth = true;
    let inMonth = true;
    if (monthLabel) {
      if (sortKey(m) > sortKey(monthLabel)) { upToMonth = false; inMonth = false; }
      else if (sortKey(m) < sortKey(monthLabel)) inMonth = false;
    }
    if (upToMonth) {
      const delta = (isChi ? soTien : 0) - (isThu ? soTien : 0);
      khStats[kId].luyKe += delta;
      nvStats[nId].luyKe += delta;
      if (inMonth) {
        if (isChi) { khStats[kId].chi += soTien; nvStats[nId].chi += soTien; }
        if (isThu) { khStats[kId].thu += soTien; nvStats[nId].thu += soTien; }
      }
    }
  });

  const allMonths = [...new Set([...Object.keys(salesByMonth), ...Object.keys(debtByMonth)])]
    .filter((m) => m !== "N/A")
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  let runningDebt = 0;
  const monthStats = {};
  allMonths.forEach((m) => {
    const s = salesByMonth[m] ? salesByMonth[m].s : 0;
    const c = salesByMonth[m] ? salesByMonth[m].c : 0;
    const chi = debtByMonth[m] ? debtByMonth[m].chi : 0;
    const thu = debtByMonth[m] ? debtByMonth[m].thu : 0;
    const rong = chi - thu;
    runningDebt += rong;
    monthStats[m] = { s, c, chi, thu, rong, luyKe: runningDebt };
  });

  const displayMonths = monthLabel ? allMonths.filter((m) => m === monthLabel) : allMonths;
  const totalIncurred = displayMonths.reduce((sum, m) => sum + monthStats[m].chi, 0);
  const totalCollected = displayMonths.reduce((sum, m) => sum + monthStats[m].thu, 0);
  const monthsDesc = displayMonths.slice().sort((a, b) => sortKey(b).localeCompare(sortKey(a)));

  const nvKeys = Object.keys(nvStats).sort(bySalesThenDebt(nvStats))
    .filter((k) => k !== "N/A" || nvStats[k].s > 0 || nvStats[k].chi > 0 || nvStats[k].thu > 0);
  const khKeys = Object.keys(khStats).sort(bySalesThenDebt(khStats))
    .filter((k) => k !== "N/A" || khStats[k].s > 0 || khStats[k].luyKe !== 0);

  // Doanh số theo NCC và theo sản phẩm: chỉ các dòng thuộc đơn đã lọc.
  const validOrderIds = new Set(orders.map((d) => d.id));
  const nccTotals = {};
  data.DH_CT.forEach((detail) => {
    if (!validOrderIds.has(detail.id_dh)) return;
    const name = detail.ncc || "N/A";
    nccTotals[name] = (nccTotals[name] || 0) + Number(detail.thanh_tien || 0);
  });
  const nccRows = Object.keys(nccTotals).sort((a, b) => nccTotals[b] - nccTotals[a]).map((name) => ({ name, s: nccTotals[name] }));

  const productStats = {};
  data.DH_CT.forEach((detail) => {
    if (detail.id_dh && !validOrderIds.has(detail.id_dh)) return;
    if (!detail.id_dh && !matchesFilters(detail, "npp")) return;
    const spId = String(detail.id_sp || "").trim();
    if (!spId) return;
    if (!productStats[spId]) productStats[spId] = { id: spId, slg: 0, thanh_tien: 0 };
    const slg = Number(detail.slg || 0);
    productStats[spId].slg += slg;
    productStats[spId].thanh_tien += Number(detail.thanh_tien || (Number(detail.don_gia || 0) * slg));
  });
  const productRows = Object.values(productStats).sort((a, b) => (b.thanh_tien - a.thanh_tien) || (b.slg - a.slg));

  return {
    totalSales,
    orderCount: orders.length,
    typeTotals: Object.entries(typeTotals),
    totalIncurred,
    totalCollected,
    monthRows: monthsDesc.map((m) => ({ month: m, ...monthStats[m] })),
    nvRows: nvKeys.map((id) => ({ id, ...nvStats[id] })),
    khRows: khKeys.map((id) => ({ id, ...khStats[id] })),
    nccRows,
    productRows
  };
}
