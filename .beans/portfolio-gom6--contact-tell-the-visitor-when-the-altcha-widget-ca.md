---
# portfolio-gom6
title: 'Contact: tell the Visitor when the ALTCHA widget cannot load'
status: todo
type: task
created_at: 2026-11-22T06:47:09Z
updated_at: 2026-11-22T06:47:09Z
parent: portfolio-fg5a
---

Found in the review of portfolio-ve7i (2026-11-22). `useHumanCheckWidget` swallows a failed chunk load: Send stays disabled with no message and no retry (a failed `import()` is cached by the browser, so a retry needs a page reload).

## What to build

- [ ] The Owner decides what the Visitor sees when the widget chunk fails to load (the existing `failed` notice, a new message, a reload hint)
- [ ] Test: a rejected load shows it
- [ ] scripts/verify.sh GREEN
