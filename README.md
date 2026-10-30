# Daily HC – Assembly (Kế hoạch SX · Nhân lực · Hiện trạng nhân lực)

Dashboard một file (`index.html`), không cần build, không cần máy chủ.

## Đưa lên Netlify (cách nhanh nhất)
1. Vào https://app.netlify.com/drop
2. Kéo thả file `netlify-dailyhc.zip` (hoặc cả thư mục này) vào khung.
3. Netlify cấp địa chỉ dạng `https://xxxx.netlify.app` – mở là dùng được.

## Đưa lên GitHub rồi nối với Netlify
1. Tạo repo mới trên GitHub (ví dụ `daily-hc`), upload `index.html`, `netlify.toml`, `README.md`, `.gitignore`.
2. Netlify → *Add new site* → *Import an existing project* → chọn repo.
3. Build command: để trống · Publish directory: `.` → *Deploy*.
4. Mỗi lần thay `index.html` và commit, Netlify tự cập nhật.

## Lưu ý khi dùng trên web
- Dữ liệu chị sửa lưu trong **localStorage của từng trình duyệt/máy** (không chia sẻ tự động).
  Muốn nhiều người cùng xem dữ liệu chung thì dùng nút đồng bộ Google Sheets trong trang (nếu đã cấu hình), hoặc bấm **“Tải HTML mới nhất”** để lấy file kèm dữ liệu rồi thay `index.html` và deploy lại.
- Nút **“Tự động lưu HTML”** (ghi đè file trong thư mục) chỉ hợp khi mở file từ máy (Chrome/Edge); trên web nên dùng “Tải HTML mới nhất”.
- Sau khi deploy bản mới mà vẫn thấy dữ liệu cũ: mở cửa sổ ẩn danh hoặc xóa Local Storage của trang.
