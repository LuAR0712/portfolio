/*
 * Current weather and today's sunrise/sunset for a location, from Open-Meteo (free, no API key).
 * Called from our own route handler, so visitors' browsers never contact a third party.
 */

export type LocalWeather = {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  // Local times in the location's zone, "HH:MM".
  sunrise: string;
  sunset: string;
};

type Location = { latitude: number; longitude: number; timeZone: string };

type ForecastResponse = {
  current?: { temperature_2m?: number; weather_code?: number; is_day?: number };
  daily?: { sunrise?: string[]; sunset?: string[] };
};

const API = "https://api.open-meteo.com/v1/forecast";

const localTime = (iso?: string) => iso?.split("T")[1] ?? null;

export async function fetchLocalWeather(
  { latitude, longitude, timeZone }: Location,
  fetcher: typeof fetch = fetch,
): Promise<LocalWeather> {
  const url = new URL(API);
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,weather_code,is_day",
    daily: "sunrise,sunset",
    timezone: timeZone,
    forecast_days: "1",
  }).toString();

  const response = await fetcher(url, { next: { revalidate: 600 } } as RequestInit);
  if (!response.ok) throw new Error(`Open-Meteo request failed: ${response.status}`);

  const { current, daily } = (await response.json()) as ForecastResponse;
  const sunrise = localTime(daily?.sunrise?.[0]);
  const sunset = localTime(daily?.sunset?.[0]);
  if (
    typeof current?.temperature_2m !== "number" ||
    typeof current.weather_code !== "number" ||
    !sunrise ||
    !sunset
  ) {
    throw new Error("Open-Meteo response is missing fields");
  }

  return {
    temperature: current.temperature_2m,
    weatherCode: current.weather_code,
    isDay: current.is_day === 1,
    sunrise,
    sunset,
  };
}
