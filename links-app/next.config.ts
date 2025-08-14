import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/x",
        destination: "https://x.com/BackupBuddy_io",
        permanent: false,
      },
      {
        source: "/telegram",
        destination: "https://t.me/+urWZC8ED7dMyMWMy",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
