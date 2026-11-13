# Roles questionnaire

One section per Role, newest first. Each ends as a first-person text plus its technologies. CV typos are not carried over ("Commulative", "convertion", "Ukranian", "Reduction on"); the new CV (portfolio-yhih) must get them right too.

No drafts are kept in this file: the Owner rejected the agent's variants (round 3). This file holds the questions and the Owner's own words, verbatim (typos included); the approved text is in `frontend/src/i18n/en/about.json`.

For every Role ask: **proudest work**, **scale** (users, traffic, team size, codebase), **team** (who, how many, where), **your part** (what only you did), **one number or outcome** you can stand behind.

## Round 1 questions (asked in the session, 2026-11-13)

10. Autodoc: your proudest work, the scale (users, team size), what only you did, and the numbers you can stand behind. Is the ~40% INP drop yours or the team's?
11. Tipico: the same questions. How many shops and users were affected by the Swing-to-React replacement?
12. Zovolt (Streembit): what was your part, and is the project public?
13. Demokratech: which government organization (or can it be named), what scale, and what was your part?
14. Upwork (2006–2015): which two or three projects stand out? Can any client or domain be named?

## 1. Senior Frontend Developer, Autodoc SE (May 2022 – May 2026, Germany)

**CV seed**: B2B marketplace for automotive professionals built from the ground up; frontend architecture replacing a monolith (independent team delivery); shared React component library replacing Ant Design; INP down ~40%, CLS removed, resources ~20% lower, conversion up (GTM); code reviews, mentoring. Tech: TypeScript, React, Next.js, Node.js, GraphQL, MySQL, Redis, Jest/RTL, Cypress, Playwright, micro-/hyper-frontends, Docker, CI/CD, Ant Design, Prometheus, New Relic.

### Answers

Round 1, verbatim:

> tasks in Autodoc gave not much of technology level challenges. however some achievements you can mention. choose yourself what to keep, and whats would not look that good for a senior level engineer.
> a. design of frontend application from scratch. choices on the app internal architecture, model of development, tooling and working process. My role: was on me from scratch. only model of development came from company wide requirements (DDD)
> b. participation in designing APIs. My role: we forged each endpoint together with backend guys, all team work.
> c. creation of internal company's i18n service. My role: design of the app - on me. communication channels, data structures, timings, fault tollerance matters - collectively in team. then, implementation - on me.
> d. real-time communication with underlying service and handling of vast amount of data (thousands of rows on one page) without deterioration of performance and correspondingly UX. My role: design of data flow - mostly on me; implementation - frontend part of the team.
> e. internal, company scale react components library to replace ant and other third-parties libs. My role: we knew that we need this library and on a frontend team meeting (3-4 members back then) decided to represent the idea to a head of sorfware development. a several meeting after that, docs, diagrams and the idea was accepted. the implementation was given to another team. guys have desiged the backbones while components were developed by frontend guys from teams across the company, me inclusive.

Round 2: the Web Vitals numbers (INP, resources) stay out ("is it a senior level achievement? more like under it"); mention significant progress on performance and metrics optimisation through code refactoring and load-balancing optimisation.

Round 3, the Owner's own sample of the wanted style and content, verbatim:

> "Frontend application serving a large B2B marketplace of automotive professionals. My role: designed from scratch the app internal architecture and tooling. Led the app development. Played an important role in decisions made on common workflow, deployment and research mechanisms. In close cooperation with business owners and backend coders took part in design of APIs. Main challenges: handling of huge data flow using real time communiation with UX degradation. huge ammount of data to be display in sortable, actionable way in products table.
> A project wide i18n service written on Nodejs. My role: projects setup from ground up, custom modules for the CMS, dataflow schema, fault tollerance matters."

Round 4 answers (2026-11-13), verbatim, to the open questions:

> 1. technical lead. a team of equally positioned developers. i senior, guys were middle an one junior. this is for your knowledge - not to post it like this
> 2. when, how much, to what exactly we should dedicate time to address opportunities to change to newer versions, faster tools, rethink, refactor etc
> 3. without ofc
> 4. CMS written on Nodejs. Strapi it is, but lets sip the name. custom modules: translation from JSON format that we were using in i18next-react to strapi format. json-to-strapi so to say. smt else cant recall now. data-flow schema: cache latest successful response on frontend to fallback to in a case of loss of availability of i18n service. caching layer redis. what goes to cdn, what goes to cms. + fault tollerance. me alone. again, not to copy. for your knowledge only. i need a professional wording that make sense in context of that we are doing
> 5. yes. it was our initiative that palyed very well for the whole company. a short line worth it
> 6. yes.
> 9. yes, it makes sense for me. it easier to read like this. but some parts, such as situation in Tipco need a few lines intro, which you will write.

