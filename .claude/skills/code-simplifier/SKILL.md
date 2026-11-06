---
name: code-simplifier
description: Reduce complexity without changing behavior - flatten branching, remove speculative abstractions, split oversized chunks - with tests run before and after. Use when the user asks to simplify or refactor code, or a bean asks for a cleanup.
argument-hint: <file, chunk or bean-id>
---

# Code Simplification Playbook

## Principles of Simplification
* **Eliminate Premature Generalization (YAGNI):** Collapse single-implementation interfaces, redundant factory functions, and speculative generic parameters down to concrete types.
* **Flatten Cyclomatic Complexity:**
  * Replace nested `if / else` blocks with early returns (guard clauses).
  * In TypeScript, avoid excessive ternaries; use discriminated unions and exhaustive `switch`.
  * In Python, prefer early returns and `match` over nested conditionals.
* **Normalize Data Flow:** Make data move in one direction. Avoid mutable accumulator parameters where a `map`/`filter`/comprehension expresses the transformation declaratively.
* **Split, Don't Grow:** A component or module doing two jobs splits on its natural border, and the pieces stay colocated in the owning chunk (`.claude/rules/structure.md`).
* **Preserve Invariants:** Do not alter a chunk's public `index.ts` exports, the API contract, or rendered output.

## Invariant Verification Workflow
Whenever simplifying a file or module:
1. **Pre-flight Check:** Run existing tests to establish a baseline:
   - Frontend: `pnpm --dir frontend test`
   - Backend: `uv run --directory backend pytest`
   If tests fail before starting, stop and notify the user.
2. **Apply Transformation:** Simplify the target code in small, focused chunks.
3. **Post-flight Verification:** Re-run the tests. If anything regresses, revert immediately.
4. **Linter Validation:** Finish with `scripts/verify.sh` (oxlint, tsrs, ruff included).
