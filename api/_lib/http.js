export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Lỗi cấu hình (thiếu/sai biến môi trường) hoặc lỗi từ Google: báo rõ nguyên nhân
// thay vì "Lỗi máy chủ" chung chung, để biết cần sửa gì trên Vercel.
export class ConfigError extends HttpError {
  constructor(message) {
    super(500, message);
  }
}

// Bọc handler: kiểm tra method, chặn cache và trả lỗi dạng JSON thống nhất.
export function route(method, handler) {
  return async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    try {
      if (req.method !== method) throw new HttpError(405, "Method không được hỗ trợ.");
      if (method !== "GET" && !String(req.headers["content-type"] || "").includes("application/json")) {
        throw new HttpError(415, "Yêu cầu phải gửi dạng JSON.");
      }
      await handler(req, res);
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      if (status === 500) console.error(error);
      const known = error instanceof HttpError;
      res.status(status).json({ error: known ? error.message : "Lỗi máy chủ, vui lòng thử lại." });
    }
  };
}

export function getBody(req) {
  const body = req.body;
  if (body && typeof body === "object") return body;
  if (typeof body === "string" && body) {
    try { return JSON.parse(body); } catch { throw new HttpError(400, "Dữ liệu gửi lên không hợp lệ."); }
  }
  return {};
}

export function requiredEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) throw new ConfigError(`Chưa cấu hình biến môi trường ${name} trên Vercel (hoặc chưa Redeploy sau khi thêm).`);
  return value.trim();
}
