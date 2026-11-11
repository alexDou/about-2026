---
# portfolio-9od8
title: 'CSS layout: flex and grid, positioning only when nothing else works'
status: completed
type: task
priority: normal
created_at: 2026-11-11T06:21:05Z
updated_at: 2026-11-11T10:55:47Z
---

Owner's layout rule, added to the frontend rules and applied to every stylesheet in the app.

## Rule

- Layout is flex or grid. `position: relative | absolute | fixed` (with offsets and `z-index`) only where flex and grid cannot do the job.
- Never `height: 0` on a visible element: give it its room and change its neighbours' spacing (e.g. the Expanded panel's close bar).

## Checklist

- [x] Rule in `.claude/rules/frontend.md` (Styling)
- [x] Slot: the view is a grid item of the slot, not absolutely positioned
- [x] ExpandedPanel: the close bar takes its room (no `height: 0`, no `z-index`), the pages' top padding gives it back
- [x] Panel and Sublabel: the dots row and the Sublabel are grid rows around the title, not absolutely positioned
- [x] Screenshots before and after the same (desktop, phone, short phone; Board, hovers, pages, Landing)
- [x] `scripts/verify.sh` GREEN, E2E no worse than before

## Notes

- Slot: `display: grid` with the view as its one item (`minmax(0, 1fr)` column); the view is a grid too, so the Panel, Stripe or Expanded panel fills it. `.slot--panel` and `.slot--stripe` take `min-height: 0` (what the absolute view gave them). Gone: `position: relative` on the slot, `absolute; inset: 0` on the view, the Expanded override, the mobile Stripe's `relative`. Stripes stay sticky (allowed).
- ExpandedPanel: the close bar is in the flow and sticky (allowed), no `height: 0`, no `z-index`; the button's bottom margin is 0.75rem, so the bar is 4rem and the five pages dropped their 4rem top padding (`padding: 0 1.5rem 4rem`).
- Panel: the content is a grid `minmax(0, 1fr) auto minmax(0, 1fr)` (dots row, title, Sublabel); desktop dots are the content's `::before` in row 1, shown with `:has(.panel__title:hover, :focus-visible)`; the phone keeps the title's own `::before` in its first column. The desktop raise (`margin-top: -20%` on the content) is `padding-bottom: 20%` on the Panel. The title is pinned to row 2 and the Sublabel to row 3 (no dots row on the phone). Sublabel: no `absolute`/`translate`.
- Evidence: 32 screenshots before and after pixel-identical (desktop 1280x800, phone 375x667, short phone 375x440: Landing, Board, two hovers, five pages, a Stripe hover, a scrolled long page). View Transition timings unchanged.
- E2E: the two desktop dots steps read the old `left`/`bottom` offsets of the title's `::before`; the helper now finds the row where it lives and measures it from the layout. 56/60, the same 4 pre-existing failures with the same values.


## Summary of Changes

Rule "Layout" added to `.claude/rules/frontend.md`; Slot, ExpandedPanel, Panel, Sublabel, Stripe and the five pages rewritten to flex/grid with no absolute positioning and no `height: 0`. 32 screenshots identical before and after; the E2E dots steps measure the dots where they now live.
