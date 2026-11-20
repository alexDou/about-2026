---
# portfolio-zmw2
title: 'Unit 4.3: Send a Contact request'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-19T13:42:25Z
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

- [ ] Fields: Name *, Company *, Position, How to reach you (hint "email, phone, LinkedIn, …"); button "Send"
- [ ] Sending state: form disabled, "Sending…"; success: the thank-you note replaces the form (a reload brings it back)
- [ ] The Contact client in the API service submits the request and maps 204 and 422
- [ ] POST /api/contact: 204 after the mailer sent; 422 on a broken field rule; the mailer, the secrets and the clock reach the handler as parameters from the route table (no framework), so tests pass mocks
- [ ] Mailer: subject "Contact request: {name}, {company}" with CR/LF stripped; plain-text body with each field and the time in Europe/Berlin; Reply-To set when contact parses as an email address; sent through the send_email binding; MAIL_FROM and MAIL_TO from Worker secrets
- [ ] Nothing is stored (ADR 0005)
- [ ] Backend tests in plain CPython with the mailer mocked; mailer tests with the send_email binding mocked along its contract; no server, no fake mail service
- [ ] Frontend tests with the Contact client mocked; E2E happy path with /api/contact stubbed by Playwright routes along the contract
- [ ] scripts/verify.sh GREEN

## Blocked by

- portfolio-m7rt Unit 4.0: Contact contracts
- portfolio-0hxh Unit 4.2: Contact Panel layout
