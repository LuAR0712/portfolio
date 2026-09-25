import { NextResponse } from "next/server";
import { getNowPlaying } from "@/features/now-playing/lastfm";
import { getServerEnv } from "@/lib/env";

// Shared CDN cache: every visitor within 30 s gets the same answer, so Last.fm sees at most a
// couple of requests a minute no matter the traffic.
const CACHE = "public, s-maxage=30, stale-while-revalidate=60";

export async function GET() {
  const { LASTFM_API_KEY, LASTFM_USERNAME } = getServerEnv();

  // Not configured: the player simply doesn't render.
  if (!LASTFM_API_KEY || !LASTFM_USERNAME) {
    return NextResponse.json(null, { headers: { "Cache-Control": CACHE } });
  }

  try {
    const track = await getNowPlaying({ apiKey: LASTFM_API_KEY, username: LASTFM_USERNAME });
    return NextResponse.json(track, { headers: { "Cache-Control": CACHE } });
  } catch (error) {
    console.error("[now-playing]", error);
    return NextResponse.json(null, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
