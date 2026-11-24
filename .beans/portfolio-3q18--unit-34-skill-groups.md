---
# portfolio-3q18
title: 'Unit 3.4: Skill groups'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T16:45:02Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-vg1p
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling, amended 2026-11-18 after the first look, see "Rework"). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The Skills Panel's groups: opening `/skills` shows the "Skills" heading, the header row (room for Expand all on the left and Copy skills on the right), and one accordion of Skill groups after the pen in `support_files/skills/accordion` (CSS Responsive animated Accordion, CodePen), kept inside the page's max-width and standard side margin.

- One accordion wrapper, not separate cards, with a 1rem strip at its bottom (`::after`) in the darkest tone; the top strip (`::before`) was dropped by the Owner after the second look.
- Light end of the palette (second look, 2026-11-18): the content is always on What I do `#d1dcd9` with the About text colour; only a group's or subgroup's name changes background, a step darker (`#b8c9c4`) and another when open (`#9db4ae`), weight 400. A group is a band with the name left and a "+" on the right that turns into "×" when open, a smaller height than the pen's. All groups start closed, so the Visitor sees all eight without scrolling. No border radius anywhere in the accordion.
- A click on a group opens it and every overview in it at once: the subgroups appear, each a name the full width of the group (smaller and shorter than a group's, more room on the left) over its Skills, with their overviews open. The Visitor closes what they do not need.
- Frontend, Backend and AI keep their loose Skills in a new first subgroup (Frontend: "Frameworks & libraries", Backend: "Runtimes & frameworks", AI: "SDKs & agent frameworks"), so no list is left without a bulk control. Groups with no subgroups (Programming languages, Cloud & DevOps, Testing & quality, Engineering practice) are plain lists.
- Content changes with it: Backend order Node.js, Express & Koa, ElysiaJS, NestJS/Hapi/Sails.js, Apollo, FastAPI, Actix, PHP frameworks; Socket.io joins WebSockets as "WebSockets, Socket.io"; "Communication protocols" becomes "gRPC, AMQP and MQTT" ("Application-level knowledge."); Frontend's "Libraries" Skill becomes "Packages".

## Acceptance criteria

- [x] Tests written first and red, then green (TDD)
- [x] A Skill's filled arrow is its only toggle: a button padded to a 24px target or more, with an accessible name; the Skill's name stays plain, selectable text
- [x] An overview opens and closes with a CSS transition (grid rows, fade, `--overview-duration`), none under reduced motion
- [x] All text from the `skills` messages
- [x] `scripts/verify.sh` GREEN
- [x] Default view: every group closed, so only the eight group names show; the Skills, subgroups and overviews inside are out of reach (`inert`) until their group opens
- [x] A group heading is a button with `aria-expanded`: a click opens the group, every overview in it and, by the subgroup rule, every subgroup heading; the next click closes the group and every overview in it. Its state is whether the group shows: opening or closing Skills by hand never opens or closes the group
- [x] Subgroup headings keep a state of their own and the rule: a click flips it and sets all their Skills to match; opening or closing Skills by hand leaves it alone, except all closed → closed, all opened → open; a heading acts on its own subgroup only
- [x] The group and subgroup rules live in pure functions with their own unit tests
- [x] One accordion wrapper with a 1rem strip after its bands (none before): content always on What I do with the About text colour; a group's or subgroup's name a step darker and another when open, weight 400; group names left, the "+" turning to "×" on the right; a subgroup's name full width of its group, shorter than a group's, with more left room; square corners; no separate cards, inside the page's max-width and side margin
- [x] Frontend, Backend and AI hold their Skills in subgroups only; the Backend order, "WebSockets, Socket.io", "gRPC, AMQP and MQTT" and "Packages" are in the content, and the content tests follow
- [x] E2E run for the UI-visible change

## Blocked by

- portfolio-vg1p

## Notes

- From the walking toggle prototype (2026-11-18): an overview opens and closes with a quick, smooth CSS transition (the prototype: grid rows 0fr to 1fr with a fade, about 220ms, the arrow turning; none with reduced motion). No JS animation.

## Decisions

- State: signals module `components/domain/skills/overviews/` (`overviews$`, `toggleSkill`, `toggleHeading`, `reset`); rules in pure functions in `state.ts`. 3.5 adds its set-all function there.
- New message `skills.overviewToggle` ("Overview of {name}", the arrow's accessible name: neutral, so the name and `aria-expanded` do not contradict). The content test lists messages the components read (`COMPONENT_MESSAGES`); add new component-read `skills.*` messages there.
- Header row: rendered empty (`skills-page__header-row`, flex, space-between, `--control-height` tall) for 3.5 and 3.7 to fill.
- Overview: `inert` when closed, grid rows 0fr to 1fr with fade, `--overview-duration` (220ms), none under reduced motion.
- E2E step "the Stripes are rows at least 44px tall, with no Sublabel" looks for paragraphs inside the Stripes, not the whole page (the Skills page has paragraph overviews).

## Rework

First pass, commit 9cf2515: separate Card blocks, group headings opening every overview beneath them (subgroups' included), loose Skills over subgroups. The Owner asked for the accordion look above and settled the behaviour in this bean rather than a new one:

- A group is closed by default and shows a list only when open; a group click still opens every overview, so subgroups expand with it ("click, and all goes visible"; the Visitor hides what they do not need).
- The group heading no longer follows the Skills by the rule: its state is "the group shows", so closing the last overview by hand never folds the group away. Subgroup headings keep the rule.
- A closed page no longer lists every Skill name (the 2026-11-16 line "for scanning and Ctrl+F" is replaced): only the group names show until a group opens.
- First look used the Contact greens; the second look (same day) moved it to the light end of the palette, as above. Contrast: `#25363a` on the names' tones is 5.7:1 or better.
- The first pass's Summary below describes what 9cf2515 built.

## Summary of Changes (first pass, 9cf2515)

The Skills Panel shows the eight Skill group blocks (Card surface) under the header row: group heading, Skills, subgroups. Each Skill has a filled arrow button (24px target, `aria-expanded`) that opens its overview; the name is plain text. Group and subgroup headings are buttons with their own state, applying open all / close all and following the Skills by the rule. Pure rules and signals module under `components/domain/skills/overviews/`; components `skill-group/` (with `skill-subgroup/`), `skill-heading/`, `skill-entry/`. Tests: rules, module, each component, the page and the entry stylesheet. Not covered here: the E2E (3.N).


## Summary of Changes (rework)

The Skills Panel is one accordion (`skills-page__accordion`, a 1rem strip before and after, in the darker Contact green) of eight bands, all closed. A band is `SkillGroup`: name left, a "+" turning to "×" right, the Contact green closed and `--skills-band-open` open, with a panel that opens in CSS and is `inert` while closed. A click opens the group with every overview in it; its subgroups are padded boxes (`--skills-subgroup`, darker `--skills-subgroup-open` when expanded) whose headings keep the rule. The group's state is whether it shows (`groupOpen`, `groupToggled`, `toggleGroup` in `overviews/`); `headingsOf` now gives subgroups only. `skill-heading/` is gone: each of group and subgroup renders its own heading. Content: Frontend, Backend and AI hold their Skills in subgroups (Frameworks & libraries, Runtimes & frameworks, SDKs & agent frameworks), the Backend order, "WebSockets, Socket.io", "gRPC, AMQP and MQTT", "Packages"; `units.md` and bean 3.5 updated. Tests: the rules, the module, group and subgroup components, their stylesheets, the page and the content.

## Summary of Changes (second look)

The accordion in the light end of the palette: `.skill-group` keeps `--panel-what-i-do` and `--text-on-light`, open or closed; only the name buttons change (`--skills-heading`, `--skills-heading-open`, weight 400, with a hover on the darker tone). A subgroup is no longer a box: its name is full width (`--skills-subgroup-indent` on the left, shorter and smaller), its Skills indented the same. No border radius on the wrapper or the names; the strips use the open tone. Tokens `--skills-band-open`, `--skills-subgroup`, `--skills-subgroup-open`, `--skills-gap` replaced by `--skills-heading`, `--skills-heading-open`, `--skills-subgroup-indent`. Stylesheet tests follow.

- Third look (2026-11-18): the wrapper's `::before` strip is removed; only `::after` stays.
