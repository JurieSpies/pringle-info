// Pringle Info dev server — `bun run dev`
// Static file server with correct MIME types, so service-worker registration
// (sw.js) and the web manifest work exactly as they would on a real host.
//
// Live reload is ON by default: editing files the browser uses (index.html,
// data.js, icons/…) auto-reloads the page; editing *.css hot-swaps the
// stylesheet with no reload. The dev live-reload script disables the service
// worker so its cache never masks edits.
//   · Disable entirely:  HOT=0 bun run server.ts
//   · Opt one request out (production parity, offline tests):  /?hot=0
import { existsSync, statSync, watch } from "node:fs";
import { file, serve } from "bun";

const PORT = Number(process.env.PORT || 8080);
const HOT = process.env.HOT !== "0";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".md": "text/markdown; charset=utf-8"
};

/* ---------- live reload infrastructure ---------- */

const WATCH_DIR = process.cwd();
// Don't reload for tooling / dependency / test files (tests/ isn't loaded by
// the page, and tests/smoke.ts requests ?hot=0 so the SW works there anyway).
const IGNORE =
  /(^|\/)(node_modules|\.git|\.fallow|\.zed|tests)(\/|$)|\.DS_Store|bun\.lockb/;

const reloadClients = new Set<ReadableStreamDefaultController>();
let pendingFiles = new Set<string>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function broadcast(msg: { files: string[]; css: boolean }) {
  const body = `event: reload\ndata: ${JSON.stringify(msg)}\n\n`;
  const enc = new TextEncoder();
  for (const c of reloadClients) {
    try {
      c.enqueue(enc.encode(body));
    } catch {
      reloadClients.delete(c);
    }
  }
}

function scheduleFlush(relPath: string) {
  pendingFiles.add(relPath);
  if (flushTimer) return;
  // Editors often fire several events per save — coalesce them.
  flushTimer = setTimeout(() => {
    flushTimer = null;
    const files = [...pendingFiles];
    pendingFiles = new Set();
    broadcast({ files, css: files.every((f) => f.endsWith(".css")) });
  }, 80);
}

if (HOT) {
  try {
    // recursive watch is supported on macOS (the dev platform for this app).
    watch(WATCH_DIR, { recursive: true }, (_ev, name) => {
      if (!name || IGNORE.test(name)) return;
      scheduleFlush(String(name).replace(/\\/g, "/"));
    });
  } catch (e) {
    console.warn("live reload: file watching unavailable —", (e as Error).message);
  }
  // Keep idle SSE connections alive (browsers drop long-idle streams).
  setInterval(() => {
    const enc = new TextEncoder();
    for (const c of reloadClients) {
      try {
        c.enqueue(enc.encode(": ping\n\n"));
      } catch {
        reloadClients.delete(c);
      }
    }
  }, 25000);
}

/* ---------- injected client (kept deliberately light) ---------- */

const HOT_SCRIPT = `<script>
/* Pringle dev live-reload — injected by server.ts, not part of the real app.
   Full reload on content changes; in-place stylesheet swap for *.css. */
(() => {
  if (window.__PRINGLE_HOT__) return;
  window.__PRINGLE_HOT__ = true;
  try {
    navigator.serviceWorker.getRegistrations().then((rs) =>
      rs.forEach((r) => r.unregister()),
    );
  } catch (e) {}
  let first = true;
  const es = new EventSource("/__reload");
  es.onopen = () => { if (!first) location.reload(); first = false; };
  es.addEventListener("reload", (ev) => {
    try {
      const d = JSON.parse(ev.data || "{}");
      if (d.css) {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        if (links.length) {
          const t = Date.now();
          links.forEach((l) => {
            const u = new URL(l.href, location.href);
            u.searchParams.set("__hot", t);
            l.href = u.href;
          });
          return;
        }
      }
    } catch (e) {}
    location.reload();
  });
})();
</script>
`;

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = decodeURIComponent(url.pathname);
    if (path.includes("..")) return new Response("Forbidden", { status: 403 });

    // SSE stream the browser subscribes to for change notifications.
    if (HOT && path === "/__reload") {
      let ctrl: ReadableStreamDefaultController | null = null;
      return new Response(
        new ReadableStream({
          start(c) {
            ctrl = c;
            reloadClients.add(c);
          },
          cancel() {
            if (ctrl) reloadClients.delete(ctrl);
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        },
      );
    }

    const target = `.${path === "/" ? "/index.html" : path}`;
    if (existsSync(target) && statSync(target).isFile()) {
      const ext = target.slice(target.lastIndexOf(".")).toLowerCase();
      // Inject the live-reload script into HTML — unless this request opted
      // out (?hot=0), which the smoke test uses for production parity.
      if (HOT && ext === ".html" && url.searchParams.get("hot") !== "0") {
        let body = await file(target).text();
        // Marker exists only inside the injected script, so we never double-
        // inject (the app's own code may mention __PRINGLE_HOT__).
        if (!body.includes("Pringle dev live-reload")) {
          body = body.replace("</head>", `${HOT_SCRIPT}</head>`);
        }
        return new Response(body, {
          headers: {
            "Content-Type": MIME[ext],
            "Cache-Control": "no-cache",
          },
        });
      }
      return new Response(file(target), {
        headers: {
          "Content-Type": MIME[ext] || "application/octet-stream",
          "Cache-Control": "no-cache"
        }
      });
    }
    return new Response("Not found", { status: 404 });
  }
});

console.log(`Pringle Info → http://localhost:${PORT}${HOT ? " (live reload on — HOT=0 to disable)" : ""}`);
