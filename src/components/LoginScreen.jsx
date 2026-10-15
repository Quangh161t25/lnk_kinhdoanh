import { useState } from "react";
import { api } from "../api.js";

export default function LoginScreen({ checking, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-badge">LK</div>
          <div>
            <h1>Lock&amp;King</h1>
            <p>.</p>
          </div>
        </div>
        {checking ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <div></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="usernameInput">Tài khoản</label>
              <input id="usernameInput" type="text" placeholder="Nhập ID nhân viên" autoComplete="username"
                value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="passwordInput">Mật khẩu</label>
              <input id="passwordInput" type="password" placeholder="Nhập mật khẩu" autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            {error ? <p className="helper login-error">{error}</p> : <p className="helper" style={{ margin: "12px 0 0" }}>.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
