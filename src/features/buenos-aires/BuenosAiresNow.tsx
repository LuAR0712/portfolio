"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/Icon";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { useLocalWeather, useMinuteClock } from "./stores";
import { hoursAhead, timeZoneOffset, weatherKind, type WeatherKind } from "./time-and-weather";

const WEATHER_ICON: Record<WeatherKind, IconName> = {
  clear: "sun",
  clearNight: "moon",
  partly: "cloudSun",
  cloudy: "cloud",
  fog: "fog",
  drizzle: "rain",
  rain: "rain",
  snow: "snow",
  storm: "storm",
};

/*
 * Local time and weather where I live, plus the visitor's time difference: a human touch that is
 * also practical for remote hiring. Time and difference are computed in the browser; weather comes
 * from our cached /api/buenos-aires route and is simply omitted if unavailable.
 * The card keeps a fixed size from the first render and fades in, so the hero never shifts.
 */
export function BuenosAiresNow({ className }: { className?: string }) {
  const t = useTranslations("buenosAires");
  const format = useFormatter();
  const now = useMinuteClock();
  const weather = useLocalWeather();
  const { city, timeZone } = profile.location;

  const ready = now !== null;
  const date = new Date(now ?? 0);
  const difference = ready
    ? hoursAhead(-date.getTimezoneOffset(), timeZoneOffset(timeZone, date))
    : 0;
  const kind = weather ? weatherKind(weather.weatherCode, weather.isDay) : null;

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "h-[5.5rem] w-60 rounded-lg border border-border bg-surface/70 px-4 py-3 text-sm shadow-soft backdrop-blur-sm transition-opacity duration-500",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {ready && (
        <>
          <p className="flex items-center gap-1.5 font-medium">
            <Icon name="pin" className="size-4 text-primary" />
            {city}
            <span aria-hidden="true" className="text-muted">
              ·
            </span>
            <time dateTime={date.toISOString()} className="tabular-nums">
              {format.dateTime(date, { hour: "2-digit", minute: "2-digit", timeZone })}
            </time>
          </p>
          {weather && kind && (
            <p className="mt-1 flex items-center gap-1.5 text-muted">
              <Icon name={WEATHER_ICON[kind]} className="size-4" />
              {format.number(weather.temperature, {
                style: "unit",
                unit: "celsius",
                maximumFractionDigits: 0,
              })}
              <span aria-hidden="true">·</span>
              {t(`weather.${kind}`)}
            </p>
          )}
          <p className="mt-1 text-xs text-muted">
            {difference === 0
              ? t("same")
              : t(difference > 0 ? "ahead" : "behind", {
                  hours: format.number(Math.abs(difference), { maximumFractionDigits: 1 }),
                })}
          </p>
        </>
      )}
    </div>
  );
}
