---
# portfolio-b327
title: 'Project foundation: objectives, design, domain model, roadmap'
status: completed
type: task
priority: normal
created_at: 2026-11-06T20:26:07Z
updated_at: 2026-11-06T20:27:36Z
---

Persist the objectives, interaction design, domain vocabulary and unit roadmap settled in the grill-with-docs session of 2026-11-06, so every later unit starts from them. Docs and tracker only, no code.

Plan: ~/.claude/plans/temporal-bubbling-cat.md

## Checklist

- [x] CONTEXT.md glossary
- [x] docs_src/specs/units.md: objectives, protocol tweak, units 1-8
- [x] ADRs 0001 (content as frontend JSON) and 0002 (Firestore)
- [x] AGENTS.md: Stage 0 covers content JSON contracts
- [x] README: drop logo/ row; commit moved design references
- [x] Beans: Launch v1 milestone + 8 epics with real dependencies

## Summary of Changes

- CONTEXT.md: glossary (people, screens, content, contact, chat terms).
- docs_src/specs/units.md: objectives, Stage 0 covers content JSON contracts, Units 1-8 with design, stages, DoD and open decisions.
- docs/adr/0001 (Panel content as static frontend JSON via react-intl) and 0002 (Firestore for app data).
- AGENTS.md: Stage 0 / Stage Final wording matches the content-JSON units.
- README: logo/ row removed; logo/ playground and Loop Lab files moved to git-ignored support_files/.
- Beans: milestone Launch v1 (portfolio-4ur0) with epics Board, About, Skills, Contact (todo) and What I do, Interview, Chat, Deploy (draft); About/Skills/Contact/What I do blocked by Board, Chat by Interview, Deploy by Contact + Chat.

Chat and Interview behaviour deliberately deferred to their units. No code changed.
