// Dữ liệu giả lập cho `npm run dev:mock`. Tài khoản thử:
//   admin / admin123  (quyền admin)
//   NV01  / 123456    (nhân viên)
//   NV02  / 123456    (nhân viên)
import { SHEETS, AUTH_SHEET } from "../shared/schema.js";

const DSNV_HEADER = ["id", "ho_ten", "hinh_anh", "gioi_tinh", "ngay_sinh", "quyen", "mk", "email", "dien_thoai", "chuc_vu", "phong_ban", "trang_thai", "ngay_vao_lam", "chi_nhanh_lam_viec", "file_ho_so"];

const row = (headers, item) => headers.map((h) => item[h] ?? "");
const table = (name, items) => [SHEETS[name], ...items.map((item) => row(SHEETS[name], item))];

export const seed = {
  [AUTH_SHEET]: [
    DSNV_HEADER,
    ["admin", "Quản Trị Viên", "", "", "", "admin", "admin123", "admin@example.com", "", "Quản lý", "Kinh doanh", "Đang làm", "", "HN", ""],
    ["NV01", "Nguyễn Văn An", "", "Nam", "", "user", "123456", "", "", "Sales", "Kinh doanh", "Đang làm", "", "HN", ""],
    ["NV02", "Trần Thị Bình", "", "Nữ", "", "user", "123456", "", "", "Sales", "Kinh doanh", "Đang làm", "", "HCM", ""]
  ],
  KHACH_HANG: table("KHACH_HANG", [
    { id: "KH01", ten_kh: "Cửa hàng Minh Phát", dien_thoai: "0901000001", dia_chi: "Hà Nội", nv_quan_ly: "NV01", kenh: "Đại lý", tt: "Hoạt động" },
    { id: "KH02", ten_kh: "Công ty An Khang", dien_thoai: "0901000002", dia_chi: "Hà Nội", nv_quan_ly: "NV01", kenh: "Dự án", tt: "Hoạt động" },
    { id: "KH03", ten_kh: "Siêu thị Hòa Bình", dien_thoai: "0901000003", dia_chi: "TP.HCM", nv_quan_ly: "NV02", kenh: "Đại lý", tt: "Hoạt động" }
  ]),
  DS_SP: table("DS_SP", [
    { id: "SP01", ten_sp: "Khóa vân tay LK-100", model: "LK-100", ncc: "Lock&King", gia_ban: 3500000, sp_chinh_thuong: "chinh" },
    { id: "SP02", ten_sp: "Khóa thẻ từ LK-200", model: "LK-200", ncc: "Lock&King", gia_ban: 2200000, sp_chinh_thuong: "thuong" },
    { id: "SP03", ten_sp: "Chuông cửa R1", model: "R1-01", ncc: "Đối tác", gia_ban: 900000, sp_chinh_thuong: "r1" }
  ]),
  DH_CT: table("DH_CT", [
    { id: "CT01", id_dh: "DH01", ngay: "2026-09-05", npp: "KH01", id_nv: "NV01", id_sp: "SP01", don_gia: 3500000, slg: 4, thanh_tien: 14000000, ncc: "Lock&King", sp_chinh_thuong: "chinh" },
    { id: "CT02", id_dh: "DH01", ngay: "2026-09-05", npp: "KH01", id_nv: "NV01", id_sp: "SP02", don_gia: 2200000, slg: 5, thanh_tien: 11000000, ncc: "Lock&King", sp_chinh_thuong: "thuong" },
    { id: "CT03", id_dh: "DH02", ngay: "2026-10-02", npp: "KH02", id_nv: "NV01", id_sp: "SP03", don_gia: 900000, slg: 10, thanh_tien: 9000000, ncc: "Đối tác", sp_chinh_thuong: "r1" },
    { id: "CT04", id_dh: "DH03", ngay: "2026-10-08", npp: "KH03", id_nv: "NV02", id_sp: "SP01", don_gia: 3500000, slg: 6, thanh_tien: 21000000, ncc: "Lock&King", sp_chinh_thuong: "chinh" }
  ]),
  KPI: table("KPI", []),
  CONG_NO: table("CONG_NO", [
    { id: "CN01", ngay: "2026-09-06", id_khach_hang: "KH01", id_dh: "DH01", thu_chi: "chi", so_tien: 25000000, id_nv: "NV01" },
    { id: "CN02", ngay: "2026-09-20", id_khach_hang: "KH01", id_dh: "DH01", thu_chi: "thu", so_tien: 15000000, id_nv: "NV01" },
    { id: "CN03", ngay: "2026-10-09", id_khach_hang: "KH03", id_dh: "DH03", thu_chi: "chi", so_tien: 21000000, id_nv: "NV02" }
  ]),
  DK_THUONG: table("DK_THUONG", [
    { id: "DK01", thang: "", id_nv: "", loai: "chinh", muc_tu: 0, muc_den: 50000000, gia_tri: 2, kieu: "phan_tram", ghi_chu: "Thưởng DS chính" }
  ])
};
