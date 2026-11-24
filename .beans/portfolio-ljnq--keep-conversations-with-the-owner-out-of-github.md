---
# portfolio-ljnq
title: Keep conversations with the Owner out of GitHub
status: completed
type: task
priority: normal
created_at: 2026-11-24T13:31:25Z
updated_at: 2026-11-24T13:47:21Z
---

Conversations with the Owner (questionnaires, grilling rounds, answers, quoted words) stay local. The repo and GitHub carry results only. Remove the conversations from the current tree and from the whole git history on GitHub, keep them reachable locally, and stop them from being pushed again.

- [ ] Backup: a git bundle of the full history, and a copy of the conversation files, both in git-ignored support_files/
- [ ] docs_src/ is git-ignored except docs_src/specs/: questionnaires and notes stay on disk, untracked
- [ ] Current tree: spec, beans, CLAUDE.md and code comments carry results only (no quotes, no round logs, no pointers to the notes)
- [ ] History rewritten: the notes folders, the Role-texts handoff bean and quoted Owner words removed from every commit
- [x] Force-pushed to the six remote branches; a fresh clone of GitHub holds none of it
- [x] GitHub's cached old commits (public repo, still open by their IDs): left as they are by the Owner's choice; a move to a new repo is considered later. The list of affected commits is in support_files/history-backup/affected-commits.txt
- [x] Rule written for agents: conversations stay local

## Notes

- filter-repo rewrote every commit, so commit IDs changed; the IDs quoted in beans were updated to the new ones.
- Kept as work logs, not conversations: the beans' round-by-round progress notes and decision summaries (no quoted words). Open for the Owner whether they go too.
- Local only: the note files in docs_src/<area>/ and a bundle of the old history in support_files/history-backup/.

## Summary of Changes

- docs_src/ is git-ignored except docs_src/specs/; the note folders stay on disk, untracked.
- Spec, beans, two code comments and CLAUDE.md carry results only; CLAUDE.md has the rule that conversations stay local.
- History rewritten with git-filter-repo (the note folders, the Role-texts handoff bean, the phone number and a quoted line removed from every commit) and force-pushed to all six remote branches; a fresh clone holds none of it. Commit IDs quoted in beans updated.
- Local backup of the old history and the notes in support_files/history-backup/.
