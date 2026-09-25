import { NextResponse } from "next/server";
import { getNowPlaying } from "@/features/now-playing/spotify";
import { getServerEnv } from "@/lib/env";

// Shared CDN cache: every visitor within 30 s gets the same answer, so Spotify sees at most a
// couple of requests a minute no matter the traffic.
const CACHE = "public, s-maxage=30, stale-while-revalidate=60";

export async function GET() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = getServerEnv();

  // Not configured: the widget simply doesn't render.
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return NextResponse.json(null, { headers: { "Cache-Control": CACHE } });
  }

  try {
    const track = await getNowPlaying({
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
      refreshToken: SPOTIFY_REFRESH_TOKEN,
    });
    return NextResponse.json(track, { headers: { "Cache-Control": CACHE } });
  } catch (error) {
    console.error("[now-playing]", error);
    return NextResponse.json(null, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
