// @vitest-environment node
import {
  charCount,
  contactSchema,
  LIMITS,
  normalizeMultiline,
  type ContactErrorCode,
  type ContactFormInput,
} from "./schema";

const valid: ContactFormInput = {
  name: "María José Núñez",
  email: "maria@example.com",
  company: "ACME",
  subject: "Posición frontend",
  message: "Hola Luciano, me gustaría hablar sobre una posición en el equipo.",
};

// Returns the error code for one field, or undefined when the field is valid.
function errorFor(field: keyof ContactFormInput, value: unknown): ContactErrorCode | undefined {
  const result = contactSchema.safeParse({ ...valid, [field]: value });
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path[0] === field)?.message as ContactErrorCode;
}

describe("contactSchema", () => {
  it("accepts a valid message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  describe("normalization", () => {
    it("trims and collapses whitespace in single-line fields", () => {
      const data = contactSchema.parse({
        ...valid,
        name: "  María   José ",
        subject: " Hola\t mundo ",
      });
      expect(data.name).toBe("María José");
      expect(data.subject).toBe("Hola mundo");
    });

    it("normalizes to NFC so decomposed accents count once", () => {
      const decomposed = "José"; // "José" as e + combining acute
      expect(contactSchema.parse({ ...valid, name: decomposed }).name).toBe("José");
    });

    it("keeps line breaks in the message but collapses runs of blank lines", () => {
      expect(normalizeMultiline("  Hola\r\n\r\n\r\n  mundo  ")).toBe("Hola\n\nmundo");
    });

    it("turns an empty company into undefined", () => {
      expect(contactSchema.parse({ ...valid, company: "   " }).company).toBeUndefined();
    });
  });

  describe("name", () => {
    it.each(["Ñandú Pérez", "O'Brien", "Jean-Luc", "Zoë", "Łukasz"])("accepts %s", (name) => {
      expect(errorFor("name", name)).toBeUndefined();
    });

    it("rejects whitespace only", () => expect(errorFor("name", "    ")).toBe("required"));
    it("rejects a missing value", () => expect(errorFor("name", undefined)).toBe("required"));
    it("rejects fewer than 2 characters", () => expect(errorFor("name", "A")).toBe("nameTooShort"));
    it("rejects more than 60 characters", () =>
      expect(errorFor("name", "A".repeat(LIMITS.name.max + 1))).toBe("nameTooLong"));
    it.each(["R2D2", "Ana_Paz", "-Ana", "Ana-", "Ana  -  Paz!"])("rejects %s", (name) => {
      expect(errorFor("name", name)).toBe("nameInvalid");
    });
  });

  describe("email", () => {
    it("rejects whitespace only", () => expect(errorFor("email", " ")).toBe("required"));
    it("rejects a malformed address", () =>
      expect(errorFor("email", "maria@")).toBe("emailInvalid"));
    it("rejects more than 254 characters", () =>
      expect(errorFor("email", `${"a".repeat(250)}@example.com`)).toBe("emailTooLong"));
    it("trims surrounding spaces", () =>
      expect(contactSchema.parse({ ...valid, email: " maria@example.com " }).email).toBe(
        "maria@example.com",
      ));
  });

  describe("company", () => {
    it("is optional", () => expect(errorFor("company", undefined)).toBeUndefined());
    it("rejects more than 80 characters", () =>
      expect(errorFor("company", "A".repeat(LIMITS.company.max + 1))).toBe("companyTooLong"));
  });

  describe("subject", () => {
    it("rejects whitespace only", () => expect(errorFor("subject", "   ")).toBe("required"));
    it("rejects fewer than 4 characters", () =>
      expect(errorFor("subject", "Hey")).toBe("subjectTooShort"));
    it("rejects more than 100 characters", () =>
      expect(errorFor("subject", "A".repeat(LIMITS.subject.max + 1))).toBe("subjectTooLong"));
  });

  describe("message", () => {
    it("rejects whitespace only", () => expect(errorFor("message", "\n  \n")).toBe("required"));
    it("rejects fewer than 20 characters", () =>
      expect(errorFor("message", "Muy corto")).toBe("messageTooShort"));
    it("rejects more than 1000 characters", () =>
      expect(errorFor("message", "a".repeat(LIMITS.message.max + 1))).toBe("messageTooLong"));
    it("accepts exactly 1000 characters", () =>
      expect(errorFor("message", "a".repeat(LIMITS.message.max))).toBeUndefined());
    it("counts padding spaces out before checking the minimum", () =>
      expect(errorFor("message", `   ${"a".repeat(19)}   `)).toBe("messageTooShort"));
  });
});

describe("charCount", () => {
  it("counts code points, not UTF-16 units", () => {
    expect(charCount("👋🏽")).toBe(2); // wave + skin tone modifier
    expect(charCount("ñ")).toBe(1);
  });
});
