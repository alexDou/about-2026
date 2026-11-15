---
paths: ["frontend/e2e/**", "frontend/**/_specs_/**", "frontend/**/*.test.{ts,tsx}", "backend/tests/**"]
---
# Tests: check structure, not pixel values

Style details change often (spacing, sizes, radii). A test that pins them breaks on every design tweak and protects nothing. Test **what the element is and does**, not its exact numbers.

## What a test verifies

- **Presence and composition**: the element exists; the parts it is made of exist, in the right order (badges, then photo, then Bio).
- **Functionality**: clicks, navigation, downloads, keyboard, state, content (text from messages).
- **Style schema, the stable base**: the palette (colours and text colours of Panels, cards, badges), the font family, `text-transform`, the layout mode (`display: flex` or `grid`, direction, wrap), the positioning mode (`sticky`, `absolute`), and that overflow is not clipped where content must show.
- **Presence of spacing, not its value**: the element has padding, margin or a gap (`> 0`); the element is a flex or grid container *and* has a gap. Not `padding: 0 10px 12px`, not `gap: 10px`.
- **Relations that hold at any value**: A is above B, A is inside B, A does not overlap B, A is centred in B, A is taller than its text line, A fits inside its Panel. Compare boxes with each other, not with a number.
- **Floors and ceilings that protect users** may stay numeric: tap targets of at least 24 or 44px (WCAG), a minimum height that keeps text readable, contrast. Say why in the scenario or the test.

## What a test does not verify

- The exact value of a padding, margin, gap, border thickness, radius, font size or line height, in px, rem or %.
- Layout arithmetic that rebuilds the CSS in the test (`height === line + 1.5 * rem`, `inset === 2%`, `lift === width / 10`). If the test has to know the stylesheet's numbers, it is a copy of it.
- Design tokens by value (`--element-distance-standard` is `1.8rem`). A test that must read a token resolves it from the page instead of hard-coding it.
- Pixel-exact positions. When a position is compared, allow the rounding of the browser (`toBeCloseTo(x, 0)`), and prefer relations to numbers.

## How

- Read the computed style and assert the *kind*: `display` is `flex`, `gap` parses to `> 0`, `paddingTop` parses to `> 0`, `position` is `sticky`.
- A value that is derived from the page itself (a border thickness for "the border runs through the middle", the root font size for a rem floor) is read at runtime, not typed into the test.
- Scenario titles and step texts name the property, not the number: "the Stripes are taller than their title line", not "title plus 1.5rem".
- Unit tests of stylesheets (`_specs_/`, CSS read as text) follow the same rule: assert the declaration is there (`display: flex`, a `gap`), not what it is set to.
- When a design change breaks a test only because a number moved, the test was wrong: loosen it to the rule above in the same commit.

## Existing tests

Older tests still pin some exact values (the 16px Panel title, the 2%, 4% and 8px of the dots, `--label-gap-*` tokens, min heights). They stay until the owner decides otherwise; do not copy their style into new tests, and loosen them when you touch them.
