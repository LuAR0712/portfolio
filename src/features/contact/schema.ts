import * as z from "zod/mini";

/*
 * Contact form schema, shared by the client (instant feedback) and the server action (the source
 * of truth — the server never trusts the client).
 *
 * Every value is normalized before it's validated: Unicode NFC, whitespace collapsed and trimmed
 * (the message keeps its line breaks). Errors are codes, not sentences; each side translates them
 * through messages → contact.form.errors.<code>.
 *
 * Built with `zod/mini` (tree-shakable functional API): this schema ships to the browser with the
 * form, and the classic API would add tens of KB to the page for the same rules.
 */

export const LIMITS = {
  name: { min: 2, max: 60 },
  email: { max: 254 },
  company: { max: 80 },
  subject: { min: 4, max: 100 },
  message: { min: 20, max: 1000 },
} as const;

export type ContactErrorCode =
  | "required"
  | "nameTooShort"
  | "nameTooLong"
  | "nameInvalid"
  | "emailInvalid"
  | "emailTooLong"
  | "companyTooLong"
  | "subjectTooShort"
  | "subjectTooLong"
  | "messageTooShort"
  | "messageTooLong";

// Length in code points, so an emoji or an accented letter counts as one character.
// The live counter in the form uses the same function, so it never disagrees with validation.
export function charCount(value: string): number {
  return Array.from(value).length;
}

export function normalizeLine(value: string): string {
  return value.normalize("NFC").replace(/\s+/g, " ").trim();
}

export function normalizeMultiline(value: string): string {
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ") // collapse spaces/tabs, keep line breaks
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Letters from any script (accents, ñ) in words joined by single spaces, apostrophes or hyphens:
// "María José", "O'Brien", "Jean-Luc". No digits, no leading/trailing punctuation.
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:(?: |['’-])\p{L}[\p{L}\p{M}]*)*$/u;

// A failing rule stops the chain (`abort`), so each field reports its first problem only.
const rule = (check: (value: string) => boolean, error: ContactErrorCode) =>
  z.refine<string>(check, { error, abort: true });

const required = rule((v) => v.length > 0, "required");
const minChars = (min: number, error: ContactErrorCode) => rule((v) => charCount(v) >= min, error);
const maxChars = (max: number, error: ContactErrorCode) => rule((v) => charCount(v) <= max, error);

const text = (normalize: (value: string) => string) =>
  z.string({ error: "required" satisfies ContactErrorCode }).check(z.overwrite(normalize));

export const contactSchema = z.object({
  name: text(normalizeLine).check(
    required,
    minChars(LIMITS.name.min, "nameTooShort"),
    maxChars(LIMITS.name.max, "nameTooLong"),
    rule((v) => NAME_PATTERN.test(v), "nameInvalid"),
  ),
  email: z.pipe(
    text(normalizeLine).check(
      required,
      rule((v) => v.length <= LIMITS.email.max, "emailTooLong"),
    ),
    z.email({ error: "emailInvalid" satisfies ContactErrorCode }),
  ),
  company: z.optional(
    z.pipe(
      text(normalizeLine).check(maxChars(LIMITS.company.max, "companyTooLong")),
      z.transform((v: string) => v || undefined),
    ),
  ),
  subject: text(normalizeLine).check(
    required,
    minChars(LIMITS.subject.min, "subjectTooShort"),
    maxChars(LIMITS.subject.max, "subjectTooLong"),
  ),
  message: text(normalizeMultiline).check(
    required,
    minChars(LIMITS.message.min, "messageTooShort"),
    maxChars(LIMITS.message.max, "messageTooLong"),
  ),
});

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactMessage = z.output<typeof contactSchema>;
export type ContactField = keyof ContactFormInput;

// Anti-spam fields travel with the form but aren't part of the message.
export const HONEYPOT_FIELD = "website";
export const MIN_FILL_TIME_MS = 3000;

export const submissionSchema = z.extend(contactSchema, {
  [HONEYPOT_FIELD]: z.optional(z.string()),
  startedAt: z.int().check(z.nonnegative()),
});

export type ContactSubmission = z.input<typeof submissionSchema>;
