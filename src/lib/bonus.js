// Tính thưởng nhân viên theo tháng (chuyển nguyên cách tính từ bản cũ).
import { currentYearMonth, normalizeBonusKey, normalizeMonthKey, normalizeProductType, parseLooseNumber, toYearMonth } from "./format.js";

// Quản lý nhận 0,2% doanh số SP thường của nhóm nhân viên bên dưới.
const SPECIAL_NV = "Lê Quang Tuyến";
const SPECIAL_TEAM = ["ngô tuấn anh", "trần doãn sáng", "kiều trung đức", "vũ công tâm", "đoàn văn quang"];

// Nguyễn Thị Nguyệt nhận 0,05% tổng doanh số SP chính + SP thường của mọi mã NV
// trong DH_CT (kể cả Công ty Vũ Gia), trừ Lê Quang Tuyến.
const NGUYET_NV = "Nguyễn Thị Nguyệt";
const NGUYET_RATE = 0.0005;

const lower = (value) => String(value || "").normalize("NFC").trim().toLowerCase();
const MANAGERS = [lower(SPECIAL_NV), lower(NGUYET_NV)];

// Tháng "yyyy-mm" của một ngày (chấp nhận cả tháng chưa có số 0 đứng trước).
const monthOf = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.includes("-")) {
    const p = dateStr.split("-");
    return p.length >= 2 ? `${p[0]}-${p[1].padStart(2, "0")}` : "";
  }
  if (dateStr.includes("/")) {
    const p = dateStr.split("/");
    return p.length >= 3 ? `${p[2]}-${p[1].padStart(2, "0")}` : "";
  }
  return "";
};

// Tra điều kiện thưởng trong DK_THUONG. Rule khớp khi muc_tu <= doanh số < muc_den
// ("từ ... đến dưới ..."; muc_den trống = không giới hạn). Các rule khớp được cộng dồn;
// với mỗi kiểu, nếu có rule riêng cho nhân viên thì bỏ rule chung cùng kiểu.
// Kiểu: "phan_tram" (% trên toàn bộ doanh số), "phan_tram_vuot" (% phần vượt moc_vuot,
// moc_vuot trống thì dùng muc_tu), "khong", còn lại (ví dụ "co_dinh") = số tiền cố định gia_tri.
export function lookupBonus(rules, loai, amount, nvId, thang) {
  const targetLoai = normalizeBonusKey(loai);
  const targetThang = normalizeMonthKey(thang);
  const matched = rules.filter((r) => {
    if (normalizeBonusKey(r.loai) !== targetLoai) return false;
    const rNv = (r.id_nv || "").trim();
    if (rNv && rNv !== nvId) return false;
    const rThang = normalizeMonthKey(r.thang);
    if (rThang && rThang !== targetThang) return false;
    const from = parseLooseNumber(r.muc_tu);
    const to = parseLooseNumber(r.muc_den);
    if (amount < from) return false;
    if (to > 0 && amount >= to) return false;
    return true;
  });
  if (!matched.length) return 0;

  const hasSpecific = (kieu) => matched.some((r) => (r.id_nv || "").trim() === nvId && normalizeBonusKey(r.kieu) === kieu);
  const effective = matched.filter((r) => !((r.id_nv || "").trim() === "" && hasSpecific(normalizeBonusKey(r.kieu))));

  return effective.reduce((sum, rule) => {
    const giaTri = parseLooseNumber(rule.gia_tri);
    const kieu = normalizeBonusKey(rule.kieu);
    const mucTu = parseLooseNumber(rule.muc_tu);
    const mucDen = parseLooseNumber(rule.muc_den);
    if (kieu === "phantram" || kieu === "%" || kieu === "phantramtong") {
      return sum + (mucDen > 0 ? amount : mucTu) * giaTri / 100;
    }
    if (kieu === "phantramvuot") {
      const mocVuot = String(rule.moc_vuot ?? "").trim() ? parseLooseNumber(rule.moc_vuot) : mucTu;
      return sum + Math.max(0, amount - mocVuot) * giaTri / 100;
    }
    if (kieu === "khong") return sum;
    return sum + giaTri;
  }, 0);
}

