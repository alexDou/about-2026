import type { z } from "zod";
import type { CONTACT_FIELD_ERROR, CONTACT_OUTCOME, CONTACT_STATUS } from "./config";
import type { contactRequestSchema } from "./contact-schema";

export type HealthResponse = {
  status: "ok";
};

/** Every error answers `{ detail }` with a stable, static message. */
export type ErrorResponse = {
  detail: string;
};

/** A cleaned Contact request, as `POST /api/contact` takes it. */
export type ContactRequest = z.output<typeof contactRequestSchema>;

/** One invalid field of a `422`: `field` is a field of the request, `error` what is wrong with it. */
export type ContactFieldError = {
  field: string;
  error: (typeof CONTACT_FIELD_ERROR)[keyof typeof CONTACT_FIELD_ERROR];
};

/** What a Contact request came to: sent, refused for these fields, or failed some other way. */
export type ContactOutcome =
  | { kind: typeof CONTACT_OUTCOME.sent }
  | { kind: typeof CONTACT_OUTCOME.invalidFields; fields: ContactFieldError[] }
  | { kind: typeof CONTACT_OUTCOME.failed };

export type ContactStatus = (typeof CONTACT_STATUS)[keyof typeof CONTACT_STATUS];

/** The parameters of an ALTCHA v2 challenge (`altcha` from PyPI, the `altcha` widget from npm). */
export type ChallengeParameters = {
  algorithm: string;
  cost: number;
  keyLength: number;
  keyPrefix: string;
  nonce: string;
  salt: string;
  /** Unix time in seconds after which the challenge is refused. */
  expiresAt: number;
  keySignature?: string;
};

/** `GET /api/contact/challenge`: an ALTCHA v2 challenge signed with the backend's key. */
export type ChallengeResponse = {
  parameters: ChallengeParameters;
  signature: string;
};
