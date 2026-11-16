# Visual smoke test

`npm run test:visual` opens the site in headless Chromium at five viewport
widths (375 / 640 / 768 / 1024 / 1440), passes the hero intro gate like a real
visitor, and asserts layout invariants: no horizontal overflow, header logo
not clipped, CTA on one line, burger/desktop-nav breakpoint behavior, service
tile pattern, no clipped captions, team image swap, font loading, no console
errors, no failed requests, and that dead anchors match the expected list in
`tests/visual_check.mjs` (`EXPECTED_DEAD_ANCHORS`).

It also exercises the header search: the panel opens from the icon at every
width, finds entries (with and without diacritics), moves with the arrow keys
and closes with Escape; following a result opens the right card, on another page
and on the same page; and every service page opens the card named in a
`#sub-<slug>` URL.

Run it after layout/markup changes. Takes ~30 s.

## One-time setup

```
npm install
npx playwright install chromium
```

## What a failure means

- Each failing width prints its problems under `[<width>px] FAIL`.
- If an anchor starts working (you added the page), remove it from
  `EXPECTED_DEAD_ANCHORS` in `tests/visual_check.mjs`.
- Needs internet (Google Fonts + Alpine.js CDN).
- Screenshots for manual review are (over)written to `tests/screenshots/`
  (gitignored). Some bugs only show up visually — skim them now and then.
