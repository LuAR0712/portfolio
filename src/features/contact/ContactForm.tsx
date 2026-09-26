"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useForm, useWatch, type Control, type FieldError } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useIsClient } from "@/hooks/useIsClient";
import { profile } from "@/content/profile";
import { statusSwap } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { sendContactMessage } from "./actions";
import { clearDraft, readDraft, saveDraft } from "./draft";
import { controlStyles, FormField } from "./FormField";
import {
  charCount,
  contactSchema,
  HONEYPOT_FIELD,
  LIMITS,
  normalizeMultiline,
  type ContactErrorCode,
  type ContactField,
  type ContactFormInput,
  type ContactMessage,
} from "./schema";
import type { SubmitResult } from "./submit";

// idle → validating → submitting → success | error. Each state has its own feedback.
type FormStatus = "idle" | "validating" | "submitting" | "success" | "error";
type ServerErrorCode = Extract<SubmitResult, { status: "error" }>["code"];

const EMPTY: ContactFormInput = { name: "", email: "", company: "", subject: "", message: "" };
const FIELD_ORDER: ContactField[] = ["name", "email", "company", "subject", "message"];
const WARNING_RATIO = 0.9;
const DRAFT_SAVE_DELAY_MS = 400;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<ServerErrorCode | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  // Read once: null on the server, the saved draft (if any) in the browser. The notice only shows
  // after hydration (isClient), so server and client markup match.
  const [savedDraft] = useState(readDraft);
  const [draftDismissed, setDraftDismissed] = useState(false);
  const isClient = useIsClient();
  const draftRestored = isClient && savedDraft !== null && !draftDismissed;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    subscribe,
    control,
    formState: { errors },
  } = useForm<ContactFormInput, unknown, ContactMessage>({
    resolver: zodResolver(contactSchema),
    defaultValues: EMPTY,
    // Validate on blur first, then on every change: no errors while someone types a field for
    // the first time, instant feedback once they're fixing one.
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  // The fill-time check starts when the form becomes interactive, not when the HTML was built.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Draft: restore after hydration (applying it during the first render would make the counter
  // disagree with the server HTML), then save shortly after every change.
  useEffect(() => {
    if (savedDraft) reset(savedDraft);

    let timeout: number | undefined;
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => saveDraft(values), DRAFT_SAVE_DELAY_MS);
      },
    });
    return () => {
      window.clearTimeout(timeout);
      unsubscribe();
    };
  }, [reset, subscribe, savedDraft]);

  function discardDraft() {
    clearDraft();
    reset(EMPTY);
    setDraftDismissed(true);
  }

  const errorText = (field: ContactField, error?: FieldError) => {
    if (!error?.message) return undefined;
    const limits = LIMITS[field] as { min?: number; max?: number };
    return t(`errors.${error.message as ContactErrorCode}`, {
      min: limits.min ?? 0,
      max: limits.max ?? 0,
    });
  };

  async function send(values: ContactMessage) {
    setStatus("submitting");
    setServerError(null);

    let result: SubmitResult;
    try {
      result = await sendContactMessage({
        ...values,
        [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "",
        startedAt: startedAt.current,
      });
    } catch {
      result = { status: "error", code: "unavailable" };
    }

    if (result.status === "success") {
      clearDraft();
      setDraftDismissed(true);
      reset(EMPTY);
      setStatus("success");
      return;
    }

    // The server re-validated and disagreed: show its errors on the fields, focus the first one.
    const fieldErrors = result.fieldErrors ?? {};
    const firstInvalid = FIELD_ORDER.find((field) => fieldErrors[field]);
    for (const field of FIELD_ORDER) {
      const code = fieldErrors[field];
      if (code) setError(field, { message: code }, { shouldFocus: field === firstInvalid });
    }
    setServerError(result.code);
    setStatus("error");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setStatus("validating");
    setServerError(null);
    // On invalid input react-hook-form focuses the first field with an error.
    await handleSubmit(send, () => {
      setServerError("invalid");
      setStatus("error");
    })(event);
  }

  function startOver() {
    startedAt.current = Date.now();
    setStatus("idle");
  }

  const isBusy = status === "validating" || status === "submitting";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.div
          key="success"
          role="status"
          className="space-y-4 rounded-lg border border-border bg-surface p-6 shadow-soft sm:p-8"
          variants={statusSwap}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h3
            ref={focusOnMount}
            tabIndex={-1}
            className="flex items-center gap-3 text-h3 outline-none"
          >
            <span aria-hidden="true" className="size-2.5 rounded-full bg-success" />
            {t("success.title")}
          </h3>
          <p className="max-w-prose text-muted">{t("success.body")}</p>
          <Button variant="secondary" onClick={startOver}>
            {t("success.again")}
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          aria-label={t("label")}
          aria-busy={isBusy}
          noValidate
          onSubmit={onSubmit}
          className="space-y-6"
          variants={statusSwap}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <p className="text-sm text-muted">{t("requiredNote")}</p>

          {draftRestored && (
            <div
              role="status"
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3 text-sm"
            >
              <span className="flex items-center gap-2">
                <Icon name="check" className="size-4 text-success" />
                {t("draft.restored")}
              </span>
              <button
                type="button"
                onClick={discardDraft}
                className="font-medium text-muted underline underline-offset-4 hover:text-fg"
              >
                {t("draft.discard")}
              </button>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              id="contact-name"
              label={t("fields.name")}
              error={errorText("name", errors.name)}
            >
              {(props) => (
                <input
                  {...props}
                  {...register("name")}
                  type="text"
                  autoComplete="name"
                  className={controlStyles}
                />
              )}
            </FormField>

            <FormField
              id="contact-email"
              label={t("fields.email")}
              error={errorText("email", errors.email)}
            >
              {(props) => (
                <input
                  {...props}
                  {...register("email")}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  className={controlStyles}
                />
              )}
            </FormField>

            <FormField
              id="contact-company"
              label={t("fields.company")}
              optionalLabel={t("optional")}
              error={errorText("company", errors.company)}
            >
              {(props) => (
                <input
                  {...props}
                  {...register("company")}
                  type="text"
                  autoComplete="organization"
                  className={controlStyles}
                />
              )}
            </FormField>

            <FormField
              id="contact-subject"
              label={t("fields.subject")}
              error={errorText("subject", errors.subject)}
            >
              {(props) => (
                <input
                  {...props}
                  {...register("subject")}
                  type="text"
                  autoComplete="off"
                  className={controlStyles}
                />
              )}
            </FormField>
          </div>

          <FormField
            id="contact-message"
            label={t("fields.message")}
            error={errorText("message", errors.message)}
            description={<MessageCounter control={control} />}
          >
            {(props) => (
              <textarea
                {...props}
                {...register("message")}
                rows={7}
                className={cn(controlStyles, "resize-y")}
              />
            )}
          </FormField>

          {/* Honeypot: invisible to people and assistive tech, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor={`contact-${HONEYPOT_FIELD}`}>{t("honeypot")}</label>
            <input
              ref={honeypotRef}
              id={`contact-${HONEYPOT_FIELD}`}
              name={HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button type="submit" disabled={isBusy} className="sm:min-w-48">
              {status === "submitting" && <Spinner />}
              {status === "submitting"
                ? t("submitting")
                : status === "validating"
                  ? t("validating")
                  : t("submit")}
            </Button>

            <div aria-live="polite" className="min-h-6 text-sm">
              <AnimatePresence mode="wait">
                {status === "error" && serverError && (
                  <motion.p
                    key={serverError}
                    className="text-danger"
                    variants={statusSwap}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t(`status.${serverError}`, { email: profile.email })}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

// Live count of the normalized message (the same value the schema validates), with color states
// as it approaches and passes the limit. The limits are read once through aria-describedby; the
// changing count itself is hidden from assistive tech so it doesn't announce every keystroke.
function MessageCounter({
  control,
}: {
  control: Control<ContactFormInput, unknown, ContactMessage>;
}) {
  const t = useTranslations("contact.form");
  const value = useWatch({ control, name: "message" }) ?? "";
  const count = charCount(normalizeMultiline(value));
  const { min, max } = LIMITS.message;
  const state = count > max ? "over" : count >= max * WARNING_RATIO ? "warning" : "ok";

  return (
    <span className="flex justify-between gap-4">
      <span>{t("counterLimit", { min, max })}</span>
      <span
        aria-hidden="true"
        data-state={state}
        className={cn(
          "font-mono tabular-nums transition-colors duration-(--duration-base)",
          state === "warning" && "text-warning",
          state === "over" && "font-semibold text-danger",
        )}
      >
        {t("counter", { count, max })}
      </span>
    </span>
  );
}

// The success panel mounts after the form finishes its exit animation, so focus is moved when
// the heading actually appears rather than when the status changes.
function focusOnMount(node: HTMLElement | null) {
  node?.focus();
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}
