---
# portfolio-653r
title: Contact page look after the pen, one Icon component
status: completed
type: task
priority: normal
created_at: 2026-11-21T13:12:02Z
updated_at: 2026-11-21T13:33:38Z
parent: portfolio-vqi0
---

Raised by the Owner on 2026-11-21 while on Unit 4. The Contact form follows the Responsive Contact Form pen (`support_files/contact/`) more closely, and one Icon component draws every icon on the site. Decisions come from the Owner's answers in the session; the Contact layout decision in `docs_src/specs/units.md` (Unit 4, "Layout") is amended with it.

## Kept as they are (Owner's working-tree changes)

- The `CLAUDE.md` rule, `components/ui/input-field/` (InputField stays in the shared UI), the `global.css` and `tokens.css` font-size tokens. `styles/_specs_/tokens.test.ts` follows the tokens.

## What to build

- **Icon** (`components/ui/icon/`): draws an SVG file on a 24×24 grid through `<svg><use href="file.svg#icon"/>`, as the Portrait does with its brush, so it takes `currentColor` from CSS. Props: `media` (the file's URL), `size`, `tone`, `label` (an accessible name; hidden from assistive technology without one). Look and feel by props, each a named constant, each applied as a class.
- The icon files sit in a `media/` folder next to what owns them: the Contact page's globe and paper plane in `pages/contact/media/`; the profile icons (LinkedIn, Xing, GitHub), used by About and Contact, in `ui/profile-links/media/` (a second consumer moves them up). Every icon on the site goes through Icon: the profile links, the globe, the send button. Not icons, so left as they are: the animated logo, the badge frames, the walking toggle's figure and the Portrait's brush.
- **Contact page, after the pen**:
  - Title "Contact me" in capitals (its own message; Explore's tile keeps "Contact"), with the subtitle "Let me know you're interested".
  - No band: the form and the info block sit on the Panel's `#5c8b70`, centred on the page with a limited width, text in the light `--panel-what-i-do`.
  - Desktop: the form on the left; the info block on the right, centred vertically against the inputs: 1 location, 2 notice, 3 links, 4 "* required". Phone: 1 location, 2 form with its submit button, 3 notice, 4 required, 5 links.
  - A field's label stands beside its input from 568px up and above it below 568px. Inputs and the Send button follow the pen's sizes (the inputs reasonably wider); no textarea. The button is under the last input at the inputs' width, with the paper-plane icon; labels "Send" and "Sending…".
  - InputField takes its look by props, as a reusable UI component.
  - The profile links keep the pen's hover: the circle fills and a ring springs out.

## Checklist

- [x] Icon component, tests first (props, `use` href, hidden or labelled)
- [x] Icon files in `media/`; ProfileLinks, the globe and the send button use Icon; About unchanged to the eye
- [x] InputField look by props; label beside the input from 568px, above below it
- [x] Contact panel layout: no band, order and centring on desktop and phone, "* required" in the info block
- [x] Title "Contact me" in capitals and the subtitle
- [x] Send button as in the pen, with the icon
- [x] Ring hover as in the pen
- [x] `units.md` Layout decision amended; unit, component and E2E tests follow
- [x] `tokens.test.ts` follows the font-size tokens
- [x] `scripts/verify.sh` GREEN and `pnpm --dir frontend e2e` green; committed, merged into `docs/unit-4-contact-design`

## Summary of Changes

- **Icon** (`components/ui/icon/`): draws an SVG file on a 24×24 grid through `<use href="file.svg#icon">`, so it takes `currentColor`. Props `media`, `size`, `tone`, `label`, each a named constant. Every icon on the site goes through it: the profile links (About and Contact), the globe and the paper plane. Left as they were, not being icons: the animated logo, the badge frames, the walking toggle figure and the Portrait brush.
- **Media**: the profile icons (LinkedIn, Xing, GitHub) sit in `ui/profile-links/media/`, since About and Contact both use them (a second consumer moves them up); the globe and the paper plane in `pages/contact/media/`, passed down as `media` props.
- **InputField** (`ui/input-field/`, class names now `input-field__*`): `layout` (stacked, inline) and `tone` (light, dark) props. Inline puts the label beside the input from 568px and above it below.
- **Contact page**: heading "Contact me" in capitals with the subtitle "Let me know you're interested" (own messages; Explore's tile and the document title keep "Contact"); no band, light text on the Panel colour; the form on the left with its button under the inputs; the info block on the right centred against the fields (1 location, 2 notice, 3 links, 4 "* required"), the phone order being location, form with button, notice, required, links. The "* required" line moved from the form to the panel (`contact.required`). The profile links keep the pen's hover: the circle swaps its colours and a ring springs out.
- **Findings**: a CSS Module keeps its own custom properties to itself, so the label column and gap that the button lines up by are global tokens (`--input-field-label-size`, `--input-field-gap`). Light text on `#5c8b70` measures 2.78:1 (the Owner's decision, recorded in `units.md`); inputs and button are light on dark, 8.97:1.
- **Docs**: the Unit 4 section of `units.md` carries the spec (problem, solution, user stories, out of scope) and the amended Layout; `portfolio-yxux` lists its stages.
- **Tests**: unit tests for Icon, InputField, ProfileLinks, the panel, form and page; `tokens.test.ts` follows the font-size tokens; E2E covers the heading, the colours, both layouts, label placement and the button.
