---
# portfolio-trgn
title: 'Unit 4.1: Shared profile links with Xing'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-19T13:42:25Z
parent: portfolio-yxux
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

Prefactor: the profile links leave About's top card for the shared UI components, because Contact becomes their second consumer. They gain the Xing icon (Simple Icons, CC0) and a look prop: plain, as on About today, or round icons with a hover ring for Contact. About is unchanged for the Visitor.

## Acceptance criteria

- [ ] Profile links live in the shared UI components and are imported through their index only; About's private copy is gone
- [ ] Xing icon added with its licence noted; LinkedIn and GitHub unchanged
- [ ] look prop: plain (About) and ring (round icons, ring on hover and focus, palette colours only)
- [ ] Each link named by its label for screen readers
- [ ] About still shows LinkedIn and GitHub as before: its unit and E2E tests stay green
- [ ] Tests for both looks and the Xing link (composition and palette, not pixel values)
- [ ] scripts/verify.sh GREEN

## Blocked by

- None (can start immediately)
