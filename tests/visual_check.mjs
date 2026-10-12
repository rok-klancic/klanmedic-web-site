// Visual smoke test for the Klanmedic site.
//
// Run:            npm run test:visual
// One-time setup: npm install && npx playwright install chromium
//
// What it does: serves the repo root on an ephemeral local port, opens
// headless Chromium at several viewport widths, passes the hero intro gate
// like a real visitor, then asserts layout/mechanical invariants:
//   - no horizontal page overflow
//   - header logo not clipped, CTA on one line
//   - burger menu / desktop nav swap at the right breakpoints
//   - service tile pattern + captions not clipped
//   - team hotspot image swap works
//   - Fraunces/Manrope fonts actually load
//   - no console errors/warnings, no failed (>=400) requests
//   - dead anchors match EXPECTED_DEAD_ANCHORS (see below)
//   - service subpages (storitve/*.html): full-bleed hero image, cards
//     reveal on scroll, card expands into a full-width inline panel
//     top-aligned with the viewport, other cards stay clickable, close
//     button returns to the grid
// Screenshots for manual review are (over)written to tests/screenshots/.
//
// Requires internet (Google Fonts + Alpine CDN). Exit code 1 on any failure.

import { chromium } from "playwright";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(HERE, "..");
const SHOTS = resolve(HERE, "screenshots");

// Viewport widths to test. Keep in sync with the breakpoints used in
// index.html (currently sm=640, lg=1024).
const WIDTHS = [375, 640, 768, 1024, 1440];

// Anchors that intentionally point at pages that do not exist yet
// (#narocanje, #urnik, #cenik). When you add those pages, this test will
// start FAILING — remove the now-live anchors from this list.
const EXPECTED_DEAD_ANCHORS = ["#narocanje", "#urnik", "#cenik"].sort();

// Service subpages expandable-card checks. Items per page must match the
// x-data="subservices([...])" array in each file.
const SUBPAGES = [
  "storitve/zobozdravstvo.html",
  "storitve/interna-medicina.html",
  "storitve/estetika.html",
];
const SUBPAGE_WIDTHS = [375, 1440];
const SUBPAGE_CARD_COUNT = 5;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function startServer() {
  return new Promise((done) => {
    const server = http.createServer(async (req, res) => {
      try {
        let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (path.endsWith("/")) path += "index.html";
        const file = resolve(ROOT, "." + path);
        if (!file.startsWith(ROOT)) throw new Error("outside root");
        const data = await readFile(file);
        res.writeHead(200, {
          "content-type": MIME[extname(file).toLowerCase()] ?? "application/octet-stream",
        });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("not found");
      }
    });
    server.listen(0, "127.0.0.1", () => {
      done({ server, port: server.address().port });
    });
  });
}

const JS = {
  state: () => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }),
  header: () => {
    const span = document.querySelector("header nav a span");
    const cta = document.querySelector('header nav > div > a[href="#narocanje"]');
    const s = span.getBoundingClientRect();
    const c = cta.getBoundingClientRect();
    return {
      logoClipped: span.scrollWidth > s.width + 1,
      ctaWrapped: c.height > 40,
      burgerVisible: getComputedStyle(document.querySelector("button[aria-label='Meni']")).display !== "none",
      desktopNavVisible: getComputedStyle(document.querySelector("header nav ul")).display !== "none",
      searchVisible: getComputedStyle(document.querySelector("button[aria-label='Iskanje']")).display !== "none",
    };
  },
  captions: () => [...document.querySelectorAll("#services h3")].map((h) => {
    const box = Math.round(h.getBoundingClientRect().width);
    return { text: h.textContent.trim(), clipped: h.scrollWidth > box + 1 };
  }),
  tiles: () => [...document.querySelectorAll("#services a")].map((a) => Math.round(a.getBoundingClientRect().width)),
  fonts: async () => {
    await document.fonts.ready;
    return { fraunces: document.fonts.check("16px Fraunces"), manrope: document.fonts.check("16px Manrope") };
  },
  deadAnchors: () => [...document.querySelectorAll('a[href^="#"]')].map((a) => {
    const href = a.getAttribute("href");
    try {
      return href !== "#" && !!document.querySelector(href) ? null : href;
    } catch {
      return href;
    }
  }).filter(Boolean),
};

