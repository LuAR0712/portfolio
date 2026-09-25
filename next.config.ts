import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Album art for the "now playing" player (Last.fm CDN).
    remotePatterns: [
      { protocol: "https", hostname: "lastfm.freetls.fastly.net", pathname: "/i/**" },
    ],
  },
};

export default withNextIntl(nextConfig);
