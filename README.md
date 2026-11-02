# Daily HC – Assembly (Cloudflare Pages + D1)

Dashboard kế hoạch sản xuất & nhu cầu nhân lực, dữ liệu dùng chung nhiều máy, có đăng nhập phân quyền, sao lưu/khôi phục.

## Cấu trúc
- `public/index.html` – giao diện (giữ nguyên UI, tính kế hoạch/nhân lực, UPH nằm trong dữ liệu từng ngày nên được lưu & đồng bộ)
- `functions/api/db.js` – API đọc/ghi D1 (all, since, backup, set, restore)
- `functions/api/login.js`, `functions/_lib/auth.js` – đăng nhập + phân quyền
- `schema.sql` – bảng `kv` (dữ liệu) và `hist` (20 phiên bản gần nhất mỗi khoá)

## Triển khai
1. `npm install`
2. `npx wrangler login`
3. `npx wrangler d1 create dailyhc` → chép `database_id` vào `wrangler.toml`
4. `npm run db:init` (tạo bảng trên D1)
5. Tạo Pages project: `npx wrangler pages project create dailyhc --production-branch main`
6. Đặt mật khẩu (Dashboard → Pages → Settings → Variables & Secrets, hoặc `npx wrangler pages secret put NAME`):
   `ADMIN_PASSWORD`, `EDITOR_PASSWORD`, `VIEWER_PASSWORD`, `SESSION_SECRET` (chuỗi ngẫu nhiên dài)
   *Nếu không đặt mật khẩu nào → chế độ mở, ai cũng toàn quyền.*
7. Pages → Settings → Bindings: D1 database, tên biến **`DB`** → `dailyhc`
8. `npm run deploy` → mở URL `*.pages.dev` để test.

## Phân quyền
- viewer: chỉ xem (nút sửa/upload bị ẩn)
- editor: sửa, upload Excel, nhập UPH
- admin: như editor + sao lưu (`/api/db?action=backup`) và khôi phục (`action=restore`)
Bấm huy hiệu ☁ góc trên để đăng nhập lại.

## Test trước khi chính thức
Mở bằng 2 thiết bị/trình duyệt: upload Excel, nhập UPH, sửa số → máy kia tự cập nhật sau ≤10 giây. Khi ổn thì gắn domain chính.
