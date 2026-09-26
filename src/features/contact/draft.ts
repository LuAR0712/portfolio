import { LIMITS, type ContactFormInput } from "./schema";

/*
 * Contact form draft, kept in the visitor's own localStorage so an accidental reload or closed tab
 * doesn't lose a half-written message. Never sent anywhere; cleared once the message is sent.
 * Storage can be unavailable (private mode, blocked site data) or hold anything, so every access
 * is guarded and what's read back is validated.
 */

export const DRAFT_KEY = "portfolio.contactDraft.v1";

const FIELDS = ["name", "email", "company", "subject", "message"] as const;
// Generous cap per field: enough for any real draft, bounded against junk in storage.
const MAX_STORED = LIMITS.message.max * 2;

export type ContactDraft = Required<{ [K in (typeof FIELDS)[number]]: string }>;

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readDraft(): ContactDraft | null {
  try {
    const raw = storage()?.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const draft = Object.fromEntries(
      FIELDS.map((field) => {
        const value = (parsed as Record<string, unknown>)[field];
        return [field, typeof value === "string" ? value.slice(0, MAX_STORED) : ""];
      }),
    ) as ContactDraft;

    return Object.values(draft).some((value) => value.trim()) ? draft : null;
  } catch {
    return null;
  }
}

export function saveDraft(values: Partial<ContactFormInput>): void {
  try {
    const draft = Object.fromEntries(FIELDS.map((field) => [field, values[field] ?? ""]));
    if (Object.values(draft).some((value) => value.trim())) {
      storage()?.setItem(DRAFT_KEY, JSON.stringify(draft));
    } else {
      storage()?.removeItem(DRAFT_KEY);
    }
  } catch {
    // Quota exceeded or storage blocked: the form keeps working without a draft.
  }
}

export function clearDraft(): void {
  try {
    storage()?.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to clear.
  }
}
