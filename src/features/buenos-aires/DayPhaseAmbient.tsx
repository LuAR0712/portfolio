"use client";

import { useEffect } from "react";
import { profile } from "@/content/profile";
import { useLocalWeather, useMinuteClock } from "./stores";
import { dayPhase, minutesInTimeZone, minutesOfDay } from "./time-and-weather";

/*
 * Marks <html data-ba-phase="dawn|day|dusk|night"> from the real sun in Buenos Aires; the
 * `bg-ambient` layer in globals.css tints the background accordingly. Renders nothing.
 * Without weather data (no sunrise/sunset) the attribute stays unset and the page keeps its
 * default look.
 */
export function DayPhaseAmbient() {
  const now = useMinuteClock();
  const weather = useLocalWeather();

  useEffect(() => {
    if (now === null || !weather) return;
    const root = document.documentElement;
    root.dataset.baPhase = dayPhase(
      minutesInTimeZone(profile.location.timeZone, new Date(now)),
      minutesOfDay(weather.sunrise),
      minutesOfDay(weather.sunset),
    );
    return () => {
      delete root.dataset.baPhase;
    };
  }, [now, weather]);

  return null;
}
