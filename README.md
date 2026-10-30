# Kế hoạch sản xuất & nhu cầu nhân lực – Assembly

```
kehoachsanxuatvanhucaunhanluc/
├── public/index.html           ← dashboard (đã kèm đầy đủ dữ liệu: 21 ngày, từ 01/10 đến 29/10/2026)
├── netlify/functions/db.mjs    ← "cơ sở dữ liệu chung" (Netlify Function + Netlify Blobs)
├── netlify.toml                ← cấu hình Netlify
└── package.json                ← khai báo thư viện @netlify/blobs
```

## Cách hoạt động
- Mở trang → trang tự gọi `/.netlify/functions/db` để tải dữ liệu chung.
- **Lần đầu** (kho dữ liệu còn trống) trang sẽ tự đưa dữ liệu có sẵn trong `index.html` lên kho.
- Ai sửa số liệu → khoảng 1 giây sau tự lưu lên kho; các máy khác tự cập nhật sau tối đa 10 giây.
- Huy hiệu "☁ Đã đồng bộ …" ở đầu trang cho biết trạng thái.
- Mở file `index.html` trực tiếp trên máy (không qua web) thì đồng bộ tắt, vẫn dùng như file đơn bình thường.

## Đưa lên GitHub + Netlify (khuyên dùng – chắc chắn cài được thư viện)
1. Tạo repo GitHub, upload toàn bộ nội dung thư mục này (giữ nguyên cấu trúc thư mục).
2. Netlify → **Add new site → Import an existing project** → chọn repo.
3. Netlify tự đọc `netlify.toml` (Publish directory `public`, Functions `netlify/functions`) → **Deploy**.
4. Mở địa chỉ `https://tên-site.netlify.app` và bấm vào huy hiệu ☁ lần đầu để nhập tên của chị (ghi vào lịch sử sửa).

## Hoặc kéo thả (nếu dùng Netlify CLI)
```
npm install
npx netlify deploy --prod
```

## Lưu ý
- Ai có đường link đều xem và sửa được dữ liệu. Nếu cần hạn chế, bật *Site settings → Access control → Password protection* của Netlify.
- Muốn cập nhật dữ liệu gốc: bấm **"Tải HTML mới nhất"** trong trang, đổi tên file thành `index.html` và thay vào `public/`. (Dữ liệu trên kho chung vẫn được ưu tiên.)
- Dữ liệu trên kho chỉ nhận các khoá `day:YYYY-MM-DD`, `hcTO`, `writer`.
- Nút "Tự động lưu HTML" chỉ hợp khi dùng file trên máy (Chrome/Edge).
