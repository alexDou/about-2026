import { z } from "zod";
import { CONTACT_LIMITS } from "./config";

// The field rules of a Contact request (Unit 4.0). The backend checks the same rules again
// (`backend/src/app/contact/models.py`), so the two change together.

/** Line breaks and tabs become a space, so every value is one line and words stay apart. */
const LINE_BREAKS = /\r\n|[\t\n\v\f\r\u0085\u2028\u2029]/gu;
/** The rest of Unicode category Cc. */
const CONTROL_CHARACTERS = /\p{Cc}/gu;

/** Line breaks to spaces, control characters out, then trimmed. */
function clean(value: string): string {
  return value.replace(LINE_BREAKS, " ").replace(CONTROL_CHARACTERS, "").trim();
}

/** Cleaned, and whitespace only is too short. */
function requiredText(limit?: number) {
  const checked = z.string().min(1);
  return z
    .string()
    .transform(clean)
    .pipe(limit === undefined ? checked : checked.max(limit));
}

/** Cleaned, and whitespace only counts as not given. Left out when not given, never null. */
function optionalText(limit?: number) {
  return z
    .string()
    .transform(clean)
    .pipe(limit === undefined ? z.string() : z.string().max(limit))
    .transform((value) => (value === "" ? undefined : value))
    .optional();
}

/** `POST /api/contact`. `altcha` is the widget's solved payload; `website` is the honeypot. */
export const contactRequestSchema = z.object({
  name: requiredText(CONTACT_LIMITS.name),
  company: requiredText(CONTACT_LIMITS.company),
  position: optionalText(CONTACT_LIMITS.position),
  contact: optionalText(CONTACT_LIMITS.contact),
  altcha: requiredText(),
  website: optionalText(),
});
