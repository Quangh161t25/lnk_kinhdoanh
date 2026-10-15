import { useState } from "react";
import { api } from "../api.js";
import { showToast } from "./Toast.jsx";

export default function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const update = (field) => (event) => setForm((value) => ({ ...value, [field]: event.target.value }));

  async function handleSubmit() {
    const { oldPassword, newPassword, confirmPassword } = form;
    if (!oldPassword || !newPassword || !confirmPassword) return showToast("Vui lòng điền đủ thông tin!", true);
    if (newPassword !== confirmPassword) return showToast("Mật khẩu mới không khớp!", true);
    if (newPassword.trim().length < 4) return showToast("Mật khẩu mới phải có ít nhất 4 ký tự!", true);

    setSaving(true);
    try {
      await api.post("/api/change-password", { oldPassword, newPassword });
      showToast("Đổi mật khẩu thành công!");
      onClose();
    } catch (error) {
      showToast(error.message || "Lỗi khi đổi mật khẩu", true);
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop open" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3>Đổi mật khẩu</h3>
            <p>Cập nhật mật khẩu đăng nhập của bạn</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={onClose}>Đóng</button>
        </div>
        <div className="cp-form">
          <div className="field">
            <label htmlFor="oldPassword">Mật khẩu hiện tại</label>
            <input type="password" id="oldPassword" placeholder="Nhập mật khẩu hiện tại" autoComplete="current-password" value={form.oldPassword} onChange={update("oldPassword")} />
          </div>
          <div className="field">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <input type="password" id="newPassword" placeholder="Nhập mật khẩu mới" autoComplete="new-password" value={form.newPassword} onChange={update("newPassword")} />
          </div>
          <div className="field">
            <label htmlFor="confirmPassword">Nhập lại mật khẩu mới</label>
            <input type="password" id="confirmPassword" placeholder="Nhập lại mật khẩu mới" autoComplete="new-password" value={form.confirmPassword} onChange={update("confirmPassword")} />
          </div>
          <div className="cp-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "Đang xử lý..." : "Xác nhận đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