// Bảng thưởng: mỗi dòng là một (tháng, nhân viên), sắp xếp tháng mới nhất trước.
export function computeBonusRows(data) {
  const key = (thang, nvId) => `${thang}||${nvId}`;

  const sales = {};
  data.DH_CT.forEach((row) => {
    const nvId = (row.id_nv || "").trim();
    const thang = nvId ? monthOf(row.ngay || "") : "";
    if (!nvId || !thang) return;
    const k = key(thang, nvId);
    if (!sales[k]) sales[k] = { thang, nvId, ds_chinh: 0, ds_thuong: 0, ds_r1: 0 };
    const amount = Number(row.thanh_tien || 0);
    const type = normalizeProductType(row.sp_chinh_thuong);
    if (type === "chinh") sales[k].ds_chinh += amount;
    else if (type === "thuong") sales[k].ds_thuong += amount;
    else if (type === "r1") sales[k].ds_r1 += amount;
  });

  const debts = {};
  data.CONG_NO.forEach((row) => {
    const nvId = (row.id_nv || "").trim();
    const thang = nvId ? monthOf(row.ngay || "") : "";
    if (!nvId || !thang) return;
    const k = key(thang, nvId);
    if (!debts[k]) debts[k] = { phat_sinh: 0, da_thu: 0 };
    const amount = Number(row.so_tien || 0);
    if ((row.thu_chi || "") === "chi") debts[k].phat_sinh += amount;
    else if ((row.thu_chi || "") === "thu") debts[k].da_thu += amount;
  });

  const rules = data.DK_THUONG;
  const rows = Object.values(sales).map(({ thang, nvId, ds_chinh, ds_thuong, ds_r1 }) => {
    const thuong_sp_chinh = Math.round(lookupBonus(rules, "sp_chinh", ds_chinh, nvId, thang));
    const thuong_sp_thuong = Math.round(lookupBonus(rules, "sp_thuong", ds_thuong, nvId, thang));
    const thuong_sp_r1 = Math.round((ds_r1 || 0) * 0.005);
    const thuong_doanh_so = thuong_sp_chinh + thuong_sp_thuong + thuong_sp_r1;
    const debt = debts[key(thang, nvId)] || { phat_sinh: 0, da_thu: 0 };
    const ti_le_thu_no = debt.phat_sinh > 0 ? (debt.da_thu / debt.phat_sinh * 100) : 0;
    // Thu nợ < 50%: không thưởng; 50–90%: thưởng theo tỉ lệ; ≥ 90%: thưởng đủ.
    let tong_tien_thuong = thuong_doanh_so;
    if (ti_le_thu_no < 50) tong_tien_thuong = 0;
    else if (ti_le_thu_no < 90) tong_tien_thuong = Math.round(thuong_doanh_so * ti_le_thu_no / 100);
    return { thang, nvId, ds_chinh, ds_thuong, ds_r1, thuong_sp_chinh, thuong_sp_thuong, thuong_sp_r1, thuong_doanh_so, ti_le_thu_no, no_phat_sinh: debt.phat_sinh, no_da_thu: debt.da_thu, tong_tien_thuong };
  });

  const teamRevenue = {};
  Object.values(sales).forEach((entry) => {
    if (SPECIAL_TEAM.includes(lower(entry.nvId))) teamRevenue[entry.thang] = (teamRevenue[entry.thang] || 0) + Number(entry.ds_thuong || 0);
  });
  Object.entries(teamRevenue).forEach(([thang, revenue]) => {
    if (revenue <= 0) return;
    const specialRow = {
      thang, nvId: SPECIAL_NV, ds_chinh: 0, ds_thuong: revenue, ds_r1: 0,
      thuong_sp_chinh: 0, thuong_sp_thuong: 0, thuong_sp_r1: 0, thuong_doanh_so: 0,
      ti_le_thu_no: 0, no_phat_sinh: 0, no_da_thu: 0,
      tong_tien_thuong: Math.round(revenue * 0.002)
    };
    const index = rows.findIndex((row) => row.thang === thang && lower(row.nvId) === lower(SPECIAL_NV));
    if (index >= 0) rows[index] = specialRow;
    else rows.push(specialRow);
  });

  const companyRevenue = {};
  Object.values(sales).forEach((entry) => {
    if (lower(entry.nvId) === lower(SPECIAL_NV)) return;
    companyRevenue[entry.thang] = (companyRevenue[entry.thang] || 0) + Number(entry.ds_chinh || 0) + Number(entry.ds_thuong || 0);
  });
  Object.entries(companyRevenue).forEach(([thang, revenue]) => {
    if (revenue <= 0) return;
    const nguyetRow = {
      thang, nvId: NGUYET_NV, ds_chinh: 0, ds_thuong: revenue, ds_r1: 0,
      thuong_sp_chinh: 0, thuong_sp_thuong: 0, thuong_sp_r1: 0, thuong_doanh_so: 0,
      ti_le_thu_no: 0, no_phat_sinh: 0, no_da_thu: 0,
      tong_tien_thuong: Math.round(revenue * NGUYET_RATE)
    };
    const index = rows.findIndex((row) => row.thang === thang && lower(row.nvId) === lower(NGUYET_NV));
    if (index >= 0) rows[index] = nguyetRow;
    else rows.push(nguyetRow);
  });

  // Ngô Tuấn Anh nhận một nửa; nửa còn lại chuyển cho Vũ Công Tâm cùng tháng.
  rows.forEach((r) => {
    const id = lower(r.nvId);
    if (id === "ngô tuấn anh") {
      r.tong_thuc_nhan = Math.round(r.tong_tien_thuong / 2);
    } else if (id === "vũ công tâm") {
      const nta = rows.find((x) => x.thang === r.thang && lower(x.nvId) === "ngô tuấn anh");
      r.tong_thuc_nhan = r.tong_tien_thuong + (nta ? Math.round(nta.tong_tien_thuong / 2) : 0);
    } else {
      r.tong_thuc_nhan = r.tong_tien_thuong;
    }
  });

  // Tháng mới nhất trước, hai dòng quản lý (Tuyến rồi Nguyệt) xuống cuối tháng, rồi doanh số giảm dần, rồi mã NV.
  rows.sort((a, b) => {
    if (a.thang !== b.thang) return b.thang.localeCompare(a.thang);
    const aRank = MANAGERS.indexOf(lower(a.nvId));
    const bRank = MANAGERS.indexOf(lower(b.nvId));
    if (aRank !== bRank) return aRank - bRank;
    const dsA = (a.ds_chinh || 0) + (a.ds_thuong || 0) + (a.ds_r1 || 0);
    const dsB = (b.ds_chinh || 0) + (b.ds_thuong || 0) + (b.ds_r1 || 0);
    if (dsB !== dsA) return dsB - dsA;
    return a.nvId.localeCompare(b.nvId);
  });
  return rows;
}

