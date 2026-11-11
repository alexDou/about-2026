---
# portfolio-rvfj
title: Time out the shared health request after 6 seconds
status: completed
type: task
priority: normal
created_at: 2026-11-11T11:29:56Z
updated_at: 2026-11-11T11:30:18Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-402i
---

## Parent

portfolio-m9gt (Unit 1: Board). Follow-up to portfolio-402i, whose review found that a hung backend leaves the health on `checking` forever, so the offline note never shows.

## What to build

The shared health request (`components/domain/ApiStatus/health.ts`) gives up after 6000 ms: `AbortSignal.timeout(HEALTH_TIMEOUT_MS)` joined with the request's own signal, so a timeout counts as `down`. `getJson` is left as it is (the owner is not happy with it, but it stays for now).

## Acceptance criteria

- [x] Test first (red): `fetchHealth` gets a signal that a timeout aborts, and the health becomes `down`; a newer request still drops an older one
- [x] `HEALTH_TIMEOUT_MS = 6000` is a named constant in the ApiStatus `config.ts`
- [x] `scripts/verify.sh` GREEN

## Summary of Changes

`checkHealth` passes `AbortSignal.any([request.signal, AbortSignal.timeout(HEALTH_TIMEOUT_MS)])` to `fetchHealth`; `HEALTH_TIMEOUT_MS = 6000` in the ApiStatus `config.ts`. A request that does not answer in time rejects and the health becomes `down`, so the offline note shows. `getJson` is unchanged. Tested with a mocked `AbortSignal.timeout` (jsdom and fake timers would not make it deterministic).
