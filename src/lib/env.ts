import { z } from "zod";

/*
 * Single entry point for environment variables (see CLAUDE.md, rule 6).
 * Public values are read with literal `process.env.NEXT_PUBLIC_*` access so Next can inline them.
 * Server values are parsed lazily: importing this module on the client never touches secrets.
 */

const optionalString = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional();

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

const serverSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    RESEND_API_KEY: optionalString,
    CONTACT_TO_EMAIL: z.email().optional(),
    CONTACT_FROM_EMAIL: optionalString,
    UPSTASH_REDIS_REST_URL: z.url().optional(),
    UPSTASH_REDIS_REST_TOKEN: optionalString,
    LASTFM_API_KEY: optionalString,
    LASTFM_USERNAME: optionalString,
  })
  .refine((env) => Boolean(env.UPSTASH_REDIS_REST_URL) === Boolean(env.UPSTASH_REDIS_REST_TOKEN), {
    message: "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set together",
    path: ["UPSTASH_REDIS_REST_TOKEN"],
  })
  .refine((env) => Boolean(env.LASTFM_API_KEY) === Boolean(env.LASTFM_USERNAME), {
    message: "LASTFM_API_KEY and LASTFM_USERNAME must be set together",
    path: ["LASTFM_USERNAME"],
  });

export type PublicEnv = z.infer<typeof publicSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

function vercelSiteUrl(): string | undefined {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return host ? `https://${host}` : undefined;
}

export function parsePublicEnv(source: Record<string, string | undefined>): PublicEnv {
  return publicSchema.parse(source);
}

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid server environment:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const publicEnv: PublicEnv = parsePublicEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || vercelSiteUrl(),
});

let cachedServerEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  cachedServerEnv ??= parseServerEnv(process.env);
  return cachedServerEnv;
}
