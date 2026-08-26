// Pringle Info smoke test — `bun run test` (server must be running: `bun run dev`)
// Playwright checks: rendering, search, favourites, WhatsApp, GPS, offline PWA.
import { chromium } from "playwright";

// ?hot=0 asks the dev server not to inject its live-reload script and to leave
// the service worker alone — production parity, so the offline checks are real.
const BASE = (process.env.BASE_URL || "http://localhost:8080") + "?hot=0";
const failures: string[] = [];
const assert = (cond: boolean, label: string) => {
    console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
    if (!cond) failures.push(label);
};

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
await ctx.grantPermissions(
    ["clipboard-read", "clipboard-write", "geolocation"],
    { origin: BASE },
);
await ctx.setGeolocation({ latitude: -34.34, longitude: 19.02 });

const page = await ctx.newPage();
const errors: string[] = [];
page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// ---- rendering ----
assert((await page.locator("details.cat").count()) === 11, "11 sections");
assert(
    (await page.locator("article[data-q]").count()) === 78,
    "78 contact cards",
);
assert(
    (await page.locator("#lifelineGrid a").count()) === 4,
    "lifeline: 4 one-tap tiles",
);
assert((await page.locator('a[href^="tel:"]').count()) === 97, "tel: links");
assert(
    (await page.locator('a[href^="https://wa.me/"]').count()) === 62,
    "WhatsApp links (mobile numbers only)",
);
assert((await page.locator(".gps-nav").count()) === 44, "GPS navigate links");

// ---- search ----
await page.fill("#search", "Snake");
await page.waitForTimeout(300);
assert(
    (await page.locator("details.cat:not([hidden])").count()) === 1,
    "search 'Snake' → 1 category",
);
await page.fill("#search", "");
await page.waitForTimeout(300);

// ---- favourites ----
await page.locator('.star[data-fav="best"]').first().click();
await page.waitForTimeout(300);
assert(
    await page.locator("#favSection").isVisible(),
    "favourites: Quick Access visible",
);
assert(
    (await page.locator("#favList article").count()) === 1,
    "favourites: pinned card shown",
);
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1200);
assert(
    (await page.locator("#favList article").count()) === 1,
    "favourites: persists after reload",
);

// ---- GPS navigate ----
const gpsVal = await page.locator(".gps-nav").first().getAttribute("data-gps");
const gpsHref = await page.locator(".gps-nav").first().getAttribute("href");
assert(
    gpsHref === `https://www.google.com/maps/dir/?api=1&destination=${gpsVal}`,
    "GPS chip links to maps directions",
);

await page.click("#myLoc");
await page.waitForTimeout(1500);
assert(
    (await page.evaluate("navigator.clipboard.readText()")) ===
        "-34.340000, 19.020000",
    "'Copy my location' uses the device GPS",
);

// ---- offline (service worker) ----
await page.waitForFunction(
    "navigator.serviceWorker.controller !== null",
    undefined,
    { timeout: 5000 },
);
await ctx.setOffline(true);
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
const offlineCount = await page.locator("#results article[data-q]").count();
console.log(
    "  (offline cards:",
    offlineCount,
    "· title:",
    await page.title(),
    ")",
);
assert(offlineCount === 78, "offline reload: app fully renders");
await ctx.setOffline(false);

assert(
    errors.length === 0,
    `no console errors${errors.length ? ` — ${errors.join(" | ")}` : ""}`,
);

await browser.close();
console.log(failures.length ? `\n${failures.length} FAILURE(S)` : "\nALL PASS");
process.exit(failures.length ? 1 : 0);
