---
# portfolio-ve7i
title: Lazy-load the ALTCHA widget
status: todo
type: task
created_at: 2026-11-22T06:08:32Z
updated_at: 2026-11-22T06:08:32Z
parent: portfolio-fg5a
---

Review of Unit 4 (2026-11-22): `import "altcha"` in `ContactForm.tsrx` puts about 122 KB of widget and workers into main.js, which every page loads (Landing included). There is no route splitting.

## What to build

- [ ] The widget loads when the Contact page opens (dynamic `import()`), not with main.js
- [ ] The form stays usable while it loads (Send waits for the widget, offline and E2E unaffected)
- [ ] Note for a future CSP: the default bundle needs `worker-src blob:`; `altcha/external` is the strict-CSP build
- [ ] scripts/verify.sh GREEN
