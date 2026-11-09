---
name: verify
description: Run the full end-of-task quality gate (frontend oxfmt/oxlint/import cycles/tsrs/vitest, backend ruff/pytest, semgrep when rules exist) and fix failures until green. Use at the end of every task that changed files, before reporting done or committing.
---

# Verify

Run the gate:

```bash
scripts/verify.sh
```

- Lanes: `frontend` and `backend` **in parallel**, then `semgrep` (only when `.semgrep/` holds rules). Takes a few seconds.
- Every step in a lane runs even if an earlier one fails; the summary lists each `✖` step. Full logs: `.verify/<lane>.log`.
- Green run writes `.verify/stamp` (working-tree fingerprint). The Claude Stop hook compares against it — any later edit makes the tree "unverified" again.
- E2E is not in the gate. For UI-visible changes also run `pnpm --dir frontend e2e` and report its result separately.

## Fix loop

1. Read only the failing lane's log (`.verify/<lane>.log`), not all of them.
2. Formatting failures → apply the formatter, don't hand-edit:
   - `pnpm --dir frontend fmt`
   - `uv run --directory backend ruff format . && uv run --directory backend ruff check --fix .`
3. Test/lint/typecheck failures → fix the root cause. Never weaken a test, add a blanket `# noqa`/`oxlint-disable`/`@ts-expect-error`, or loosen a linter config to get green without the user's OK.
4. Re-run `scripts/verify.sh` until `verify: GREEN`.

## Reporting

- Report the final summary verbatim (PASS/FAIL per lane).
- If a failure is pre-existing and unrelated to this task (the failing file/test is not in `git diff`), say so explicitly and name it — never claim GREEN while any lane is FAIL.
