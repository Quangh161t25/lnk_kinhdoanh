import { useEffect, useState } from "react";

// Thông báo nhỏ góc màn hình. Gọi showToast() từ bất cứ đâu; <Toast /> chỉ cần đặt một lần.
let setToast = null;
let hideTimer = null;

function show(message, background, duration) {
  clearTimeout(hideTimer);
  setToast?.({ message, background, visible: true });
  if (duration) hideTimer = setTimeout(hideToast, duration);
}

export function showToast(message, isError = false) {
  show(message, isError ? "#7f1d1d" : "#173d36", 2600);
}

// Thông báo "đang xử lý", giữ nguyên cho tới khi gọi hideToast().
export function showBusyToast(message) {
  show(message, "#ca8a04", 0);
}

export function hideToast() {
  clearTimeout(hideTimer);
  setToast?.((toast) => ({ ...toast, visible: false }));
}

export default function Toast() {
  const [toast, setState] = useState({ message: "", background: undefined, visible: false });

  useEffect(() => {
    setToast = setState;
    return () => { if (setToast === setState) setToast = null; };
  }, []);

  return <div className={`toast${toast.visible ? " show" : ""}`} style={{ background: toast.background }}>{toast.message}</div>;
}
