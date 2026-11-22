---
# portfolio-gom6
title: 'Contact: tell the Visitor when the ALTCHA widget cannot load'
status: in-progress
type: task
priority: normal
created_at: 2026-11-22T06:47:09Z
updated_at: 2026-11-22T06:51:57Z
parent: portfolio-fg5a
---

Found in the review of portfolio-ve7i (2026-11-22). `useHumanCheckWidget` swallows a failed chunk load: Send stays disabled with no message and no retry (a failed `import()` is cached by the browser, so a retry needs a page reload).

## What to build

- [ ] The Owner decides what the Visitor sees when the widget chunk fails to load (the existing `failed` notice, a new message, a reload hint)
- [ ] Test: a rejected load shows it
- [x] `useContactForm` returns one derived `canSend` (`status === editing && !retryLocked && valid && humanCheckReady`); `submit` guards on it and the Send button is `disabled={!canSend || offline}` (review of portfolio-ve7i)
- [ ] scripts/verify.sh GREEN
