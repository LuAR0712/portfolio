import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Album art for the "now playing" widget.
    remotePatterns: [{ protocol: "https", hostname: "i.scdn.co", pathname: "/image/**" }],
  },
};

export default withNextIntl(nextConfig);