async function runWidth(browser, width, port) {
  const height = width < 800 ? 812 : 900;
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const rec = { width, problems: [] };

  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning")
      rec.problems.push(`console ${m.type()}: ${m.text().slice(0, 150)}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400) rec.problems.push(`http ${r.status()}: ${r.url().slice(-90)}`);
  });
  page.on("requestfailed", (r) => rec.problems.push(`request failed: ${r.url().slice(-90)}`));

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.mouse.click(width / 2, Math.round(height * 0.4));
  await page.waitForFunction(() => window.Alpine && Alpine.store("intro").ready, undefined, { timeout: 8000 });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: resolve(SHOTS, `${width}-hero.png`) });

  // overflow (top of page)
  let st = await page.evaluate(JS.state);
  if (st.scrollWidth > st.innerWidth) rec.problems.push(`horizontal overflow at top: ${st.scrollWidth} > ${st.innerWidth}`);

  // header
  const h = await page.evaluate(JS.header);
  if (h.logoClipped) rec.problems.push("header logo text clipped");
  if (h.ctaWrapped) rec.problems.push("header CTA wrapped to two lines");
  const expectBurger = width < 1024;
  if (h.burgerVisible !== expectBurger)
    rec.problems.push(`burger visibility wrong (visible=${h.burgerVisible}, expected=${expectBurger})`);
  if (h.desktopNavVisible === expectBurger)
    rec.problems.push(`desktop nav visibility wrong (visible=${h.desktopNavVisible})`);
  if (h.searchVisible !== (width >= 640))
    rec.problems.push(`search button visibility wrong (visible=${h.searchVisible})`);

  // service tiles: banner + 2 half tiles on phones
  const tiles = await page.evaluate(JS.tiles);
  const captions = await page.evaluate(JS.captions);
  for (const c of captions.filter((c) => c.clipped))
    rec.problems.push(`caption clipped: "${c.text}"`);
  if (width === 375 && !(tiles[0] > 300 && Math.abs(tiles[1] - tiles[2]) <= 1 && tiles[1] < tiles[0] / 2))
    rec.problems.push(`service tile pattern wrong: [${tiles}]`);

  // mobile menu
  if (width < 1024) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click("button[aria-label='Meni']");
    await page.waitForTimeout(500);
    if (!(await page.locator("#mobile-menu").isVisible()))
      rec.problems.push("mobile menu did not open");
    await page.screenshot({ path: resolve(SHOTS, `${width}-menu.png`) });

    // tapping a nav link inside the menu must close it
    await page.click("#mobile-menu a[href='#services']");
    await page.waitForTimeout(500);
    if (await page.locator("#mobile-menu").isVisible())
      rec.problems.push("mobile menu did not close after link tap");
  }

  // services screenshot
  await page.locator("#services").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator("#services").screenshot({ path: resolve(SHOTS, `${width}-services.png`) });

  // team hotspot swaps the image (hotspots only exist at md+)
  if (width >= 768) {
    await page.locator("#team").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const srcBefore = await page.evaluate(() => document.querySelector("#team img").getAttribute("src"));
    await page.locator("button[aria-label^='Spoznajte']").nth(1).click();
    await page.waitForTimeout(1100);
    const srcAfter = await page.evaluate(() => document.querySelector("#team img").getAttribute("src"));
    if (!srcAfter.includes("meet_the_team_marko")) rec.problems.push(`team image swap failed (${srcBefore} -> ${srcAfter})`);
  }

  // overflow after full scroll
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  st = await page.evaluate(JS.state);
  if (st.scrollWidth > st.innerWidth) rec.problems.push(`horizontal overflow at bottom: ${st.scrollWidth} > ${st.innerWidth}`);

  // fonts
  const fonts = await page.evaluate(JS.fonts);
  if (!fonts.fraunces || !fonts.manrope) rec.problems.push(`fonts not loaded: ${JSON.stringify(fonts)}`);

  // dead anchors vs expected list
  const dead = [...new Set(await page.evaluate(JS.deadAnchors))].sort();
  const unexpected = dead.filter((d) => !EXPECTED_DEAD_ANCHORS.includes(d));
  const stale = EXPECTED_DEAD_ANCHORS.filter((d) => !dead.includes(d));
  if (unexpected.length) rec.problems.push(`unexpected dead anchors: ${unexpected.join(", ")}`);
  if (stale.length)
    rec.problems.push(`anchors in EXPECTED_DEAD_ANCHORS now exist — update the list: ${stale.join(", ")}`);

  await context.close();
  return rec;
}

async function runSubpage(browser, width, port, path) {
  const height = width < 800 ? 812 : 900;
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const name = path.replace("storitve/", "").replace(".html", "");
  const rec = { width, subpage: name, problems: [] };

  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning")
      rec.problems.push(`console ${m.type()}: ${m.text().slice(0, 150)}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400) rec.problems.push(`http ${r.status()}: ${r.url().slice(-90)}`);
  });
  page.on("requestfailed", (r) => rec.problems.push(`request failed: ${r.url().slice(-90)}`));

  await page.goto(`http://127.0.0.1:${port}/${path}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: resolve(SHOTS, `${width}-${name}-hero.png`) });

  // overflow at top
  let st = await page.evaluate(JS.state);
  if (st.scrollWidth > st.innerWidth)
    rec.problems.push(`horizontal overflow at top: ${st.scrollWidth} > ${st.innerWidth}`);

  // hero image is full-bleed and actually loaded
  const hero = await page.evaluate(() => {
    const img = document.querySelector("main section img");
    const box = img?.getBoundingClientRect();
    return {
      loaded: !!img && img.complete && img.naturalWidth > 0,
      width: box ? Math.round(box.width) : 0,
    };
  });
  if (!hero.loaded) rec.problems.push("hero image not loaded");
  if (hero.width !== width) rec.problems.push(`hero image not full-bleed (width=${hero.width})`);

  // fonts
  const fonts = await page.evaluate(JS.fonts);
  if (!fonts.fraunces || !fonts.manrope)
    rec.problems.push(`fonts not loaded: ${JSON.stringify(fonts)}`);

  // card grid renders the expected number of cards
  const cardCount = await page.locator("[data-card]").count();
  if (cardCount !== SUBPAGE_CARD_COUNT)
    rec.problems.push(`expected ${SUBPAGE_CARD_COUNT} subservice cards, got ${cardCount}`);

  // grid columns: 2 on phones, 3 on sm/md, 4 on lg and up
  const expectedColumns = width >= 1024 ? 4 : width >= 640 ? 3 : 2;
  const columns = await page.evaluate(() => {
    const rows = new Map();
    [...document.querySelectorAll("[data-card]")].forEach((card) => {
      const top = Math.round(card.getBoundingClientRect().top);
      rows.set(top, (rows.get(top) ?? 0) + 1);
    });
    return Math.max(...rows.values());
  });
  if (columns !== expectedColumns)
    rec.problems.push(`grid has ${columns} columns (expected ${expectedColumns})`);

  // cards reveal once scrolled into view
  await page.locator("[data-card]").first().scrollIntoViewIfNeeded();
  await page
    .waitForFunction(
      () => document.querySelector(".sub-grid")?.classList.contains("cards-in"),
      undefined,
      { timeout: 5000 }
    )
    .catch(() => rec.problems.push("cards never revealed (cards-in missing)"));
  await page.waitForTimeout(1800);
  const revealed = await page.evaluate(() =>
    [...document.querySelectorAll("[data-card]")].every(
      (c) => Number(getComputedStyle(c).opacity) > 0.95
    )
  );
  if (!revealed) rec.problems.push("cards still hidden after reveal");

  // clicking a card expands it into a full-width inline panel
  await page.locator("[data-card] > button:visible").first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(SHOTS, `${width}-${name}-flight.png`) });
  await page.waitForTimeout(1100);
  let open = await page.locator(".sub-panel:visible").count();
  if (open !== 1) rec.problems.push(`card did not expand (${open} visible panels)`);

  // the expanded panel spans the whole grid width
  const widths = await page.evaluate(() => {
    const grid = document.querySelector(".sub-grid");
    const openCard = [...grid.querySelectorAll("[data-card]")].find((c) => {
      const panel = c.querySelector(".sub-panel");
      return panel && getComputedStyle(panel).display !== "none";
    });
    return {
      grid: grid.clientWidth,
      card: openCard ? Math.round(openCard.getBoundingClientRect().width) : 0,
    };
  });
  if (widths.card && Math.abs(widths.card - widths.grid) > 3)
    rec.problems.push(`expanded card is not full width (${widths.card} vs ${widths.grid})`);

  // the expanded panel must be top-aligned with the viewport, sitting
  // just below the fixed header (offset ≈ 88px)
  const topAligned = await page.evaluate(() => {
    const panel = [...document.querySelectorAll(".sub-panel")].find(
      (p) => getComputedStyle(p).display !== "none"
    );
    const rect = panel?.getBoundingClientRect();
    if (!rect) return "panel not found for top-alignment check";
    return rect.top < 40 || rect.top > 150
      ? `expanded panel not top-aligned below header (top=${Math.round(rect.top)}px)`
      : null;
  });
  if (topAligned) rec.problems.push(topAligned);

  await page.screenshot({ path: resolve(SHOTS, `${width}-${name}-expanded.png`) });

  // other cards stay clickable while one is expanded
  await page.locator("[data-card] > button:visible").nth(1).click();
  await page.waitForTimeout(1500);
  open = await page.locator(".sub-panel:visible").count();
  if (open !== 1) rec.problems.push(`switching to another card failed (${open} visible panels)`);

  // clear button returns to the normal card view
  await page.getByRole("button", { name: "Nazaj na vse storitve" }).click();
  await page.waitForTimeout(1500);
  open = await page.locator(".sub-panel:visible").count();
  if (open !== 0) rec.problems.push(`panel did not close (${open} visible panels)`);

  // overflow at bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  st = await page.evaluate(JS.state);
  if (st.scrollWidth > st.innerWidth)
    rec.problems.push(`horizontal overflow at bottom: ${st.scrollWidth} > ${st.innerWidth}`);

  await context.close();
  return rec;
}

async function main() {
  mkdirSync(SHOTS, { recursive: true });
  const { server, port } = await startServer();
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const width of WIDTHS) {
      process.stdout.write(`--- landing ${width}px ---\n`);
      results.push(await runWidth(browser, width, port));
    }
    for (const path of SUBPAGES) {
      for (const width of SUBPAGE_WIDTHS) {
        process.stdout.write(`--- ${path} ${width}px ---\n`);
        results.push(await runSubpage(browser, width, port, path));
      }
    }
  } finally {
    await browser.close();
    server.closeAllConnections?.();
    server.close();
  }

  console.log("\n================ VERDICT ================");
  let failed = 0;
  for (const rec of results) {
    const label = rec.subpage ? `${rec.width}px ${rec.subpage}` : `${rec.width}px landing`;
    if (rec.problems.length) {
      failed++;
      console.log(`[${label}] FAIL`);
      for (const p of rec.problems) console.log(`    - ${p}`);
    } else {
      console.log(`[${label}] PASS`);
    }
  }
  console.log(`\n${results.length - failed}/${results.length} widths pass`);
  if (failed) process.exitCode = 1;
}

main();
