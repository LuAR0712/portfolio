import { useSyncExternalStore } from "react";
import type { LocalWeather } from "./open-meteo";

/*
 * Two tiny external stores shared by the "Buenos Aires now" card and the day-phase background:
 * - weather: one fetch of /api/buenos-aires for the whole page, refreshed every 10 minutes while
 *   anything is subscribed. `null` until loaded or when unavailable.
 * - clock: the current minute. Notifies only when the minute changes, not every second.
 * Both return null on the server, so time-dependent UI renders only after hydration.
 */

type Listener = () => void;

function createStore<T>(initial: T, start: (set: (value: T) => void) => () => void) {
  let value = initial;
  const listeners = new Set<Listener>();
  let stop: (() => void) | null = null;

  const set = (next: T) => {
    if (Object.is(next, value)) return;
    value = next;
    for (const listener of listeners) listener();
  };

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      stop ??= start(set);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    },
    get: () => value,
  };
}

const WEATHER_REFRESH_MS = 10 * 60 * 1000;

const weatherStore = createStore<LocalWeather | null>(null, (set) => {
  const controller = new AbortController();
  const load = async () => {
    try {
      const response = await fetch("/api/buenos-aires", { signal: controller.signal });
      set(response.ok ? ((await response.json()) as LocalWeather | null) : null);
    } catch {
      // Offline or aborted: keep whatever we had; the card still shows the time.
    }
  };
  void load();
  const interval = window.setInterval(load, WEATHER_REFRESH_MS);
  return () => {
    controller.abort();
    window.clearInterval(interval);
  };
});

const currentMinute = () => Math.floor(Date.now() / 60_000) * 60_000;

const clockStore = createStore<number | null>(null, (set) => {
  set(currentMinute());
  const interval = window.setInterval(() => set(currentMinute()), 5_000);
  return () => window.clearInterval(interval);
});

export function useLocalWeather(): LocalWeather | null {
  return useSyncExternalStore(weatherStore.subscribe, weatherStore.get, () => null);
}

// Epoch ms of the current minute, or null during SSR and hydration.
export function useMinuteClock(): number | null {
  return useSyncExternalStore(clockStore.subscribe, clockStore.get, () => null);
}
