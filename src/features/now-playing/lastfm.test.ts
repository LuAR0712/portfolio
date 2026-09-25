// @vitest-environment node
import { getNowPlaying, type LastfmConfig } from "./lastfm";

const config: LastfmConfig = { apiKey: "key", username: "luciano" };

const images = (hash: string) => [
  { size: "small", "#text": `https://lastfm.freetls.fastly.net/i/u/34s/${hash}.png` },
  { size: "large", "#text": `https://lastfm.freetls.fastly.net/i/u/174s/${hash}.png` },
];

const track = (overrides: Record<string, unknown> = {}) => ({
  name: "De música ligera",
  url: "https://www.last.fm/music/Soda+Stereo/_/De+m%C3%BAsica+ligera",
  artist: { "#text": "Soda Stereo" },
  image: images("abc123"),
  ...overrides,
});

function respond(body: unknown, status = 200) {
  return vi.fn(
    async () => new Response(JSON.stringify(body), { status }),
  ) as unknown as typeof fetch;
}

describe("getNowPlaying (Last.fm)", () => {
  it("returns the track playing now", async () => {
    const result = await getNowPlaying(
      config,
      respond({ recenttracks: { track: [track({ "@attr": { nowplaying: "true" } }), track()] } }),
    );

    expect(result).toEqual({
      status: "playing",
      title: "De música ligera",
      artist: "Soda Stereo",
      url: "https://www.last.fm/music/Soda+Stereo/_/De+m%C3%BAsica+ligera",
      image: "https://lastfm.freetls.fastly.net/i/u/174s/abc123.png",
    });
  });

  it("returns the last scrobble with when it was played", async () => {
    const result = await getNowPlaying(
      config,
      respond({ recenttracks: { track: [track({ date: { uts: "1790000000" } })] } }),
    );
    expect(result).toMatchObject({ status: "recent", playedAt: 1_790_000_000_000 });
  });

  it("accepts a single track object instead of an array", async () => {
    const result = await getNowPlaying(config, respond({ recenttracks: { track: track() } }));
    expect(result?.title).toBe("De música ligera");
  });

  it("drops Last.fm's placeholder artwork (typical of YouTube scrobbles)", async () => {
    const result = await getNowPlaying(
      config,
      respond({
        recenttracks: { track: [track({ image: images("2a96cbd8b46e442fc41c2b86b821562f") })] },
      }),
    );
    expect(result?.image).toBeNull();
  });

  it("returns null for an empty history", async () => {
    expect(await getNowPlaying(config, respond({ recenttracks: { track: [] } }))).toBeNull();
  });

  it("throws on API errors so the route can respond 502", async () => {
    await expect(getNowPlaying(config, respond({}, 503))).rejects.toThrow(/503/);
  });
});
