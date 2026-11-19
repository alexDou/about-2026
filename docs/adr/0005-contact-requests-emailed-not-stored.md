# Contact requests are emailed, not stored

A Contact request goes straight from `POST /api/contact` to the Owner's mailbox through Gmail SMTP. The backend keeps nothing: no database, no file, no log of the fields. The Owner only needs to read and answer requests, and email already does that. A site that keeps no Visitor data also needs no storage module, no retention rule and no Privacy policy, only the Contact notice beside the form. This supersedes ADR 0002 for Contact requests. Storage for the Agent is decided in Unit 7.

## Considered Options

- Firestore (ADR 0002): a managed store with a free tier, but it brings an emulator for development and tests and a retention rule, and its only reader would be the Owner, who already gets the email.
- SQLite replicated to Cloud Storage with Litestream: a real database on the free tier, but it needs a single instance and a restore on every start. A SQLite file directly on a Cloud Storage FUSE mount was rejected outright: the mount has no file locking, so the last write wins and the database can corrupt.
- One JSON object per request in a Cloud Storage bucket, deleted by a lifecycle rule: the simplest store, but it is still storage nobody reads.

## Consequences

- If the email fails, the request is lost. The Visitor sees the failure (`502`) and sends again after a 10-second countdown, so nothing is silently dropped.
- The rate limit keeps its counters in memory and holds no IP beyond them, so Cloud Run runs at most one instance.
