/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "server",
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loka.youneselaoufy.com",
        pathname: "/uploads/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:4000/api/:path*", // ✅ internal API calls via Nginx reverse proxy
      },
    ];
  },
};

export default nextConfig;