/** @type {import('next').NextConfig} */

// TEMPORAIRE : définir le port avant le build standalone
process.env.PORT = "3100";

const nextConfig = {
  output: "standalone",            // ✅ Nécessaire pour déploiement via PM2
  basePath: "/loka",               // ✅ Nécessaire pour sous-chemin Nginx
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
