# Testing & quality questionnaire

The Testing & quality Skill group. The Owner's answers are kept verbatim; the polished text lives in the message file once approved.

**Seed**: the spec lists Jest, RTL, Vitest, Cypress, Playwright, pytest, TDD; the Roles Jest/RTL, Cypress, Playwright; this site uses Vitest, Cucumber + Playwright, pytest, oxlint, ruff, Opengrep and a verify gate.

## Round 1

1. The list: add, drop, merge? Candidates: Cucumber/BDD, MSW, linters and formatters (ESLint, Prettier, oxlint, ruff), Semgrep/Opengrep, SonarQube, contract tests, k6.
2. Confidence per Skill; which to merge?
3. TDD: here, or in Engineering practice?
4. Flat, or subgroups ("Unit & component", "End-to-end")?

### Answers

> Cucumber/Gerkin, RTL, Jest, Vitest, Mocha, MSW, Cypress, Playwright, ESLint, Prettier, oxlint, ruff, (rust linter here too), Semgrep, exclude SonarCube
>
> pls group them together on your own, and assign expert, use regularily for each of them but ruff, the rust's one, Semgrep

## Round 2

1. Depth for Ruff, Clippy and Semgrep?
2. pytest and TDD: pytest in, TDD to Engineering practice?
3. The grouping right?

### Answers

1. ruff, clippy - application level; semgrep - use regularly
2. add pytest pls
3. yes

Approved (round 3): the text is in `frontend/src/i18n/en/skills.json`. pytest as drafted; TDD goes to Engineering practice's questionnaire.
