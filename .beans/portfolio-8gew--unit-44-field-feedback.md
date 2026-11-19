---
# portfolio-8gew
title: 'Unit 4.4: Field feedback'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-19T13:42:25Z
parent: portfolio-yxux
blocked_by:
    - portfolio-zmw2
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

The form tells the Visitor what is wrong before and after they press Send. A field is checked when it loses focus and again on submit, never on every keystroke. Errors show as text under their field and are linked to it for screen readers. Submitting with errors moves focus to the first invalid field. A counter appears once a field passes 80% of its limit. A 422 from the backend shows a generic notice.

## Acceptance criteria

- [ ] Check on blur and on submit, not per keystroke
- [ ] Errors: "Please enter your name.", "Please enter your company.", "At most {max} characters."; aria-invalid and aria-describedby on the field
- [ ] Focus moves to the first invalid field on submit
- [ ] Counter "n / max" past 80% of the limit
- [ ] Trimmed values; whitespace only counts as empty
- [ ] 422 shows a generic notice
- [ ] Component tests with the Contact client mocked; E2E scenario for field errors
- [ ] scripts/verify.sh GREEN

## Blocked by

- portfolio-zmw2 Unit 4.3: Send a Contact request
