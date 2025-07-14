/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { '@prisma/client': 'PrismaClient' }];
    return config;
  },
  experimental: {
    serverActions: true,
  },
  output: 'standalone' 
};

export default nextConfig;