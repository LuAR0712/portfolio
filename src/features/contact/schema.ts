import { z } from "zod";

/*
 * Contact form schema, shared by the client (instant feedback) and the server action (the source
 * of truth — the server never trusts the client).
 *
 * Every value is normalized before it's validated: Unicode NFC, whitespace collapsed and trimmed
 * (the message keeps its line breaks). Errors are codes, not sentences; each side translates them
 * through messages → contact.form.errors.<code>.
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

const text = (normalize: (value: string) => string) =>
  z.string({ error: "required" satisfies ContactErrorCode }).overwrite(normalize);

const between = (min: number, max: number, tooShort: ContactErrorCode, tooLong: ContactErrorCode) =>
  text(normalizeLine)
    .refine((v) => v.length > 0, { error: "required" satisfies ContactErrorCode, abort: true })
    .refine((v) => charCount(v) >= min, { error: tooShort, abort: true })
    .refine((v) => charCount(v) <= max, { error: tooLong, abort: true });

export const contactSchema = z.object({
  name: between(LIMITS.name.min, LIMITS.name.max, "nameTooShort", "nameTooLong").refine(
    (v) => NAME_PATTERN.test(v),
    { error: "nameInvalid" satisfies ContactErrorCode },
  ),
  email: text(normalizeLine)
    .refine((v) => v.length > 0, { error: "required" satisfies ContactErrorCode, abort: true })
    .refine((v) => v.length <= LIMITS.email.max, {
      error: "emailTooLong" satisfies ContactErrorCode,
      abort: true,
    })
    .pipe(z.email({ error: "emailInvalid" satisfies ContactErrorCode })),
  company: text(normalizeLine)
    .refine((v) => charCount(v) <= LIMITS.company.max, {
      error: "companyTooLong" satisfies ContactErrorCode,
    })
    .transform((v) => v || undefined)
    .optional(),
  subject: between(LIMITS.subject.min, LIMITS.subject.max, "subjectTooShort", "subjectTooLong"),
  message: text(normalizeMultiline)
    .refine((v) => v.length > 0, { error: "required" satisfies ContactErrorCode, abort: true })
    .refine((v) => charCount(v) >= LIMITS.message.min, {
      error: "messageTooShort" satisfies ContactErrorCode,
      abort: true,
    })
    .refine((v) => charCount(v) <= LIMITS.message.max, {
      error: "messageTooLong" satisfies ContactErrorCode,
    }),
});

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactMessage = z.output<typeof contactSchema>;
export type ContactField = keyof ContactFormInput;

// Anti-spam fields travel with the form but aren't part of the message.
export const HONEYPOT_FIELD = "website";
export const MIN_FILL_TIME_MS = 3000;

export const submissionSchema = contactSchema.extend({
  [HONEYPOT_FIELD]: z.string().optional(),
  startedAt: z.number().int().nonnegative(),
});

export type ContactSubmission = z.input<typeof submissionSchema>;
