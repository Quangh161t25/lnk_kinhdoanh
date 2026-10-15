import { useEffect, useState } from "react";
import { api } from "../api.js";

const FEATURES = [
  { text: "Dashboard doanh số, công nợ theo thời gian thực", icon: <path d="M4 19V5M4 19h16M8 15V9M12 15V6M16 15v-3" /> },
  { text: "Tính thưởng nhân viên tự động theo điều kiện", icon: <><path d="M20 12v10H4V12" /><path d="M22 7H2v5h20V7zM12 22V7" /></> },
  { text: "Dữ liệu đồng bộ an toàn với Google Sheets", icon: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></> }
];

export default function LoginScreen({ checking, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { document.title = "Đăng nhập · Lock&King"; }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!username.trim() || !password.trim()) return setError("Vui lòng nhập tài khoản và mật khẩu.");
    setSubmitting(true);
    setError("");
    try {
      onLogin(await api.post("/api/login", { username: username.trim(), password }));
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="login-screen">
      <aside className="login-hero">
        <div className="login-hero-logo">
          <img src="https://locknking.com/wp-content/uploads/2025/06/logo-lockking.png" alt="Lock&King" />
        </div>
        <div>
          <h2>Quản lý kinh doanh gọn gàng, rõ ràng.</h2>
          <p>Khách hàng, đơn hàng, công nợ và thưởng nhân viên của Lock&amp;King trong một nơi duy nhất.</p>
          <ul className="login-features">
            {FEATURES.map((item) => (
              <li key={item.text}><svg viewBox="0 0 24 24">{item.icon}</svg>{item.text}</li>
            ))}
          </ul>
        </div>
        <div className="login-hero-foot">© {new Date().getFullYear()} Lock&amp;King · ERP Sales</div>
      </aside>

      <main className="login-panel">
        <div className="login-card">
          <div className="login-brand">
            <div className="login-brand-badge">LK</div>
            <div>
              <h1>Đăng nhập</h1>
              <p>Chào mừng trở lại, vui lòng đăng nhập để tiếp tục.</p>
            </div>
          </div>
          {checking ? (
            <div className="loading-box">
              <div className="spinner"></div>
              <div>Đang kiểm tra phiên đăng nhập…</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="usernameInput">Tài khoản</label>
                <div className="input-icon">
                  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <input id="usernameInput" type="text" placeholder="Nhập ID nhân viên" autoComplete="username" autoFocus
                    value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="passwordInput">Mật khẩu</label>
                <div className="input-icon">
                  <svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  <input id="passwordInput" type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" autoComplete="current-password"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" className="input-action" onClick={() => setShowPassword((v) => !v)}
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                    {showPassword
                      ? <svg viewBox="0 0 24 24"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10 10 0 0 1 12 5c5 0 9 4.5 10 7a12.6 12.6 0 0 1-3 4.2M6.6 6.6C4.3 8 2.7 10.2 2 12c1 2.5 5 7 10 7a9.8 9.8 0 0 0 4.4-1" /></svg>
                      : <svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>}
                  </button>
                </div>
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
                {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
              </button>
              {error && <div className="login-error" role="alert">{error}</div>}
              <p className="login-note">Quên mật khẩu? Liên hệ quản trị viên để được cấp lại.</p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
