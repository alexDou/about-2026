---
name: pr-toolkit
description: Pull request lifecycle - pre-flight gate, contract check, PR body from the bean, opening the PR with gh, and reviewing incoming PRs. Use when the user wants to open, describe or review a pull request.
argument-hint: create | review <PR number>
---

# Pull Request Toolkit

Use `gh` for all GitHub interactions. Commits and PRs are authored by the human only: no `Co-Authored-By`, no "Generated with …" lines, no AI or tool mention anywhere.

## Creating a PR

1. **Branch:** never from `main`. Branch names are `type/slug`, e.g. `feat/projects-section`.
2. **Beans:** every bean in the branch is `completed` with a `## Summary of Changes`, and its file is committed with the code.
3. **Pre-flight gate** (stop at the first failure):
   - `git status --porcelain` is empty.
   - `scripts/verify.sh` prints `verify: GREEN`.
   - UI-visible change → `pnpm --dir frontend e2e` passes.
   - **Contract check:** if a route or Pydantic model in `backend/app/` changed, the matching types in `frontend/src/services/` changed in the same branch, and vice versa. Removing or renaming a field the frontend reads is breaking.
4. `git push -u origin HEAD`.
5. `gh pr create --title "<type>(<scope>): <summary>" --body "<body>"`, body built from the beans (template below).
6. Return the PR URL.

### PR body

```markdown
## Summary
- What changed and why, one bullet per point. Beans: <bean-id>, <bean-id>.

## Architecture
- **Frontend:** new or moved chunks, code promoted to / demoted from shared levels, animation or performance impact.
- **Backend / API:** endpoints, models, contract changes.

## Breaking changes
- [ ] Yes: (API contract or a chunk's public `index.ts` changed)
- [ ] No

## Validation
- [x] `scripts/verify.sh`: GREEN
- [x] E2E: `pnpm --dir frontend e2e`
- [x] Checked in the browser (`pnpm --dir frontend dev`)
```

## Reviewing a PR

1. `gh pr diff <n>` and `gh pr view <n> --comments`. Read the beans named in the PR.
2. Run the `code-reviewer` subagent on the diff, or review against the same criteria:
   - **Blast radius:** every changed chunk's `index.ts` exports and their importers.
   - **Contract parity:** backend models and frontend types still match field for field.
   - **Structure:** new code lives in the chunk that owns it; nothing deep-imports another chunk's internals.
   - **Hot paths:** no per-frame allocations, leaked listeners or timers in animation code.
3. Report by severity: [P0] Blocker, [P1] Performance, [P2] Suggestion, [Nit].
4. Post only when asked: `gh pr review <n> --comment -b "<review>"`.
