/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  basePath: "/loka",              // ✅ Pour router depuis /loka
  assetPrefix: "/loka",           // ✅ Pour charger correctement _next/static/ et autres assets
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
