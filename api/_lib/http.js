export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
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
      res.status(status).json({ error: status === 500 ? "Lỗi máy chủ, vui lòng thử lại." : error.message });
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
  if (!value) throw new Error(`Thiếu biến môi trường ${name}`);
  return value;
}
