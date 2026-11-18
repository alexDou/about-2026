# Backend questionnaire

The Backend Skill group, in the Frontend format: its Skills (the frameworks of the languages, which sit in their own group) and its subgroup. The Owner's answers are kept verbatim; the polished text lives in the message file once approved.

**CV seed**: "Strong commercial expertise with Node.js, Next.js, backend tooling and CMS development"; "backend services with Rust (actix-starter)"; FastAPI; PHP 7 with Yii2 and Zend Framework; the i18n CMS service; the Java Spring Boot API shaped together with the team.

## Round 1

1. Skills per language: Node.js (Express, NestJS, Fastify, Koa?), Python (FastAPI, Django, Flask?), Rust (Actix, Axum?), PHP (Yii2, Zend Framework / Laminas, Laravel?), Kotlin (Ktor or Spring, from the course?)?
2. Confidence per framework?
3. Headless CMS: a Backend Skill?
4. The subgroup's new name: "APIs & services", "APIs & communication", "APIs & integration", "APIs, messaging & services"?
5. The subgroup's list: confirm, cut or add (queues such as RabbitMQ, Server-Sent Events, OpenAPI/Swagger, event-driven design, OAuth/JWT)?
6. Anything missing?

### Answers

> PHP 7 - to just PHP
> Nodejs - yes + ElysiaJS, Socket.io, Hapi, Sailsjs, Strapi, Apollo
> Python - FastAPI only
> Rust - Actix only
> PHP - Yii2, Zend Framework, Laravel
> Kotlin - Spring but nube level
>
> start with Nodejs - expert, proven commercial prod success
> Python - deep knowledge, not an expert though
> PHP - used a lot in the past, many project. all type of project up to full-scale social networks. dont use much these days
> Rust - enthusiast, would choose Actix by default for a project denanding low-latency, high-throughput and real-time systems. consider Axum for standard web APIs
> Kotlin - show cert, put it like it is. no prod experience etc

2. Express, Koa, ElysiaJS, Socket.io, Strapi, Apollo - very confident; NestJS, Hapi, Sailsjs - a bit less. my not know latest development. new feature etc. but wont have a problem to jump right into
   FastAPI - confident, not an expert though
   PHP frameworks - mostly knowledge form past. outdated a big deal. you can even unite them in one item with unified description
   Actix - up to date, very strong knowledge
3. Strapi is CMS, and exactly headless. exclude from above, dont mention CMSs at all.
4. ok, your recommendation
5. SSE, OpenAPI/Swagger
6. Communication protocols gRPC, AMQP, MQTT. say, application level knowledge

## Round 2

1. Express, Koa, ElysiaJS, Socket.io, Apollo: the same "Very confident." line, or one fact each?
2. Depth for the subgroup: REST, GraphQL, WebSockets, SSE, WebRTC, OpenAPI/Swagger, Kafka, CQRS, microservices?
3. TypeScript (Programming languages): "Expert. JavaScript included, though these days I write TypeScript."?
4. Rust: "enthusiast" the whole line, or "practical experience" (CV) too?
5. Order: Node.js and its frameworks, FastAPI, the PHP frameworks, Actix, Spring?

### Answers

1. Express, Koa, Socket.io, Apollo - expert; ElysiaJS - fascinated, on opportunity will pick up thats missing in my knowledge. starting a project from scratch - first thing i'd consider today. very conveinient and top performant
2. can use from day 1
3. no, just Typescript. say, expert, confidently operating complex types/interfaces (better words)
4. enthusiast - yea good way to put it. i personally like this language add that i use it for web development only
5. change places PHP - Rust and ok

## Round 3

1. Repeated lines ("Expert." four times, the NestJS line three times, "Ready to use from day one." nine times): keep (A), or merge the duplicates into one Skill each (B)?
2. Spring: shown at all, or folded into Kotlin's line?
3. The rest approved?

### Answers

> Express, Koa - in one, Expert with extensive prod experience;
> Socket.io, Apollo - ready to use
> Nestjs, Hapi, Sailsjs - in one
>
> REST - RESTful API
> REST, GraphQL, WebSockets, Server-Sent Events, WebRTC, OpenAPI/Swagger, Kafka - up to date knowledge
> CQRS, Microservices - development/sys.design patterns, correct me if i wrong. we will mention them in what-i-do. remove from here
>
> Languages OK
>
> hmm, very basic Spring and Kotlin. move to Kotlin. no experience must be loud and clear
>
> approved

Approved: the text is in `frontend/src/i18n/en/skills.json`. CQRS and microservices go to What I do (Unit 5).

## Design review (2026-11-18)

After the first look at the Skills Panel, the Owner reworked the layout and the order (Unit 3.4):

- The loose Skills go in a first subgroup, "Runtimes & frameworks", in this order: Node.js, Express & Koa, ElysiaJS, NestJS/Hapi/Sails.js, Apollo, FastAPI, Actix, the PHP frameworks.
- Socket.io joins WebSockets: one Skill, "WebSockets, Socket.io".
- "Communication protocols" becomes "gRPC, AMQP and MQTT", "Application-level knowledge."
