# AGENTS.md

Klanmedic static marketing site (Slovenian, `lang="sl"`). Multi-page static HTML
using Tailwind CSS v4 and Alpine.js, both loaded as plain assets. No framework,
no bundler, no linter, no typecheck, no CI. A single Playwright visual smoke
test lives in `tests/`.

## Commands

- `npm install` — install dev deps (Tailwind v4 + its CLI, Playwright).
- `npm run build` — one-shot Tailwind compile: `src/css/input.css` -> `src/css/output.css`, minified.
- `npm run watch` — same pipeline, watching for changes.
- `npm run test:visual` — Playwright smoke test at 5 viewport widths; run after
  layout/markup changes. One-time browser setup: `npx playwright install
  chromium`. See `tests/README.md`.

There is no dev server, build orchestrator, or preview script in `package.json`.
Open `index.html` directly in a browser, or serve the repo root with any static
server (e.g. `npx serve .`). Opening via `file://` works for everything except
features that need a real HTTP origin.

`src/css/output.css` is a build artifact — never edit it by hand; change
`src/css/input.css` and re-run the build/watch script. It is tracked in git (its
`.gitignore` line is commented out), so commit the rebuilt file with CSS changes.

## Project layout

- `index.html` — landing page. Sections: `#home`, `#o-kliniki`, `#services`,
  `#why-us`, `#team`, `#narocanje-cta`.
- `narocanje.html`, `urnik.html`, `cenik.html` — info pages.
- `storitve/zobozdravstvo.html`, `storitve/interna-medicina.html` — service
  pages with expandable subservice cards.
- `storitve/estetika.html` — hub of link-cards; detail pages live in
  `storitve/estetika/*.html`.
- `intro-2.html` — experimental intro, not linked from the nav.
- The header/nav markup is duplicated in every page; a nav change must be
  applied to all of them. Asset paths depend on depth (`./src/`, `../src/`,
  `../../src/`).
- `src/css/input.css` — Tailwind entry; uses Tailwind v4 CSS-first config via
  `@import "tailwindcss";` and a `@theme { ... }` block. There is intentionally
  no `tailwind.config.js`.
- `src/js/main.js` — Alpine `alpine:init` hook; registers the `intro` store and
  the `heroIntro`, `heroIntro2`, `teamShowcase` and `subservices(items)`
  components.
- `artifacts/sketches/` — design references (`.excalidraw` + exported `.png`)
  for the landing page. Not deployed.

## Stack notes

- Tailwind v4. Config lives in CSS, not JS. Add design tokens to the `@theme`
  block; do not introduce a `tailwind.config.js`.
- Alpine.js v3 is loaded from `cdn.jsdelivr.net` (see the `<script defer>` tag
  in `index.html`). New `x-data` components should be registered inside the
  `alpine:init` listener in `src/js/main.js` so they are available before
  Alpine scans the DOM.
- The inline `<style>[x-cloak] { display: none !important; }</style>` in
  `index.html` is required for the mobile nav — keep it.

## Design direction

The visual spec for the site lives in [`DESIGN.md`](./DESIGN.md) — color, type,
layout, and the one signature element (the 2px sand rule under the hero).
Treat it as the source of truth; do not re-derive decisions from defaults.

Non-negotiables (full detail in `DESIGN.md`):
- Palette is the six sage/forest/sand tokens. No `blue-600`, no `slate-*`, no
  pure `#FFFFFF` surfaces — use `#FAFAF7` for cards.
- Type is Fraunces (display) + Manrope (body). No Inter, no system fallbacks
  as the visible choice.
- Container is `max-w-[80rem]`; hero is a 5/7 split (copy 5 cols, image 7);
  sections separated by 1px hairlines in `border-hairline`, not by extra
  whitespace alone.
- Sand is rationed: signature rule under the hero, plus at most two section
  titles per page. Never as a button fill, never as a badge fill.
- Buttons are `bg-forest text-surface` resting; hover reveals a `bg-muted`
  fill with `text-surface` text and a `ring-muted` ring. Never hover white
  (`bg-surface`).

Subpages inherit the same tokens, type scale, container, and signature
behavior. The sand rule appears under each subpage H1, identical to the
landing-page hero treatment. Slovenian is the only active locale today;
Italian and English are planned, and the 17px body / 60–72ch measure exist
specifically to absorb the longer copy those locales will need.

When the implementation drifts from `DESIGN.md` (e.g., a new component picks
a different color, or a new heading falls back to a system font), update the
implementation to match the spec — not the other way around.

## Conventions

- UI copy is Slovenian. Match existing tone; do not translate to English.
- `tests/visual_check.mjs` is the only test; keep it a single plain Playwright
  script (no test framework). When you add a subpage, add it to `SUBPAGES` in
  that file. `EXPECTED_DEAD_ANCHORS` is currently empty; keep it accurate.

## Language of communication

Regardless in which language of the website you are working on, in the chat interface, always communicate in english.