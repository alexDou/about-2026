---
# portfolio-gom6
title: 'Contact: tell the Visitor when the ALTCHA widget cannot load'
status: completed
type: task
priority: normal
created_at: 2026-11-22T06:47:09Z
updated_at: 2026-11-22T07:03:37Z
parent: portfolio-fg5a
---

Found in the review of portfolio-ve7i (2026-11-22). `useHumanCheckWidget` swallows a failed chunk load: Send stays disabled with no message and no retry (a failed `import()` is cached by the browser, so a retry needs a page reload).

## What to build

- [x] The Owner decides what the Visitor sees when the widget chunk fails to load: "The security check failed to load. Try reloading the page, or feel free to use the social links to contact me." (a new alert in the form, the error logged with `console.error`)
- [x] Test: a rejected load shows it
- [x] `useContactForm` returns one derived `canSend` (`status === editing && !retryLocked && valid && humanCheckReady`); `submit` guards on it and the Send button is `disabled={!canSend || offline}` (review of portfolio-ve7i)
- [x] scripts/verify.sh GREEN

## Summary of Changes

- `useContactForm` returns one derived `canSend` (editing, not retry-locked, valid, widget loaded); `submit` guards on it and the Send button is `disabled={!canSend || offline}`. `valid` and `humanCheckReady` are no longer exposed.
- `useHumanCheckWidget` returns a `WidgetLoad` (`loading`, `ready`, `failed`; `WIDGET_LOAD` in the form's `config.ts`) and logs a failed load with `console.error`.
- A failed load shows the Owner's message as an alert in the form (`contact.form.widgetFailed`): "The security check failed to load. Try reloading the page, or feel free to use the social links to contact me." Send stays disabled; the social links are in the panel beside the form.
- Tests: hook (failed state, error logged), form (alert, Send disabled, nothing shown while loading or once loaded). Spies are restored in `afterEach`.
- E2E: 119 scenarios pass. No scenario blocks the chunk, so the failure is covered by unit tests only.
