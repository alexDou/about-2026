---
# portfolio-k6h6
title: 'Unit 3.2: Certificate images and verification links'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T06:47:56Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-vg1p
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The certificate images and their verification links, so every Certificate can be shown: the ten certificates from `support_files/skills/Zertifikate/` (git-ignored) as AVIF/WebP images in the frontend's public folder (on Google Cloud later, Unit 8), each Certificate's data in the content (title, issuer, month and year, TestDome ranking, the issuer's own verification URL).

## Acceptance criteria

- [x] Tests written first and red, then green (TDD)
- [x] TestDome TypeScript (Jul 2020, top 10%), TestDome Python (Mar 2022, top 10%), Educative Clean Code in Python, Docker for Developers, The Ultimate Guide to Kotlin Programming (2025), Udemy BASH Programming (Jul 2019), LLM Engineering (Jul 2025), AI Engineer Agentic Track (Jan 2026), Getting Started with Elasticsearch (Jul 2016), modern.css CSS Wizard (2026)
- [x] Left out: TestDome JavaScript and Node.js, Udemy MongooseJS Essentials
- [x] Each image converted from the PDF/PNG, AVIF and WebP, reasonable size; no email address or other personal data beyond the name
- [x] Verification URL per Certificate (ude.my, Educative's verify page); none for TestDome or CSS Wizard; no course hours
- [x] The validation test checks that every Certificate's image exists
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-vg1p

## Notes

- Owner decision (2026-11-18): TestDome Certificates show no verification link. The criterion above, `docs_src/specs/units.md` (Certificate view, Copy skills example), portfolio-63rn and portfolio-8a73 were amended to match.
- Red run: the three new or changed Certificate tests (image in both formats, files in `public/`, verification URLs) failed before the content and images landed.
- Verification URLs: Udemy from the `ude.my` address printed on each certificate; Educative from the QR code on each certificate (matches the printed Certification ID).
- Open for the Owner: the certificate images still print course hours (Udemy, Educative). The data carries none; the images were left uncropped.

## Summary of Changes

- `frontend/public/certificates/`: the ten Certificates as `<id>.avif` and `<id>.webp`, converted from the PDFs/PNGs in `support_files/skills/Zertifikate/`, at most 1200 px wide, metadata stripped, 14 to 144 KB each. Only the name shows as personal data.
- Contract: `Certificate.image` is now `CertificateImage` (`{ avif, webp }`, both paths from the site root), so 3.6 can render AVIF with the WebP fallback.
- `content.ts`: verification URLs for the Udemy (`ude.my`) and Educative (verify page) Certificates; none for TestDome (Owner decision) or CSS Wizard.
- `_specs_/content.test.ts`: pins both image paths, checks every image file exists in `public/` within a byte budget, and pins the verification URL per Certificate.
- Spec and downstream beans (63rn, 8a73) amended: no TestDome verification link.
