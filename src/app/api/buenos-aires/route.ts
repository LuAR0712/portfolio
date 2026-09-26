import { NextResponse } from "next/server";
import { profile } from "@/content/profile";
import { fetchLocalWeather } from "@/features/buenos-aires/open-meteo";

// Weather changes slowly: the CDN serves one answer for 10 minutes, so Open-Meteo sees a handful
// of requests per hour regardless of traffic.
const CACHE = "public, s-maxage=600, stale-while-revalidate=1800";

export async function GET() {
  try {
    const weather = await fetchLocalWeather(profile.location);
    return NextResponse.json(weather, { headers: { "Cache-Control": CACHE } });
  } catch (error) {
    console.error("[buenos-aires]", error);
    return NextResponse.json(null, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
