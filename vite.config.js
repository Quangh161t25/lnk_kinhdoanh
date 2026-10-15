import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Khi chạy `npm run dev`, plugin này phục vụ các file trong /api giống như
// Vercel Functions, để không cần cài Vercel CLI khi phát triển ở máy.
function localApi() {
  return {
    name: "local-vercel-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, "http://localhost");
        if (!url.pathname.startsWith("/api/")) return next();
        const name = url.pathname.slice("/api/".length).replace(/\/$/, "");
        if (!/^[a-z-]+$/.test(name)) {
          res.statusCode = 404;
          return res.end();
        }

        let mod;
        try {
          mod = await server.ssrLoadModule(`/api/${name}.js`);
        } catch {
          res.statusCode = 404;
          return res.end();
        }

        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString("utf8");
        try {
          req.body = raw && (req.headers["content-type"] || "").includes("application/json") ? JSON.parse(raw) : raw;
        } catch {
          res.statusCode = 400;
          return res.end("Invalid JSON");
        }
        req.query = Object.fromEntries(url.searchParams);
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(data));
          return res;
        };

        try {
          await mod.default(req, res);
        } catch (error) {
          console.error(error);
          if (!res.headersSent) res.status(500).json({ error: "Lỗi máy chủ." });
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  // Nạp biến môi trường phía server (không có tiền tố VITE_) cho các API ở máy.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    plugins: [react(), localApi()],
    // Cấu hình PostCSS rỗng để Vite không đọc nhầm postcss.config.js ở thư mục cha.
    css: { postcss: {} }
  };
});
