import { useCallback, useEffect, useState } from "react";
import { api } from "./api.js";
import LoginScreen from "./components/LoginScreen.jsx";
import MainApp from "./components/MainApp.jsx";
import { readSessionHint, saveSessionHint, clearSessionHint } from "./store/sessionHint.js";

function Splash() {
  return (
    <div className="app-splash">
      <img src="https://locknking.com/wp-content/uploads/2025/06/logo-lockking.png" alt="Lock&King" />
      <div className="spinner"></div>
    </div>
  );
}

export default function App() {
  // session: undefined = đang kiểm tra, null = chưa đăng nhập, { user, staff } = đã đăng nhập.
  // Đã đăng nhập từ trước thì hiện ngay ứng dụng, server xác nhận lại ở nền.
  const [session, setSession] = useState(() => readSessionHint() || undefined);

  const signIn = useCallback((next) => {
    saveSessionHint(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    clearSessionHint();
    setSession(null);
  }, []);

  useEffect(() => {
    api.get("/api/me").then(signIn).catch((error) => {
      // 401 = phiên hết hạn → về đăng nhập. Lỗi mạng mà đã có phiên cũ thì vẫn cho xem dữ liệu cache.
      if (error.status === 401 || !readSessionHint()) signOut();
    });
  }, [signIn, signOut]);

  useEffect(() => {
    window.addEventListener("auth:expired", signOut);
    return () => window.removeEventListener("auth:expired", signOut);
  }, [signOut]);

  const handleLogout = useCallback(async () => {
    try { await api.post("/api/logout"); } catch { }
    signOut();
  }, [signOut]);

  if (session === undefined) return <Splash />;
  if (!session) return <LoginScreen onLogin={signIn} />;
  return <MainApp key={session.user.id} user={session.user} staff={session.staff} onLogout={handleLogout} />;
}
