"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { getServerEnv } from "@/lib/env";
import type { ContactEmail } from "./email";
import { createMemoryRateLimiter, createUpstashRateLimiter, type RateLimiter } from "./rate-limit";
import { handleSubmission, type SubmitResult } from "./submit";

let rateLimiter: RateLimiter | undefined;

function getRateLimiter(): RateLimiter {
  const env = getServerEnv();
  rateLimiter ??=
    env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
      ? createUpstashRateLimiter(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN)
      : createMemoryRateLimiter();
  return rateLimiter;
}

async function sendEmail(email: ContactEmail): Promise<void> {
  const env = getServerEnv();
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    if (env.NODE_ENV === "production") {
      // Names only, never values: this goes to the server log.
      const missing = Object.entries({ RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL })
        .filter(([, value]) => !value)
        .map(([name]) => name);
      throw new Error(`Resend is not configured; missing: ${missing.join(", ")}`);
    }
    // Development without credentials: log instead of failing.
    console.info("[contact] Resend not configured — email not sent:\n", email.text);
    return;
  }

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL,
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
  // Resend's message says what was rejected (e.g. a test sender used with another recipient).
  if (error) throw new Error(`Resend error: ${error.name}: ${error.message}`);
}

async function clientIp(): Promise<string> {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
}

// Thin wrapper: request context and real services in, all decisions in handleSubmission.
export async function sendContactMessage(input: unknown): Promise<SubmitResult> {
  return handleSubmission(input, {
    ip: await clientIp(),
    now: Date.now(),
    rateLimiter: getRateLimiter(),
    sendEmail,
  });
}
