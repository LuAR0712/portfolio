// @vitest-environment node
import { getNowPlaying, type SpotifyCredentials } from "./spotify";

const credentials: SpotifyCredentials = {
  clientId: "id",
  clientSecret: "secret",
  refreshToken: "r",
};

const track = (name: string) => ({
  type: "track",
  name,
  artists: [{ name: "Soda Stereo" }, { name: "Gustavo Cerati" }],
  album: {
    images: [
      { url: "https://i.scdn.co/image/640", width: 640, height: 640 },
      { url: "https://i.scdn.co/image/64", width: 64, height: 64 },
      { url: "https://i.scdn.co/image/300", width: 300, height: 300 },
    ],
  },
  external_urls: { spotify: `https://open.spotify.com/track/${name}` },
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// Routes each Spotify endpoint to a canned response.
function fakeFetch(routes: { current: Response; recent?: Response }) {
  return vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes("accounts.spotify.com")) return json({ access_token: "token" });
    if (url.includes("currently-playing")) return routes.current;
    if (url.includes("recently-played")) return routes.recent ?? json({ items: [] });
    throw new Error(`Unexpected ${url}`);
  }) as unknown as typeof fetch;
}

describe("getNowPlaying", () => {
  it("returns the track currently playing", async () => {
    const result = await getNowPlaying(
      credentials,
      fakeFetch({ current: json({ is_playing: true, item: track("De música ligera") }) }),
    );

    expect(result).toEqual({
      status: "playing",
      title: "De música ligera",
      artists: "Soda Stereo, Gustavo Cerati",
      url: "https://open.spotify.com/track/De música ligera",
      image: { url: "https://i.scdn.co/image/64", width: 64, height: 64 },
    });
  });

  it("falls back to the last played track when nothing is playing", async () => {
    const result = await getNowPlaying(
      credentials,
      fakeFetch({
        current: new Response(null, { status: 204 }),
        recent: json({ items: [{ track: track("Persiana americana") }] }),
      }),
    );
    expect(result).toMatchObject({ status: "recent", title: "Persiana americana" });
  });

  it("treats a paused track as not playing", async () => {
    const result = await getNowPlaying(
      credentials,
      fakeFetch({
        current: json({ is_playing: false, item: track("Paused") }),
        recent: json({ items: [{ track: track("Last") }] }),
      }),
    );
    expect(result).toMatchObject({ status: "recent", title: "Last" });
  });

  it("returns null when there is no history", async () => {
    const result = await getNowPlaying(
      credentials,
      fakeFetch({ current: new Response(null, { status: 204 }) }),
    );
    expect(result).toBeNull();
  });

  it("throws on API errors so the route can respond 502", async () => {
    await expect(getNowPlaying(credentials, fakeFetch({ current: json({}, 429) }))).rejects.toThrow(
      /429/,
    );
  });
});
