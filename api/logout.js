import { route } from "./_lib/http.js";
import { clearSessionCookie } from "./_lib/auth.js";

export default route("POST", async (req, res) => {
  res.setHeader("Set-Cookie", clearSessionCookie());
  res.status(200).json({ ok: true });
});
