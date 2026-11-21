---
# portfolio-tn1x
title: 'Unit 4: Contact spec'
status: in-progress
type: feature
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-19T13:36:34Z
updated_at: 2026-11-20T13:35:05Z
parent: portfolio-yxux
---

Full design: the Unit 4 section of `docs_src/specs/units.md` (grilling 2026-11-19). Vocabulary: `CONTEXT.md`. Decisions: ADR 0005 (Contact requests are emailed, not stored), ADR 0006 (the API runs as a Python Worker on Cloudflare's free plan). Amended 2026-11-20 for ADR 0006.

## Problem Statement

A Visitor (a hiring manager or recruiter) who likes what they see on the site has no way to reach the Owner from it. The Contact Panel is an empty shell with only its heading and the offline note. The Owner wants to be reached without publishing a phone number or an email address, without keeping Visitor data on the site, and without paying for anything beyond the free tier. The form must not become a spam channel.

## Solution

The Contact Panel shows "Remote, worldwide", the Owner's LinkedIn and Xing profiles, a Contact notice and a short Contact request form: name, company, an optional position description and an optional way to reach the Visitor. On submit, an invisible proof-of-work human check runs in the browser, and the backend emails the Contact request to the Owner's mailbox. Nothing is stored. The Visitor always knows the state of the form: what is wrong with a field, that it is sending, that it was sent, or that it failed and when they can try again. Bots are stopped by the human check and a honeypot; floods are stopped by a per-IP and a site-wide rate limit, built with the deploy in Unit 8.

## User Stories

1. As a Visitor, I want to open the Contact Panel from Explore, so that I can get in touch with the Owner.
2. As a Visitor, I want to see the Contact heading in the Panel's own colour, as on the other Panels, so that the site feels consistent.
3. As a Visitor, I want to read "Remote, worldwide", so that I know the Owner works remotely from anywhere.
4. As a Visitor, I want to see the Owner's LinkedIn and Xing profiles as icon links, so that I can reach them on the network I use.
5. As a Visitor using a screen reader, I want each profile link named ("LinkedIn", "Xing"), so that I know where it leads.
6. As a Visitor, I want a visible ring when I hover or focus a profile icon, so that I can tell it is a link.
7. As a Visitor, I want the Contact notice beside the form, so that I know my details are used only to reply, reach the Owner by email, and are not stored or passed on.
8. As a Visitor, I want no consent checkbox to tick, so that sending a request takes no extra step.
9. As a Visitor, I want a visible label above every field, so that I still know what a field is after I start typing.
10. As a Visitor, I want required fields marked with "*" and a "* required" line, so that I know what I must fill in.
11. As a Visitor, I want to give only my name and company if I prefer, so that I don't have to share a phone number or email.
12. As a Visitor, I want an optional position field, so that I can say which role I am writing about.
13. As a Visitor, I want an optional "How to reach you" field with the hint "email, phone, LinkedIn, …", so that I can pick my own channel.
14. As a Visitor, I want a field checked when I leave it, not on every keystroke, so that I'm not scolded while typing.
15. As a Visitor, I want an error to appear as text under the field it belongs to, so that I know what to fix.
16. As a Visitor using a screen reader, I want an invalid field announced with its error, so that I can fix it without seeing the screen.
17. As a Visitor, I want a character counter once I near a field's limit, so that I'm not cut off by surprise.
18. As a Visitor, I want leading and trailing spaces ignored and a whitespace-only value treated as empty, so that a stray space doesn't cause an error or an empty request.
19. As a Visitor, I want focus to move to the first invalid field when I submit with errors, so that I can correct it at once.
20. As a Visitor, I want the form disabled and the button to read "Sending…" while my request is on its way, so that I don't send it twice.
21. As a Visitor, I want the human check to happen without a puzzle or a click, so that sending feels like any other form.
22. As a Visitor, I want the form replaced by "Thank you, {name}. I'll get back to you soon." when it is sent, so that I know it worked.
23. As a Visitor whose request failed, I want the form back with everything I typed, so that I don't have to type it again.
24. As a Visitor whose request failed, I want a generic reason and a 10-second countdown before I can retry, so that I know when to try again.
25. As a Visitor who sent too many requests, I want "Too many requests from your connection. Please try again in a few minutes.", so that I understand why it was refused. (Unit 8)
26. As a Visitor, I want the form disabled beside the offline note while the backend is down, while the links and the Contact notice stay, so that I can still reach the Owner another way.
27. As a Visitor on a phone, I want "Remote, worldwide" and the links first, then the fields, then the Contact notice right above the submit button, so that the notice is where I decide to send.
28. As a Visitor on a desktop, I want the links and the Contact notice on the left and the form on the right, so that I see everything at once.
29. As a Visitor, I want the texts in the site's language through its translations, so that a future locale translates them too.
30. As the Owner, I want each Contact request emailed to my own mailbox, so that I read requests where I already read mail.
31. As the Owner, I want the subject "Contact request: {name}, {company}", so that I can sort requests in my inbox.
32. As the Owner, I want a plain-text body with each field and the time in Europe/Berlin, so that I can read it on any mail client.
33. As the Owner, I want Reply-To set to the Visitor's contact when it is an email address, so that I can just hit reply.
34. As the Owner, I want nothing stored on the site, so that I have no Visitor data to protect, keep or delete.
35. As the Owner, I want a failed email reported to the Visitor (`502`), so that no request is lost silently.
36. As the Owner, I want bots that fail the human check rejected (`400`), so that my inbox gets only real requests.
37. As the Owner, I want a filled honeypot answered with a silent `204` and nothing sent, so that bots believe they succeeded and don't adapt.
38. As the Owner, I want 5 requests per 15 minutes per IP, so that a real Visitor can retry but one source can't flood me. (Unit 8)
39. As the Owner, I want a site-wide cap of 100 requests a day, so that a flood from many IPs can't fill my inbox or use up the free plan's quotas. (Unit 8)
40. As the Owner, I want the client IP taken from `CF-Connecting-IP`, which Cloudflare sets, so that a client can't forge its way past the limit.
41. As the Owner, I want CR/LF stripped from anything that goes into an email header, so that no one can inject headers.
42. As the Owner, I want the backend to check every field rule again, so that a crafted request can't bypass the browser's checks.
43. As the Owner, I want invalid fields answered with `422`, so that the API says clearly what it rejects.
44. As the Owner, I want the mail addresses and the ALTCHA key kept as Worker secrets, so that no address or secret ever lands in the repo.
45. As the Owner, I want the human check self-hosted with no third party and no cookies, so that the Contact notice stays true.
46. As the Owner, I want About to keep its LinkedIn and GitHub links unchanged when the profile links become shared, so that About doesn't regress.
47. As the Owner, I want the site to stay on Cloudflare's free plan and never be billed, so that a spike can at worst take `/api` down until midnight UTC while the site stays up with the offline note.

## Implementation Decisions

- **Contract (Stage 4.0)**, owned on each side and matching field for field:
  - `GET /api/contact/challenge` returns an ALTCHA challenge signed with the `ALTCHA_HMAC_KEY` secret (generated by the Owner, no provider).
  - `POST /api/contact` takes JSON `{ name, company, position?, contact?, altcha, website? }`. `altcha` is the widget's solved payload; `website` is the honeypot.
  - Responses: `204` sent (and a filled honeypot), `422` invalid fields, `400` failed human check, `429` limit reached, `502` email not sent.
  - Field rules: name required ≤ 80, company required ≤ 100, position optional ≤ 120 on one line, contact optional ≤ 200 free text. Trimmed, control characters stripped, whitespace only counts as empty.
  - Frontend: one zod schema holds these rules and the `ContactRequest` type is derived from it. Backend: a Pydantic model mirrors them.
- **Frontend modules**:
  - The API service gains the Contact client beside the health check: a POST helper next to the existing GET helper, the challenge fetch and the submit. It maps each status code to an outcome the form can show.
  - The profile links move from About's top card to the shared UI components (second consumer). They gain Xing (Simple Icons, CC0) and a look prop: plain on About, round icons with a hover ring on Contact.
  - A Contact domain component area holds the form and its parts: fields with visible labels, inline errors, counters, the sending / sent / failed-with-countdown states, the honeypot and the ALTCHA widget (invisible, solving on submit). The form is disabled while the shared health check reports the backend down.
  - The Contact page holds its content (the profile list, the message ids) and lays out the heading, the band and the two columns. Below 840px one CSS grid reorders the same markup.
  - All text is FormatJS messages in a Contact message file (`en`).
  - Fonts: Amethysta for content, Playfair Display for headings and labels. The palette tokens: heading on `#5c8b70`, the band `#d1dcd9`, text `#25363a`.
- **Backend modules** (a Python Worker with no framework, ADR 0006; one package for the Contact area):
  - The route table hands each request to a handler, passing it the mailer, the human check, the secrets and the clock. Only a thin entry module imports the Workers runtime.
  - The Contact handlers: challenge and submit, with the order honeypot → field validation → human check → mail (Unit 8 adds the rate limit before the human check).
  - A human-check module wrapping the `altcha` library: create a challenge and verify a payload.
  - A mailer module: builds the message (subject, plain-text body, Europe/Berlin time, conditional Reply-To, header sanitizing) and sends it through the `send_email` binding. `MAIL_FROM` (on the Owner's domain) and `MAIL_TO` (the Owner's mailbox, the account's only verified destination) are Worker secrets.
  - A rate-limit module (Unit 8): exact sliding windows in Durable Objects, 5 per 15 minutes per hashed client IP (`CF-Connecting-IP`) and 100 per day site-wide. Each request first deletes expired timestamps with one SQL statement, then counts; no alarms. The counting logic is a plain class; a thin Durable Object wrapper binds it to SQL storage.
- **Architecture**: no storage of Contact requests (ADR 0005). The API, `/api/health` included, is a Python Worker on Cloudflare's free plan, and the SPA is its static assets (ADR 0006). In front of the Worker sit Cloudflare's DDoS protection and one WAF rate-limiting rule on `/api/*` (Unit 8). The Agent (Unit 7) is Google ADK on Cloud Run, called by the Worker.

## Testing Decisions

- A good test checks external behaviour against a contract: what a module returns, renders, sends or refuses, given what its dependencies return. It never checks internals, exact paddings, margins or gaps (`.claude/rules/testing.md`). No test starts a server or builds a fake service (no fake SMTP, no fake mailbox, no fake store): each dependency is mocked along its contract. Being hard to test is never a reason to drop or bend a feature.
- **Backend** (pytest in plain CPython; the Workers runtime is never imported by tested code):
  - Endpoint tests call the route table in process with the mailer, the human check, the secrets and the clock mocked along their contracts. They assert:
    - the exact JSON of the challenge;
    - `204` with the mailer called once with the cleaned fields;
    - the silent `204` with the mailer not called for a honeypot;
    - `422` per broken rule;
    - `400` when the human check rejects;
    - `502` when the mailer raises.
  - Mailer tests mock the `send_email` binding and check what it is handed: the From/To/Subject/Reply-To headers, the CR/LF stripping, the body fields and the Berlin time.
  - Human-check tests verify a payload solved with the `altcha` library's own solver, and reject a tampered or expired one.
- **Frontend** (Vitest with the Octane testing library):
  - The zod schema: each rule, the trimming and the whitespace-only case.
  - The Contact client: with `fetch` mocked, the request body shape and the mapping of every status code (prior art: the health service's tests).
  - The form and the page: with the Contact client and the ALTCHA widget mocked along their contracts. They check:
    - labels and the required marks;
    - the error on blur and on submit, focus moving to the first invalid field;
    - the counters near the limit;
    - the disabled form and "Sending…";
    - the thank-you note replacing the form;
    - the failure message with values kept and the 10-second countdown (fake timers);
    - the disabled form while offline.
    - The look: composition, the palette and the layout mode (grid order below 840px), as in the Skills tests.
  - The profile links in the shared UI: both looks, Xing included, About unchanged (prior art: the About top card's tests).
- **E2E** (Cucumber + Playwright on the frontend build): `/api/*` is stubbed by Playwright routes along the contract, as `offline.feature` does; no running backend. Covered: sending a request, field errors, a `502` with its countdown, and the offline state. This deviates from the AGENTS.md Stage Final for this unit, by the Owner's decision.

## Out of Scope

- A Legal notice, a Privacy policy, a consent checkbox, or any extra page or route.
- Storing Contact requests anywhere (database, bucket, logs of the fields).
- A confirmation email to the Visitor; a phone push to the Owner.
- Cloud Run for the API, Cloud Armor, a load balancer, an nginx sidecar, FastAPI or any web framework.
- A free-text message field.
- Deploying is Unit 8: the domain on Cloudflare with Email Routing, the Worker secrets, the WAF rule, and every check and prototype. That includes CPU time per request under 10 ms (fallback: a TypeScript Worker), `altcha` and Pydantic under Pyodide, Durable Object SQL, `send_email`, WAF-blocked requests not counting toward the quota, and the first email from the deployed site.
- The rate limiter and its `429` message: Unit 8 (portfolio-vd9x).
- Chat's rate limit and storage (Unit 7).
- Fixing the Cloud Skill overview that still names Firestore (a separate bean once Unit 7 decides storage).

## Further Notes

- The Gmail SMTP setup proved on 2026-11-19 is retired by ADR 0006. The secrets are listed in `backend/README.md`.
- Ticket 4.0a turns the backend into a Python Worker before 4.0.
- Profile URLs: LinkedIn `https://www.linkedin.com/in/a-doo/`, Xing `https://www.xing.com/profile/Alexander_Doo`.
