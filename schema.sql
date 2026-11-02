-- Cloudflare D1: dữ liệu chung của dashboard
-- Mỗi ngày báo cáo = 1 dòng (key "day:YYYY-MM-DD"); cộng thêm "hcTO" (TO nhập tay) và "writer".
CREATE TABLE IF NOT EXISTS kv (
  key     TEXT PRIMARY KEY,
  value   TEXT,                       -- JSON
  updated INTEGER NOT NULL,           -- thời điểm sửa (ms)
  by      TEXT NOT NULL DEFAULT '',   -- người sửa
  deleted INTEGER NOT NULL DEFAULT 0  -- 1 = đã xóa (giữ dấu vết để máy khác cập nhật)
);
CREATE INDEX IF NOT EXISTS kv_updated ON kv(updated);

-- Lịch sử: giữ 20 phiên bản gần nhất của mỗi key (để khôi phục khi sửa nhầm)
CREATE TABLE IF NOT EXISTS hist (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  key     TEXT NOT NULL,
  value   TEXT,
  updated INTEGER,
  by      TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS hist_key ON hist(key, id);