Round 3 rulings: "replacing the previous monolithic frontend" is not true (the CV bullet is wrong for the Owner's part); "all of it was on me" is not a professional CV phrase; "thousands of rows" becomes "huge data load".

## 2. Senior Frontend Developer, Tipico GmbH (Sep 2019 – Apr 2022, Germany)

**CV seed**: retail betting platform, legacy Java Swing replaced by React + TypeScript in betting shops across Germany; greenfield apps; reusable components and design system; mentoring and onboarding. Tech: TypeScript, React, Node.js, GraphQL, Cypress, Jest/RTL, Java, MySQL, Kafka, Redis.

### Answers

Round 1, verbatim:

> yes, the main thing, and the only actually, was Swing-to-React transition. i found myself in the company in a period of great re-write of monolyth Java app to micro-services architecture. Swing was a part of the move. Swing has its limitations. things are not looking very good sometimes and there are not so much ways to improve compared with a typical frontend app. For a work start i had only a Figma design. all the frontend design and coded from scratch by 2 guys. I was working on end-users facing inerfaces. the app Tipico shop visitors see on the screens. another guy was working on admin-side UI - this is that shop owners, managers and company admins see. As i have seen it passing by a Tipico shop this UIs are still there. across the country.

Round 4 answer, verbatim:

> 7. here is the situation from the very beginning. I have mentioned this above. explain my role, explain design. do not focus too much on the other dev role

Round 3 rulings: keep the sentence "I joined during the great rewrite of the monolithic Java application into microservices." as written; "the Swing-to-React move" alone does not convey the picture, so tell the story.

## 3. Senior Web Developer, Zovolt Ltd (Nov 2017 – Mar 2019, remote, EU)

**CV seed**: Streembit, a peer-to-peer, decentralized, secure communication platform (video calls, text chat, IoT); blockchain concepts, Kademlia DHT, cryptographic protocols with thin documentation. Tech: JavaScript, Node.js, WebRTC, Blockchain, Kademlia DHT, P2P, WebSockets.

### Answers

Round 1, verbatim:

> designed by a head of development, absolutely brilliant guy. I was coding these specs. take the description from CV. It was public, it was life in beta. but then, the problems with fundings have driven the project to susspension. result: secure p2p communication platform with features of chat, files sharing, video conferencing that was working in browser. by saying secure i mean unbreakable based on AES-256 key pairs exchange.

Round 2, verbatim:

> it is unbreakable, AES-256 was not broken by anyone by now. key=pair exchange on auth level, AES-256 encryption of communications. write that looks professional based on info you have

Credo anecdote (credo.md, question 8), verbatim:

> with appearience of WebRTC from Google, we received an opportunity to replace Flash or ActiveX. Flash had a number of problems, ActiveX was not ideal too. but back of the days ( in my timeline these are Zovolt times ) the protocol was still not stable. let alone adapted by all major browsers and it took a lot of experimentations to figure out things that matter

Round 4 answer, verbatim:

> 8. yes, mine in a big deal. not coding the spec, but coding from specs. what we develop was defined by our brilliant software engineering lead. i have coded it. crypto as well. frontend, backend. we were working with codes that we ran on Raspberry Pi, as a side note. I coded many parts of Streembit project, part of which is public on Github

Round 3 rulings: "unstable WebRTC" is out, write just WebRTC, AES-256 crypto, key pairs, p2p. Explain what Streembit is and enhance it with what the Owner did.

## 4. Full Stack Developer, Demokratech (Jan 2015 – May 2017, remote, Sweden)

**CV seed**: meeting management platform for a government organization: agenda planning, live meetings, real-time streaming, recording and archival; backend services, REST APIs, rich JS apps. Tech: PHP 7, Yii2, JavaScript, MySQL, REST APIs, WebRTC.

### Answers

Round 1, verbatim:

> sweden county leading board. i cant recall the name now. my part is that from CV. summarize, condence somehow

## 5. Freelance Fullstack Web Developer, Upwork (Jan 2006 – Mar 2015, remote)

**CV seed**: commercial projects in e-commerce, social networking, media, business automation and CMS; full lifecycle from analysis to maintenance; international clients, startups, established businesses.

### Answers

Round 1, verbatim:

> hmm, cant recollect now. i mean i have to dig in my file and see whats still online. you can mention:
> - router/firewall management interface. full-stack work, a user set a rule described in plain english on UI in browser, with a tick or a select, and the system translated it to router configs and firewall rules, with application of those rules for a user(client) and reload of services etc
> - social networks, type of facebook, one for catholics in western Europe, another for pet owners, based on SocialEngine CMS (PHP, Zend Framework). my role: installation, setup for clients, custom plugins and modules
> - Magento plugins. checkout extension, custom delivery plugin
> - Workpress plugins. one or two of them ended up in official Workpress plugins repository. other were internal. i can't recall the name now and dont want to search for it

Round 2: the Catholic community network is named as such ("yea, your way").

## Round 5 (2026-11-13): the Owner's corrected versions, verbatim

Structure agreed: an optional intro and a list of highlights per Role, each "what was done. My role: ...". The texts below are the Owner's; the polished versions of Roles 1 to 3 are in `about.json` (`about.role.N.intro`, `about.role.N.highlight.M`).

### 1. Autodoc

> Application. Frontend application of a large B2B marketplace for automotive professionals, built within Domain-Driven Design (DDD) model. My role: technical lead. I designed the application's internal architecture and tooling from scratch and led its development.
> - Workflow and upkeep. I played an important role in the decisions on the common workflow and deployment. I also shaped how the team decides when, and how much time, to dedicate to technical debt.
> - APIs. I took part in forging the APIs, working closely with business owners and backend engineers.
> - Main challenge. Real-time communication channel with the underlying service serving a huge data flow, where data has to be shown in a sortable, actionable way without degrading performance or UX. My role: I designed the data flow and took part in implementation.
> - i18n service. A project-wide translation service (Node.js CMS). My role: I set up the project from the ground up and wrote custom CMS modules, including a converter from the JSON format of i18next to the CMS's own format. I designed the data-flow schema: caching layer, fault tollerance mechanisms and where finds itself a split between CDN and CMS obligations.
> - Component library. Our frontend team's initiative: a company-wide React component library that replaced third-party web-components libraries. My role: the initiative and taking part in implementation of components.
> - Results. the first version of this new service covered 1 mil. revenue mark in just 3 months. Significant progress in performance and metrics, resulting in better user reviews and about tangible growth of customers base.

### 2. Tipico

> Intro: I joined the company in a period of major rewrite of the monolithic Java application into microservices. The betting-shop screens were part of that move. They ran on Java Swing, which has its limitations, and role was to replace it with a React based application.
> - Frontend. Small team of frontend engineers overtook the required transfirmation. Tipico betting shops was designed and coded in React and TypeScript, starting from just a Figma designs. The work was split in two top-level chunks: UIs an actual customer sees in Tipico shops and admin part of the story, very well thought for shop owners, data providers and company's admins.
> - My role. Lead the Swing-React transformation. Architecture and implementation from scratch of entire application that serve shop visitors. Here belongs team work on shape of Java Spring Boot API, services communication schemas, data flow handling on frontend, fault tollerance, performance and UX matters.
> - Result. Successfully deployed and collected overwhelmingly positive reaction from end users. I've seen these interfaces on the screens in Tipico shop last time i passed by it.

### 3. Zovolt

> - Streembit. A decentralized, secure peer-to-peer communication platform that works in the browser: text chat, file sharing, video conferencing and IoT integration. It ran live in public beta until funding problems suspended the project. Part of the code is public on GitHub.
> - My role. While decisions on the system shape and components were made by our software engineering lead, I coded those from development specifications, ending up authoring many parts of the platform: frontend, backend incl. cryptography, IoT services, P2P node discoveries, CLI tools, etc.
> - Challanges. Unbittable security. Authentication level was based on private/public key pairs exchange, while all communication were AES-256 encrypted. Real time. WebRTC had just arrived as the alternative to Flash and ActiveX. It took extensive experimentation to find the proper reliability. Peer-to-peer layer. Emerging decentralized technologies such as blockchain concepts and a Kademlia DHT.
> - IoT. we have also experimented with IoT devices running our code on Raspberry Pi.

GitHub: Streembit https://github.com/streembit ; the Owner's repositories https://github.com/alexDou?tab=repositories&q=streembit

## Round 6 (2026-11-13), verbatim

> third-party web-components libraries
> 1. yes, the marketplace platform. Euro.
> 2. no, was antd, then our internal. keep it
> 3. i meant Unbeatable, which is also impregnable. spelling issue on my side
> 4. we keep mentoring for CV. here is ok to skip
> 5. argh.. it was advanced back then, but time passed by. it might look outdated. not sure. wdyt?
>
> Upwork. you were right. do not say catholics, expess it the way you suggested
> My role. Creation of custom modules and plugins specifically for a project.

Applied: "third-party web-components libraries", "€1 million revenue mark", Ant Design stays in the technologies list, "Unbeatable security", the Upwork social networks described as "a community in western Europe" with that My role line. Demokratech (Role 4) and the Upwork intro and bullets were shown in the session and not objected to otherwise. The Streembit GitHub link stays out of the text (see the session).

## Round 7 (2026-11-13), verbatim

> The technologies line holds only what you named: PHP, Zend Framework, SocialEngine CMS, Magento, WordPress. in Upwork? no, theres a lot more. dont mention CMS. keep: PHP7, Javascript, relational DB, SaSS/Less/CSS3, WebRTC, Bash, Apache, Nginx
> Demokratech. yes, approval

Applied: Upwork technologies "PHP 7, JavaScript, relational databases, Sass/Less/CSS3, WebRTC, Bash, Apache, Nginx". Demokratech approved.
