# Portfolio Units (Vertical Walking Skeletons)

Each unit is a complete, test-verified end-to-end slice: the Octane frontend (`frontend/`), plus the FastAPI backend (`backend/`) where the unit needs one. Vocabulary: `CONTEXT.md`. Decisions: `docs/adr/`.

## Objectives

- **What**: the Owner's CV as an interactive site. An SPA: the Visitor lands on the animated logo, clicks, and the Board with five Panels is revealed.
- **For whom**: hiring managers and recruiters for Senior Full Stack / Technical Lead roles. Not a business, not freelance.
- **Focus**: the content and how the Visitor experiences it. The stack is the Owner's own practice, not a deliverable: when the two conflict, the Visitor's experience wins.
- **Scope**: English only (content runs through react-intl, so other locales stay possible). No SEO; the site is bot-protected.
- **Launch**: once a first version of every unit below exists. No deadline, but keep it short.

## Specification & Ticket Breakdown Protocol: Contract-First Staging

All unit specifications, task matrices, and ticket breakdowns follow a strict 3-stage lifecycle:

1. **Stage 0: Domains, Interfaces & Contracts First (`Unit X.0`)**:
   - Where data crosses HTTP (Contact, Chat): lock the Pydantic models and the matching frontend TS types (no codegen, they must match field for field — `.claude/rules/api-contract.md`). Contract tests on both sides (`pytest` response shape, `vitest` service parsing).
   - Where content is static frontend JSON (About, Skills, What I do): lock the TS type of the content and a `vitest` test that validates the JSON against it, including invariants such as 36 Takeovers.
   - Contract tests pass before any feature code starts.
2. **Stage 1..N: Subsystem Modules in Isolation (`Unit X.1`, `X.2`, `X.3`, ...)**:
   - Develop each module (FastAPI route, service, hook, component) against mocks built on the contracts.
   - No running backend needed for frontend work and vice versa.
   - Verified hermetically with offline unit/component tests (`pytest`, `vitest`).
3. **Stage Final: Connect Everything Together (`Unit X.N`)**:
   - Cucumber + Playwright E2E against the real frontend build, plus the running backend for units that use it.
   - Verifies the live end-to-end flow and, where the backend is involved, the latency budget (<50ms).

---

Order: Board → About → Skills → Contact → What I do → Interview → Chat → Deploy. All eight make the launch milestone.

## Unit 1: Board

**Objective**: the Landing → Board flow, with five Panels that expand and collapse, real URLs and the mobile layout. Panels are empty shells; later units fill them.

**Design**
- Clicking the Landing logo reveals the Board with a staggered Panel entrance. Reference: the expanded menu of codepen `fluxus/gPWvZm` (local copy in git-ignored `support_files/page/`); only the expanded menu is taken.
- Default state: five full-height Panels sharing the width evenly, in order Skills, What I do, Chat with me, About, Contact. Optional Sublabels ("36 take overs", "AI agent trained on my data").
- Clicking a Panel expands it with animation: Panels to its left slide left, Panels to its right slide right, and they condense into Stripes with vertical titles. Sublabels disappear. A close button at the top-right restores the default state. Clicking any Panel title in any state, Stripes included, expands that Panel.
- Mobile: Panels stack as rows; expansion mirrors desktop (up/down, horizontal Stripes).
- URLs: `/` Landing, `/explore` Board default, `/skills`, `/what-i-do`, `/chat`, `/about`, `/contact` per Expanded panel. Deep links work and skip the Landing; browser back works. No in-UI way back to the Landing.
- Colors: the Landing palette stays as is; Panel colors are given per task.

**Sub-unit breakdown**
- 1.0: Panel ids, route map and board state type (`default | expanded(panel)`), locked by tests.
- 1.x: board state + routing hook; Panel and Stripe components; Landing → Board reveal; mobile layout; react-intl setup with `en` messages (Octane ships `octane/react`: verify react-intl runs via a `react` → `octane/react` alias, fall back to `@formatjs/intl` if not); `noindex` + `robots.txt`.
- 1.N: E2E for deep links, back button, expanding from a Stripe, close restores the default.

