/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // skip lint step in prod build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // skip type-errors in prod build
    ignoreBuildErrors: true,
    // skip type-errors in dev too (Next 14+)
    ignoreDevErrors: true,
  },
  webpack(config) {
    // remove the fork-ts-checker plugin entirely
    config.plugins = config.plugins.filter(
      (p) => p.constructor.name !== 'ForkTsCheckerWebpackPlugin'
    );
    return config;
  },
};

export default nextConfig;
