# AGENTS.md

Klanmedic static marketing site (Slovenian, `lang="sl"`). Single-page HTML using
Tailwind CSS v4 and Alpine.js, both loaded as plain assets. No framework, no
bundler, no test suite, no linter, no typecheck, no CI.

## Commands

- `npm install` — install dev deps (only Tailwind v4 + its CLI).
- `npm run build` — one-shot Tailwind compile: `src/css/input.css` -> `src/css/output.css`, minified.
- `npm run watch` — same pipeline, watching for changes.

There is no dev server, build orchestrator, or preview script in `package.json`.
Open `index.html` directly in a browser, or serve the repo root with any static
server (e.g. `npx serve .`). Opening via `file://` works for everything except
features that need a real HTTP origin.

`src/css/output.css` is a build artifact and is gitignored — never edit it by
hand; change `src/css/input.css` and re-run the build/watch script.

## Project layout

- `index.html` — the only page. Sections: `#home`, `#services`, `#contact`.
- `src/css/input.css` — Tailwind entry; uses Tailwind v4 CSS-first config via
  `@import "tailwindcss";` and a `@theme { ... }` block. There is intentionally
  no `tailwind.config.js`.
- `src/js/main.js` — Alpine `alpine:init` hook; currently registers a single
  component, `counter`, used by the `#services` section.
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
  pure `#FFFFFF` surfaces — use `#FAFBF8` for cards.
- Type is Fraunces (display) + Manrope (body). No Inter, no system fallbacks
  as the visible choice.
- Container is `max-w-[80rem]`; hero is a 7/5 split; sections separated by 1px
  hairlines in `border`, not by extra whitespace alone.
- Sand is rationed: signature rule under the hero, plus at most two section
  titles per page. Never as a button fill, never as a badge fill.

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
- Keep markup in `index.html`; only factor out into separate files if a second
  page is added (the previous `wine-bar.html` was removed in the current
  rewrite).
- No tests exist. Do not add a test framework for this repo unless asked.

## Working tree

The repo is mid-rewrite. `git status` currently shows many files
(`script.js`, `styles.css`, `wine-bar.html`, `CNAME`, `README.md`,
`GOOGLE_SEARCH_SETUP.md`) deleted and the new `src/`, `package.json`,
`package-lock.json` untracked. That is expected during this transition — do not
"fix" it by reverting unless explicitly asked.
</content>
</invoke>