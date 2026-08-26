/* Pringle Info — service worker: cache the app shell for offline use */
const VERSION = "v2.4.0";
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
