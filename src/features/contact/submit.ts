import { buildContactEmail, type ContactEmail } from "./email";
import type { RateLimiter } from "./rate-limit";
import {
  HONEYPOT_FIELD,
  MIN_FILL_TIME_MS,
  submissionSchema,
  type ContactErrorCode,
  type ContactField,
} from "./schema";

export type SubmitResult =
  | { status: "success" }
  | {
      status: "error";
      code: "invalid" | "rateLimited" | "unavailable";
      fieldErrors?: Partial<Record<ContactField, ContactErrorCode>>;
    };

export type SubmitDeps = {
  ip: string;
  now: number;
  rateLimiter: RateLimiter;
  sendEmail: (email: ContactEmail) => Promise<void>;
};

const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

/*
 * Server-side handling of a contact submission. Pure apart from its injected dependencies, so
 * every branch is unit-tested without network or Next internals.
 *
 * Bots get a fake success: telling them what tripped the filter only helps them adapt.
 */
export async function handleSubmission(input: unknown, deps: SubmitDeps): Promise<SubmitResult> {
  const parsed = submissionSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, ContactErrorCode>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message as ContactErrorCode;
    }
    return { status: "error", code: "invalid", fieldErrors };
  }

  const { [HONEYPOT_FIELD]: honeypot, startedAt, ...message } = parsed.data;

  const elapsed = deps.now - startedAt;
  const looksAutomated =
    Boolean(honeypot) || elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FORM_AGE_MS;
  if (looksAutomated) return { status: "success" };

  const { success } = await deps.rateLimiter.limit(deps.ip);
  if (!success) return { status: "error", code: "rateLimited" };

  try {
    await deps.sendEmail(buildContactEmail(message));
    return { status: "success" };
  } catch (error) {
    console.error("Contact email failed", error);
    return { status: "error", code: "unavailable" };
  }
}
