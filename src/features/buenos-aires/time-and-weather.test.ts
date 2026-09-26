// @vitest-environment node
import {
  dayPhase,
  hoursAhead,
  minutesInTimeZone,
  minutesOfDay,
  timeZoneOffset,
  weatherKind,
} from "./time-and-weather";

const BA = "America/Argentina/Buenos_Aires";

describe("weatherKind", () => {
  it.each([
    [0, true, "clear"],
    [0, false, "clearNight"],
    [2, true, "partly"],
    [3, true, "cloudy"],
    [45, true, "fog"],
    [53, true, "drizzle"],
    [63, true, "rain"],
    [81, false, "rain"],
    [75, true, "snow"],
    [95, true, "storm"],
  ] as const)("code %i (day: %s) → %s", (code, isDay, kind) => {
    expect(weatherKind(code, isDay)).toBe(kind);
  });
});

describe("dayPhase", () => {
  const sunrise = minutesOfDay("2026-09-26T06:37");
  const sunset = minutesOfDay("2026-09-26T18:53");

  it.each([
    ["03:00", "night"],
    ["06:10", "dawn"],
    ["07:20", "dawn"],
    ["12:00", "day"],
    ["18:30", "dusk"],
    ["19:35", "dusk"],
    ["22:00", "night"],
  ])("%s → %s", (time, phase) => {
    expect(dayPhase(minutesOfDay(time), sunrise, sunset)).toBe(phase);
  });
});

describe("time zones", () => {
  const instant = new Date("2026-09-26T18:45:00Z");

  it("reads zone offsets, including half hours", () => {
    expect(timeZoneOffset(BA, instant)).toBe(-180);
    expect(timeZoneOffset("Europe/Madrid", instant)).toBe(120);
    expect(timeZoneOffset("Asia/Kolkata", instant)).toBe(330);
    expect(timeZoneOffset("UTC", instant)).toBe(0);
  });

  it("gives the local minutes of the day in a zone", () => {
    expect(minutesInTimeZone(BA, instant)).toBe(15 * 60 + 45);
  });

  it("computes how far ahead the visitor is", () => {
    expect(hoursAhead(120, -180)).toBe(5); // Madrid
    expect(hoursAhead(-300, -180)).toBe(-2); // New York (EST)
    expect(hoursAhead(330, -180)).toBe(8.5); // India
    expect(hoursAhead(-180, -180)).toBe(0);
  });
});
