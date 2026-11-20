---
# portfolio-m7rt
title: 'Unit 4.0: Contact contracts'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-20T13:03:30Z
parent: portfolio-yxux
blocked_by:
    - portfolio-1b3v
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

The Contact request and challenge contracts, locked on both sides before any feature uses them. The frontend gets one zod schema that holds the field rules, with the ContactRequest type derived from it, and the backend a Pydantic model that mirrors fields and limits. The challenge response shape and the status codes are fixed. The API client gains a POST helper beside its GET helper.

## Acceptance criteria

- [x] zod schema: name required ≤ 80, company required ≤ 100, position optional ≤ 120 (one line), contact optional ≤ 200, altcha required, website (honeypot) optional; trimmed, control characters stripped, whitespace only counts as empty
- [x] ContactRequest type derived from the schema; challenge response type
- [x] Pydantic model with identical field names, optionality and limits, plus the challenge response model
- [x] Status codes documented in the contract: 204 sent, 422 invalid fields, 400 failed human check, 429 limit reached, 502 email not sent
- [x] Frontend contract test: the schema accepts and rejects along every rule; the POST helper sends the JSON body and parses errors (mocked fetch)
- [x] Backend contract test: the models validate and reject along the same rules
- [x] scripts/verify.sh GREEN

## Blocked by

- portfolio-1b3v Unit 4.0a: Backend becomes a Python Worker

## Decisions

- ALTCHA protocol v2: the npm widget is `altcha` 3.7.0 and PyPI `altcha` 2.4.0 creates v2 challenges. The challenge is `{ parameters: { algorithm, cost, keyLength, keyPrefix, nonce, salt, expiresAt, keySignature? }, signature }`, the library's own camelCase JSON. `expiresAt` is required, since every challenge expires. `keySignature` is optional: only the pre-solved (deterministic) mode sets it, and 4.6 picks the mode. `algorithm` stays a string until 4.6 picks one.
- Limits count Unicode code points on both sides: zod 4.6's `max` counts code points, and so does Python's `len()`. An emoji is one character. The 4.4 counter should count the same way (`[...value].length`), not `String.length` or the `maxlength` attribute.
- Cleaning, the same on both sides: line breaks (CRLF, CR, LF, NEL, U+2028, U+2029) and tabs become a space, then the rest of Unicode category Cc is stripped, then the value is trimmed with JavaScript's `trim()` set (Python's `str.strip()` keeps U+FEFF, so the backend lists the set). This keeps every value on one line, as the position rule asks, without joining words. Whitespace only makes a required field too short and an optional one not given.
- An optional field is left out, never `null`: zod's `.optional()` refuses `null` and so does the Pydantic model. `json_response` leaves out `None` fields (`api-contract.md`).
- Status codes: `ContactStatus` (IntEnum) and `CONTACT_STATUS` (`as const`), plus the `models.py` docstring.
- `ApiError` gains `detail`, read from the contract's `{ detail }` error body when there is one. `postJson` resolves on any 2xx.
- The contract stays in `services/api/` beside the health check, as the spec puts it ("The Contact client sits in the existing API service beside the health check"), even though the review suggested a `services/contact/` chunk.
- For 4.6: neither side caps `altcha` or `website`, and the spec sets no limit. 4.3 or 4.6 may cap the body size for the 10 ms CPU budget. The challenge shape is typed by hand here; 4.6's tests with the library's own solver are the first check against what the library produces.

## Summary of Changes

- Backend: `src/app/contact/models.py` with `ContactRequest` (cleaning, limits, null refused), `ChallengeParameters` / `ChallengeResponse` (camelCase aliases), `ContactStatus`, `CONTACT_LIMITS`. `json_response` dumps by alias and leaves out `None`. `tests/contact/test_models.py`: every rule, the cleaning, the line breaks, code points, null, the challenge JSON and the status codes.
- Frontend: `zod` 4.6.7 (exact). `services/api/config.ts` (`CONTACT_LIMITS`, `CONTACT_STATUS`), `contact-schema.ts` (`contactRequestSchema`), types (`ContactRequest` derived from the schema, `ChallengeResponse`, `ChallengeParameters`, `ContactStatus`, `ErrorResponse`), `postJson` beside `getJson`, `ApiError.detail`. Tests: `_specs_/contact-schema.test.ts` (the same rules as the backend) and `_specs_/client.test.ts` (POST body and headers, the abort signal, errors with and without a detail, the challenge JSON).
- Rules: `api-contract.md` (optional means left out, not null; Stage 0 model tests), `backend.md` (how handlers get runtime values, the JSON dump).
