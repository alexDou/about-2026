---
# portfolio-2wil
title: 'Contact review round: social links, countdown, form states, 422 fields'
status: completed
type: task
priority: normal
created_at: 2026-11-22T06:08:44Z
updated_at: 2026-11-22T06:20:13Z
parent: portfolio-vqi0
---

Findings of the code review of all Unit 4 (2026-11-22), decided with the Owner.

## What to build

### Frontend
- [x] `components/ui/profile-links/` becomes `components/ui/social-links/` (`SocialLinks`, tests, types, styles, media stay inside); About and Contact import it through its index
- [x] Class bindings use the `classnames` package, not template strings
- [x] New `components/ui/countdown/` (`Countdown`): its own state, so only its text re-renders each second and the form does not; replaces `useCountdown`
- [x] The failure notice is a static `role="alert"` sentence; the seconds sit outside the live region
- [x] Send is disabled while the form is invalid and while it is pristine (empty form: disabled); an invalid or untouched required field keeps Send disabled
- [x] Field errors show while typing and on blur (a field shows its error once touched); user stories 14, 15, 19 amended in units.md
- [x] 422 carries per-field errors: the form shows them under the fields, keeps the values, focuses the first invalid field, shows no countdown, and Send stays disabled until a field changes; 429 and 5xx keep the generic notice with the countdown
- [x] Remove the stale comments (`altcha-widget.d.ts`, `contact-panel/types.ts`, `--color-field` band) and any unused variables
- [x] Focus moves to the thank-you note when the form is replaced
- [x] The 17px to 16px font-size token change is confirmed by the Owner; no action

### Contract and backend
- [x] `altcha` and `website` get a `max_length` in the zod schema and the Pydantic model
- [x] 422 body lists `field` and `error` code per invalid field, on both sides, with contract tests
- [x] Handler order is honeypot, then human check, then field validation (units.md and handler tests amended)

### Rules and docs
- [x] frontend.md: `width: 100%` stays discouraged; a strong preference for stretch, with an exception where a grid or flex item has nothing to stretch against
- [x] E2E scenarios amended; scripts/verify.sh GREEN and e2e green


## Summary of Changes

- `ui/profile-links` is now `ui/social-links` (`SocialLinks`); its class bindings use `classnames`. The array bindings elsewhere were left as they are.
- New `ui/countdown` (`Countdown`), state of its own; `useCountdown` is gone. The failure notice is a static alert with the seconds under it.
- Send is disabled while the form is invalid or empty. Errors show while typing and on blur. A 422 carries `{ detail, fields: [{ field, error }] }`; the form shows each error, keeps the values, focuses the first refused field and locks Send until a field changes. No countdown for 422; 429 and 5xx keep it.
- Backend order: honeypot, human check, field validation. `altcha` (2048) and `website` (200) have a `max_length` on both sides.
- The thank-you note takes the focus. Stale comments fixed; no unused variables were reported by oxlint or tsrs.
- frontend.md: `width: 100%` is a strong preference, with an exception where stretching cannot reach. units.md amended (stories 14, 19, form state, contract). E2E scenarios amended, 119 of 119 pass.
- Not done, as not asked: the `HumanCheck.verify` docstring that says "never raises" (a missing `ALTCHA_HMAC_KEY` raises).
