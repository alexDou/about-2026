// Values of the Contact contract, mirrored by `backend/src/app/contact/models.py`.

/** The most characters each Contact field may hold, in code points (as zod's `max` counts). */
export const CONTACT_LIMITS = { name: 80, company: 100, position: 120, contact: 200 } as const;

/** What `POST /api/contact` answers. A filled honeypot gets a silent `sent` too. */
export const CONTACT_STATUS = {
  sent: 204,
  invalidFields: 422,
  failedHumanCheck: 400,
  limitReached: 429,
  emailNotSent: 502,
} as const;

/** What a Contact request came to, as the form shows it. */
export const CONTACT_OUTCOME = {
  sent: "sent",
  invalidFields: "invalidFields",
  failed: "failed",
} as const;
