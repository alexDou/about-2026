# Panel content is static JSON in the frontend

Everything the Panels show (About, Skills, Certificates, the 36 Takeovers) lives as react-intl message JSON in the frontend and is edited in the repo. The backend does not serve content, because the Owner wants no admin UI or CMS to maintain. The backend exists only for Contact intake and, later, the chat gateway. The Agent's Knowledge is built from the same files, so the Panels and the Agent cannot drift apart.

## Considered Options

- A backend-owned profile dataset served over `/api` to the Panels and the Agent. Chosen first, then rejected: editing content would need either an admin UI or a backend deploy, for no gain on a site with one author.
