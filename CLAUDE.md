# CLAUDE.md

Klanmedic marketing site for a Slovenian medical clinic. Static multi-page HTML + Tailwind CSS v4 + Alpine.js v3. No framework, bundler, linter, typecheck or CI.

## Communication
- Chat with the user in **English**, always.
- Site copy is **Slovenian** (`lang="sl"`). Match the existing tone. Never translate it to English. Italian and English locales are planned, so leave room for copy 15–25% longer.

## Commands
- `npm run build` — compile `src/css/input.css` → `src/css/output.css` (minified). Run it after changing input.css **or adding new utility classes in any HTML**.
- `npm run watch` — same, watching for changes.
- `npm run test:visual` — Playwright smoke test at 375/640/768/1024/1440px (~30 s). Run after layout/markup changes. It needs internet (Google Fonts, Alpine CDN). One-time setup: `npx playwright install chromium`. Screenshots go to `tests/screenshots/` (gitignored). Details in `tests/README.md`.
- There is no dev server. Open the HTML files directly, or run `npx serve .`.

## Layout
Pages (the header/nav markup is **copied into every page**, so a nav change must be applied to all of them):
- `index.html` — landing page. Section ids: `#home`, `#o-kliniki`, `#services`, `#why-us`, `#team`, `#narocanje-cta`. It has the scroll intro (`heroIntro`) and the team showcase.
- `narocanje.html`, `urnik.html`, `cenik.html` — info pages.
- `storitve/zobozdravstvo.html`, `storitve/interna-medicina.html` — service pages with expandable subservice cards.
- `storitve/estetika.html` — hub of 8 link-cards. Detail pages are in `storitve/estetika/*.html`.
- `intro-2.html` — an experimental intro (`heroIntro2`). It is not linked from the nav.

Code:
- `src/css/input.css` — Tailwind v4 CSS-first config (`@theme` tokens) plus shared component classes: `.signature-rule`, `.signature-rule--center`, `.image-card-overlay`, `.image-card-caption`, `.card-reveal`, the `[data-card]` crossfade/FLIP styles, and `.intro-*`. There is intentionally **no `tailwind.config.js`**. Add tokens to `@theme`.
- `src/js/main.js` — everything lives in one `alpine:init` listener: store `intro`, components `siteHeader` (menus + search), `heroIntro`, `heroIntro2`, `teamShowcase`, `subservices(items)`.
- `src/js/search-index.js` — hand-maintained search index (`window.KLANMEDIC_SEARCH`), lazy-loaded by the header search icon. A JS file, not `.json`, so search works from `file://`. Field docs are at the top of the file.
- `src/images/` — assets. `artifacts/` — design sketches, gitignored, not deployed.
- `.opencode/`, `.agents/` — config for other agent tools. `AGENTS.md` and `DESIGN.md` are the human/other-tool originals of this file and of `.claude/rules/design.md`.

## Rules and gotchas
- **Never hand-edit `src/css/output.css`.** It is a build artifact, but it **is tracked in git** (its .gitignore line is commented out). Rebuild it and commit it with CSS changes.
- Register new `x-data` components inside the `alpine:init` listener in `src/js/main.js`. Alpine is loaded `defer` from cdn.jsdelivr.net.
- Keep the inline `<style>[x-cloak]{display:none!important}</style>` in every page `<head>`. The mobile nav needs it.
- Asset paths depend on depth: `./src/…` (root), `../src/…` (`storitve/`), `../../src/…` (`storitve/estetika/`).
- Each service page passes its card data inline: `x-data="subservices([...])"`. Keep the `[data-card]`, `.card-face`, `.sub-panel` and `.panel-inner` hooks, because the FLIP animation and its CSS depend on them.
- **Search index:** when you add or rename a page, a `subservices` card or a cenik section, add or update its entry in `src/js/search-index.js`. Card entries link to `…#sub-<slug>`; `subservices` opens the card whose slug is in the URL hash, so keep slugs stable. Search is Slovenian; matching ignores diacritics.
- Any new animation must respect `prefers-reduced-motion`, as the existing ones do.
- Tests: `tests/visual_check.mjs` is the only test. Keep it a single plain Playwright script (no framework). When you add a subpage, add it to `SUBPAGES` there. `EXPECTED_DEAD_ANCHORS` is currently empty and should stay accurate.
- Do not commit or push unless asked.

## Design
The visual spec is in `.claude/rules/design.md`, which loads automatically when you touch HTML, CSS or JS. `DESIGN.md` has the full rationale and is the source of truth. If the code drifts from it, change the code, not the spec.
