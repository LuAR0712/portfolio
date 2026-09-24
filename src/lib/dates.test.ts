// @vitest-environment node
import { formatPartialDate, fullYearsSince, toIsoValue } from "./dates";

const format = (locale: string) => (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale, options).format(date);

describe("formatPartialDate", () => {
  it("formats month and year in the given locale", () => {
    expect(formatPartialDate({ year: 2022, month: 6 }, format("en"))).toBe("Jun 2022");
    expect(formatPartialDate({ year: 2022, month: 6 }, format("es"))).toMatch(/^jun\.? 2022$/);
  });

  it("falls back to the bare year when the month is unknown", () => {
    expect(formatPartialDate({ year: 2017 }, format("en"))).toBe("2017");
  });
});

describe("toIsoValue", () => {
  it("produces valid <time> values", () => {
    expect(toIsoValue({ year: 2022, month: 6 })).toBe("2022-06");
    expect(toIsoValue({ year: 2017 })).toBe("2017");
  });
});

describe("fullYearsSince", () => {
  const start = { year: 2022, month: 6 };

  it("counts only completed years", () => {
    expect(fullYearsSince(start, new Date(Date.UTC(2026, 4, 31)))).toBe(3);
    expect(fullYearsSince(start, new Date(Date.UTC(2026, 5, 1)))).toBe(4);
  });

  it("never returns a negative number", () => {
    expect(fullYearsSince(start, new Date(Date.UTC(2020, 0, 1)))).toBe(0);
  });
});
