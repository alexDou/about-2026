# Roles questionnaire

One section per Role, newest first. Each ends as a first-person text plus its technologies. CV typos are not carried over ("Commulative", "convertion", "Ukranian", "Reduction on"); the new CV (portfolio-yhih) must get them right too.

No drafts are kept in this file: the Owner rejected the agent's variants (round 3). This file holds the questions and the Owner's own words, verbatim (typos included); the text is written in portfolio-hdd2.

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

Round 3 rulings: "replacing the previous monolithic frontend" is not true (the CV bullet is wrong for the Owner's part); "all of it was on me" is not a professional CV phrase; "thousands of rows" becomes "huge data load".

## 2. Senior Frontend Developer, Tipico GmbH (Sep 2019 – Apr 2022, Germany)

**CV seed**: retail betting platform, legacy Java Swing replaced by React + TypeScript in betting shops across Germany; greenfield apps; reusable components and design system; mentoring and onboarding. Tech: TypeScript, React, Node.js, GraphQL, Cypress, Jest/RTL, Java, MySQL, Kafka, Redis.

### Answers

Round 1, verbatim:

> yes, the main thing, and the only actually, was Swing-to-React transition. i found myself in the company in a period of great re-write of monolyth Java app to micro-services architecture. Swing was a part of the move. Swing has its limitations. things are not looking very good sometimes and there are not so much ways to improve compared with a typical frontend app. For a work start i had only a Figma design. all the frontend design and coded from scratch by 2 guys. I was working on end-users facing inerfaces. the app Tipico shop visitors see on the screens. another guy was working on admin-side UI - this is that shop owners, managers and company admins see. As i have seen it passing by a Tipico shop this UIs are still there. across the country.

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
