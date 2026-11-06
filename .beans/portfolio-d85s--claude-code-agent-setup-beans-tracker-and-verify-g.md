---
# portfolio-d85s
title: Claude Code agent setup, beans tracker and verify gate
status: completed
type: task
priority: normal
created_at: 2026-11-06T16:00:36Z
updated_at: 2026-11-06T16:00:36Z
---

Port the agent workflow (rules, skills, subagent, hooks, end-of-task gate) into this project as a Claude-only setup, adapted to Octane/FastAPI, with beans as the single source of tasks.

## Summary of Changes

- `.claude/rules/` (structure always loaded; frontend, backend, api-contract scoped by `paths`), `.claude/skills/`, `code-reviewer` subagent, format-on-edit and verify-gate hooks.
- `scripts/verify.sh`: frontend (oxfmt, oxlint, tsrs, vitest) and backend (ruff, pytest) in parallel; semgrep when `.semgrep/` has rules.
- beans 0.4.2 initialised (`.beans.yml`, prefix `portfolio-`); CLAUDE.md makes every task a bean and runs `beans prime` first.
- AGENTS.md, docs/agents/ and docs_src/specs/units.md describe the contract-first, bean-driven workflow.
