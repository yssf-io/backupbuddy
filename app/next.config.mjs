/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // skip lint step in prod build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // skip type-errors in prod build
    ignoreBuildErrors: true,
  },
  // Optimize for memory usage
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
  // Reduce memory usage during build
  swcMinify: true,
  compress: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://backupbuddy.io",
        permanent: false,
      },
    ];
  },
  webpack(config) {
    // remove the fork-ts-checker plugin entirely
    config.plugins = config.plugins.filter(
      (p) => p.constructor.name !== "ForkTsCheckerWebpackPlugin"
    );

    // Optimize memory usage
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    };

    return config;
  },
};

export default nextConfig;
