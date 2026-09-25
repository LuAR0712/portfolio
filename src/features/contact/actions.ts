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
    if (env.NODE_ENV === "production") throw new Error("Resend is not configured");
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
  if (error) throw new Error(`Resend error: ${error.name}`);
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
