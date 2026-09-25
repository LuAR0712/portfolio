// @vitest-environment node
import { buildContactEmail } from "./email";
import { escapeHtml } from "./escape-html";
import { createMemoryRateLimiter, type RateLimiter } from "./rate-limit";
import type { ContactSubmission } from "./schema";
import { handleSubmission, type SubmitDeps } from "./submit";

const NOW = 1_800_000_000_000;

const submission: ContactSubmission = {
  name: "Ana Paz",
  email: "ana@example.com",
  subject: "Posición frontend",
  message: "Hola, me gustaría conversar sobre una posición.",
  website: "",
  startedAt: NOW - 10_000,
};

function setup(overrides: Partial<SubmitDeps> = {}) {
  const sendEmail = vi.fn<SubmitDeps["sendEmail"]>().mockResolvedValue(undefined);
  const deps: SubmitDeps = {
    ip: "203.0.113.7",
    now: NOW,
    rateLimiter: createMemoryRateLimiter(),
    sendEmail,
    ...overrides,
  };
  return { deps, sendEmail };
}

describe("handleSubmission", () => {
  it("sends a valid message", async () => {
    const { deps, sendEmail } = setup();

    await expect(handleSubmission(submission, deps)).resolves.toEqual({ status: "success" });
    expect(sendEmail).toHaveBeenCalledOnce();
    expect(sendEmail.mock.calls[0]![0]).toMatchObject({
      subject: "[Portfolio] Posición frontend",
      replyTo: "ana@example.com",
    });
  });

  it("revalidates on the server and returns field error codes", async () => {
    const { deps, sendEmail } = setup();

    const result = await handleSubmission({ ...submission, name: "A", email: "nope" }, deps);

    expect(result).toEqual({
      status: "error",
      code: "invalid",
      fieldErrors: { name: "nameTooShort", email: "emailInvalid" },
    });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects payloads that aren't objects", async () => {
    const { deps } = setup();
    await expect(handleSubmission("<script>", deps)).resolves.toMatchObject({ code: "invalid" });
  });

  it("silently drops submissions with a filled honeypot", async () => {
    const { deps, sendEmail } = setup();

    const result = await handleSubmission({ ...submission, website: "https://spam.example" }, deps);

    expect(result).toEqual({ status: "success" });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("silently drops forms filled in under 3 seconds", async () => {
    const { deps, sendEmail } = setup();

    const result = await handleSubmission({ ...submission, startedAt: NOW - 2_999 }, deps);

    expect(result).toEqual({ status: "success" });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("silently drops timestamps from the future", async () => {
    const { deps, sendEmail } = setup();
    await handleSubmission({ ...submission, startedAt: NOW + 60_000 }, deps);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rate limits by IP", async () => {
    const rateLimiter: RateLimiter = { limit: vi.fn().mockResolvedValue({ success: false }) };
    const { deps, sendEmail } = setup({ rateLimiter });

    const result = await handleSubmission(submission, deps);

    expect(result).toEqual({ status: "error", code: "rateLimited" });
    expect(rateLimiter.limit).toHaveBeenCalledWith("203.0.113.7");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("reports the service as unavailable when sending fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { deps } = setup({ sendEmail: vi.fn().mockRejectedValue(new Error("down")) });

    await expect(handleSubmission(submission, deps)).resolves.toEqual({
      status: "error",
      code: "unavailable",
    });
  });
});

describe("buildContactEmail", () => {
  it("escapes user input in the HTML body", () => {
    const email = buildContactEmail({
      name: "Ana Paz",
      email: "ana@example.com",
      subject: "Hola",
      message: '<img src=x onerror="alert(1)"> & more',
    });

    expect(email.html).not.toContain("<img");
    expect(email.html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; more");
    expect(email.text).toContain('<img src=x onerror="alert(1)">'); // plain text stays literal
  });

  it("omits the company row when it wasn't provided", () => {
    const email = buildContactEmail({
      name: "Ana Paz",
      email: "ana@example.com",
      subject: "Hola",
      message: "Mensaje",
    });
    expect(email.text).not.toContain("Company");
  });
});

describe("escapeHtml", () => {
  it("escapes the five HTML-significant characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;",
    );
  });
});

describe("createMemoryRateLimiter", () => {
  it("allows N requests per window, per key, then recovers", async () => {
    let now = 0;
    const limiter = createMemoryRateLimiter({ requests: 2, windowMs: 1000 }, () => now);

    expect((await limiter.limit("a")).success).toBe(true);
    expect((await limiter.limit("a")).success).toBe(true);
    expect((await limiter.limit("a")).success).toBe(false);
    expect((await limiter.limit("b")).success).toBe(true);

    now = 1000;
    expect((await limiter.limit("a")).success).toBe(true);
  });
});
