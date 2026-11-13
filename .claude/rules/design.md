---
paths:
  - "**/*.html"
  - "src/css/**"
  - "src/js/**"
---

# Klanmedic design rules

Condensed from `DESIGN.md` (the source of truth). If the code disagrees, fix the code.

## Color: six tokens only (defined in `@theme`)
| Class stem | Hex | Use |
| --- | --- | --- |
| `sage` | `#FCFAF5` | page background (`bg-sage`) |
| `surface` | `#FAFAF7` | cards and elevated surfaces (`bg-surface`) |
| `forest` | `#3F4543` | text, buttons, links, primary rules |
| `sand` | `#B58A62` | accent only (see the sand budget) |
| `hairline` | `#B9B5AA` | all borders (`border-hairline`) |
| `muted` | `#756F65` | captions, meta, secondary text |

- Never use `blue-*`, `slate-*`, `gray-*` or other default palette colors. Never use `bg-white` or `#FFF`.
- Borders are always 1px and always `border-hairline`.
- **Buttons:** resting `bg-forest text-surface`; hover `hover:bg-muted hover:text-surface hover:ring-1 hover:ring-muted`. Never sand, never a hover to `bg-surface`/white.

## Sand budget
- Sand is used for the hero signature rule, plus at most 2 section titles per page, and about once per screen.
- Never use sand as a button or badge fill, as a link underline, or under body text or buttons.
- Use the existing `.signature-rule` class (add `.signature-rule--center` for centered subpage H1s). Do not hand-roll the rule. It is a 2px sand line, with no animation and no hover.
- Every subpage H1 gets the rule, identical to the landing hero.

## Type: Fraunces (display) + Manrope (body). No other faces.
| Role | Classes |
| --- | --- |
| Hero H1 | `font-fraunces`, weight 500, 72/80/96px (`text-7xl`/`text-8xl`). The current hero uses an arbitrary ramp (`text-[44px]` → `lg:text-[88px]`); keep the phone step that fits |
| Section title | `font-fraunces text-4xl` (36/40px) |
| Subheading | `text-xl`/`text-2xl`, Manrope 500. Fraunces headings use `text-xl` below `sm` |
| Body | `text-[15px] sm:text-[17px]`, Manrope 400 |
| Caption/meta | `text-sm font-medium uppercase tracking-wide` |

- Never use Fraunces below 20px (`text-xl`).
- Body measure is 60–72ch (`max-w-[60ch]` to `max-w-[72ch]`), even on wide screens.
- Diacritics (š, č, ž, ù, à, é) must render. Both fonts load Latin Extended.

## Layout
- Container is `max-w-[80rem]`, centered, on a 12-col grid that collapses below `md`.
- Vertical rhythm: `py-24` between sections, `py-12` within a section. Major sections are separated by a 1px `border-hairline` rule, not whitespace alone.
- **Hero:** copy in 5 cols (`lg:col-span-5`) and image in 7 (`lg:col-span-7`). Below `sm` the image is omitted and the copy is vertically centered. From `sm` to `lg` the eyebrow and H1 take a full-width row, then copy and image share a 5/7 row below, with a 24px gutter at `sm` and 40px at `md`. From `lg` it is side by side. The centered hairline dash between hero and services is desktop only.
- Subpages use the same container, grid, hairlines and type scale. No page-specific layouts unless the content demands it.

## Image cards and subpage heroes (light treatment only)
- Image cards: use `.image-card-overlay` (a bottom `surface` scrim, 85% opacity, 70% on hover) and `.image-card-caption`, with `text-forest` copy. Titles keep a fixed top anchor within a grid: 75% from the top with an action label (`.image-card-caption`), 85% for title-only cards (`.image-card-caption--title-only`).
- Subpage hero: full-bleed image under `bg-sage/80`, headline in `text-forest`, meta in `text-muted`, sand rule under the H1.
- The dark scrim (`bg-forest/65`) and the full-card haze are retired. Do not reintroduce them.

## Team section (`#team`, `teamShowcase`)
- At `lg`+, the photo takes 7 cols and the names 5 cols. The names column is vertically centered against the photo. The names flow in 2 columns (3 if there are more than ~8 members) and never get taller than the photo. Below `lg` the names sit under the photo in a 2-column grid. The photo is 16/9.
- Names are the primary control: hover or focus shows a hairline underline, and the selected person keeps it.
- Photo hotspots are pointer-only, at `md`+, with a 500ms hover-intent delay, and only for members that have a face image.
- On first view the names rise in once, staggered 150ms. Skip it under `prefers-reduced-motion`.
