---
# portfolio-ljnq
title: Keep conversations with the Owner out of GitHub
status: in-progress
type: task
priority: normal
created_at: 2026-11-24T13:31:25Z
updated_at: 2026-11-24T13:35:37Z
---

Conversations with the Owner (questionnaires, grilling rounds, answers, quoted words) stay local. The repo and GitHub carry results only. Remove the conversations from the current tree and from the whole git history on GitHub, keep them reachable locally, and stop them from being pushed again.

- [ ] Backup: a git bundle of the full history, and a copy of the conversation files, both in git-ignored support_files/
- [ ] docs_src/ is git-ignored except docs_src/specs/: questionnaires and notes stay on disk, untracked
- [ ] Current tree: spec, beans, CLAUDE.md and code comments carry results only (no quotes, no round logs, no pointers to the notes)
- [ ] History rewritten: the notes folders, the Role-texts handoff bean and quoted Owner words removed from every commit
- [ ] Force-pushed to the six remote branches; GitHub checked
- [x] Rule written for agents: conversations stay local
