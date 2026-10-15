// Cấu trúc các sheet nghiệp vụ, dùng chung cho frontend và API.
// Đây chỉ là tên cột, không phải thông tin bí mật.
export const SHEETS = {
  KHACH_HANG: ["id", "ten_kh", "dien_thoai", "email", "dia_chi", "ngay_cap_nhat", "nv_quan_ly", "kenh", "tt"],
  DS_SP: ["id", "ten_sp", "model", "ncc", "gia_ban", "sp_chinh_thuong"],
  DH_CT: ["id", "id_dh", "ngay", "npp", "id_nv", "id_sp", "don_gia", "slg", "thanh_tien", "ncc", "sp_chinh_thuong"],
  KPI: ["id", "thang", "id_nv", "ds_chinh", "ds_thuong", "tien_thuong_ds_chinh", "tien_thuong_ds_thuong", "tien_thuong_ds", "ti_le_thu_con_no", "tong_tien_thuong", "tong_tien_thuong_thuc"],
  CONG_NO: ["id", "ngay", "id_khach_hang", "id_dh", "thu_chi", "so_tien", "cong_no", "id_nv"],
  DK_THUONG: ["id", "thang", "id_nv", "loai", "muc_tu", "muc_den", "gia_tri", "kieu", "ghi_chu"]
};

// Sheet tài khoản. Chỉ API được đọc/ghi, không bao giờ gửi nguyên sheet này ra trình duyệt.
export const AUTH_SHEET = "DSNV";

// Các sheet mà nhân viên chỉ được thấy dòng có id_nv của chính mình.
export const STAFF_SCOPED_SHEETS = ["DH_CT", "CONG_NO", "KPI"];
