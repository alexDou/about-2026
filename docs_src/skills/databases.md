# Databases & search questionnaire

The Databases & search Skill group. The Owner's answers are kept verbatim; the polished text lives in the message file once approved.

**CV seed**: "Commercial experience with SQL/noSQL databases (incl. PostgreSQL, MySQL, Redis, Cassandra, CouchDB, Couchbase, RethinkDB, AWS DynamoDB)". The spec adds ScyllaDB, MongoDB and Elasticsearch (Udemy course certificate, 2016). The Roles: MySQL and Redis in several, Redis as the i18n service's caching layer.

## Round 1

1. The list: Cassandra, CouchDB, Couchbase (CV only); ScyllaDB, MongoDB, Elasticsearch (spec only)? Candidates: SQLite, Firestore, OpenSearch, vector stores (pgvector, Qdrant, Chroma), ORMs (Prisma, TypeORM, SQLAlchemy, Mongoose).
2. Confidence per database; which to merge?
3. Elasticsearch: the knowledge today?
4. Schema design, query optimisation, caching, migrations: here or in What I do?

### Answers

> ScyllaDB, MongoDB and Elasticsearch
>
> SQL
>  - Postgres, MySQL - analysis, debugging, scaling, optimisation. expert
>  - ElasticSearch - applicational knowledge, not too much in-depth
>  - SQlite - use regularily
> noSQL
>  - Redis - expert, use modtly for caching
>  - MongoDB - expert. optimisation, transactions
>  - DynamoDB - confident, not an expert
>  - RethinkDB - confiendent, consider first for real-time use-cases
>  - ScyllaDB - confident, consider first for huge-scale, ultra-low-latency data flows
> ORMs
>  - Prisma - expert, built a number of app on it
>  - TypeORM - expert, though have not built on it for quite a while
>  - SQLAlchemy - ready to use
>  - Mongoose, MongoDB Modejs driver - expert. I'd choose official driver today
>
> side note: add Zod to frontend. we list some libs there. state managers etc. add zod too

## Round 2

1. Elasticsearch to NoSQL (a search engine on a document store, not SQL), or "NoSQL & search"?
2. Three subgroups, no Skills of their own: "SQL", "NoSQL", "ORMs & drivers"?
3. PostgreSQL & MySQL as one Skill?
4. The rest approved?

### Answers

> Cassandra, CouchDB and Couchbase - yes
>
> Elasticsearch - yes, certainly

2. ok
3. yes
4. approved

Approved: the text is in `frontend/src/i18n/en/skills.json`. Cassandra, CouchDB and Couchbase stay out.
