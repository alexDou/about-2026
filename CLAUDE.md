# CLAUDE.md

**IMPORTANT**: before you do anything else, run the `beans prime` command and heed its output.

@AGENTS.md

## Work comes from beans

- Every task is a bean. Its body is the spec: what to do, the acceptance criteria and the `- [ ]` checklist. Read it with `beans show --json <id>` before touching code, and do what it says, nothing more.
- The user names a bean → work on that bean. The user asks for work that has no bean → search (`beans list --json -S "<keywords>"`), and if nothing matches, report the case to a user.
- No todo lists or TodoWrite. Progress lives in the bean: set `in-progress` when you start, tick checklist items as they're done, append findings and decisions to the body.
- Scope that grows beyond the bean becomes a new bean (`--blocked-by` or `--parent` as fits), not extra work in this one.
- Done = checklist fully ticked, `scripts/verify.sh` GREEN, `## Summary of Changes` appended, status `completed`, bean file committed with the code.
- Gotcha in `beans prime`'s examples: `--body-append "## Notes\n\n..."` stores a literal `\n`. Pipe multi-line text through stdin instead: `printf '## Notes\n\n...\n' | beans update <id> --body-append -`.

## End-of-task gate

- Finish every file-changing task with `/verify` (runs `scripts/verify.sh`). Don't say "done", complete a bean or commit until it prints `verify: GREEN`. A Stop hook blocks ending a turn while the working tree differs from the last green run.
- Edited files are auto-formatted by a PostToolUse hook: oxfmt under `frontend/` (incl. `.tsrx`), `ruff format` under `backend/`.

## Commands that aren't obvious

- pnpm only, never npm/npx: `pnpm --dir frontend <script>`, `pnpm dlx`, `pnpm view`. Backend via `uv run --directory backend ...`.
- Frontend E2E is Cucumber + Playwright, not the Playwright runner: `pnpm --dir frontend e2e` (builds first). It is not part of `scripts/verify.sh`; run it for UI-visible changes.
- Type checking is tsrs with mandatory `--runExternalCode` (`pnpm --dir frontend typecheck`): `.tsrx` files reach it through `@tsrx/content-mapper` (tsconfig `contentMappers`). There is no `tsc` in this project.

## Rules (`.claude/rules/`)

- `structure.md` is always loaded: where files go, the colocation rule.
- `frontend.md`, `backend.md` and `api-contract.md` load automatically when you read or edit a file under their `paths`.

## Workflow

- Commits: `type(scope): summary (portfolio-xxxx)`, using the bean ID. Scopes: frontend, backend, logo, docs, agents. Tracker-only commits use `chore(tracker): <id> completed`.
- Branches: `type/slug` off `main`, e.g. `feat/projects-section`.
- Features: the `feature-dev` skill turns a bean into a design plus staged child beans. Review with the `code-reviewer` subagent; PRs with the `pr-toolkit` skill.
- Project skills live in `.claude/skills/`. Add new ones there.
