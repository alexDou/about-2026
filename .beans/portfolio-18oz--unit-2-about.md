---
# portfolio-18oz
title: 'Unit 2: About'
status: todo
type: epic
priority: normal
created_at: 2026-11-06T20:27:21Z
updated_at: 2026-11-13T14:56:32Z
parent: portfolio-4ur0
blocked_by:
    - portfolio-m9gt
---

About Panel: photo, bio, education, experience, languages, hobbies, CV download (English only while the site has one locale). Content as message JSON. Spec: docs_src/specs/units.md#unit-2-about.


## Grilling notes

Round 1 (2026-11-12), recorded in the Unit 2 spec section and `CONTEXT.md` (Headline, Bio, Role, Hobby):

- First person. Sections: name, Headline*, photo, Bio*, Roles*, education, languages, Hobbies*, citizenship, CV download. (*) = written with the Owner: questionnaire per item at the end of the About rounds, then drafts.
- Expertise blocks go to Skills, contact details to Contact.
- All five Roles, each a condensed text of its own. Ukrainian left out.
- Photo: the 512×512 JPEG embedded in the CV (has a black slanted bar in the bottom-left corner to crop).
- CV: English only for now; a new CV is made for the download.
- Design reference: `support_files/about/about-design.jpg`.


Round 2 (2026-11-12), recorded in the Unit 2 spec section:

- Citizenship: "A permanent EU resident" (no visa wording, Owner 2026-11-13). Berlin, Germany; open to relocation; available now. The kinds of work must be seen loud and clear.
- Look: top section inspired by `about-design.jpg` (greeting sentence, brush-masked photo); other sections in the same style, dark on `#25363a`.
- Languages as word plus CEFR. Education plus one business-level sentence. Roles newest first with technologies.
- The CV download moves to its own bean, portfolio-yhih (after Skills, Contact, What I do; before Chat).
- Questionnaires: one Markdown file per item in `docs_src/about/`, answered in place.


Round 3 (2026-11-12), recorded in the Unit 2 spec section:

- Kinds of work: permanent full-time or contract, remote preferred, some hybrid, relocation anywhere. Shown as badges where the reference has its "N" logo; "Available Now" is a round green badge with text on the circle.
- Target roles go into the Headline. Greeting without location.
- Top card: face cut out of the CV photo over an SVG brush sketch on the right, greeting + one short line + LinkedIn/GitHub icons on the left. Serif for greeting and section headings. No scroll arrow.
- Until portfolio-yhih, About links the 2026 PDF.
- No glossary term for Availability: the glossary defines domains, not one Panel line.


Round 4 (2026-11-12), recorded in the Unit 2 spec section:

- The card line under the greeting is not the Bio; the Bio is the next card and also says EU residence and optional hybrid.
- Six badges (Available Now, Full-time, Contract, Relocation, Remote work, AI ready) in a row at the top left, level with the close button.
- Photo: `support_files/about/me.png` (Owner's cut-out, 1079×1457).
- Cards on `--panel-what-i-do`; top card with a rounded palette-colour border. Card order: top, Bio, Roles, Education, Languages + Hobbies.
- Grey squares out; a faded node burst after `IMG_7255.jpg` instead (draft in `support_files/about/nodes-draft/`), also as a 60×60 SVG.
- Playfair Display confirmed.


Round 5 (2026-11-12): node burst draft approved, to be greyed and dimmed, one only, below the icons on the left. Badges: own SVGs after the references (colours kept, slightly muted), rem-sized, wrapping flex row, one row on desktop clear of the close button, expressive `title` each. Brush `#25363a` ~10


Round 5 (2026-11-12): node burst draft approved, to be greyed and dimmed, one only, below the icons on the left. Badges: own SVGs after the references (colours kept, slightly muted), rem-sized, wrapping flex row, one row on desktop clear of the close button, expressive `title` each. Brush `#25363a` at about 10 percent. Photo and brush responsive. Languages and Hobbies two columns, short lists. Bio outline from the Owner recorded in the spec.


Round 6 (2026-11-12), recorded in the Unit 2 spec section: Bio text approved; badge labels and titles; Hobbies with a few words each; questionnaires (headline, credo, roles, hobbies, education) grilled in a dedicated content bean after 2.0; stages 2.0 to 2.N as in the spec; the 60×60 node burst goes to the logo (own bean); the 2026 PDF ships with the phone number stripped.

## Stages

Child beans, in dependency order (each lists its blockers):

- portfolio-3wkt Unit 2.0: About content contract
- portfolio-ajvs Unit 2.1: About content from questionnaires (ready-for-human; grilling with the Owner)
- portfolio-viuq Unit 2.2: About assets
- portfolio-ftdn Unit 2.3: Availability badges
- portfolio-fbzp Unit 2.4: About top card
- portfolio-xjur Unit 2.5: About lower cards
- portfolio-6x9j Unit 2.6: CV link
- portfolio-04f9 Unit 2.N: About E2E

The epic is done when every child bean is completed. Outside it: portfolio-yhih (the new CV, replaces 2.6's file at the same path) and portfolio-z9ns (node burst in the logo, draft).
