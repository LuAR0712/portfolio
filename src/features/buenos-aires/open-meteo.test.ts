// @vitest-environment node
import { fetchLocalWeather } from "./open-meteo";

const location = {
  latitude: -34.6037,
  longitude: -58.3816,
  timeZone: "America/Argentina/Buenos_Aires",
};

const respond = (body: unknown, status = 200) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

// Shape recorded from the real API.
const sample = {
  current: { time: "2026-09-26T15:45", temperature_2m: 19.7, weather_code: 0, is_day: 1 },
  daily: { time: ["2026-09-26"], sunrise: ["2026-09-26T06:37"], sunset: ["2026-09-26T18:53"] },
};

describe("fetchLocalWeather", () => {
  it("normalizes the current weather and today's sun times", async () => {
    await expect(fetchLocalWeather(location, respond(sample))).resolves.toEqual({
      temperature: 19.7,
      weatherCode: 0,
      isDay: true,
      sunrise: "06:37",
      sunset: "18:53",
    });
  });

  it("asks for the location in its own time zone", async () => {
    const fetcher = respond(sample);
    await fetchLocalWeather(location, fetcher);
    const url = new URL(String(vi.mocked(fetcher).mock.calls[0]![0]));
    expect(url.searchParams.get("timezone")).toBe("America/Argentina/Buenos_Aires");
    expect(url.searchParams.get("latitude")).toBe("-34.6037");
  });

  it("rejects incomplete responses and API errors", async () => {
    await expect(fetchLocalWeather(location, respond({ current: {} }))).rejects.toThrow(/missing/);
    await expect(fetchLocalWeather(location, respond({}, 500))).rejects.toThrow(/500/);
  });
});
