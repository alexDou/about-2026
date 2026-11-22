// Values of the Contact contract, mirrored by `backend/src/app/contact/models.py`.

/** The most characters each Contact field may hold, in code points (as zod's `max` counts). */
export const CONTACT_LIMITS = { name: 80, company: 100, position: 120, contact: 200 } as const;

/** The most characters the human check payload and the honeypot may hold. */
export const ALTCHA_MAX_LENGTH = 2048;
export const WEBSITE_MAX_LENGTH = CONTACT_LIMITS.contact;

/** Where the human check's widget fetches its challenge: `GET`, answered with a `ChallengeResponse`. */
export const CONTACT_CHALLENGE_URL = "/api/contact/challenge";

/** What `POST /api/contact` answers. A filled honeypot gets a silent `sent` too. */
export const CONTACT_STATUS = {
  sent: 204,
  invalidFields: 422,
  failedHumanCheck: 400,
  limitReached: 429,
  emailNotSent: 502,
} as const;

/** What the backend says is wrong with a field of a `422`. */
export const CONTACT_FIELD_ERROR = { required: "required", tooLong: "tooLong" } as const;

/** What a Contact request came to, as the form shows it. */
export const CONTACT_OUTCOME = {
  sent: "sent",
  invalidFields: "invalidFields",
  failed: "failed",
} as const;
