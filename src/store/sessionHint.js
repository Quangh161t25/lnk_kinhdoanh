// Ghi nhớ "lần trước đã đăng nhập" để khi tải lại trang hiện ngay ứng dụng (dùng dữ liệu cache)
// thay vì nháy màn hình đăng nhập trong lúc chờ server xác nhận cookie.
// Chỉ là gợi ý cho giao diện: quyền thật vẫn do server kiểm tra ở mọi API.
const KEY = "lk_session_hint";

export function readSessionHint() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return value?.user?.id ? value : null;
  } catch {
    return null;
  }
}

export function saveSessionHint(session) {
  try { localStorage.setItem(KEY, JSON.stringify({ user: session.user, staff: session.staff })); } catch { }
}

export function clearSessionHint() {
  try { localStorage.removeItem(KEY); } catch { }
}
