---
paths: [".opengrep/**", "frontend/tools/opengrep-tsrx.ts", "scripts/verify.sh"]
---

# Opengrep: the project's security rules

Opengrep (https://github.com/opengrep/opengrep, LGPL-2.1, Semgrep-compatible rule syntax) is the static security scanner. Free, no account, no registry rules: the gate runs only the rules in `.opengrep/rules/`. Semgrep is not used in this project.

## Install and version

- Installed per machine, not per project: the official script puts the binary in `~/.opengrep/cli/<version>/` with a symlink `~/.local/bin/opengrep`. Pin: `OPENGREP_VERSION` in `scripts/verify.sh`. The `opengrep` lane fails on any other version and prints the install command.
- To upgrade: install the new version, bump `OPENGREP_VERSION`, run the gate.

## Rules and their tests

- One rules file per area, each with a fixture file of the same base name next to it: `frontend.yml` + `frontend.tsx`, `backend.yml` + `backend.py`. `opengrep test .opengrep/rules` checks them in the gate.
- Every rule has a `# ruleid:` case for each pattern and at least one `# ok:` case for the closest safe code. A rule without fixtures can match nothing and still pass.
- Each rule's `paths.include` names the code it guards (`/frontend/src/`, `/backend/app/`), so the fixtures themselves are never scanned as project code.
- Messages say what to do instead, in one or two sentences.
- Generic Python checks (eval, pickle, `yaml.load`, `shell=True`, hardcoded passwords) are ruff's `S` rules (`backend/pyproject.toml`). Write Opengrep rules only for what is specific to this app.
- A false positive is fixed in the rule, with an `# ok:` fixture for it. A `noopengrep` comment needs the user's OK.

## .tsrx files

- Opengrep has no TSRX parser and skips `.tsrx` files. `frontend/tools/opengrep-tsrx.ts` (`pnpm --dir frontend scan:tsrx`) compiles each one with Octane's `compileToVolarMappings` (the output tsrs type-checks), scans the TSX in a temp folder under the file's repo path plus `.tsx`, and maps each finding back to the `.tsrx` line through the compiler's mappings.
- So TypeScript rules cover `.ts` and `.tsrx` alike. Write them against the compiled TSX: TSRX control flow (`@if`, `@for`) arrives as plain JSX expressions.
- Cross-file analysis (`--enable-interfile`) is not on: virtual files cannot resolve their `.tsrx` imports.
