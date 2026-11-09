---
# portfolio-m9gt
title: 'Unit 1: Board'
status: todo
type: epic
priority: normal
created_at: 2026-11-06T20:27:21Z
updated_at: 2026-11-09T10:33:06Z
parent: portfolio-4ur0
---

Landing → Board reveal and five Panels (About, What I do, Skills, Chat with me, Contact) that expand into an Expanded panel with Stripes. The close button and Escape restore the default Board. Real URLs, a mobile layout of its own, user-triggered transitions only, FormatJS messages (ADR 0003), a shared backend health check with offline notes in Chat with me and Contact, `noindex` + `robots.txt`.

Spec, fully decided: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`.

## Stages

Child beans, in dependency order (each lists its blockers):

- portfolio-lz1t Unit 1.0: Board and message contracts
- portfolio-dbxq Unit 1.1: Site shell
- portfolio-u8a6 Unit 1.2: FormatJS on the Landing
- portfolio-3n34 Unit 1.3: Landing ↔ Board routing
- portfolio-uqsd Unit 1.4: Default Board look
- portfolio-4zpt Unit 1.5: Open and close a Panel
- portfolio-1syg Unit 1.6: Expand and collapse sequences
- portfolio-t6ex Unit 1.7: Board entrance
- portfolio-402i Unit 1.8: Backend status in Chat with me and Contact
- portfolio-3sox Unit 1.N: Board E2E

The epic is done when every child bean is completed.
