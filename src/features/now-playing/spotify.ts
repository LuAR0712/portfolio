/*
 * Minimal Spotify Web API client for the "now playing" widget. Server-only: it holds the app
 * secret and a refresh token for the site owner's account.
 * Scopes needed when creating the refresh token: user-read-currently-playing, user-read-recently-played.
 */

export type NowPlaying = {
  status: "playing" | "recent";
  title: string;
  artists: string;
  url: string;
  // Smallest album image of at least 64px, for a 48px thumbnail at 1x–2x.
  image: { url: string; width: number; height: number } | null;
};

export type SpotifyCredentials = { clientId: string; clientSecret: string; refreshToken: string };

type Fetch = typeof fetch;

type SpotifyImage = { url: string; width: number | null; height: number | null };
type SpotifyTrack = {
  type: string;
  name: string;
  artists: { name: string }[];
  album: { images: SpotifyImage[] };
  external_urls: { spotify: string };
};

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1/me/player";

async function getAccessToken(
  { clientId, clientSecret, refreshToken }: SpotifyCredentials,
  fetcher: Fetch,
) {
  const response = await fetcher(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Spotify token request failed: ${response.status}`);
  return ((await response.json()) as { access_token: string }).access_token;
}

function pickImage(images: SpotifyImage[]): NowPlaying["image"] {
  const usable = images
    .filter((image) => (image.width ?? 0) >= 64)
    .sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  const image = usable[0] ?? images[0];
  return image ? { url: image.url, width: image.width ?? 64, height: image.height ?? 64 } : null;
}

export function toNowPlaying(track: SpotifyTrack, status: NowPlaying["status"]): NowPlaying {
  return {
    status,
    title: track.name,
    artists: track.artists.map((artist) => artist.name).join(", "),
    url: track.external_urls.spotify,
    image: pickImage(track.album.images),
  };
}

/*
 * What the owner is playing right now, or the last track played. Returns null when there's
 * nothing to show (a podcast, an ad, or no history). Throws on API errors.
 */
export async function getNowPlaying(
  credentials: SpotifyCredentials,
  fetcher: Fetch = fetch,
): Promise<NowPlaying | null> {
  const token = await getAccessToken(credentials, fetcher);
  const headers = { Authorization: `Bearer ${token}` };

  const current = await fetcher(`${API}/currently-playing`, { headers, cache: "no-store" });
  if (current.status === 200) {
    const body = (await current.json()) as { is_playing: boolean; item: SpotifyTrack | null };
    if (body.is_playing && body.item?.type === "track") return toNowPlaying(body.item, "playing");
  } else if (current.status !== 204) {
    throw new Error(`Spotify currently-playing failed: ${current.status}`);
  }

  const recent = await fetcher(`${API}/recently-played?limit=1`, { headers, cache: "no-store" });
  if (!recent.ok) throw new Error(`Spotify recently-played failed: ${recent.status}`);
  const { items } = (await recent.json()) as { items: { track: SpotifyTrack }[] };
  const last = items[0]?.track;
  return last ? toNowPlaying(last, "recent") : null;
}
