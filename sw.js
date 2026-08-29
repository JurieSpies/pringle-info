/* Overstrand Lifeline — service worker: cache the app shell for offline use */
const VERSION = "v2.9.0"; // v2.9.0 — email rows + hours line; v2.8.0 — brand logos on cards; v2.7.0 — Space Grotesk display font; v2.6.0 — Notion redesign
const CACHE = `pringle-info-${VERSION}`;

const ASSETS = [
    "./",
    "./index.html",
    "./tailwind.css",
    "./data.js",
    "./manifest.json",
    "./icons/icon.svg",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/icon-maskable-512.png",
    "./icons/apple-touch-icon.png",
    "./fonts/space-grotesk-latin.woff2",
    // brand logos rendered on directory cards (icons/logos/*)
    "./icons/logos/birdflu.png",
    "./icons/logos/capenature.svg",
    "./icons/logos/dffe.png",
    "./icons/logos/er24.png",
    "./icons/logos/heart2soul.png",
    "./icons/logos/kaws.png",
    "./icons/logos/kogelberg.png",
    "./icons/logos/localchoice.png",
    "./icons/logos/nchild.png",
    "./icons/logos/nlifeline.png",
    "./icons/logos/nsadag.png",
    "./icons/logos/nsaps.png",
    "./icons/logos/nsrih.png",
    "./icons/logos/nsrik.png",
    "./icons/logos/onehealth.png",
    "./icons/logos/overstrand.png",
    "./icons/logos/sapsg.png",
    "./icons/logos/sapsh.png",
    "./icons/logos/sapsk.png",
    "./icons/logos/sapss.png",
    "./icons/logos/turtles.svg",
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches
            .open(CACHE)
            .then((c) => c.addAll(ASSETS))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((k) => k !== CACHE)
                        .map((k) => caches.delete(k)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener("fetch", (e) => {
    if (e.request.method !== "GET") return;
    // Navigation: network-first so a deployed update lands on the next open;
    // offline falls back to the cached shell. Everything else stays cache-first
    // (it is refreshed in bulk when the new cache is filled on install).
    if (e.request.mode === "navigate") {
        e.respondWith(
            fetch(e.request)
                .then((res) => {
                    if (res.ok) {
                        const copy = res.clone();
                        caches.open(CACHE).then((c) => c.put(e.request, copy));
                    }
                    return res;
                })
                .catch(() =>
                    caches
                        .match(e.request)
                        .then((hit) => hit || caches.match("./index.html")),
                ),
        );
        return;
    }
    e.respondWith(
        caches.match(e.request).then((hit) => {
            if (hit) return hit;
            return fetch(e.request)
                .then((res) => {
                    // Cache successful same-origin responses for use offline.
                    if (
                        res.ok &&
                        new URL(e.request.url).origin === self.location.origin
                    ) {
                        const copy = res.clone();
                        caches.open(CACHE).then((c) => c.put(e.request, copy));
                    }
                    return res;
                })
                .catch(() => caches.match("./index.html"));
        }),
    );
});
