# Portfolio API

```sh
uv sync                 # install
uv run fastapi dev      # http://127.0.0.1:8000  (docs at /docs)
uv run pytest           # tests
uv run ruff check . && uv run ruff format --check .
```

## Environment

Settings live in the git-ignored `backend/.env` locally and in Secret Manager when deployed (Unit 8). Never commit values.

| Variable | What it is | Where it comes from |
| --- | --- | --- |
| `GOOGLE_APP_PASSWORD` | App password of the mailer Gmail account | Google Account → Security → 2-Step Verification → App passwords |
| `MAIL_FROM` | The mailer Gmail address that sends Contact requests | The mailer account |
| `MAIL_TO` | The Owner's mailbox that receives them | The Owner |
| `SMTP_HOST`, `SMTP_PORT` | Mail server, `smtp.gmail.com` and `587` (STARTTLS) | Fixed; tests point them at a local fake SMTP server |
| `ALTCHA_HMAC_KEY` | Secret that signs and checks the human-check challenges | Generate it yourself: `openssl rand -hex 32` |
