---
# portfolio-hj19
title: Opengrep security scanner in the verify gate
status: completed
type: task
priority: normal
created_at: 2026-11-15T16:05:01Z
updated_at: 2026-11-15T16:19:18Z
parent: portfolio-fg5a
blocking:
    - portfolio-yxux
    - portfolio-h69y
---

Turn on a static security scanner in `scripts/verify.sh`: **Opengrep** (free, LGPL-2.1) with project rules, so attack vectors in Contact (Unit 4) and Chat (Unit 7) are caught as their code lands, not after. Semgrep is not used in this project.

## Context

- `scripts/verify.sh` had a dormant `lane_semgrep` (no rules, no scanner installed), so it never ran.
- The current attack surface is near zero: `GET /api/health` and a static SPA. It grows with Unit 4 (public `POST /api/contact`, personal data, Firestore, email, rate limit), Unit 7 (`/api/chat`, Agent replies rendered in the browser) and Unit 8 (secrets, deploy).
- Reference setup: `ros2-robo-ctrl--simulation` (project-specific trust-boundary rules only).

## Opengrep (researched 2026-11-15)

- Fork of Semgrep CE at v1.100.0, LGPL-2.1. Active: v2.0.0 on 2026-11-13, ~3.3k stars. Same rule syntax.
- Free cross-function taint within one file (`taint_intrafile`). v2.0.0 adds interfile taint (`--enable-interfile`) and ships self-contained, Cosign-signed binaries (no Python).
- Bring your own rules: there is no maintained ruleset (`opengrep/opengrep-rules` is archived). The gate runs only our rules.
- No telemetry flag exists; nothing to turn off.
- Sources: https://www.opengrep.dev/, https://github.com/opengrep/opengrep/releases

## Decisions

- Opengrep v2.0.0, installed globally by the official script (`~/.opengrep/cli/v2.0.0`, symlink `~/.local/bin/opengrep`). The binary's sha256 matched the GitHub release digest (cosign is not installed here). Pin: `OPENGREP_VERSION` in `scripts/verify.sh`; any other version fails the lane.
- Rules in `.opengrep/rules/`, one file per area with a same-named fixture file.
- `.tsrx`: Opengrep has no parser for it. `frontend/tools/opengrep-tsrx.ts` compiles each file with Octane's `compileToVolarMappings` (what tsrs type-checks), scans the TSX in a temp folder and maps findings back to `.tsrx` lines. TypeScript rules cover `.ts` and `.tsrx` alike.
- Generic Python checks are ruff `S` (bandit), not Opengrep rules.

## Checklist

- [x] Pick the scanner and pin a version (decision recorded here)
- [x] Install Opengrep globally; the gate fails when it is missing or another version
- [x] Make `.tsrx` scannable (compile to TSX, map findings back), with unit tests
- [x] Frontend rules: raw HTML sinks (`dangerouslySetInnerHTML`, `trustHTML`, `innerHTML`/`outerHTML`/`srcdoc`, `insertAdjacentHTML`, `createContextualFragment`, `document.write`), code from strings (`eval`, `new Function`, string timers), `javascript:` URLs
- [x] Backend rules: routes only on the `/api` router; no exception text in responses; no wildcard CORS; request data in outbound URLs (SSRF taint)
- [x] Rule tests (`# ruleid:` / `# ok:` fixtures, `opengrep test`) in the gate
- [x] Enable ruff `S` (bandit); `S101` allowed in tests
- [x] `opengrep` lane in `scripts/verify.sh`, parallel with frontend/backend; AGENTS.md, CLAUDE.md, `/verify` skill and `.claude/rules/opengrep.md` updated
- [x] `scripts/verify.sh` GREEN

## Summary of Changes

- Opengrep v2.0.0 installed globally; `scripts/verify.sh` runs an `opengrep` lane (version check, `opengrep test`, repo scan, `.tsrx` scan) in parallel with frontend and backend. The dormant semgrep lane is gone.
- `.opengrep/rules/frontend.yml` (raw HTML sinks, code from strings, `javascript:` URLs) and `backend.yml` (routes off the `/api` router, exception text in responses, wildcard CORS, SSRF taint), each with a fixture file: 7/7 rule tests pass, and probe files confirmed findings on real `.ts`, `.py` and `.tsrx` paths. The current code has no findings.
- `frontend/tools/opengrep-tsrx.ts` + `pnpm scan:tsrx`: compiles `.tsrx` with Octane, scans the TSX, maps findings to `.tsrx` lines; unit tests in `tools/_specs_/opengrep-tsrx.test.ts`.
- ruff `S` enabled in `backend/pyproject.toml` (`S101` allowed in tests).
- Docs: `.claude/rules/opengrep.md` (new), AGENTS.md gate line, CLAUDE.md rules list, `/verify` skill.
