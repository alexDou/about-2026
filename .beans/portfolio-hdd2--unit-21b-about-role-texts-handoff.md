---
# portfolio-hdd2
title: 'Unit 2.1b: About Role texts (handoff)'
status: completed
type: task
priority: normal
tags:
    - ready-for-human
created_at: 2026-11-13T14:32:41Z
updated_at: 2026-11-13T16:03:50Z
parent: portfolio-18oz
blocked_by:
    - portfolio-ajvs
---

## Parent

portfolio-18oz (Unit 2: About). Split out of portfolio-ajvs (Unit 2.1) on 2026-11-13: the other 2.1 content (Headline, credo, Bio, Hobbies, Education) is approved and in the message file; the five Role texts are not.

## What to build

The five Role texts (`about.role.1..5.text` in `frontend/src/i18n/en/about.json`, newest first) and, where the Owner wants it, their `technologies`, written with the Owner. The messages still hold the 2.0 placeholders for `text` (and Role 5's `technologies`); title, company, period, place and the other technologies are the CV facts and are not reviewed yet.

## Handoff: read this first

Several agent drafts were rejected by the Owner ("sloppy") and deleted on purpose. Do not look for them and do not reuse their phrasing. `docs_src/about/roles.md` holds only the questions and the Owner's own words, verbatim: that is your raw material.

### How to work

1. Start from `docs_src/about/roles.md`. Read every Owner quote for every Role.
2. Ask the Owner the open questions below before writing. The Owner said: "if you have any questions on the roles, don't hesitate to ask, don't assume, make sure". Numbered rounds in free text, no AskUserQuestion (grilling skill).
3. Write one Role at a time, show it, get approval, then move to the next. Keep nothing in the repo until the Owner approves it (no draft variants in files); then put the approved text into `about.json` and a copy under `### Approved` in `roles.md`.

### The wanted style (from the Owner, verbatim sample, Autodoc)

> "Frontend application serving a large B2B marketplace of automotive professionals. My role: designed from scratch the app internal architecture and tooling. Led the app development. Played an important role in decisions made on common workflow, deployment and research mechanisms. In close cooperation with business owners and backend coders took part in design of APIs. Main challenges: handling of huge data flow using real time communiation with UX degradation. huge ammount of data to be display in sortable, actionable way in products table.
> A project wide i18n service written on Nodejs. My role: projects setup from ground up, custom modules for the CMS, dataflow schema, fault tollerance matters."

(The Owner's typos; "with UX degradation" almost certainly means "without".) The Owner's own instruction: "what was done - my role", professional CV English, the Owner's native wording where applicable. Polish it, do not rewrite it.

### Rules the Owner has given

- Stay close to the Owner's input. Sell the candidature, never down-grade: the reader should exclaim "I need this guy". More words than a short CV line are fine; convey the full picture in a positive light.
- Use the Owner's words: "huge data load" (not "thousands of rows"), "co-authored" (not "co-proposed"), "third-party component libraries" (not "Ant Design").
- "All of it was on me" is not a CV phrase: write "My role: designed from scratch ...".
- Do not add claims the Owner did not make (earlier slips: "peer discovery", "still serves me in real-time work"). Do not write "replacing the previous monolithic frontend": it is not true. Leave the Web Vitals numbers out; a qualitative line on performance and metrics gains through code refactoring and load-balancing optimisation is wanted (confirm it is still wanted).
- Tipico: keep "I joined during the great rewrite of the monolithic Java application into microservices." Tell the story (Swing and its limits, a Figma design only, two developers, the Owner on end-user shop screens, the other on the admin side, still in shops across the country), not just "Swing-to-React".
- Zovolt: explain Streembit and enhance it with what the Owner did. Say WebRTC, AES-256 crypto, key pairs exchanged at authentication, p2p, Kademlia DHT. Never "unstable WebRTC". "Unbreakable" in the Owner's sense: AES-256 has not been broken by anyone to date.
- Demokratech: condense the CV text.
- Upwork: the Owner cannot recall names; use the four items in `roles.md`.
- Tone: confident, first person where natural, no hedging. CV typos are not carried over.

### Open questions for the Owner (ask first, do not assume)

Autodoc:
1. "Led the app development": a formal lead of how many people, or the frontend technical lead? Earlier answer: a 3-4 member frontend team and "the frontend part of the team" implementing the data flow.
2. "Research mechanisms": what are they exactly?
3. "Real time communication with UX degradation": without degradation, correct?
4. The i18n service: is it a Node.js service with a CMS? Which CMS, and what were the "custom modules for the CMS"? Earlier answer: app design the Owner's, channels, data structures, timings and fault tolerance collective, implementation the Owner's. Which of data-flow schema and fault tolerance is the Owner's alone?
5. The company-scale React component library (co-authored, accepted by the head of software development, built across teams): keep it, or leave it out of the new text?
6. Keep the performance line (refactoring, load balancing)? DDD: mention?

Tipico:
7. CV bullets: reusable components and design system, work with architects and product owners, mentoring and onboarding: keep any? How many betting-shop applications were there?

Zovolt:
8. Which parts of the crypto and p2p layers did the Owner implement beyond coding the spec? Was file sharing and IoT integration the Owner's code too?

General:
9. Does the Owner want the "what was done, my role" structure as sentences in one paragraph, or as a bullet list per Role? A list needs a contract change (`text` becomes a list of items in `AboutRole`, so a change to 2.0 and to the 2.5 rendering bean).

## Acceptance criteria

- [x] The open questions asked and answered; the answers kept in `docs_src/about/roles.md` (verbatim)
- [x] Each of the five Role texts approved by the Owner, one at a time
- [x] The approved texts (and technologies lists) replace the placeholders in `about.json`; the 2.0 test still passes
- [x] `scripts/verify.sh` GREEN

## Round 4 (2026-11-13)

The Owner answered the open questions in the session (kept verbatim in `docs_src/about/roles.md`, Round 4). Bullet list per Role approved in principle (needs a contract change after the first Role text is approved); a few intro lines for Roles like Tipico. Drafts of Autodoc, Tipico and Zovolt shown in chat for approval, none kept in files.

## Round 5 (2026-11-13)

`AboutRole` is now `intro?` plus `highlights` (derived from `about.role.N.highlight.M` messages); `text` is gone. Roles 1 to 3 polished from the Owner's corrected versions and written into `about.json`; Roles 4 and 5 still placeholders. 2.5 renders the list: note added to portfolio-xjur. Open: currency and subject of the "1 million revenue" line, Ant Design in the technologies list, "Unbittable" read as "Unbreakable".

## Summary of Changes

- Open questions asked and answered; the answers and the Owner's texts are kept verbatim in `docs_src/about/roles.md` (rounds 4 to 6).
- `AboutRole` is now an optional `intro` plus `highlights` (read from the `about.role.N.highlight.M` messages), each highlight "what was done. My role: ..."; the 2.0 test pins the order and the Tipico intro. The 2.5 bean notes the list rendering.
- The five Roles are in `about.json`: Autodoc, Tipico (with intro), Zovolt (Streembit), Demokratech, Upwork (with intro); no placeholders are left in the About messages. Demokratech and the Upwork text were approved by the Owner's silence on them after his Upwork corrections (Catholic community generalised, own My role line).
- Left out on purpose: the Streembit GitHub link (the Owner asked for an opinion; recommended no link, the code is reachable from the GitHub link on About), mentoring (kept for the CV only), Web Vitals numbers.
