---
# portfolio-c1qs
title: Remove the wordmark from the logo
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-10T10:24:51Z
updated_at: 2026-11-10T10:25:09Z
parent: portfolio-m9gt
---

## Parent

portfolio-m9gt (Unit 1: Board). Raised by the Owner while reviewing portfolio-uqsd.

## What to build

The logo on the Landing no longer shows the "Dooooo.." wordmark inside the O. Only the woven weave remains.

## Acceptance criteria

- [x] Test first and red: the logo has no wordmark (`<image>`) inside it; then green
- [x] `dooooo.svg`, its import, `WORDMARK_BOX` and the empty `media/` folder are removed
- [x] `scripts/verify.sh` GREEN

## Summary of Changes

The logo draws only the weave. Removed the `<image>` of the wordmark, `WORDMARK_BOX`, `media/dooooo.svg` and its folder. The test now asserts the logo has no image inside.
