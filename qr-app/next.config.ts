import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://backupbuddy.io",
        permanent: false,
      },
      {
        source: "/banner-1",
        destination: "https://backupbuddy.io/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
