---
# portfolio-trgn
title: 'Unit 4.1: Shared profile links with Xing'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-20T13:40:52Z
parent: portfolio-yxux
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

Prefactor: the profile links leave About's top card for the shared UI components, because Contact becomes their second consumer. They gain the Xing icon (Simple Icons, CC0) and a look prop: plain, as on About today, or round icons with a hover ring for Contact. About is unchanged for the Visitor.

## Acceptance criteria

- [x] Profile links live in the shared UI components and are imported through their index only; About's private copy is gone
- [x] Xing icon added with its licence noted; LinkedIn and GitHub unchanged
- [x] look prop: plain (About) and ring (round icons, ring on hover and focus, palette colours only)
- [x] Each link named by its label for screen readers
- [x] About still shows LinkedIn and GitHub as before: its unit and E2E tests stay green
- [x] Tests for both looks and the Xing link (composition and palette, not pixel values)
- [x] scripts/verify.sh GREEN

## Blocked by

- None (can start immediately)

## Summary of Changes

- `ProfileLinks` moved from `domain/about/about-top-card/profile-links/` to `components/ui/profile-links/` (second consumer: Contact); About imports it through the index, its private copy is gone.
- Xing added (Simple Icons 15.0.0, CC0, noted in `config.ts`); `PROFILE_LOOKS` (`plain`, `ring`) and the `look` prop (default plain). Ring look: round icons, ring in `--panel-contact` on hover and focus-visible.
- Tests: `ui/profile-links/_specs_/ProfileLinks.test.ts` (order, labels, icons, both looks) and `styles.test.ts`; About's stylesheet test no longer lists the moved sheet.
- `scripts/verify.sh` GREEN; E2E 101/101 (one Skills accordion scenario failed once in an earlier run and passed on rerun and on a clean tree, unrelated).
