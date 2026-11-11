---
# portfolio-b4cl
title: 'CSS class names: module-name chunks, BEM'
status: completed
type: task
priority: normal
created_at: 2026-11-11T05:35:52Z
updated_at: 2026-11-11T10:55:47Z
---

Owner's rule for CSS class names, added to the frontend rules and applied to every CSS Module in the app.

## Rule

A class name is built from lowercase chunks: the module's name (kebab-case: `ExpandedPanel` → `expanded-panel`), then what the class does. Nesting and variants follow BEM: block `expanded-panel`, element `expanded-panel__close-bar`, modifier `slot--stripe`, `slot__view--hidden`. The CSS Module keys are the class names as written (`styles["slot__view"]`), so the bundler and Vitest export them as-is.

## Checklist

- [x] Rule in `.claude/rules/frontend.md` (Styling), and the class-key mention in "No hardcoded values"
- [x] Rspack and Vitest export CSS Module classes as written (no camelCase)
- [x] Rename the classes of every CSS Module under `frontend/src/`, and the `styles[...]` lookups and class assertions in tests
- [x] The View Transition classes of the Board prototype (`view-transition-class`) follow the rule too
- [x] `scripts/verify.sh` GREEN, E2E no worse than before (4 pre-existing `board-look.feature` failures)

## Notes

- Done on the prototype branch `proto-octane-view_transition`, in the same working tree as the uncommitted prototype (portfolio-u2li). The rule and the rename belong on the main line, so they should be committed apart from the prototype.
- Renames, by module: `api-status`; `expanded-panel`, `__close-bar`, `__close`; `panel`, `__content`, `__title`, `--entering`; `slot`, `--ink|mist|teal|blue|green`, `--panel|stripe|expanded`, `--entering`, `__view`, `__view--hidden`; `stripe__link`; `board__panels`; `animated-logo`, `__svg`, `__glow`, `__weave`, `__weave--ring|line`, `__strand` (new base class for the weave paths), `__strand--tone-1|2|3`; `status-badge`, `--ok|down`; pages `about-page`, `chat-with-me-page`, `contact-page`, `skills-page`, `what-i-do-page`, `landing-page`, `landing-page__title`. `app`, `board`, `heading`, `sublabel` were already compliant.
- `rspack.config.ts` `exportsConvention: "as-is"`; `vitest.config.ts` no longer sets `localsConvention: "camelCaseOnly"`.
- `slot--panel` has no CSS rule, so the production build does not emit it (Vitest's non-scoped names do). Same as before the rename.
- Gate GREEN (262 unit tests). E2E 56/60, the same 4 pre-existing `board-look.feature` failures.


## Summary of Changes

Rule "Class names" added to `.claude/rules/frontend.md`; every CSS Module class renamed to `module__part--variant` across `frontend/src`, keys exported as written (`exportsConvention: "as-is"`), tests and E2E selectors updated. Code review fix: the logo's groups are `animated-logo__ring` / `animated-logo__line`.
