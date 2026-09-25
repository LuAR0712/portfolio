/*
 * Minimal Last.fm client for the "now playing" player. Server-only (holds the API key).
 * Last.fm aggregates listening from several sources: Spotify scrobbles natively, and YouTube /
 * YouTube Music scrobble through the Web Scrobbler browser extension.
 */

export type NowPlaying = {
  status: "playing" | "recent";
  title: string;
  artist: string;
  url: string;
  image: string | null;
  // When a "recent" track finished (epoch ms). Absent while playing.
  playedAt?: number;
};

export type LastfmConfig = { apiKey: string; username: string };

type LastfmImage = { size: string; "#text": string };
type LastfmTrack = {
  name: string;
  url: string;
  artist: { "#text": string };
  image?: LastfmImage[];
  date?: { uts: string };
  "@attr"?: { nowplaying?: string };
};
type RecentTracksResponse = { recenttracks?: { track?: LastfmTrack | LastfmTrack[] } };

const API = "https://ws.audioscrobbler.com/2.0/";
// Last.fm serves this grey star when a track has no artwork (common for YouTube scrobbles).
const PLACEHOLDER_IMAGE = "2a96cbd8b46e442fc41c2b86b821562f";

function pickImage(images: LastfmImage[] = []): string | null {
  const preferred = ["large", "extralarge", "medium"]
    .map((size) => images.find((image) => image.size === size)?.["#text"])
    .find((url) => url && !url.includes(PLACEHOLDER_IMAGE));
  return preferred ?? null;
}

export function toNowPlaying(track: LastfmTrack): NowPlaying {
  const playing = track["@attr"]?.nowplaying === "true";
  return {
    status: playing ? "playing" : "recent",
    title: track.name,
    artist: track.artist["#text"],
    url: track.url,
    image: pickImage(track.image),
    ...(!playing && track.date ? { playedAt: Number(track.date.uts) * 1000 } : {}),
  };
}

// The track playing now, or the last one scrobbled. Null when the history is empty.
export async function getNowPlaying(
  { apiKey, username }: LastfmConfig,
  fetcher: typeof fetch = fetch,
): Promise<NowPlaying | null> {
  const url = new URL(API);
  url.search = new URLSearchParams({
    method: "user.getrecenttracks",
    user: username,
    api_key: apiKey,
    format: "json",
    limit: "1",
  }).toString();

  const response = await fetcher(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Last.fm request failed: ${response.status}`);

  // With limit=1, Last.fm returns an array (two items while something is playing) or, at times,
  // a bare object. The first item is always the most recent.
  const body = (await response.json()) as RecentTracksResponse;
  const tracks = body.recenttracks?.track;
  const first = Array.isArray(tracks) ? tracks[0] : tracks;
  return first ? toNowPlaying(first) : null;
}
