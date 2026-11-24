---
# portfolio-8a73
title: 'Unit 3.7: Copy skills'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T20:00:07Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-3q18
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Copy skills: a button in the header row that copies all Skills to the clipboard as plain, structured text, whatever is open on screen, and shows "Copied" for a moment.

Format, two spaces per level: group, subgroup, Skill, overview, and a "Certified:" line per Certificate, with its verification URL where it has one (none for TestDome or CSS Wizard):

```
Programming languages
  TypeScript
    <overview>
    Certified: TypeScript, TestDome, Jul 2020, top 10%
Backend
  APIs & services
    RESTful APIs
      <overview>
```

## Acceptance criteria

- [x] Tests written first and red, then green (TDD)
- [x] The text builder is a pure function with its own unit tests (levels, subgroups, Certificates, CSS Wizard without a URL)
- [x] The clipboard write (`navigator.clipboard.writeText`, imperative, agreed with the Owner) lives in a global, domain-agnostic hook in `hooks/`, like `useEscapeKey`
- [x] "Copied" feedback for a moment, announced to screen readers
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3q18

## Notes

- From the walking toggle prototype (2026-11-18): the button is `--control-height` tall (35px, the same as Expand all) with a 20px border radius.

- Every text on the site comes from the messages: "Copy skills" and "Copied" are `skills` messages.


## Summary of Changes

- `components/domain/skills/copy-skills/`: `CopySkills` button (header row, right of Expand all, `--control-height` tall, 20px radius) with an always-present `<output>` status region that shows "Copied" for `COPIED_MS` (1.5s). `utils.ts` holds the pure `buildSkillsText(groups, format)`: group, subgroup, Skill, overview and a `Certified:` line per Certificate (title, issuer, date, ranking, verification URL when it has one), two spaces a level, a group's own Skills before its subgroups.
- `hooks/use-clipboard/`: global, domain-agnostic `useClipboard(resetMs)` returning `{ copied, copy }`. `navigator.clipboard.writeText` is the one imperative call (agreed with the Owner). A refusal or a missing clipboard leaves `copied` false; a repeat copy restarts the time; the timer is cleared on unmount.
- `components/domain/skills/format-certificate-date/`: the "Jul 2020" formatting moved out of `CertificateView`, now shared with the text builder (second consumer).
- Messages `skills.copySkills`, `skills.copied` and `skills.copyCertified` (the word "Certified" in the copied text, so it can be translated).
- E2E: new scenario in `skills.feature` (clipboard permission granted, "Copied" announced, clipboard text starts with the Skills text). The offline scenario "Other Panels have no offline note" moved from `/skills` to `/about`: Skills now has its own status region, which that scenario's "no status region" step would count.

## Notes

- The verification URL is appended as the last comma-separated part of the Certified line; the bean left its position open.
- A second copy while "Copied" is still showing restarts the timer but leaves the status text unchanged, so a screen reader does not announce it again.
