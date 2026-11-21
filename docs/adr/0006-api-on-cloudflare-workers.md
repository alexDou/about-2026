# The API runs as a Python Worker on Cloudflare's free plan

The backend is a Python Worker on Cloudflare (Pyodide, managed with uv and `pywrangler`), with no web framework. A plain route table answers every `/api` endpoint: health, the Contact challenge and request, and later Chat. Pydantic stays for the contract models. Rate limits are exact counts in Durable Objects, and email goes out through the `send_email` binding. The SPA is served as the same project's static assets. The site must stay on a free tier and must never be billed, even under a spike. Cloudflare's free plan has no billing at all: past a limit, requests fail. Static assets are free and unlimited, so the worst case is `/api` answering errors until 00:00 UTC while the site stays up and shows the offline note. The Owner accepts that case. The Agent (Unit 7) stays on Google ADK on Cloud Run's free tier, called by the Worker.

## Considered Options

- FastAPI on Cloud Run with an in-memory rate limiter: free, but exact counts need a single instance, Cloud Run's front end has no configurable rate limiting, and past the free tier Cloud Run bills.
- Cloud Armor on a Google load balancer: real per-IP limits, but the load balancer costs about $20 a month or more.
- A Worker as a gateway in front of Cloud Run: free and fast, but Cloud Run's public URL lets a flood skip the Worker unless the origin is locked. That means two runtimes and two deploys for one form.
- FastAPI on Python Workers: supported, but the free plan allows 10 ms of CPU per request, and FastAPI running in Pyodide may not fit.
- A TypeScript Worker: the surest fit for 10 ms and the fallback if Python doesn't fit, but the backend was decided to be Python.

## Consequences

- CPU time per request is not measured yet. Unit 8 measures it on a deployed Worker. If it exceeds 10 ms, the same design moves to a TypeScript Worker and only the backend tickets change.
- Only a thin entry module imports the Workers runtime, so pytest runs the handlers and the Durable Object logic in plain CPython with the bindings mocked.
- Durable Object alarms are not documented for Python, so each request deletes expired counts itself.
- The client IP is `CF-Connecting-IP`. A WAF rate-limiting rule (the free plan has one) on `/api/*` stops single-source floods before they reach the Worker. It needs the Owner's domain on Cloudflare (Unit 8).
- The rate limiter (Durable Objects) ships with the Cloudflare deploy in Unit 8, not with the Contact form in Unit 4 (decided 2026-11-21): it is only checkable on Cloudflare, next to the WAF rule and the Durable Object SQL check. Unit 4 ships without it and keeps the `429` in the contract; Unit 8 builds the limiter, the `429` message in the form and their tests (bean portfolio-vd9x).
- `send_email` reaches only verified destinations, so the Owner's mailbox is the only address it can mail. The sender is on the Owner's domain. The Gmail account set up for SMTP is retired.
- Unit 7 adds the Worker → Cloud Run call to the ADK Agent and locks Cloud Run to it.
