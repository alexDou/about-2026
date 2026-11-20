# Portfolio API

A Python Worker on Cloudflare with no web framework (ADR 0006). `src/entry.py` is the Worker's entry; everything in `src/app/` is plain Python that pytest runs in CPython.

```sh
uv sync                 # install
uv run pywrangler dev   # http://127.0.0.1:8787 (needs uv >= 0.13.4 and Node)
uv run pytest           # tests
uv run ruff check . && uv run ruff format --check .
```

## Environment

In development the Worker reads its secrets from `backend/.env` (git-ignored); deployed, they are Worker secrets (Unit 8). Never commit values or addresses.

| Secret | What it is | Where it comes from |
| --- | --- | --- |
| `MAIL_FROM` | Sender address of Contact request emails, on the Owner's domain | The Owner's domain on Cloudflare (Unit 8) |
| `MAIL_TO` | The Owner's mailbox, verified as an Email Routing destination | The Owner |
| `ALTCHA_HMAC_KEY` | Secret that signs and checks the human-check challenges | Generate it yourself: `openssl rand -hex 32` |

```sh
# backend/.env
MAIL_FROM=...
MAIL_TO=...
ALTCHA_HMAC_KEY=...
```

Email goes out through the Worker's `send_email` binding, which needs no password. The Gmail SMTP settings (`GOOGLE_APP_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`) are retired.
