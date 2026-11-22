---
# portfolio-ve7i
title: Lazy-load the ALTCHA widget
status: completed
type: task
priority: normal
created_at: 2026-11-22T06:08:32Z
updated_at: 2026-11-22T06:47:13Z
parent: portfolio-fg5a
---

Review of Unit 4 (2026-11-22): `import "altcha"` in `ContactForm.tsrx` puts about 122 KB of widget and workers into main.js, which every page loads (Landing included). There is no route splitting.

## What to build

- [x] The widget loads when the Contact page opens (dynamic `import()`), not with main.js
- [x] The form stays usable while it loads (Send waits for the widget, offline and E2E unaffected)
- [x] Note for a future CSP: the default bundle needs `worker-src blob:`; `altcha/external` is the strict-CSP build
- [x] scripts/verify.sh GREEN

## Summary of Changes

- `import "altcha"` is gone from `ContactForm.tsrx`. The new `use-human-check-widget` hook (colocated in `contact-form/hooks/`) loads the widget with a dynamic `import()` (`load.ts`) when the form mounts, and `useContactForm` exposes `humanCheckReady`.
- Send is disabled, and `submit` returns early (Enter key included), until the widget is defined. Offline handling and E2E are unchanged: 119 E2E scenarios pass against the real widget.
- main.js 794,614 -> 657,146 bytes; the widget is a separate ~140 KB chunk.
- The CSP note (`worker-src blob:`, `altcha/external` for strict CSP) is the doc comment in `load.ts`.
- Removed the now-stale `altcha` entry from the `import/no-unassigned-import` allow-list in `.oxlintrc.json`, so a static `import "altcha"` is flagged again.
- Tests: hook test, a ContactForm test for Send waiting on the widget; `renderForm` waits for the widget as a Visitor would.
- Left open: a failed chunk load keeps Send disabled with no message. Follow-up bean created for the Owner to decide the wording.
