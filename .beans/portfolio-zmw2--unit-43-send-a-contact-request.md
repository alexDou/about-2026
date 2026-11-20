---
# portfolio-zmw2
title: 'Unit 4.3: Send a Contact request'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-20T13:55:47Z
parent: portfolio-yxux
blocked_by:
    - portfolio-m7rt
    - portfolio-0hxh
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

The tracer bullet. A Visitor fills in the form and presses Send, and the Owner gets the email. The form has visible labels in Playfair Display, the required marks and a "* required" line. While it sends, the form is disabled and the button reads "Sending…". On success the form is replaced by "Thank you, {name}. I'll get back to you soon." POST /api/contact validates the fields (422 on a broken rule) and hands the cleaned request to the mailer, which builds the email and sends it through the Worker's send_email binding (ADR 0006).

## Acceptance criteria

- [x] Fields: Name *, Company *, Position, How to reach you (hint "email, phone, LinkedIn, …"); button "Send"
- [x] Sending state: form disabled, "Sending…"; success: the thank-you note replaces the form (a reload brings it back)
- [x] The Contact client in the API service submits the request and maps 204 and 422
- [x] POST /api/contact: 204 after the mailer sent; 422 on a broken field rule; the mailer, the secrets and the clock reach the handler as parameters from the route table (no framework), so tests pass mocks
- [x] Mailer: subject "Contact request: {name}, {company}" with CR/LF stripped; plain-text body with each field and the time in Europe/Berlin; Reply-To set when contact parses as an email address; sent through the send_email binding; MAIL_FROM and MAIL_TO from Worker secrets
- [x] Nothing is stored (ADR 0005)
- [x] Backend tests in plain CPython with the mailer mocked; mailer tests with the send_email binding mocked along its contract; no server, no fake mail service
- [x] Frontend tests with the Contact client mocked; E2E happy path with /api/contact stubbed by Playwright routes along the contract
- [x] scripts/verify.sh GREEN

## Blocked by

- portfolio-m7rt Unit 4.0: Contact contracts
- portfolio-0hxh Unit 4.2: Contact Panel layout

## Summary of Changes

- Backend: `POST /api/contact` (`app/contact/handlers.py`): 422 `Invalid fields` on a broken rule or body, mailer called with the cleaned request and the clock's time, 204 on success, 502 `Email not sent` on `MailerError`. `app/dependencies.py` (`Dependencies`: mailer, clock) is handed from `entry.py` to `dispatch(request, dependencies)`; `.claude/rules/backend.md` records the shape. Secrets (`MAIL_FROM`, `MAIL_TO`) live in `EmailMailer`; the ALTCHA key joins `Dependencies` in 4.6.
- Mailer (`app/contact/mailer.py`): builds `{from, to, subject, text, replyTo?}` for the Cloudflare Email Service structured `send()` (subject `Contact request: {name}, {company}`, CR/LF stripped from every header value, body with each field and the time in Europe/Berlin, Reply-To only for a bare address) and wraps any binding error in `MailerError`. `tzdata` added for `zoneinfo` on Pyodide; `wrangler.jsonc` gets the `EMAIL` `send_email` binding. The real binding, `to_js` conversion and Pyodide `tzdata` are checked in Unit 8.
- Frontend: `submitContact` in the API service (204 -> `sent`, 422 -> `invalidFields`, anything else -> `failed`; 4.5 refines the rest); `ContactForm` with `ContactField` and `useContactForm` in `components/domain/contact/contact-form/`: visible labels in Playfair Display, asterisks, "* required", Send / "Sending…" with the fields disabled, thank-you note replacing the form, values kept after a failure. The page passes the form into the panel; the form is `display: contents` so the notice sits right above Send on a phone (the panel places the fieldset and button by element type, since CSS Modules scopes grid area names per stylesheet).
- Stand-ins until later tickets: the `altcha` field is `HUMAN_CHECK_PENDING` (4.6); an invalid form or a failed request shows nothing yet (4.4 field errors, 4.5 failure states).
- Tests: pytest for mailer, handler through `dispatch`; Vitest for client, form, page; E2E send scenario with `/api/contact` stubbed.
- `scripts/verify.sh` GREEN; E2E green.
