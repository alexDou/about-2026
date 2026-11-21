# Portfolio Units (Vertical Walking Skeletons)

Each unit is a complete, test-verified end-to-end slice: the Octane frontend (`frontend/`), plus the Python backend (`backend/`, a Cloudflare Worker, ADR 0006) where the unit needs one. Vocabulary: `CONTEXT.md`. Decisions: `docs/adr/`.

## Objectives

- **What**: the Owner's CV as an interactive site. An SPA: the Visitor lands on the animated logo, clicks, and Explore with five Panels is revealed.
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
   - Develop each module (API route, service, hook, component) against mocks built on the contracts.
   - No running backend needed for frontend work and vice versa.
   - Verified hermetically with offline unit/component tests (`pytest`, `vitest`).
3. **Stage Final: Connect Everything Together (`Unit X.N`)**:
   - Cucumber + Playwright E2E against the real frontend build, plus the running backend for units that use it.
   - Verifies the live end-to-end flow and, where the backend is involved, the latency budget (<50ms).

---

Order: Explore → About → Skills → Contact → What I do → Interview → Chat → Deploy. All eight make the launch milestone.

## Unit 1: Explore

**Objective**: the Landing → Explore flow, with five Panels that expand and collapse, real URLs and the mobile layout. Panels are shells that show only their titles; later units fill them.

**Design**

Reference: the expanded menu of codepen `fluxus/gPWvZm` (local copy in git-ignored `support_files/page/`). Only the expanded menu and its title style are taken.

- **Layout**
  - Panels, in order: About, What I do, Skills, Chat with me, Contact.
  - Desktop: full-height columns sharing the width evenly. Explore is at least 32rem tall. The title sits a tenth of the Panel's width above the middle, as in the pen.
  - Mobile (below 840px wide): full-width rows sharing the height evenly. Explore is at least 420px tall. Two flaws of the pen are fixed: rows never shrink to a sliver on narrow screens, and titles are centred on both axes by layout, not by an offset.
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
  - Every route change plays its transition, whatever caused it: the logo click, a Panel title, a Stripe, the close button, Escape, a direct visit to `/explore`, a reload of it and browser Back/Forward alike (a direct visit or reload of an Expanded panel shows it at once under Explore's entrance, see Stages). The site does not track the cause of a change or what was open before (ADR 0004).
  - Entrance, whenever Explore appears (the logo click, a direct visit, a reload, Back/Forward from the Landing), as in the pen: Explore slides in (300ms), the Panels follow 150ms apart, the titles fade in (140ms). Clicks, the close button and Escape are ignored until it ends (Explore is busy, as it is during a sequence); with reduced motion there is no entrance to wait for.
  - Expanding on desktop: the other Panels' content fades out (120ms), the widths animate (500ms, ease-in-out), then the Stripes fade in (400ms) while the Expanded panel's content fades in faster (150ms). Collapsing runs the same steps backwards. Switching Panels (one Expanded panel to another) by a Stripe click: smooth scroll to the top (skipped when already there; the route changes when the scroll has ended), then one step like mobile: nothing fades, the previous Panel's width shrinks to a Stripe while the new one's grows (500ms, ease-in-out).
  - Expanding on mobile: no fade-out and no collapse step. The other rows shrink and the chosen one expands. Switching scrolls smoothly to the top first, then plays the same single step.
  - Each Panel keeps one stable slot on Explore. Only the slot's size animates; the Panel, Stripe and Expanded panel views fade into each other inside it. CSS only: the durations are CSS custom properties kept in one place, and the steps chain on `transitionend`.
  - Clicks are ignored while a sequence runs, as in the pen. A route change by Back/Forward during a sequence drops the stages still to play and plays the way from the stage on screen to the new state, so what it plays depends on what is on screen, not on what was open before or on what caused the change.
  - Stages: Explore is a small tree of stages (Panels shown → slots even, views faded out → one slot resized → Stripes and page shown). A sequence walks the tree from the stage on screen to the route's stage; switching Panels is one stage (the target's), since a fade-out and fade-in between two Expanded panels would show nothing the sizes do not. A stage ends when the slots and views it changes report that their CSS transitions ended (a stage that changes none is skipped; with reduced motion every stage is skipped, so every step is instant). The route reaches Explore's motion a frame after it changes. A direct visit or reload of an Expanded panel shows it at once under Explore's entrance, with no stages. The outgoing page is not kept: the route's `Outlet` shows the new page only in the slot the route names, so a closing or switching Expanded panel fades out without a page, and Explore follows the route a frame later.
  - Reduced motion: every step is instant. Focus: expanding moves it to the Expanded panel's heading; collapsing returns it to the Panel that was open.
- **URLs and history**
  - `/` Landing, `/explore` Explore default, `/about`, `/what-i-do`, `/skills`, `/chat`, `/contact` per Expanded panel, through TanStack Router (`@octanejs/tanstack-router`, code-defined routes, ADR 0004).
  - Panels and Stripes are real links, so opening one in a new tab works; normal clicks are handled in the app.
  - Every state change adds a history entry, the logo click included, so Back from `/explore` shows the Landing. The site itself offers no way back to the Landing.
  - An unknown path is replaced by `/`, and a trailing slash is dropped, both without a history entry.
  - Browser scroll restoration is off; every Explore state starts at the top.
  - Document title: "A.Durnev portfolio" on `/` and `/explore`, "<Panel> · A.Durnev portfolio" per Expanded panel. `theme-color` follows the Expanded panel's color.
