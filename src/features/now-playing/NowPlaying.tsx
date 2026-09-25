"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { NowPlaying as Track } from "./spotify";

const REFRESH_MS = 60_000;

/*
 * What I'm listening to on Spotify, or the last thing I played. Fetches /api/now-playing after
 * hydration and refreshes every minute while the tab is visible. Renders nothing until there is a
 * track, when Spotify isn't configured, or on any error: it's a nice-to-have, never a broken box.
 */
export function NowPlaying() {
  const t = useTranslations("nowPlaying");
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    let controller: AbortController | undefined;

    const load = async () => {
      if (document.visibilityState !== "visible") return;
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch("/api/now-playing", { signal: controller.signal });
        setTrack(response.ok ? ((await response.json()) as Track | null) : null);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setTrack(null);
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

  if (!track) return null;

  const playing = track.status === "playing";

  return (
    <div className="flex items-center gap-3">
      {track.image && (
        <Image
          src={track.image.url}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-sm object-cover shadow-soft"
        />
      )}
      <div className="min-w-0 text-sm">
        <p className="flex items-center gap-2 font-mono text-xs tracking-wide text-muted uppercase">
          {playing && <Equalizer />}
          {playing ? t("playing") : t("recent")}
        </p>
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex max-w-full items-center gap-1 font-medium"
        >
          <span className="truncate">
            {track.title}{" "}
            <span className="font-normal text-muted">
              {t("byArtist", { artists: track.artists })}
            </span>
          </span>
          <span className="sr-only"> {t("newTab")}</span>
          <Icon
            name="arrowUpRight"
            className="size-3.5 shrink-0 text-muted transition-transform duration-(--duration-base) motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </div>
  );
}

function Equalizer() {
  return (
    <span aria-hidden="true" className="flex h-3 items-end gap-0.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-full w-0.5 origin-bottom animate-eq rounded-full bg-success"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}
