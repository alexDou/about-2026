---
# portfolio-18oz
title: 'Unit 2: About'
status: in-progress
type: epic
priority: normal
created_at: 2026-11-06T20:27:21Z
updated_at: 2026-11-12T11:28:15Z
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

- Citizenship: "Permanent EU resident, no visa sponsorship required". Berlin, Germany; open to relocation; available now. The kinds of work must be seen loud and clear.
- Look: top section inspired by `about-design.jpg` (greeting sentence, brush-masked photo); other sections in the same style, dark on `#25363a`.
- Languages as word plus CEFR. Education plus one business-level sentence. Roles newest first with technologies.
- The CV download moves to its own bean, portfolio-yhih (after Skills, Contact, What I do; before Chat).
- Questionnaires: one Markdown file per item in `docs_src/about/`, answered in place.
