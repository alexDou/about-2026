#!/usr/bin/env bash
# PostToolUse(Write|Edit): format the edited file with the project formatter for its location.
#   frontend/**  -> oxfmt (frontend/node_modules)
#   backend/**/*.py -> ruff format (backend venv via uv)
set -uo pipefail
f="$(jq -r '.tool_response.filePath // .tool_input.file_path // empty')"
[[ -n "$f" && -f "$f" ]] || exit 0
root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"
case "$f" in
  "$root"/frontend/node_modules/*) exit 0 ;;
  "$root"/frontend/*.ts | "$root"/frontend/*.tsx | "$root"/frontend/*.tsrx | "$root"/frontend/*.mjs | \
  "$root"/frontend/*.js | "$root"/frontend/*.json | "$root"/frontend/*.css)
    (cd "$root/frontend" && node_modules/.bin/oxfmt --no-error-on-unmatched-pattern "$f" >/dev/null) ;;
  "$root"/backend/*.py)
    uv run --directory "$root/backend" ruff format --force-exclude --quiet "$f" ;;
esac
