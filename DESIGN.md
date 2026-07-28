# Klanmedic — Design Direction

A visual spec for the Klanmedic landing page, designed to extend cleanly to per-speciality subpages and to a Slovenian → Italian → English localization. Single source of truth for color, type, layout, and the one signature moment.

## Color

Six tokens. Sage carries the page; warm off-white holds cards; deep forest is the only primary; warm sand is the *only* accent and is used as a highlight, never as a fill.

| Token | Role | Hex |
| --- | --- | --- |
| sage | Page background | `#F1F4F0` |
| surface | Cards, elevated surfaces (warm off-white) | `#FAFBF8` |
| forest | Primary: text, buttons, links, primary rules | `#2F4A3A` |
| sand | Accent — signature rule, underline accent, single hover wash only | `#D9C7A7` |
| border | Hairline dividers, card borders | `#D4DCD0` |
| muted | Captions, meta, secondary text | `#5C6B61` |

Rules:
- Buttons are always forest. Never sand.
- Sand appears once per screen, max. Never as a button fill, never as a badge fill.
- Borders are always 1px and always `border`. No other border weights or colors.
- Surfaces are warm off-white, not pure `#FFFFFF` — already decided in interview.
- The current code's `blue-600` / `slate-*` baseline is fully replaced. Nothing from the old Tailwind defaults survives.

## Type

Two faces. **Fraunces** for display (hero, section titles). **Manrope** for body and UI. No other faces. No Inter, no system fallback as the visible choice.

| Role | Size (px) | Tailwind | Face / weight | Notes |
| --- | --- | --- | --- | --- |
| Hero | 72 / 80 / 96 | `text-7xl` / `text-8xl` | Fraunces 500, *soft* axis on, *wonk* off | Optical sizing on |
| Section title | 36 / 40 | `text-4xl` | Fraunces 500 | |
| Subheading | 20 / 24 | `text-xl` / `text-2xl` | Manrope 500 | |
| Body | 17 | `text-[17px]` | Manrope 400 | Slightly larger than default for i18n length buffer |
| Caption / meta | 14 | `text-sm` | Manrope 500, uppercase, `tracking-wide` | Eyebrows, service labels |

Rules:
- Fraunces is never used below 24px — its high contrast thins out at body sizes and reads as a different register.
- Body measure is **60–72ch**, not the full container width, even on wide screens.
- Both faces ship Latin Extended — diacritics (š, č, ž, ù, à, é, …) are first-class for sl / it / en.
- Body at 17px (not 16) is a deliberate buffer for Slovenian and Italian copy, which run 15–25% longer than English.
- Pairing rationale, since the combo will be questioned: Fraunces gives editorial warmth and the *soft* axis a human register (matters when the clinic includes aesthetic medicine); Manrope is geometric, calm, and distinctively *not* Inter. Cormorant Garamond + Inter was considered and rejected as the most-paired serif-and-grotesque combo of the last five years.

## Layout

- **Max width:** `80rem` (1280px). Content is centered in this container.
- **Grid:** 12-col, mobile-first; collapses to fewer cols below `md`.
- **Hero:** 7/5 split — Fraunces headline, subhead, and primary CTA on the left 7 cols; image on the right 5 cols. At `md` and below, stack: text first, image second.
- **Sections:** centered within the 80rem container, with hairline rules (1px `border`) between major sections rather than relying on whitespace alone.
- **Vertical rhythm:** `py-24` (6rem) between sections, `py-12` (3rem) within a section.
- **Body measure:** paragraphs sit in a 60–72ch column, even on wide screens.
- **Subpages:** the same 80rem container, 12-col grid, hairline rules, and type scale apply to per-speciality pages. No page-specific layouts unless content demands it.

## Signature element

A single 2px `sand` rule beneath the hero headline, overshooting the last word by 10–15% of the line's total width.

- **Weight:** 2px. (Heavier than section dividers on purpose — the 1px borders separate, this one anchors.)
- **Color:** `sand` (`#D9C7A7`).
- **Length:** 100% of the headline line width + 10–15% overshoot, on the right.
- **Position:** 4–8px below the baseline of the last headline line.
- **Reuse:** the same overshoot treatment is allowed under at most two section titles per page. Not under body text, not under buttons, not as a generic underline for links. The sand is rationed.
- **On subpages:** appears under each page H1, identical behavior. This is how the brand carries across pages.
- **Interaction:** no animation, no hover state. It sits. It is the one thing on the page that does not need to draw attention to itself.
