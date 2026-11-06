# Firestore for app data

The backend stores its data (Contact requests, later Agent-related records) in Firestore, with the Firestore emulator for local development and tests, behind a single storage module. The deploy target is serverless Google Cloud, where a SQLite file has no persistent disk and is lost on restart; the data is small, and Firestore's free tier covers it.

## Considered Options

- SQLite: the obvious choice for a few hundred rows, but on Cloud Run it needs Litestream or a Cloud Storage mount, or a VM instead of serverless.
