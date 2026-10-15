import { useCallback, useEffect, useState } from "react";
import { api } from "./api.js";
import LoginScreen from "./components/LoginScreen.jsx";
import MainApp from "./components/MainApp.jsx";

export default function App() {
  // session: undefined = đang kiểm tra, null = chưa đăng nhập, { user, staff } = đã đăng nhập
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    api.get("/api/me").then(setSession).catch(() => setSession(null));
  }, []);

  useEffect(() => {
    const onExpired = () => setSession(null);
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const handleLogout = useCallback(async () => {
    try { await api.post("/api/logout"); } catch { }
    setSession(null);
  }, []);

  if (!session) return <LoginScreen checking={session === undefined} onLogin={setSession} />;
  return <MainApp user={session.user} staff={session.staff} onLogout={handleLogout} />;
}
