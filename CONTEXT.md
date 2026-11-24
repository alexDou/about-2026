# Portfolio

The Owner's CV presented as an interactive site, made for hiring managers and recruiters.
A Visitor arrives on the Landing, opens Explore, and explores the Owner through its Panels.

## Language

### People

**Owner**:
The person the site is about and who maintains it.
_Avoid_: admin, author, me

**Visitor**:
Someone browsing the site, typically a hiring manager or recruiter.
_Avoid_: user, recruiter, client

### Screens

**Landing**:
The first screen, showing the animated logo and whether the backend is reachable. Clicking the logo reveals Explore.
_Avoid_: home, intro, splash

**Explore**:
The screen that holds the five Panels. It is the whole site after the Landing.
_Avoid_: board (its former name), menu, overlay, hub

**Panel**:
One of Explore's five areas, in order: About, What I do, Skills, Chat with me, Contact.
_Avoid_: block, column, section, tile

**Expanded panel**:
The one Panel opened to fill Explore and show its content. At most one at a time.
_Avoid_: active block, open section

**Stripe**:
A Panel squeezed to Explore's edge while another Panel is expanded, showing only its title.
_Avoid_: collapsed column, sidebar

**Sublabel**:
An optional short line under a Panel's title, shown only while no Panel is expanded.
_Avoid_: subtitle, tagline

### Content

**Skill**:
A named thing the Owner knows (a language, technology or practice) with an overview: a short
statement in their own words. Depth, where given, is told in words, never as a rating.
_Avoid_: competency, rating

**Skill group**:
A named set of related Skills, such as Databases. It may hold Skill subgroups.
_Avoid_: category, section, expertise block

**Skill subgroup**:
A named set of Skills inside a Skill group, one level deep, such as Frontend's
"Architecture & ecosystem".
_Avoid_: subcategory, nested group

**Certificate**:
Proof from an outside issuer that the Owner passed a test or completed a course, shown on the
Skill it backs.
_Avoid_: certification, badge, credential

**Takeover**:
One of the kinds of work the Owner can take over, shown as a card: its Takeover group and
title on the front; on the back a description of what the Owner does and why the Owner fits, and
its Benefits where they fit.
_Avoid_: service, offering, skill

**Benefits**:
What a client gains from a Takeover, on the card's back under the description. Optional: only
where they fit.
_Avoid_: advantages, perks, value

**Takeover group**:
One of six groups of Takeovers. Each group has a background of its own, and every card carries
its group's name.
_Avoid_: category

**CV**:
The Owner's downloadable résumé document, one per site locale (English for now).
_Avoid_: résumé, profile

### About

**Headline**:
The one line naming what the Owner is professionally, shown under their name.
_Avoid_: title, tagline, position

**Bio**:
The Owner's short self-introduction in their own words.
_Avoid_: summary, profile, about text

**Role**:
One position in the Owner's work history: title, company, period, place and what the Owner did there.
_Avoid_: job, position, experience, employment

**Hobby**:
Something the Owner enjoys outside work, told in their own words.
_Avoid_: interest, passion

### Contact

**Contact request**:
What a Visitor sends the Owner: a name and a company, and optionally a short position
description and a way to reach them. It reaches the Owner by email and is never kept by the site.
_Avoid_: lead, message, inquiry

**Contact notice**:
The line beside the Contact request form that tells the Visitor how their details are used.
_Avoid_: privacy policy, consent, disclaimer

### Chat

**Agent**:
The AI counterpart a Visitor talks to in the Chat with me Panel, answering about the Owner.
_Avoid_: bot, assistant, avatar

**Knowledge**:
Everything the Agent knows about the Owner: Panel content, Vault notes and Interview answers.
_Avoid_: training data, knowledge base, memory

**Memory**:
What the Agent retains about a Visitor across conversations, including those conversations.
_Avoid_: history, context, Knowledge

**Vault**:
The Owner's Obsidian notes on technical knowledge: approaches, books, videos.
_Avoid_: notes, wiki

**Interview**:
A long text Q&A in which an AI interviewer questions the Owner to build the Knowledge.
_Avoid_: questionnaire, Q&A session
