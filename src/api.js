// Gọi API cùng domain. Cookie đăng nhập (HttpOnly) được trình duyệt tự gửi kèm.
async function request(method, url, body) {
  const response = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || `Lỗi máy chủ (${response.status})`);
    error.status = response.status;
    if (response.status === 401 && url !== "/api/login") window.dispatchEvent(new Event("auth:expired"));
    throw error;
  }
  return data;
}

export const api = {
  get: (url) => request("GET", url),
  post: (url, body = {}) => request("POST", url, body)
};
