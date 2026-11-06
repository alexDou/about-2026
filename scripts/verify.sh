#!/usr/bin/env bash
# End-of-task quality gate: {frontend, backend} lanes in parallel -> semgrep (when rules exist).
#
#   scripts/verify.sh                 run the full gate (logs in .verify/)
#   scripts/verify.sh --fingerprint   print the working-tree fingerprint (used by the Claude Stop hook)
#
# On success, writes the fingerprint to .verify/stamp so the Stop hook knows the current tree is green.
# E2E (Cucumber + Playwright) is not part of the gate: run `pnpm --dir frontend e2e` separately.
set -uo pipefail

ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "$ROOT"
OUT="$ROOT/.verify"

# Tree hash of the working tree incl. untracked (non-ignored) files, without touching the real index.
fingerprint() {
  local idx
  idx="$(mktemp)"
  cp "$(git rev-parse --git-path index)" "$idx" 2>/dev/null || true
  GIT_INDEX_FILE="$idx" git add -A . >/dev/null 2>&1
  GIT_INDEX_FILE="$idx" git write-tree
  rm -f "$idx"
}

if [[ "${1:-}" == "--fingerprint" ]]; then
  fingerprint
  exit 0
fi

mkdir -p "$OUT"
rm -f "$OUT"/*.log "$OUT/stamp"
FP_START="$(fingerprint)"

# step <label> <cmd...>: run one check, keep going on failure so a single run surfaces everything.
step() {
  local label="$1"; shift
  echo "▶ $label"
  if "$@"; then return 0; fi
  echo "✖ $label FAILED"
  FAILS+=("$label")
  return 1
}

lane_frontend() {
  FAILS=()
  step "oxfmt" pnpm --dir frontend run -s fmt:check
  step "oxlint" pnpm --dir frontend run -s lint
  step "typecheck (tsrs)" pnpm --dir frontend run -s typecheck
  step "vitest" pnpm --dir frontend run -s test
  [[ ${#FAILS[@]} -eq 0 ]] || { echo "frontend failed: ${FAILS[*]}"; return 1; }
}

lane_backend() {
  FAILS=()
  step "ruff format" uv run --directory backend ruff format --check .
  step "ruff check" uv run --directory backend ruff check .
  step "pytest" uv run --directory backend pytest -q -p no:cacheprovider
  [[ ${#FAILS[@]} -eq 0 ]] || { echo "backend failed: ${FAILS[*]}"; return 1; }
}

# Runs only when .semgrep/ holds rules. A missing semgrep binary with rules present is a failure.
lane_semgrep() {
  semgrep scan --config .semgrep/ --error --metrics=off -q
}

run() { # run <lane> -> logs to .verify/<lane>.log, returns lane status
  local name="$1"
  ("lane_$name") >"$OUT/$name.log" 2>&1
}

declare -A STATUS
report() {
  local failed=0
  echo "── verify summary ──"
  for name in frontend backend semgrep; do
    [[ -z "${STATUS[$name]:-}" ]] && continue
    if [[ "${STATUS[$name]}" == 0 ]]; then
      echo "  PASS  $name"
    else
      failed=1
      echo "  FAIL  $name   (full log: .verify/$name.log)"
      grep -E "^(✖|[a-z]+ failed:)" "$OUT/$name.log" | sed "s/^/        /"; tail -n 20 "$OUT/$name.log" | sed 's/^/        /'
    fi
  done
  return "$failed"
}

declare -A PIDS
for name in frontend backend; do
  run "$name" &
  PIDS[$name]=$!
done
for name in frontend backend; do
  wait "${PIDS[$name]}"
  STATUS[$name]=$?
done

if compgen -G ".semgrep/*.y*ml" >/dev/null; then
  run semgrep
  STATUS[semgrep]=$?
fi

if report; then
  if [[ "$(fingerprint)" == "$FP_START" ]]; then
    echo "$FP_START" >"$OUT/stamp"
    echo "verify: GREEN"
  else
    echo "verify: GREEN, but files changed while it ran (formatter?); re-run to stamp."
  fi
  exit 0
fi
echo "verify: RED"
exit 1
