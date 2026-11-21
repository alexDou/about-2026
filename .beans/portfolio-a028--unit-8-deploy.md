---
# portfolio-a028
title: 'Unit 8: Deploy'
status: draft
type: epic
priority: normal
created_at: 2026-11-06T20:27:21Z
updated_at: 2026-11-21T15:57:16Z
parent: portfolio-4ur0
blocked_by:
    - portfolio-yxux
    - portfolio-h69y
---

Run the SPA and the API (a Python Worker) on Cloudflare and the Agent on Google Cloud (ADR 0006). Spec: docs_src/specs/units.md#unit-8-deploy.

Open: hosting services, domain, secrets, CI/CD.

## Notes from Unit 4 (2026-11-20)

ADR 0006 moves the API to a Python Worker on Cloudflare's free plan, with the SPA as its static assets. The Agent stays on Google (ADK on Cloud Run, Unit 7). Unit 8 owns every Unit 4 check and prototype:

- [ ] Domain on Cloudflare; Email Routing on, the Owner's mailbox verified as destination
- [ ] Worker secrets: MAIL_FROM, MAIL_TO, ALTCHA_HMAC_KEY
- [ ] WAF rate-limiting rule on /api/* (the free plan has one); confirm WAF-blocked requests do not count toward the Worker's daily quota
- [ ] Measure CPU time per request against the free plan's 10 ms (fallback: the same design as a TypeScript Worker)
- [ ] altcha and Pydantic load under Pyodide; Durable Object SQL counting works
- [ ] send_email from the deployed Worker; the first Contact request email received


- [ ] Rate limiter (portfolio-vd9x, moved from Unit 4 on 2026-11-21): Durable Objects per hashed IP and site-wide, the 429 and its message in the form; design in the "Rate limit" decision of Unit 4 in `docs_src/specs/units.md`. Unit 8 has not been grilled yet: this is its first decision, amend after the grilling
