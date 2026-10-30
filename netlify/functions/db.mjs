// Netlify Function: cơ sở dữ liệu chung cho dashboard (lưu bằng Netlify Blobs)
// Giao thức (khớp với script "cloud-sync" trong index.html):
//   GET  ?action=all            -> { ok, now, data: { key: { value, updated, by } } }
//   GET  ?action=since&t=<ms>   -> chỉ các key thay đổi sau thời điểm t
//   POST { action:'set', by, items:[{ key, value }] }   (value = null -> xóa)
// Key hợp lệ: "day:YYYY-MM-DD", "hcTO", "writer"
import { getStore } from "@netlify/blobs";

const KEY_RE = /^(day:\d{4}-\d{2}-\d{2}|hcTO|writer)$/;
const MAX_BODY = 4 * 1024 * 1024;           // 4MB mỗi lần gửi
const META = "_meta";                        // { key: { u: thời điểm sửa (ms), by } }
const blobKey = (k) => "k:" + encodeURIComponent(k);

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export function createHandler(getStoreFn) {
  return async (req) => {
    try {
      const store = getStoreFn({ name: "dailyhc", consistency: "strong" });
      const url = new URL(req.url);

      if (req.method === "GET") {
        const action = url.searchParams.get("action") || "all";
        const t = action === "since" ? Number(url.searchParams.get("t") || 0) : 0;
        const meta = (await store.get(META, { type: "json" })) || {};
        const keys = Object.keys(meta).filter((k) => (meta[k].u || 0) > t);
        const data = {};
        await Promise.all(
          keys.map(async (k) => {
            const v = await store.get(blobKey(k), { type: "json" });
            if (action === "all" && (v === null || v === undefined)) return;   // bỏ key đã xóa khi tải toàn bộ
            data[k] = { value: v === undefined ? null : v, updated: meta[k].u, by: meta[k].by || "" };
          })
        );
        return json({ ok: true, now: Date.now(), data });
      }

      if (req.method === "POST") {
        const raw = await req.text();
        if (raw.length > MAX_BODY) return json({ ok: false, error: "Dữ liệu quá lớn" }, 413);
        let body;
        try { body = JSON.parse(raw); } catch { return json({ ok: false, error: "JSON không hợp lệ" }, 400); }
        if (body.action !== "set" || !Array.isArray(body.items)) return json({ ok: false, error: "Yêu cầu không hợp lệ" }, 400);
        const by = String(body.by || "").slice(0, 60);
        const now = Date.now();
        const meta = (await store.get(META, { type: "json" })) || {};
        for (const it of body.items) {
          if (!it || typeof it.key !== "string" || !KEY_RE.test(it.key)) continue;
          if (it.value === null || it.value === undefined) {
            await store.delete(blobKey(it.key));
          } else {
            await store.setJSON(blobKey(it.key), it.value);
          }
          meta[it.key] = { u: now, by };
        }
        await store.setJSON(META, meta);
        return json({ ok: true, now });
      }

      return json({ ok: false, error: "Phương thức không được hỗ trợ" }, 405);
    } catch (e) {
      return json({ ok: false, error: String((e && e.message) || e) }, 500);
    }
  };
}

export default createHandler(getStore);
