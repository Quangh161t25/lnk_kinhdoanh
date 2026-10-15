# Lock&King ERP Sales

Ứng dụng quản lý kinh doanh (khách hàng, sản phẩm, đơn hàng, công nợ, thưởng, tỉ trọng) dùng Google Sheets làm cơ sở dữ liệu.

- **Frontend:** React + Vite (`src/`)
- **Backend:** Vercel Functions (`api/`): giữ private key, Spreadsheet ID; xử lý đăng nhập, phân quyền
- Trình duyệt **không** còn giữ thông tin bí mật nào và không gọi trực tiếp Google Sheets.

```
Trình duyệt (React)  ──/api/*──▶  Vercel Functions  ──▶  Google Sheets
                     cookie HttpOnly    (biến môi trường)
```

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `api/` | Các endpoint: `login`, `logout`, `me`, `data`, `sheets`, `change-password` |
| `api/_lib/` | Kết nối Google Sheets, xác thực, lọc dữ liệu theo quyền |
| `shared/schema.js` | Tên cột các sheet (dùng chung frontend/backend) |
| `src/components/` | Khung giao diện React: đăng nhập, sidebar, topbar, đổi mật khẩu, drawer, toast, ô chọn dùng chung |
| `src/tabs/` | Mỗi tab nghiệp vụ là một component (Trang chủ, Dashboard, Đơn hàng, Sản phẩm, Khách hàng, Công nợ, Thưởng, Tỉ trọng) |
| `src/store/` | Kho dữ liệu dùng chung (`DataContext`), chuẩn hóa dữ liệu, ghi sheet, cache trình duyệt |
| `src/lib/` | Hàm định dạng và các phép tính (dashboard, thưởng), đọc Excel |
| `dev/mock-data.js` | Dữ liệu giả lập để chạy thử |

## Chạy ở máy

```bash
npm install
```

**Chạy thử với dữ liệu giả lập** (không cần Google): tài khoản `admin / admin123`, `NV01 / 123456`, `NV02 / 123456`.

```bash
npm run dev:mock
```

**Chạy với Google Sheets thật:** sao chép `.env.example` thành `.env.local`, điền giá trị, rồi:

```bash
npm run dev
```

## Deploy lên Vercel

1. Đẩy code lên GitHub, vào https://vercel.com/new và import repo này (Framework: Vite, Vercel tự nhận).
2. Vào **Settings → Environment Variables**, thêm 4 biến (xem `.env.example`):
   - `SPREADSHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`: dán nguyên chuỗi `-----BEGIN PRIVATE KEY-----\n...` (giữ các `\n`)
   - `SESSION_SECRET`: chuỗi ngẫu nhiên ≥ 32 ký tự
3. Deploy (hoặc Redeploy nếu đã deploy trước khi thêm biến).
4. Spreadsheet phải được chia sẻ quyền **Editor** cho email service account.

## Bảo mật

- Private key và Spreadsheet ID chỉ nằm trong biến môi trường của Vercel.
- Đăng nhập kiểm tra ở server; phiên lưu bằng cookie `HttpOnly` có chữ ký HMAC, hạn 7 ngày.
- Mật khẩu được mã hóa bcrypt: mật khẩu cũ dạng chữ thường trong cột `mk` của `DSNV` sẽ tự chuyển sang dạng mã hóa ở lần đăng nhập đúng đầu tiên. Admin vẫn có thể gõ mật khẩu mới dạng chữ thường vào sheet để cấp lại mật khẩu; nó sẽ được mã hóa ở lần đăng nhập sau.
- Đổi mật khẩu làm mọi phiên đăng nhập cũ của tài khoản đó hết hiệu lực.
- Nhân viên chỉ nhận được dữ liệu của chính mình (lọc ở server). Chỉ admin được ghi dữ liệu; sheet `DSNV` không thể ghi qua API dữ liệu.
