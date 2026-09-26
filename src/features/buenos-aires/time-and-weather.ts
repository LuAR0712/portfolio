/*
 * Pure helpers for the "Buenos Aires now" card and the day-phase background.
 * No I/O: everything takes explicit inputs so it's deterministic in tests.
 */

export type WeatherKind =
  "clear" | "clearNight" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

export type DayPhase = "night" | "dawn" | "day" | "dusk";

// WMO weather interpretation codes, as returned by Open-Meteo.
export function weatherKind(code: number, isDay: boolean): WeatherKind {
  if (code === 0) return isDay ? "clear" : "clearNight";
  if (code <= 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
}

// "06:37" or "2026-09-26T06:37" → minutes since midnight.
export function minutesOfDay(time: string): number {
  const [hours = 0, minutes = 0] = (time.split("T")[1] ?? time).split(":").map(Number);
  return hours * 60 + minutes;
}

// Dawn and dusk span 45 minutes on each side of sunrise and sunset.
const TWILIGHT_MIN = 45;

export function dayPhase(now: number, sunrise: number, sunset: number): DayPhase {
  if (Math.abs(now - sunrise) <= TWILIGHT_MIN) return "dawn";
  if (Math.abs(now - sunset) <= TWILIGHT_MIN) return "dusk";
  return now > sunrise && now < sunset ? "day" : "night";
}

// UTC offset of a time zone at a given instant, in minutes (Buenos Aires → -180).
export function timeZoneOffset(timeZone: string, date: Date): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = /GMT([+-])(\d{2}):?(\d{2})?/.exec(name ?? "");
  if (!match) return 0; // "GMT" alone means UTC
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

// Minutes since midnight in a time zone, e.g. for comparing against sunrise/sunset.
export function minutesInTimeZone(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return value("hour") * 60 + value("minute");
}

// Hours the visitor is ahead (+) or behind (-) of the given zone. 0 when they share an offset.
export function hoursAhead(visitorOffset: number, zoneOffset: number): number {
  return (visitorOffset - zoneOffset) / 60;
}