- **Text**: all UI text is FormatJS (ICU) messages (ADR 0003). The setup and the message files (one per page or area, ids prefixed by area, e.g. `explore.panel.skills.title`) live in `src/i18n/`; `useIntl()` is a shared hook. A Panel has a Sublabel when its Sublabel message exists. An unknown message id fails the type check, and a test checks that every message parses as ICU.
- **Backend status**: the Landing keeps its status badge. One shared health check runs on page load and again whenever Chat with me or Contact opens. While the backend is down, both show an offline note.
- **Search engines**: `<meta name="robots" content="noindex, nofollow">` (the matching `X-Robots-Tag` header comes with Unit 8). `robots.txt` lets ordinary crawlers in, so they read the `noindex`, and disallows AI-training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, …).
- **Code layout**: the router matches the URL and renders the screen: `App` is the root route's component (messages and an `Outlet`), `LandingPage` is the route of `/`, and Explore is a layout route whose `Outlet` shows the Expanded panel's page, one page route per Panel (`staticData: { panel }` tells Explore which one is Expanded). There is no `switch` on the route in any component. Explore (`components/domain/explore/`, rendered by `pages/explore/ExplorePage`) owns the Panel, Stripe and Expanded panel components and gives each Panel its tone by position. One page per Panel in `pages/`; `Heading` in `components/ui/`. `hooks/useRoute` holds the Panel ids and their order, id ↔ path, Explore state, the router factory (components passed in, so the module imports none) and `useRoute()` (`explore`, `navigate`, `link`); `app/router.ts` supplies the real components. There is no separate Panel config.

**Sub-unit breakdown**
- 1.0: Panel ids and order, the id ↔ path map, Explore state type (`default | expanded(panel)`), the URL ↔ state mapping and the message-id type, locked by tests.
- 1.x: FormatJS setup with `en` messages; font and palette tokens; routing on TanStack Router (replacing the own route hook of 1.3); Heading, Panel, Stripe and Expanded panel; Explore layout with the desktop and mobile expand/collapse sequences; Landing → Explore entrance; document title and `theme-color`; shared health check and offline notes; `noindex` + `robots.txt`; the stale `logo/` mentions in `AnimatedLogo` (the playground moved to `support_files/logo/`).
- 1.N: E2E for deep links, Back/Forward, unknown paths, expanding from a Stripe, the close button and Escape restoring the default, and the mobile layout.

**Definition of Done**: every URL renders the right state; every route change animates the same way (respecting reduced motion); mobile follows its own layout; E2E green.

## Unit 2: About

**Objective**: the About Panel, in the first person: name, Headline, photo, Bio, work experience (Roles), education, languages, Hobbies, citizenship, and the CV download.

