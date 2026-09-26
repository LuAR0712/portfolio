// @vitest-environment node
import { parsePublicEnv, parseServerEnv } from "./env";

describe("parsePublicEnv", () => {
  it("defaults the site URL to localhost", () => {
    expect(parsePublicEnv({}).NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("rejects a malformed site URL", () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SITE_URL: "not a url" })).toThrow();
  });
});

describe("parseServerEnv", () => {
  it("accepts an empty environment (dev without Resend or Upstash)", () => {
    const env = parseServerEnv({});
    expect(env.NODE_ENV).toBe("development");
    expect(env.RESEND_API_KEY).toBeUndefined();
  });

  it("treats blank strings as unset", () => {
    expect(parseServerEnv({ RESEND_API_KEY: "   " }).RESEND_API_KEY).toBeUndefined();
  });

  it("rejects an invalid contact email", () => {
    expect(() => parseServerEnv({ CONTACT_TO_EMAIL: "nope" })).toThrow(/CONTACT_TO_EMAIL/);
  });

  it("requires the Upstash URL and token together", () => {
    expect(() => parseServerEnv({ UPSTASH_REDIS_REST_URL: "https://example.upstash.io" })).toThrow(
      /must be set together/,
    );
  });
});
