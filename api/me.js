import { route } from "./_lib/http.js";
import { requireUser, publicUser, staffList } from "./_lib/auth.js";

export default route("GET", async (req, res) => {
  const { user, users } = await requireUser(req);
  res.status(200).json({ user: publicUser(user), staff: staffList(users) });
});
