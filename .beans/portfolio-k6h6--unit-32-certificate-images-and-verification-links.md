---
# portfolio-k6h6
title: 'Unit 3.2: Certificate images and verification links'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-16T09:50:04Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-vg1p
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The certificate images and their verification links, so every Certificate can be shown: the ten certificates from `support_files/skills/Zertifikate/` (git-ignored) as AVIF/WebP images in the frontend's public folder (on Google Cloud later, Unit 8), each Certificate's data in the content (title, issuer, month and year, TestDome ranking, the issuer's own verification URL).

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] TestDome TypeScript (Jul 2020, top 10%), TestDome Python (Mar 2022, top 10%), Educative Clean Code in Python, Docker for Developers, The Ultimate Guide to Kotlin Programming (2025), Udemy BASH Programming (Jul 2019), LLM Engineering (Jul 2025), AI Engineer Agentic Track (Jan 2026), Getting Started with Elasticsearch (Jul 2016), modern.css CSS Wizard (2026)
- [ ] Left out: TestDome JavaScript and Node.js, Udemy MongooseJS Essentials
- [ ] Each image converted from the PDF/PNG, AVIF and WebP, reasonable size; no email address or other personal data beyond the name
- [ ] Verification URL per Certificate (ude.my, testdome.com/certificates, Educative's verify page); none for CSS Wizard; no course hours
- [ ] The validation test checks that every Certificate's image exists
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-vg1p