**Decided**:
- Source: the 2026 CV (`support_files/about/`, git-ignored). The site text is rewritten, not copied: condensed, first person, the CV's typos fixed.
- Kept off About: the CV's expertise blocks (Skills, Unit 3) and "Core expertise" (raw material for Takeovers, Unit 5); phone and email (Contact, Unit 4). LinkedIn and GitHub appear on both.
- Headline, Bio, Roles and Hobbies are written together with the Owner: each gets a questionnaire, then a draft the Owner approves.
- Education: the degree as in the CV, plus one business-level sentence on the product and business thinking it built.
- Languages: Russian (native), English: fluent (C1), German: good working knowledge (B2), Spanish: basic (A2); word plus CEFR level. Ukrainian is left out.
- Citizenship: "A permanent EU resident", said in the Bio (not a badge). No visa wording: a permanent resident needs no visa.
- Kinds of work: permanent full-time or contract; remote preferred, hybrid possible (said in the Bio); open to relocation anywhere on good conditions (no place named). The target roles go into the Headline.
- Availability badges: six, big and readable, sized in rem, in a wrapping flex row at the top left, level with the Expanded panel's close button; on desktop one row with a good margin to the button. Available Now (starburst, green only), Full-time, Contract, Relocation, Remote work, AI ready. Each is our own inline SVG drawn after the shape and colours of its reference (`support_files/about/*_badge.*`, watermarked stock: reference only), its text from the messages, and an expressive `title`: Available Now "Can start immediately."; Full-time ("FULL-TIME") "Open to a permanent, full-time position."; Contract "Open to contract work."; Relocation "Open to relocation anywhere, for the right offer."; Remote work ("REMOTE WORK / READY") "Remote first, with years in distributed international teams."; AI ready "I build AI features into products and work with agentic, AI-assisted development."
- Cards, in order: the top card; the Bio; Roles; Education; Languages and Hobbies (two columns on desktop, stacked on phones; both short lists, each Hobby with a few words of its own). Cards have a light `--panel-what-i-do` background. The top card also has a rounded border in a palette colour (`--panel-skills`), radius as in the reference.
- Bio (approved, content review rounds 8 to 10, `docs_src/about/bio.md`): two paragraphs, two messages. Professional: "Full-stack by trade, equally solid on the frontend and the backend. My work rests on the fundamentals of the craft: system design, clean code and architecture, test-driven development, refactoring and domain-driven design. A proven ability to turn complex business requirements into scalable, maintainable software. AI ready: I build AI-powered features into products and work in agentic, AI-assisted development, keeping both the agents and the code they generate under thorough control." Personal: "Born in Moscow, based in Germany since 2019, a permanent EU resident. I prefer remote work and am open to hybrid." No birth date.
- Credo (approved, round 2): "A software engineer who fell for the web 20 years ago and never left. I still set time aside for experiments and discoveries: that's where the better solutions keep coming from." It is the line under the Headline in the top card (the first two sentences of the earlier Bio, which now holds only the personal facts).
- Top card, after `support_files/about/about-design.jpg` (no scroll arrow, no grey squares):
  - Left: the greeting "Hello, I'm Alexander Durnev." and, on its own line, the Headline (no location) in Playfair Display (self-hosted, OFL; About's greeting and section headings only, an exception to Overused Grotesk site-wide). Under it, the credo (working name), one smaller line in the spirit of the sample's quote (a bit bigger than the sample's), combining experience, passion for technology, team spirit and love of experimentation. It is not the Bio. LinkedIn and GitHub icons and the CV download button.
  - Right, centred vertically: the Owner's cut-out photo (`support_files/about/me.png`) over an SVG brush sketch (CC0/OFL asset, licence kept beside it) in `#25363a` at about 10%. Both responsive, taking about the same share of the card as in the reference.
  - No node burst: tried behind the links and dropped (Owner, 2026-11-14). Its 60×60 version is for the logo (a dimmed background or inside its "o", decided in a logo bean).
  - The photo is centred on the greeting and the credo (not the links row); its lower edge is frayed by the brush's outline and fades out, so no hard corners show.
  - The "About" heading stays the page's `h1` for screen readers and focus, visually hidden: the badges and the card open the page. The other pages keep theirs visible.
  - Phone: badges (small, growing only a little with the width), a gap, then the card: the photo, then the rest. On wider screens the card pulls up under the badge row.
- Roles: all five from the CV, newest first, each an optional intro plus highlights ("what was done. My role: ...") in the Owner's own words, and its technologies.
- CV download: English only while the site has one locale. Until portfolio-yhih ships the new CV, About links the 2026 PDF (`support_files/about/A.Durnev-CV_2026.pdf`) with the phone number stripped out, served as `frontend/public/cv/alexander-durnev-cv-en.pdf`.
- Content: after the contracts (2.0), a dedicated grilling bean works through the questionnaires in `docs_src/about/` (`headline.md`, `credo.md`, `roles.md`, `hobbies.md`, `education.md`), then drafts the message JSON for the Owner to approve.

**Open**: the content from the questionnaires.

**Sub-unit breakdown**: 2.0 About content type + JSON validation test (six badges, five Roles newest first, the language list); 2.1 content: questionnaires grilled with the Owner, then the message JSON; 2.2 assets (photo AVIF/WebP 1×/2×, Playfair Display woff2 + licence, brush SVG + licence); 2.3 badges (six SVG components, the badge row); 2.4 top card; 2.5 lower cards (Bio, Roles, Education, Languages and Hobbies); 2.6 CV link (the 2026 PDF without the phone number); 2.N E2E opening `/about`, the badges and cards render, the CV downloads. Order: 2.0 → 2.2 → 2.3 / 2.4 / 2.5 → 2.6 → 2.N, with 2.1 after 2.0 alongside; only 2.N waits for 2.1 (components are built on placeholder messages the 2.0 test accepts).

**Definition of Done**: content comes from the message JSON only; the CV file downloads.

## Unit 3: Skills

**Objective**: the Skills Panel: Skills in Skill groups, each explained in the Owner's words (no bars, no ratings), with the Certificates that back them.

**Decided** (grilling 2026-11-16):
- Source: the 2026 CV's expertise blocks and the Roles' technology lists (`support_files/about/`), the certificates in `support_files/skills/Zertifikate/` (both git-ignored). The CV's "Core expertise" list names kinds of work, not knowledge: it goes to What I do (Unit 5) as raw material for Takeovers, not to Skills.
- Model: a Skill group holds Skills and at most one level of Skill subgroups. A Skill is a name plus an overview: a short statement in the Owner's words. Groups and subgroups carry no statement of their own. Where the Owner gives a depth, the overview tells it in words ("expert", "confident", "application-level"), never as a label, bar or rating; an overview may instead say how the Owner uses the Skill (amended with the Owner, 3.1). No years per Skill, no demo links, no "used at" company mentions.
- Skill groups, in order (the Skill lists are examples; the questionnaires fix them). Eight since 3.1: the "Programming languages" group, decided in the grilling, was lost on the way to this list and restored by the Owner (2026-11-17); AI moved up to 4th.
  1. Programming languages: TypeScript, Python, Rust, PHP, Kotlin (no production experience: learnt and certified, very basic Spring) (fixed with the Owner in `docs_src/skills/programming-languages.md`).
  2. Frontend, in two subgroups (2026-11-18): "Frameworks & libraries" (React, Next.js, Preact, Vue, Svelte) and "Architecture & ecosystem": frontend architecture, build tooling, SSR & SSG, responsive UI, Figma to UI, UX principles, standards & accessibility (W3C, WCAG 2), SEO, performance optimisation, CSS, packages (fixed with the Owner in `docs_src/skills/frontend.md`).
  3. Backend, in two subgroups (reordered by the Owner, 2026-11-18): "Runtimes & frameworks" (Node.js, Express & Koa, ElysiaJS, NestJS/Hapi/Sails.js, Apollo, FastAPI, Actix, the PHP frameworks in one Skill) and "APIs & services" (the Owner claims no architect title): RESTful APIs, GraphQL, WebSockets & Socket.io (one Skill, "WebSockets, Socket.io"), Server-Sent Events, WebRTC, OpenAPI/Swagger, Kafka, "gRPC, AMQP and MQTT" (application-level knowledge). CQRS and microservices are patterns: What I do (Unit 5). No CMS is named (fixed with the Owner in `docs_src/skills/backend.md`).
  4. AI, in two subgroups (2026-11-18): "SDKs & agent frameworks" (OpenAI SDK, CrewAI, LangGraph, MCP, agent creation (Google ADK, Amazon Bedrock)) and "AI-assisted development": Claude Code & Codex, Antigravity, OpenCode, RAG with Obsidian & Karpathy Wiki, prompts, skills & rules. LangChain is not named (fixed with the Owner in `docs_src/skills/ai.md`).
  5. Databases & search, in three subgroups and no Skills of its own: "SQL" (PostgreSQL & MySQL, SQLite), "NoSQL" (Redis, MongoDB, DynamoDB, RethinkDB, ScyllaDB, Elasticsearch), "ORMs & drivers" (Prisma, TypeORM, SQLAlchemy, Mongoose & the MongoDB Node.js driver) (fixed with the Owner in `docs_src/skills/databases.md`).
  6. Cloud & DevOps (observability included), no subgroup: Docker & Docker Compose, Kubernetes, Terraform & Helm, GitLab CI & Jenkins, AWS, Google Cloud, Nginx & Apache, Linux (Bash scripting), Monitoring & Observability (Prometheus, Grafana, Instana, GTM, CloudWatch) (fixed with the Owner in `docs_src/skills/cloud-devops.md`).
  7. Testing & quality: Jest, Vitest & Mocha, pytest, React Testing Library & MSW, Cypress & Playwright, Cucumber & Gherkin, ESLint, Prettier & oxlint, Ruff & Clippy, Semgrep. TDD moves to Engineering practice (fixed with the Owner in `docs_src/skills/testing.md`).
  8. Engineering practice: SOLID, DRY, KISS, YAGNI & design patterns; clean code, clean architecture & deep modules; DDD, TDD & BDD; spec-driven development; legacy code & refactoring; code review; technical documentation & ADRs; Agile: Scrum & Kanban (fixed with the Owner in `docs_src/skills/practice.md`).
- Layout (amended 2026-11-18 after the first look): the "Skills" heading; a row with the Expand all switch (left) and the Copy skills button (right), one for the whole page, both one height (`--control-height`, 35px), Copy skills with a 20px radius (prototype round, 2026-11-18); then one accordion of Skill groups after the CodePen "CSS Responsive animated Accordion" (`support_files/skills/accordion`), inside the page's max-width and standard side margin: one wrapper, not separate cards, with a 1rem strip at its bottom (`::after`, the top one dropped by the Owner, 2026-11-18) in the darkest tone, and square corners throughout (no border radius on the wrapper or the names). In the light end of the palette (2026-11-18, second look): the content is always on the What I do colour `#d1dcd9` with the About text colour; only a group's or subgroup's name changes background, a step darker (`#b8c9c4`), and another when open (`#9db4ae`), in regular weight (400). A group's name is a band: left-aligned, a "+" on the right that turns into "×" when open. An open group holds its subgroups, each a name the full width of the group, smaller and shorter than a group's with more room on the left, then its Skills; a group with no subgroups holds its Skills as a plain list. Finer look later.
- Default view (amended 2026-11-18): every group closed, so the Visitor sees all eight group names without scrolling; what is inside is out of reach until the group opens. A click on a group opens it and every overview in it (so each subgroup is expanded), and the next click closes it; the Visitor closes what they do not need. An overview opens and closes with a quick, smooth CSS transition (no JS animation; none under reduced motion), and so does a group. The first pass kept every Skill name listed on a closed page, for scanning and Ctrl+F: replaced by this.
- A Skill's filled arrow is its only toggle (a button padded to a 24px target or more) and opens or closes its overview. The Skill's name is plain, selectable text.
- A group heading is a button whose state is whether the group shows (`aria-expanded`), closed by default: a click opens the group and every overview in it, the next click closes both. Opening or closing Skills by hand never opens or closes the group. A subgroup heading has a state of its own, closed by default: a click flips it and sets all its Skills to match (open all / close all). Opening or closing Skills by hand leaves it alone, except: all of them closed by hand → closed; all of them opened by hand → open, so the next click always does something visible. A heading acts on its own group or subgroup only. A Skill group holds Skills or subgroups, not both: Frontend, Backend and AI keep what were loose Skills in a first subgroup ("Frameworks & libraries", "Runtimes & frameworks", "SDKs & agent frameworks").
- Expand all: a convenience switch, the walking toggle below. Clicked, on opens every group and every overview, off closes every overview and every group, once the switch's walk has ended (the subgroup headings' states then follow by the rule above). It also follows the Skills (amended 2026-11-18, the Owner): every group and every overview open, by hand or by the switch → on; every overview closed, by hand or by the switch → off; a mix leaves it where it is, so it never flips back and forth under the Visitor's hand. A move the Skills cause walks like a click but opens and closes nothing.
- Walking toggle: after `support_files/skills/toogle/` (SCSS + React reference, no licence; ours is written after it in CSS Modules, no licence file kept), approved by the Owner in a prototype (2026-11-18): scaled so its track is the row's height (`--control-height`, the same as Copy skills), no face, no dirt particles, a 1s walk instead of 2.5s; head and legs `#25363a`, the track `#98b2ae` off and `#04b198` on (the Panel's teal moved toward grey, then toward the dark end). The walk plays only after the first change (the reference's `--animated` class from a `hasToggled` state). With reduced motion the handle only slides. It reports a change only when the walk (or the slide) has ended, so the overviews open after it. A button named by what a click does, "Expand all" while off and "Collapse all" while on (the `skills` messages, like every text on the site), with no visible label and no switch role (an action for a name and an on/off state would contradict: "Collapse all, on"): the name shows as a hint to the right of the switch on hover (pointers that hover) or keyboard focus, in CSS alone (`:hover` / `:focus-visible` on the switch, `~` to the hint, a fade and slide), in the palette. Not an HTML popover: a popover opens only by script or by `interestfor`, which Firefox and Safari lack (Owner, 2026-11-18).
- Certificates live inside the Skill they back, as a link in its overview, so they show only when the Skill is open: they back the words, they are not the headline. Every Skill with a certificate gets one, Elasticsearch's 2016 course included; no separate Certificates list. A Skill with one shows one link, "Certificate"; a Skill with two shows two links, each labelled by its issuer. The link opens the Certificate view: the certificate image, title, issuer, month and year, the TestDome ranking, and "Verify at the issuer" (the issuer's own verification URL; none for TestDome or CSS Wizard).
  - TypeScript: TestDome TypeScript (Jul 2020, top 10%).
  - Python: TestDome Python (Mar 2022, top 10%); Educative "Clean Code in Python" (Jun 2025).
  - Kotlin: Educative "The Ultimate Guide to Kotlin Programming" (Jun 2025).
  - CSS (Frontend, Architecture & ecosystem): modern.css "CSS Wizard", Modern CSS Quiz 20/20 (2026).
  - Docker: Educative "Docker for Developers" (Jun 2025).
  - Linux (Bash scripting): Udemy "BASH Programming Course: Master the Linux Command Line!" (Jul 2019).
  - AI Skills: Udemy "LLM Engineering: Master AI, Large Language Models & Agents" (Jul 2025); Udemy "AI Engineer Agentic Track: The Complete Agent & MCP Course" (Jan 2026).
  - Elasticsearch: Udemy "Getting Started with Elasticsearch" (Jul 2016).
  - Left out: TestDome JavaScript and Node.js (2019, replaced by the TypeScript test), Udemy MongooseJS Essentials. No course hours shown.