**Definition of Done**: every URL renders the right state, transitions animate (and respect reduced motion), mobile mirrors desktop, E2E green.

**Open**: Panel colors. Stale `logo/` mentions in the `AnimatedLogo` comments (the playground moved to `support_files/logo/`).

## Unit 2: About

**Objective**: the About Panel: photo, bio, education, work experience, languages, hobbies and passions, and the CV download in English and German.

**Sub-unit breakdown**: 2.0 About content type + JSON validation test; 2.x content sections and the CV downloads; 2.N E2E opening `/about` and downloading both CVs.

**Definition of Done**: content comes from the message JSON only; both CV files download.

## Unit 3: Skills

**Objective**: the Skills Panel: grouped Skills explained in the Owner's words (no bars, no ratings) and the Certificates.

**Sub-unit breakdown**: 3.0 Skills + Certificate content types + JSON validation test; 3.x rendering; 3.N E2E opening `/skills`.

**Definition of Done**: all Skills and Certificates render from the message JSON.

## Unit 4: Contact

**Objective**: the Contact Panel: GitHub and LinkedIn links, the Contact request form, the Legal notice and the Privacy policy.

**Design**
- Form fields: name (optional), company, position (optional, short), contact (any channel: email, phone, social). Consent checkboxes.
- Legal notice (name + postal address, §18 MStV) and Privacy policy beside or before the form.
- The backend stores each Contact request and emails the Owner (phone push later).
- Invisible human check on submit, plus per-IP rate limiting.

**Sub-unit breakdown**: 4.0 `ContactRequest` Pydantic model ↔ TS type + contract tests; 4.x form, `POST /api/contact`, storage module over Firestore (emulator locally, ADR 0002), email notification, human check + rate limit, legal texts; 4.N E2E submitting a request against the running backend.

**Definition of Done**: a submitted request is stored and the Owner gets an email; bots and floods are rejected.

**Open**: human-check provider (it goes into the Privacy policy); email sending service.

## Unit 5: What I do

**Objective**: the 36 Takeovers, in 6 Takeover groups of 6. Each Takeover: title, why the Owner fits, what the Owner does in that regard.

**Sub-unit breakdown**: 5.0 Takeover content type + JSON validation test enforcing 36 = 6 × 6; 5.x presentation; 5.N E2E.

**Open**: the presentation. Idea: a dice game (two dice pick a Takeover) and an accordion by group, at the Visitor's choice. Explore it with the `prototype` skill first.

## Unit 6: Interview

**Objective**: build the Agent's Knowledge through a long, thorough, picky text Interview of the Owner, run by Claude Opus 5.5. It covers all 36 Takeovers, the Skills, experience, hobbies: everything (for example: what the Python GIL does, how the Node.js event loop works, which database for write-heavy loads and why, how to start a corporate-scale app from scratch, agentic development).

**Open**: everything about how it runs and where the answers go. Design in this unit.

## Unit 7: Chat

**Objective**: the Chat with me Panel: an Agent that answers Visitors about the Owner from its Knowledge (Panel content, Vault, Interview answers) and keeps a Memory of Visitors and their conversations. The browser talks only to the backend (`/api/chat`); the backend talks to the Agent, hosted on Google's agent platform (free tier).

**Open** (all deferred to this unit): the Agent's voice (first person as the Owner, or a representative) and how it marks extrapolation; how it deflects beyond its Knowledge; Visitor identity and consent for Memory; retention; how the Owner reviews what Visitors ask; hand-off to Contact; off-limits topics; how Knowledge is stored (RAG, long context or combined).

## Unit 8: Deploy

**Objective**: run the site on Google Cloud: the SPA, the FastAPI backend, Firestore and the Agent.

**Open**: hosting services, domain, secrets, CI/CD.
