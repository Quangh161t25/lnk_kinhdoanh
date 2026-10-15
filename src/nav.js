export const NAV_ITEMS = [
  { id: "dashboard", label: "Trang chủ", subtitle: "MENU CHÍNH", icon: "home", color: "#2d5bff" },
  { id: "sales_dashboard", label: "Dashboard Kinh doanh", subtitle: "KINH DOANH", icon: "chart", color: "#ff7a1a" },
  { id: "order_details", label: "Đơn hàng Chi tiết", subtitle: "KINH DOANH", icon: "file", color: "#0ea5e9" },
  { id: "products", label: "Danh sách Sản phẩm", subtitle: "KINH DOANH", icon: "box", color: "#8f53ff" },
  { id: "customers", label: "Khách hàng", subtitle: "KINH DOANH", icon: "users", color: "#00b894" },
  { id: "debts", label: "Công nợ", subtitle: "KINH DOANH", icon: "coin", color: "#ff4d6d" },
  { id: "thuong", label: "Thưởng Nhân Viên", subtitle: "KINH DOANH", icon: "gift", color: "#e11d48" },
  { id: "ti_trong", label: "TỈ TRỌNG", subtitle: "KINH DOANH", icon: "chart", color: "#6366f1" }
];

// Mã SVG tĩnh của từng biểu tượng menu.
export const NAV_ICONS = {
  home: `<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5 9.5V21h14V9.5"></path></svg>`,
  chart: `<svg viewBox="0 0 24 24"><path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 15V9"></path><path d="M12 15V6"></path><path d="M16 15v-3"></path></svg>`,
  bag: `<svg viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8Z"></path><path d="M9 9V7a3 3 0 1 1 6 0v2"></path></svg>`,
  file: `<svg viewBox="0 0 24 24"><path d="M8 3h6l4 4v14H8z"></path><path d="M14 3v5h5"></path></svg>`,
  box: `<svg viewBox="0 0 24 24"><path d="m12 3 8 4.5-8 4.5L4 7.5 12 3Z"></path><path d="M4 7.5V16.5L12 21l8-4.5V7.5"></path><path d="M12 12v9"></path></svg>`,
  users: `<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><path d="M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="M21 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  coin: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><path d="M9.5 9.5c.3-1 1.2-1.5 2.5-1.5 1.7 0 2.5.8 2.5 1.9 0 2.7-5 1.3-5 4 0 1.2 1 2.1 2.8 2.1 1.4 0 2.4-.6 2.7-1.7"></path><path d="M12 7v10"></path></svg>`,
  gift: `<svg viewBox="0 0 24 24"><path d="M20 12v10H4V12"></path><path d="M22 7H2v5h20V7z"></path><path d="M12 22V7"></path><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`
};
