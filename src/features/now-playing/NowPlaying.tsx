"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { NowPlaying as Track } from "./lastfm";

const REFRESH_MS = 60_000;

type Loaded = { track: Track; fetchedAt: number };

/*
 * A small retro MP3 player showing what I'm listening to (or the last track), via Last.fm.
 * Fetches /api/now-playing after hydration and refreshes every minute while the tab is visible.
 * Renders nothing until there is a track, when Last.fm isn't configured, or on any error.
 *
 * The looping visuals (equalizer, scan bar) can be paused with the wheel's center button, as
 * WCAG 2.2.2 requires for motion that runs longer than five seconds; they start paused when the OS
 * asks for reduced motion. The other wheel marks are decoration, hidden from assistive tech.
 */
export function NowPlaying() {
  const t = useTranslations("nowPlaying");
  const format = useFormatter();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  // Starts paused when the OS asks for reduced motion. Nothing renders on the server, so reading
  // matchMedia here can't cause a hydration mismatch.
  const [paused, setPaused] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    let controller: AbortController | undefined;
    const load = async () => {
      if (document.visibilityState !== "visible") return;
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch("/api/now-playing", { signal: controller.signal });
        const track = response.ok ? ((await response.json()) as Track | null) : null;
        setLoaded(track ? { track, fetchedAt: Date.now() } : null);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setLoaded(null);
      }
    };

    void load();
    const interval = window.setInterval(load, REFRESH_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      controller?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  if (!loaded) return null;

  const { track, fetchedAt } = loaded;
  const playing = track.status === "playing";
  const animationState = paused ? "[animation-play-state:paused]" : undefined;

  return (
    <section
      aria-label={t("label")}
      className="inline-flex w-full max-w-sm items-center gap-4 rounded-[1.25rem] border border-border bg-surface p-3 shadow-lift"
    >
      {/* LCD screen */}
      <div className="min-w-0 flex-1 rounded-md bg-lcd px-3 py-2.5 font-mono text-lcd-fg shadow-inner">
        <p className="flex items-center justify-between gap-2 text-[0.625rem] tracking-widest uppercase">
          <span className="flex items-center gap-1.5">
            <Icon name={playing ? "play" : "pause"} className="size-2.5 fill-current" />
            {playing ? t("playing") : t("recent")}
          </span>
          {playing && <Equalizer className={animationState} />}
        </p>

        <div className="mt-2 flex items-center gap-2.5">
          {track.image ? (
            <Image
              src={track.image}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-sm object-cover"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-lcd-muted/40">
              <Icon name="music" className="size-4 text-lcd-muted" />
            </span>
          )}
          <div className="min-w-0 text-xs">
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${track.title} — ${track.artist}`}
              className="block truncate font-semibold underline-offset-2 hover:underline"
            >
              {track.title}
              <span className="sr-only"> {t("newTab")}</span>
            </a>
            <p className="truncate text-lcd-muted">{track.artist}</p>
          </div>
        </div>

        {playing ? (
          <div
            aria-hidden="true"
            className="mt-2.5 h-1 overflow-hidden rounded-full bg-lcd-muted/25"
          >
            <div
              className={cn("h-full w-1/3 animate-scan rounded-full bg-lcd-fg", animationState)}
            />
          </div>
        ) : (
          track.playedAt && (
            <p className="mt-2 text-[0.625rem] text-lcd-muted">
              {format.relativeTime(track.playedAt, fetchedAt)}
            </p>
          )
        )}
      </div>

      {/* Click wheel: only the center button is a control */}
      <div className="relative grid size-20 shrink-0 place-items-center rounded-full border border-border bg-bg shadow-inner">
        <span
          aria-hidden="true"
          className="absolute top-1.5 font-mono text-[0.5rem] tracking-widest text-muted"
        >
          MENU
        </span>
        <Icon name="skipBack" className="absolute left-2 size-2.5 fill-current text-muted" />
        <Icon name="skipForward" className="absolute right-2 size-2.5 fill-current text-muted" />
        {playing ? (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={!paused}
            aria-label={t("animation")}
            className="grid size-9 place-items-center rounded-full border border-border bg-surface text-fg transition-colors duration-(--duration-fast) hover:bg-fg/5"
          >
            <Icon name={paused ? "play" : "pause"} className="size-3.5 fill-current" />
          </button>
        ) : (
          <span
            aria-hidden="true"
            className="size-9 rounded-full border border-border bg-surface"
          />
        )}
      </div>
    </section>
  );
}

function Equalizer({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className="flex h-2.5 items-end gap-0.5">
      {[0, 150, 300, 450].map((delay) => (
        <span
          key={delay}
          className={cn("h-full w-0.5 origin-bottom animate-eq rounded-full bg-current", className)}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}
