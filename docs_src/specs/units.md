# Portfolio Units (Vertical Walking Skeletons)

Each unit is a complete, test-verified end-to-end slice: the Octane frontend (`frontend/`), plus the FastAPI backend (`backend/`) where the unit needs one. Vocabulary: `CONTEXT.md`. Decisions: `docs/adr/`.

## Objectives

- **What**: the Owner's CV as an interactive site. An SPA: the Visitor lands on the animated logo, clicks, and the Board with five Panels is revealed.
- **For whom**: hiring managers and recruiters for Senior Full Stack / Technical Lead roles. Not a business, not freelance.
- **Focus**: the content and how the Visitor experiences it. The stack is the Owner's own practice, not a deliverable: when the two conflict, the Visitor's experience wins.
- **Scope**: English only (content runs through FormatJS messages, ADR 0003, so other locales stay possible). No SEO; the site is bot-protected.
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

**Objective**: the Landing → Board flow, with five Panels that expand and collapse, real URLs and the mobile layout. Panels are shells that show only their titles; later units fill them.

**Design**

Reference: the expanded menu of codepen `fluxus/gPWvZm` (local copy in git-ignored `support_files/page/`). Only the expanded menu and its title style are taken.

- **Layout**
  - Panels, in order: About, What I do, Skills, Chat with me, Contact.
  - Desktop: full-height columns sharing the width evenly. The Board is at least 32rem tall. The title sits a tenth of the Panel's width above the middle, as in the pen.
  - Mobile (below 840px wide): full-width rows sharing the height evenly. The Board is at least 420px tall. Two flaws of the pen are fixed: rows never shrink to a sliver on narrow screens, and titles are centred on both axes by layout, not by an offset.
  - Titles: the pen's style (uppercase, wide letter-spacing), 1rem (the pen: 0.9rem), in Overused Grotesk (self-hosted, used site-wide). In the default state only the title is clickable. On hover and focus a row of moving dots (CSS only) slides in above the title, the Panel's full width and just tall enough for the dots, 1.2rem above it (the Sublabel hangs 0.6rem below it). On a phone the row stands at the Panel's left border as in the pen: on the title's height, from 4% in to before the text, as long as the space allows. A phone 440px wide or less has no dots. No line ever crosses the title.
  - Sublabels: optional, shown only in the default state. For now What I do ("36 Takeovers") and Chat with me ("AI agent trained on my data").
- **Expanded panel**
  - The page scrolls to show its full content.
  - A small circle-× close button sits at the top right, stays in view while scrolling, and has `title="Close <Panel>"`. Escape also closes. Clicking the Expanded panel itself does nothing.
  - Each page renders its own heading through a shared Heading component. In this unit a page is only its heading, which is enough to check the animation.
- **Stripes**
  - Desktop: the other Panels stand at the sides, as narrow as their title plus padding, title vertical top to bottom (English book spine), sticky while the page scrolls. The whole Stripe is clickable.
  - Mobile: the other Panels shrink to rows of title height plus a little padding (at least 44px), without Sublabels, not sticky.
- **Colors**
  - Panel palette: About `#25363a`, What I do `#d1dcd9`, Skills `#67b3a8`, Chat with me `#4c839f`, Contact `#5c8b70`. Text comes from the palette too: `#d1dcd9` on About, `#25363a` on the other four. The Landing palette stays as is.
  - The palette colors are global tokens; each component switches a tone class by prop (`classnames`).
  - `#25363a` reaches only about 3:1 on the blue and green Panels: enough for titles, below AA for body text. Body text in Chat with me and Contact therefore sits on a `#d1dcd9` surface (Units 4 and 7).
