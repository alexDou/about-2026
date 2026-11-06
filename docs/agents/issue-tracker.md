# Issue tracker: Beans CLI

Issues and specs for this repo live as markdown beans in `.beans/` (configured in `.beans.yml`). Use the `beans` CLI for all operations.

## Conventions

- **Create an issue**: `beans create "<title>" -t <type> -d "<description>" -s todo` (types: `task`, `feature`, `bug`, `epic`, `milestone`).
- **Read an issue**: `beans show <id>` or `beans show --json <id>`.
- **List issues**: `beans list --json` with optional `--status`, `--type`, `--tag`, or `--ready`.
- **Update status**: `beans update <id> -s <status>` (`todo`, `in-progress`, `draft`, `completed`, `scrapped`).
- **Add / remove triage tags**: `beans update <id> --tag "<role>"` / `--remove-tag "<role>"`.
- **Append notes or summary**: `printf '## Notes\n\n...\n' | beans update <id> --body-append -`. Pass multi-line text through stdin (`-`): a `\n` inside a quoted argument is stored literally, not as a newline.
- **Text replacement in body**: `beans update <id> --body-replace-old "old" --body-replace-new "new"`.
- **Close / resolve**: `printf '## Summary of Changes\n\n...\n' | beans update <id> -s completed --body-append -`.

## When a skill says "publish to the issue tracker"

Create bean with `beans create "<title>" -t <type> -d "<description>" -s todo`.

## When a skill says "fetch the relevant ticket"

Read with `beans show <id>`.

## Wayfinding operations

Used by `/wayfinder`. Map is epic/milestone bean; child tickets linked via parent relationship.

- **Map**: `beans create "Map: <title>" -t epic -d "<Notes / Decisions-so-far / Fog>" -s in-progress --tag wayfinder:map`.
- **Child ticket**: `beans create "<title>" -t task --parent <map-id> -d "<description>" --tag wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`).
- **Blocking**: `beans update <child-id> --blocked-by <blocker-id>`.
- **Frontier query**: `beans list --json --parent <map-id> --ready`.
- **Claim**: `beans update <child-id> -s in-progress`.
- **Resolve**: `printf '## Answer\n\n<answer>\n' | beans update <child-id> -s completed --body-append -`, then append context pointer to map bean.

