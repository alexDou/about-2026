---
# portfolio-8a73
title: 'Unit 3.7: Copy skills'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-16T09:50:04Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-3q18
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Copy skills: a button in the header row that copies all Skills to the clipboard as plain, structured text, whatever is open on screen, and shows "Copied" for a moment.

Format, two spaces per level: group, subgroup, Skill, overview, and a "Certified:" line per Certificate with its verification URL:

```
Programming languages
  TypeScript
    <overview>
    Certified: TypeScript, TestDome, Jul 2020, top 10%, https://www.testdome.com/certificates/...
Backend
  APIs & services
    REST
      <overview>
```

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] The text builder is a pure function with its own unit tests (levels, subgroups, Certificates, CSS Wizard without a URL)
- [ ] The clipboard write (`navigator.clipboard.writeText`, imperative, agreed with the Owner) lives in a global, domain-agnostic hook in `hooks/`, like `useEscapeKey`
- [ ] "Copied" feedback for a moment, announced to screen readers
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3q18