- **Motion**
  - Every route change plays its transition, whatever caused it: the logo click, a Panel title, a Stripe, the close button, Escape, a direct visit to `/explore`, a reload of it and browser Back/Forward alike (a direct visit or reload of an Expanded panel shows it at once under the Board's entrance, see Stages). The site does not track the cause of a change or what was open before (ADR 0004).
  - Entrance, whenever the Board appears (the logo click, a direct visit, a reload, Back/Forward from the Landing), as in the pen: the Board slides in (300ms), the Panels follow 150ms apart, the titles fade in (140ms). Clicks, the close button and Escape are ignored until it ends (the Board is busy, as it is during a sequence); with reduced motion there is no entrance to wait for.
  - Expanding on desktop: the other Panels' content fades out (120ms), the widths animate (500ms, ease-in-out), then the Stripes fade in (400ms) while the Expanded panel's content fades in faster (150ms). Collapsing runs the same steps backwards. Switching Panels (one Expanded panel to another) by a Stripe click: smooth scroll to the top (skipped when already there; the route changes when the scroll has ended), then one step like mobile: nothing fades, the previous Panel's width shrinks to a Stripe while the new one's grows (500ms, ease-in-out).
  - Expanding on mobile: no fade-out and no collapse step. The other rows shrink and the chosen one expands. Switching scrolls smoothly to the top first, then plays the same single step.
  - Each Panel keeps one stable slot on the Board. Only the slot's size animates; the Panel, Stripe and Expanded panel views fade into each other inside it. CSS only: the durations are CSS custom properties kept in one place, and the steps chain on `transitionend`.
  - Clicks are ignored while a sequence runs, as in the pen. A route change by Back/Forward during a sequence drops the stages still to play and plays the way from the stage on screen to the new state, so what it plays depends on what is on screen, not on what was open before or on what caused the change.
  - Stages: the Board is a small tree of stages (Panels shown → slots even, views faded out → one slot resized → Stripes and page shown). A sequence walks the tree from the stage on screen to the route's stage; switching Panels is one stage (the target's), since a fade-out and fade-in between two Expanded panels would show nothing the sizes do not. A stage ends when the slots and views it changes report that their CSS transitions ended (a stage that changes none is skipped; with reduced motion every stage is skipped, so every step is instant). The route reaches the Board's motion a frame after it changes. A direct visit or reload of an Expanded panel shows it at once under the Board's entrance, with no stages. The outgoing page is not kept: the route's `Outlet` shows the new page only in the slot the route names, so a closing or switching Expanded panel fades out without a page, and the Board follows the route a frame later.
  - Reduced motion: every step is instant. Focus: expanding moves it to the Expanded panel's heading; collapsing returns it to the Panel that was open.
- **URLs and history**
  - `/` Landing, `/explore` Board default, `/about`, `/what-i-do`, `/skills`, `/chat`, `/contact` per Expanded panel, through TanStack Router (`@octanejs/tanstack-router`, code-defined routes, ADR 0004).
  - Panels and Stripes are real links, so opening one in a new tab works; normal clicks are handled in the app.
  - Every state change adds a history entry, the logo click included, so Back from `/explore` shows the Landing. The site itself offers no way back to the Landing.
  - An unknown path is replaced by `/`, and a trailing slash is dropped, both without a history entry.
  - Browser scroll restoration is off; every Board state starts at the top.
  - Document title: "A.Durnev portfolio" on `/` and `/explore`, "<Panel> · A.Durnev portfolio" per Expanded panel. `theme-color` follows the Expanded panel's color.
- **Text**: all UI text is FormatJS (ICU) messages (ADR 0003). The setup and the message files (one per page or area, ids prefixed by area, e.g. `board.panel.skills.title`) live in `src/i18n/`; `useIntl()` is a shared hook. A Panel has a Sublabel when its Sublabel message exists. An unknown message id fails the type check, and a test checks that every message parses as ICU.
- **Backend status**: the Landing keeps its status badge. One shared health check runs on page load and again whenever Chat with me or Contact opens. While the backend is down, both show an offline note.
- **Search engines**: `<meta name="robots" content="noindex, nofollow">` (the matching `X-Robots-Tag` header comes with Unit 8). `robots.txt` lets ordinary crawlers in, so they read the `noindex`, and disallows AI-training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, …).
- **Code layout**: the router matches the URL and renders the screen: `App` is the root route's component (messages and an `Outlet`), `LandingPage` is the route of `/`, and the Board is a layout route whose `Outlet` shows the Expanded panel's page, one page route per Panel (`staticData: { panel }` tells the Board which one is Expanded). There is no `switch` on the route in any component. The Board (`components/domain/Board/`) owns the Panel, Stripe and Expanded panel components and gives each Panel its tone by position. One page per Panel in `pages/`; `Heading` in `components/ui/`. `hooks/useRoute` holds the Panel ids and their order, id ↔ path, the Board state, the router factory (components passed in, so the module imports none) and `useRoute()` (`board`, `navigate`, `link`); `app/router.ts` supplies the real components. There is no separate Panel config.

**Sub-unit breakdown**
- 1.0: Panel ids and order, the id ↔ path map, the Board state type (`default | expanded(panel)`), the URL ↔ state mapping and the message-id type, locked by tests.
- 1.x: FormatJS setup with `en` messages; font and palette tokens; routing on TanStack Router (replacing the own route hook of 1.3); Heading, Panel, Stripe and Expanded panel; Board layout with the desktop and mobile expand/collapse sequences; Landing → Board entrance; document title and `theme-color`; shared health check and offline notes; `noindex` + `robots.txt`; the stale `logo/` mentions in `AnimatedLogo` (the playground moved to `support_files/logo/`).
- 1.N: E2E for deep links, Back/Forward, unknown paths, expanding from a Stripe, the close button and Escape restoring the default, and the mobile layout.

