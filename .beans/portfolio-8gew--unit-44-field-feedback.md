---
# portfolio-8gew
title: 'Unit 4.4: Field feedback'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-20T14:08:54Z
parent: portfolio-yxux
blocked_by:
    - portfolio-zmw2
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

The form tells the Visitor what is wrong before and after they press Send. A field is checked when it loses focus and again on submit, never on every keystroke. Errors show as text under their field and are linked to it for screen readers. Submitting with errors moves focus to the first invalid field. A counter appears once a field passes 80% of its limit. A 422 from the backend shows a generic notice.

## Acceptance criteria

- [x] Check on blur and on submit, not per keystroke
- [x] Errors: "Please enter your name.", "Please enter your company.", "At most {max} characters."; aria-invalid and aria-describedby on the field
- [x] Focus moves to the first invalid field on submit
- [x] Counter "n / max" past 80% of the limit
- [x] Trimmed values; whitespace only counts as empty
- [x] 422 shows a generic notice
- [x] Component tests with the Contact client mocked; E2E scenario for field errors
- [x] scripts/verify.sh GREEN

## Blocked by

- portfolio-zmw2 Unit 4.3: Send a Contact request

## Summary of Changes

- Each field is checked when it loses focus and on submit (`fieldError` in `contact-form/utils.ts` reuses the zod field rules, so the form and the request agree); errors show as text under the field, linked with `aria-invalid` and `aria-describedby` (hint and error both). The label no longer wraps the feedback (`htmlFor`/`id`), so the accessible name stays "Name *".
- Submit with errors sends nothing and focuses the first invalid field: refs plus one effect, agreed with the Owner (frontend.md asks before imperative code).
- Counter "n / max" in code points past 80% of the limit; 422 shows the generic notice (`role="alert"`), values kept, cleared when the next try starts.
- Messages: `contact.form.{name,company}.error`, `tooLong`, `counter`, `invalid`.
- Tests: component (blur, submit, focus, counters, 422), `utils.test.ts`, E2E (empty submit, blur-not-keystroke, counter and limit, 422). `scripts/verify.sh` GREEN; E2E 108/108.
