import { clearDraft, DRAFT_KEY, readDraft, saveDraft } from "./draft";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("contact draft", () => {
  it("round-trips a draft", () => {
    saveDraft({ name: "Ana", message: "Hola" });
    expect(readDraft()).toEqual({
      name: "Ana",
      email: "",
      company: "",
      subject: "",
      message: "Hola",
    });
  });

  it("removes the entry when every field is empty", () => {
    saveDraft({ name: "Ana" });
    saveDraft({ name: "  " });
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(readDraft()).toBeNull();
  });

  it("ignores corrupt or unexpected data", () => {
    localStorage.setItem(DRAFT_KEY, "{not json");
    expect(readDraft()).toBeNull();

    localStorage.setItem(DRAFT_KEY, JSON.stringify({ name: 42, message: ["x"], extra: "y" }));
    expect(readDraft()).toBeNull();
  });

  it("caps stored values", () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ message: "a".repeat(50_000) }));
    expect(readDraft()?.message.length).toBe(2000);
  });

  it("keeps working when storage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });
    expect(() => saveDraft({ name: "Ana" })).not.toThrow();
  });

  it("clears the draft", () => {
    saveDraft({ name: "Ana" });
    clearDraft();
    expect(readDraft()).toBeNull();
  });
});