**Definition of Done**: every URL renders the right state; every route change animates the same way (respecting reduced motion); mobile follows its own layout; E2E green.

## Unit 2: About

**Objective**: the About Panel, in the first person: name, Headline, photo, Bio, work experience (Roles), education, languages, Hobbies, citizenship, and the CV download.

**Decided**:
- Source: the 2026 CV (`support_files/about/`, git-ignored). The site text is rewritten, not copied: condensed, first person, the CV's typos fixed.
- Kept off About: the CV's expertise blocks and "Core expertise" (Skills, Unit 3); phone and email (Contact, Unit 4). LinkedIn and GitHub appear on both.
- Headline, Bio, Roles and Hobbies are written together with the Owner: each gets a questionnaire, then a draft the Owner approves.
- Education: the degree as in the CV, plus one business-level sentence on the product and business thinking it built.
- Languages: Russian (native), English: fluent (C1), German: good working knowledge (B2), Spanish: basic (A2); word plus CEFR level. Ukrainian is left out.
- Citizenship: "Permanent EU resident, no visa sponsorship required", said in the Bio (not a badge).
- Kinds of work: permanent full-time or contract; remote preferred, hybrid possible (said in the Bio); open to relocation anywhere on good conditions (no place named). The target roles go into the Headline.
- Availability badges: a row of six, big and readable, at the top left, level with the Expanded panel's close button: Available Now (starburst, green only), Full-time, Contract, Relocation, Remote work, AI ready. Shape references in `support_files/about/*_badge.*`.
- Cards, in order: the top card; the Bio; Roles; Education; Languages and Hobbies together. Cards have a light `--panel-what-i-do` background. The top card also has a rounded border in a palette colour.
- Top card, after `support_files/about/about-design.jpg` (no scroll arrow, no grey squares):
  - Left: the greeting "Hello, I'm Alexander Durnev. I'm a {Headline}." (no location) in Playfair Display (self-hosted, OFL; About's greeting and section headings only, an exception to Overused Grotesk site-wide). Under it, one smaller line in the spirit of the sample's quote (a bit bigger than the sample's), combining experience, passion for technology, team spirit and love of experimentation. It is not the Bio. LinkedIn and GitHub icons and the CV download button.
  - Right, centred vertically: the Owner's cut-out photo (`support_files/about/me.png`) over an SVG brush sketch (CC0/OFL asset, licence kept beside it).
  - Background: a faded node burst (a centre disc with radiating coloured lines ending in dots), generated after `support_files/about/IMG_7255.jpg`; also needed as a 60×60 SVG.
  - Phone: badges, then the photo, then the rest.
- Roles: all five from the CV, newest first, each with a condensed text of its own and its technologies.
- CV download: English only while the site has one locale. Until portfolio-yhih ships the new CV, About links the 2026 PDF (`support_files/about/A.Durnev-CV_2026.pdf`).

**Open**: badge drawing and colours, card border and brush colours, the node burst's look and the 60×60 use; the questionnaires and drafts.

**Sub-unit breakdown**: 2.0 About content type + JSON validation test; 2.x content sections and the CV download; 2.N E2E opening `/about` and downloading the CV.

**Definition of Done**: content comes from the message JSON only; the CV file downloads.

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
- Body text (form, Legal notice, Privacy policy) sits on a `#d1dcd9` surface: on the Panel's `#5c8b70`, palette text reaches only about 3:1 (Unit 1).
- While the backend is down, the form is disabled beside Unit 1's offline note. The Legal notice, the Privacy policy and the links stay available.

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

**Design**: the chat sits on a `#d1dcd9` surface, because palette text reaches only about 3:1 on the Panel's `#4c839f` (Unit 1). While the backend is down, Unit 1's offline note takes the chat's place.

**Open** (all deferred to this unit): the Agent's voice (first person as the Owner, or a representative) and how it marks extrapolation; how it deflects beyond its Knowledge; Visitor identity and consent for Memory; retention; how the Owner reviews what Visitors ask; hand-off to Contact; off-limits topics; how Knowledge is stored (RAG, long context or combined).

## Unit 8: Deploy

**Objective**: run the site on Google Cloud: the SPA, the FastAPI backend, Firestore and the Agent.

**Open**: hosting services, domain, secrets, CI/CD.