- Certificate files: images (AVIF/WebP, converted from the PDFs and PNGs: a PDF in an overlay renders unreliably on phones) in `frontend/public/certificates/` for now; on Google Cloud with Unit 8.
- The Certificate view is a `<dialog>` opened declaratively with Invoker Commands (`commandfor` + `command="show-modal"` on the link's button, `command="close"` inside), with a quick entry and exit animation in CSS (`@starting-style`); no `showModal()` call, no ref. 3.5 checks Octane passes the attributes through. Escape closes only the Certificate view, never the Expanded panel behind it.
- Copy skills copies everything, whatever is open on screen, as plain text indented two spaces per level: group, subgroup, Skill, overview, and a "Certified:" line per certificate, with its verification URL where it has one:
  ```
  Programming languages
    TypeScript
      <overview>
      Certified: TypeScript, TestDome, Jul 2020, top 10%
  Backend
    APIs & services
      RESTful APIs
        <overview>
  ```
  The clipboard write is imperative (`navigator.clipboard.writeText`), agreed with the Owner: it lives in a global, domain-agnostic hook in `hooks/` (like `useEscapeKey`), and the button shows "Copied" for a moment.
- Content: a dedicated bean grills one questionnaire per Skill group in `docs_src/skills/` with the Owner (the Owner's words polished, nothing invented, answers kept verbatim), then drafts the message JSON for the Owner to approve.

**Sub-unit breakdown**: 3.0 Skill group / Skill subgroup / Skill / Certificate content types + JSON validation test (unique ids, every Certificate used by exactly one Skill); 3.1 content: questionnaires grilled with the Owner, then the message JSON; 3.2 certificate images (AVIF/WebP in `public/certificates/`) and verification links, the test checks every image exists; 3.3 walking toggle (`components/ui/`, a quick `prototype` first for scale and speed); 3.4 Skill groups: groups, subgroups, Skills, the arrow, the heading rule; 3.5 Expand all; 3.6 Certificate view (Invoker Commands), the Escape rule; 3.7 Copy skills: the plain-text format and the clipboard hook; 3.N E2E opening `/skills`: a Skill's toggle, the heading rule, Expand all, copying, the Certificate view opening and closing (Escape leaves the Panel open). Order: 3.0 and 3.3 first; 3.1, 3.2 and 3.4 after 3.0; 3.5 after 3.3 and 3.4; 3.6 after 3.2 and 3.4; 3.7 after 3.4; 3.N after 3.1, 3.5, 3.6 and 3.7. Beans: portfolio-vg1p, -i2yz, -k6h6, -r41n, -3q18, -zb2n, -63rn, -8a73, -gcla.

**Definition of Done**: all Skills and Certificates render from the message JSON; Copy skills puts the full structured text on the clipboard.

## Unit 4: Contact

**Objective**: the Contact Panel: "Remote, worldwide", the LinkedIn and Xing links, the Contact notice and the Contact request form. A sent Contact request reaches the Owner by email and is never stored (ADR 0005). The API runs as a Python Worker on Cloudflare (ADR 0006).

**Problem**: A Visitor (a hiring manager or recruiter) who likes what they see on the site has no way to reach the Owner from it. The Contact Panel is an empty shell with only its heading and the offline note. The Owner wants to be reached without publishing a phone number or an email address, without keeping Visitor data on the site, and without paying for anything beyond the free tier. The form must not become a spam channel.

**Solution**: The Contact Panel shows "Remote, worldwide", the Owner's LinkedIn and Xing profiles, a Contact notice and a short Contact request form: name, company, an optional position description and an optional way to reach the Visitor. On submit, an invisible proof-of-work human check runs in the browser, and the backend emails the Contact request to the Owner's mailbox. Nothing is stored. The Visitor always knows the state of the form: what is wrong with a field, that it is sending, that it was sent, or that it failed and when they can try again. Bots are stopped by the human check and a honeypot; floods are stopped by a per-IP and a site-wide rate limit, built with the deploy in Unit 8.

**Decided** (grilling 2026-11-19, amended 2026-11-20 for Cloudflare Workers):
- **No Legal notice, no Privacy policy, no consent checkbox.** Only the Contact notice beside the form. No extra page or route: everything stays in the Contact Panel.
- **Layout** (after the Responsive Contact Form pen in `support_files/contact/`, for layout and feel only, not a look to copy; amended 2026-11-21, portfolio-653r):
  - The page opens with the heading "Contact me" (capitals, its own message; Explore's tile and the document title keep "Contact") and the subtitle "Let me know you're interested", a step smaller than the heading, in italic. The offline note follows.
  - No band: the form and the info block stand on the Panel's `#5c8b70`, centred on the page in columns of limited width, in the About colour `--panel-about`. This drops the earlier `#d1dcd9` band, which was there because body text on `#5c8b70` reaches only about 3:1. The Owner decided for the dark text anyway; it measures 3.23:1, which passes the 3:1 of non-text contrast (the rules, the rings) and not the 4.5:1 of body text. The inputs and the button carry their own contrast (light on dark, 8.97:1).
  - Wide screen (1180px and up): the form on the left, its button under it; the info block on the right, centred vertically against the form's fields. The info block is one `div` per item with a rule (`hr`) between each: 1 "Remote, worldwide" (globe icon, the standard font), 2 the Contact notice (italic), 3 the profile links (LinkedIn, Xing; round icons), 4 "* required".
  - From 840px to 1180px one column: the form, then the info block under it, rules included.
  - Below 840px one column reorders the same markup, with no rules: "Remote, worldwide", the form fields with the submit button, the notice, "* required", the links.
  - A field's label stands beside its input from 568px up and above it below 568px. The inputs and the button follow the pen's sizes: short boxes (about 34px) with a thin light border on a dark fill, the button as wide as the inputs and directly under them, with its text only; no textarea. The gaps are `--element-distance-small` (the fields, the info block) and `--element-distance-standard` (the panel).
  - Fonts: Amethysta for content, Playfair Display for headings, labels and the button. Palette colours only.
  - Every icon (the globe, the profile icons) is drawn by the shared `Icon` component from an SVG file in a `media/` folder. On Contact the profile icons are 1rem; About's stay as they were.
- **Profile links**: `ProfileLinks` moves from About's top card to `components/ui/profile-links/` (second consumer) and gains Xing (Simple Icons, CC0) and a `look` prop: About stays plain, Contact gets round icons with a hover ring. LinkedIn `https://www.linkedin.com/in/a-doo/`, Xing `https://www.xing.com/profile/Alexander_Doo`. About keeps LinkedIn and GitHub.
- **Contact notice** (an `en` message, translatable): "I use these details only to reply to your request. They reach me privately and are not stored or passed on to anyone."
- **Form fields**, visible labels (Playfair Display) beside or above each field, required marked "*" with a "* required" line:
  - name (label "Your name"): required, at most 80 characters;
  - company: required, at most 100;
  - position (label "You're hiring for"): optional, one line, at most 120;
  - contact ("How to reach you", hint "email, phone, LinkedIn, …"): optional, at most 200, free text in any channel, no format check.
  - Values are trimmed and stripped of control characters; whitespace only counts as empty. zod checks them in the browser; the backend checks the same rules again.
- **Form state shown to the Visitor**:
  - A field is checked when it loses focus and again on submit, never on every keystroke. The error shows as text under the field (`aria-invalid`, `aria-describedby`).
  - A character counter ("87 / 120") shows once a field passes 80% of its limit.
  - Submit with errors moves focus to the first invalid field.
  - While sending, the form is disabled and the button reads "Sending…".
  - Success hides the form and shows "Thank you, {name}. I'll get back to you soon." A reload brings the form back.
  - Any failure (422, failed human check, server or email error, network) brings the form back with its values and a generic "Your request wasn't sent. Please try again in {seconds} s.": submit stays locked for 10 s with a visible countdown.
  - 429: "Too many requests from your connection. Please try again in a few minutes." Built in Unit 8, with the rate limiter.
  - Field errors: "Please enter your name.", "Please enter your company.", "At most {max} characters."
  - While the backend is down, the form is disabled beside Unit 1's offline note; the links and the Contact notice stay.
- **Human check**: ALTCHA (self-hosted proof of work, MIT): the `altcha` widget from npm in the form, the `altcha` library from PyPI on the backend. Solved on submit, invisible, no third party, no cookies. Plus a hidden honeypot field (`website`): a filled honeypot gets a silent `204` and nothing is sent.
- **Contract**:
  - `GET /api/contact/challenge`: an ALTCHA challenge signed with `ALTCHA_HMAC_KEY`. The key is a random secret the Owner generates (`openssl rand -hex 32`). ALTCHA self-hosted has no account and no provider key, so the backend signs the challenge and checks the signature with this key. Changing the key only makes challenges already out fail.
  - `POST /api/contact`, JSON `{ name, company, position?, contact?, altcha, website? }`.
  - Responses: `204` sent, `422` invalid fields, `400` failed human check, `429` limit reached, `502` the email could not be sent.
  - The Contact client sits in the existing API service beside the health check, with a POST helper next to its GET helper. The zod schema lives there and the `ContactRequest` type is derived from it; the backend's Pydantic model mirrors fields and limits. Contract tests on both sides.
- **Email**:
  - Sent through the `send_email` binding of Cloudflare Email Service, to the Owner's mailbox. That mailbox is the account's only verified destination, so the binding cannot reach anyone else. No confirmation email to the Visitor, no phone push.
  - The sender address is on the Owner's domain, added to Cloudflare with Email Routing in Unit 8.
  - The binding is declared without a fixed address; the recipient and sender come from secrets, so no address goes into the repo.
  - Subject "Contact request: {name}, {company}" (CR/LF stripped).
  - Plain-text body: each field and the time in Europe/Berlin. `Reply-To` is the contact field when it parses as an email address.
  - Secrets: `MAIL_FROM`, `MAIL_TO`, `ALTCHA_HMAC_KEY`. Locally they're in the Worker's git-ignored secrets file (the list is in `backend/README.md`); deployed, they're Worker secrets (Unit 8).
  - The Gmail account and its app password from 2026-11-19 are retired: the local SMTP proof no longer applies. End-to-end proof is the first email sent from the deployed site (Unit 8).
- **Rate limit**, on Cloudflare's free plan. Moved to Unit 8 (decided 2026-11-21): the limiter is built and checked together with the Cloudflare deploy, so Unit 4 ships without it and without the `429` message. The design below is unchanged and is Unit 8's starting point (bean portfolio-vd9x); the `429` stays in the contract:
  - On `/api/contact`, 5 requests per 15 minutes per client IP, plus 100 a day site-wide. Both answer `429`.
  - Durable Objects keep the exact counts: one object per hashed client IP (`CF-Connecting-IP`, set by Cloudflare) and one site-wide object. Each request first deletes the timestamps older than the window with one SQL statement, then counts. There are no alarms (not documented for Python Workers).
  - In front of the Worker: Cloudflare's automatic DDoS protection, and the free plan's one WAF rate-limiting rule on `/api/*` per IP over 10 seconds (Unit 8, needs the domain).
  - The free plan never bills. Past 100k Worker requests a day, `/api` answers errors until 00:00 UTC, while the SPA (static assets, free and unlimited) stays up and shows the offline note. The Owner accepts that remaining case.
  - Unit 7 sets its own limit for `/api/chat`.
- **Tests**: no test starts a server or a fake service (no fake SMTP, no fake mailbox, no fake store). Every module is tested against the contracts of what it depends on, with those dependencies mocked:
  - Backend: pytest in plain CPython. The handlers, the human check and the mailer are plain Python modules (the rate limiter too, in Unit 8). Only a thin entry module imports the Workers runtime (`workers`). Endpoint tests call the route table in process with the env bindings (email; Durable Objects in Unit 8), the human check and the clock mocked along their contracts. The mailer's own tests check the message it hands the `send_email` binding.
  - Frontend: component tests mock the API client (or `fetch`) and the ALTCHA widget; the countdown runs on fake timers.
  - E2E (Unit 4 deviates from the AGENTS.md Stage Final here, by the Owner's decision): the frontend build with `/api/*` stubbed by Playwright routes along the contract, as `offline.feature` already does. No running backend.
  - Being hard to test is never a reason to drop or bend a feature: the test mocks the dependency instead.

**User stories**:

1. As a Visitor, I want to open the Contact Panel from Explore, so that I can get in touch with the Owner.
2. As a Visitor, I want to see the Contact heading in the Panel's own colour, as on the other Panels, so that the site feels consistent.
3. As a Visitor, I want to read "Remote, worldwide", so that I know the Owner works remotely from anywhere.
4. As a Visitor, I want to see the Owner's LinkedIn and Xing profiles as icon links, so that I can reach them on the network I use.
5. As a Visitor using a screen reader, I want each profile link named ("LinkedIn", "Xing"), so that I know where it leads.
6. As a Visitor, I want a visible ring when I hover or focus a profile icon, so that I can tell it is a link.
7. As a Visitor, I want the Contact notice beside the form, so that I know my details are used only to reply, reach the Owner privately, and are not stored or passed on.
8. As a Visitor, I want no consent checkbox to tick, so that sending a request takes no extra step.
9. As a Visitor, I want a visible label above every field, so that I still know what a field is after I start typing.
10. As a Visitor, I want required fields marked with "*" and a "* required" line, so that I know what I must fill in.
11. As a Visitor, I want to give only my name and company if I prefer, so that I don't have to share a phone number or email.
12. As a Visitor, I want an optional position field, so that I can say which role I am writing about.
13. As a Visitor, I want an optional "How to reach you" field with the hint "email, phone, LinkedIn, …", so that I can pick my own channel.
14. As a Visitor, I want a field checked when I leave it, not on every keystroke, so that I'm not scolded while typing.
15. As a Visitor, I want an error to appear as text under the field it belongs to, so that I know what to fix.
16. As a Visitor using a screen reader, I want an invalid field announced with its error, so that I can fix it without seeing the screen.
17. As a Visitor, I want a character counter once I near a field's limit, so that I'm not cut off by surprise.
18. As a Visitor, I want leading and trailing spaces ignored and a whitespace-only value treated as empty, so that a stray space doesn't cause an error or an empty request.
19. As a Visitor, I want focus to move to the first invalid field when I submit with errors, so that I can correct it at once.
20. As a Visitor, I want the form disabled and the button to read "Sending…" while my request is on its way, so that I don't send it twice.
21. As a Visitor, I want the human check to happen without a puzzle or a click, so that sending feels like any other form.
22. As a Visitor, I want the form replaced by "Thank you, {name}. I'll get back to you soon." when it is sent, so that I know it worked.
23. As a Visitor whose request failed, I want the form back with everything I typed, so that I don't have to type it again.
24. As a Visitor whose request failed, I want a generic reason and a 10-second countdown before I can retry, so that I know when to try again.
25. As a Visitor who sent too many requests, I want "Too many requests from your connection. Please try again in a few minutes.", so that I understand why it was refused. (Unit 8)
26. As a Visitor, I want the form disabled beside the offline note while the backend is down, while the links and the Contact notice stay, so that I can still reach the Owner another way.
27. As a Visitor on a phone, I want "Remote, worldwide" and the links first, then the fields, then the Contact notice right above the submit button, so that the notice is where I decide to send.
28. As a Visitor on a desktop, I want the links and the Contact notice on the left and the form on the right, so that I see everything at once.
29. As a Visitor, I want the texts in the site's language through its translations, so that a future locale translates them too.
30. As the Owner, I want each Contact request emailed to my own mailbox, so that I read requests where I already read mail.
31. As the Owner, I want the subject "Contact request: {name}, {company}", so that I can sort requests in my inbox.
32. As the Owner, I want a plain-text body with each field and the time in Europe/Berlin, so that I can read it on any mail client.
33. As the Owner, I want Reply-To set to the Visitor's contact when it is an email address, so that I can just hit reply.
34. As the Owner, I want nothing stored on the site, so that I have no Visitor data to protect, keep or delete.
35. As the Owner, I want a failed email reported to the Visitor (`502`), so that no request is lost silently.
36. As the Owner, I want bots that fail the human check rejected (`400`), so that my inbox gets only real requests.
37. As the Owner, I want a filled honeypot answered with a silent `204` and nothing sent, so that bots believe they succeeded and don't adapt.
38. As the Owner, I want 5 requests per 15 minutes per IP, so that a real Visitor can retry but one source can't flood me. (Unit 8)
39. As the Owner, I want a site-wide cap of 100 requests a day, so that a flood from many IPs can't fill my inbox or use up the free plan's quotas. (Unit 8)
40. As the Owner, I want the client IP taken from `CF-Connecting-IP`, which Cloudflare sets, so that a client can't forge its way past the limit.
41. As the Owner, I want CR/LF stripped from anything that goes into an email header, so that no one can inject headers.
42. As the Owner, I want the backend to check every field rule again, so that a crafted request can't bypass the browser's checks.
43. As the Owner, I want invalid fields answered with `422`, so that the API says clearly what it rejects.
44. As the Owner, I want the mail addresses and the ALTCHA key kept as Worker secrets, so that no address or secret ever lands in the repo.
45. As the Owner, I want the human check self-hosted with no third party and no cookies, so that the Contact notice stays true.
46. As the Owner, I want About to keep its LinkedIn and GitHub links unchanged when the profile links become shared, so that About doesn't regress.
47. As the Owner, I want the site to stay on Cloudflare's free plan and never be billed, so that a spike can at worst take `/api` down until midnight UTC while the site stays up with the offline note.

**Out of scope**:

- A Legal notice, a Privacy policy, a consent checkbox, or any extra page or route.
- Storing Contact requests anywhere (database, bucket, logs of the fields).
- A confirmation email to the Visitor; a phone push to the Owner.
- Cloud Run for the API, Cloud Armor, a load balancer, an nginx sidecar, FastAPI or any web framework.
- A free-text message field.
- Deploying is Unit 8: the domain on Cloudflare with Email Routing, the Worker secrets, the WAF rule, and every check and prototype. That includes CPU time per request under 10 ms (fallback: a TypeScript Worker), `altcha` and Pydantic under Pyodide, Durable Object SQL, `send_email`, WAF-blocked requests not counting toward the quota, and the first email from the deployed site.
- The rate limiter and its `429` message: Unit 8 (portfolio-vd9x).
- Chat's rate limit and storage (Unit 7).
- Fixing the Cloud Skill overview that still names Firestore (a separate bean once Unit 7 decides storage).

**Sub-unit breakdown** (tickets, vertical slices):
- 4.0a (portfolio-1b3v), the backend becomes a Python Worker: the route table, `/api/health`, `pywrangler dev`, the rules and AGENTS.md.
- 4.0, contracts: the zod schema ↔ Pydantic model, the challenge response and the status codes.
- 4.1, shared profile links with Xing.
- 4.2, the Contact Panel layout.
- 4.3, sending a Contact request (the tracer bullet: form, `POST /api/contact`, mailer).
- 4.4, field feedback.
- 4.5, failure and offline states.
- 4.6, the human check and the honeypot.
- 4.N, Contact E2E and the Definition of Done.

Order: 4.0a and 4.1 first; 4.0 after 4.0a; 4.2 after 4.1; 4.3 after 4.0 and 4.2; 4.4 and 4.5 after 4.3; 4.6 after 4.3 and 4.5; 4.N after all. Beans: the epic portfolio-yxux and its stages portfolio-1b3v (4.0a), -m7rt (4.0), -trgn (4.1), -0hxh (4.2), -zmw2 (4.3), -8gew (4.4), -dhsr (4.5), -m1de (4.6), -9pe4 (4.N).

**Definition of Done**: a sent Contact request reaches the Owner by email and nothing is stored; bots (failed human check, filled honeypot) are rejected (floods: the rate limiter, Unit 8); unit, component and E2E tests green.

## Unit 5: What I do

**Objective**: the 36 Takeovers, in 6 Takeover groups of 6. Each Takeover: title, why the Owner fits, what the Owner does in that regard.

**Input**: the CV's "Core expertise" list (Full Stack Engineering, Technical Leadership, Product Development, Software Architecture, AI Integration, Micro-services & scalable frontends, Frontend Engineering, Backend Engineering, Performance Optimization, Cloud Infrastructure, Application Modernization): kinds of work, so raw material for Takeovers (decided in Unit 3's grilling). Also CQRS, microservices, system design and mentoring, taken off Skills in its content round (3.1).

**Sub-unit breakdown**: 5.0 Takeover content type + JSON validation test enforcing 36 = 6 × 6; 5.x presentation; 5.N E2E.

**Open**: the presentation. Idea: a dice game (two dice pick a Takeover) and an accordion by group, at the Visitor's choice. Explore it with the `prototype` skill first.

## Unit 6: Interview

**Objective**: build the Agent's Knowledge through a long, thorough, picky text Interview of the Owner, run by Claude Opus 5.5. It covers all 36 Takeovers, the Skills, experience, hobbies: everything (for example: what the Python GIL does, how the Node.js event loop works, which database for write-heavy loads and why, how to start a corporate-scale app from scratch, agentic development).

**Open**: everything about how it runs and where the answers go. Design in this unit.

## Unit 7: Chat

**Objective**: the Chat with me Panel: an Agent that answers Visitors about the Owner from its Knowledge (Panel content, Vault, Interview answers) and keeps a Memory of Visitors and their conversations. The browser talks only to the backend (`/api/chat`, the Worker of ADR 0006); the Worker talks to the Agent, built with Google ADK and run on Cloud Run's free tier (decided in Unit 4's grilling: ADK for the experience of it, plus its guardrails, governance and token management). The Worker → Cloud Run lock is designed here.

**Design**: the chat sits on a `#d1dcd9` surface, because palette text reaches only about 3:1 on the Panel's `#4c839f` (Unit 1). While the backend is down, Unit 1's offline note takes the chat's place.

**Open** (all deferred to this unit): the Agent's voice (first person as the Owner, or a representative) and how it marks extrapolation; how it deflects beyond its Knowledge; Visitor identity and consent for Memory; retention; how the Owner reviews what Visitors ask; hand-off to Contact; off-limits topics; how Knowledge is stored (RAG, long context or combined).

## Unit 8: Deploy

**Objective**: run the site: the SPA as static assets and the API as a Python Worker on Cloudflare's free plan (ADR 0006), the Agent on Google Cloud (Unit 7).

**From Unit 4**:
- The Owner's domain on Cloudflare, with Email Routing and the Owner's mailbox verified as a destination.
- The Worker secrets (`MAIL_FROM`, `MAIL_TO`, `ALTCHA_HMAC_KEY`).
- The WAF rate-limiting rule on `/api/*`.
- The rate limiter (portfolio-vd9x): Durable Objects, the `429` and its message in the form, as decided in Unit 4's "Rate limit" (moved here 2026-11-21).
- Checks and prototypes, all here:
  - CPU time per request under the free plan's 10 ms (fallback: the same design as a TypeScript Worker);
  - `altcha` and Pydantic under Pyodide;
  - Durable Object SQL counting;
  - `send_email` from the Worker;
  - WAF-blocked requests not counting toward the Worker's daily quota;
  - the first email sent from the deployed site.

**Open**: the domain name, CI/CD, and the Agent's Google Cloud setup (Unit 7).