// Bảng nhân viên (doanh số, nợ, tỉ lệ thu) theo tháng và mã NV đang lọc.
export function computeStaffDebtRows(data, filterMonth, filterNv) {
  const effectiveMonth = filterMonth || currentYearMonth();
  const prev = (() => {
    const parts = effectiveMonth.split("-");
    if (parts.length < 2) return null;
    let y = Number(parts[0]);
    let m = Number(parts[1]) - 1;
    if (m === 0) { m = 12; y -= 1; }
    return `${y}-${String(m).padStart(2, "0")}`;
  })();

  const stats = {};
  const init = (id) => { if (!stats[id]) stats[id] = { s: 0, chi: 0, thu: 0, chiCM: 0, thuCM: 0, chiLM: 0, luyKe: 0 }; };

  data.DH_CT.forEach((d) => {
    if (filterMonth && toYearMonth(d.ngay) !== effectiveMonth) return;
    const n = String(d.id_nv || "N/A").trim();
    if (filterNv && n !== filterNv) return;
    init(n);
    stats[n].s += Number(d.thanh_tien || 0);
  });

  data.CONG_NO.forEach((c) => {
    const cym = toYearMonth(c.ngay);
    const isChi = c.thu_chi === "chi";
    const isThu = c.thu_chi === "thu";
    const amount = Number(c.so_tien || 0);
    const nId = String(c.id_nv || "N/A").trim();
    if (filterNv && nId !== filterNv) return;
    init(nId);
    if (prev && cym === prev && isChi) stats[nId].chiLM += amount;
    if (cym === effectiveMonth && isChi) stats[nId].chiCM += amount;
    if (cym === effectiveMonth && isThu) stats[nId].thuCM += amount;

    let upToMonth = true;
    let inMonth = true;
    if (filterMonth) {
      if (cym > effectiveMonth) { upToMonth = false; inMonth = false; }
      else if (cym < effectiveMonth) inMonth = false;
    }
    if (upToMonth) {
      stats[nId].luyKe += (isChi ? amount : 0) - (isThu ? amount : 0);
      if (inMonth) {
        if (isChi) stats[nId].chi += amount;
        if (isThu) stats[nId].thu += amount;
      }
    }
  });

  return Object.keys(stats)
    .sort((a, b) => ((stats[b].s || 0) - (stats[a].s || 0)) || ((stats[b].luyKe || 0) - (stats[a].luyKe || 0)))
    .filter((k) => k !== "N/A" || stats[k].s > 0 || stats[k].chi > 0 || stats[k].thu > 0)
    .map((id) => ({ id, ...stats[id] }));
}
