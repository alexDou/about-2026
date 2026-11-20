# Portfolio API

```sh
uv sync                 # install
uv run fastapi dev      # http://127.0.0.1:8000  (docs at /docs)
uv run pytest           # tests
uv run ruff check . && uv run ruff format --check .
```

## Environment

The API is moving to a Python Worker on Cloudflare (ADR 0006, ticket Unit 4.0a). Its secrets live in the Worker's git-ignored local secrets file in development, which 4.0a sets up, and as Worker secrets when deployed (Unit 8). Never commit values or addresses.

| Secret | What it is | Where it comes from |
| --- | --- | --- |
| `MAIL_FROM` | Sender address of Contact request emails, on the Owner's domain | The Owner's domain on Cloudflare (Unit 8) |
| `MAIL_TO` | The Owner's mailbox, verified as an Email Routing destination | The Owner |
| `ALTCHA_HMAC_KEY` | Secret that signs and checks the human-check challenges | Generate it yourself: `openssl rand -hex 32` |

Email goes out through the Worker's `send_email` binding, which needs no password. The Gmail SMTP settings (`GOOGLE_APP_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`) are retired.
