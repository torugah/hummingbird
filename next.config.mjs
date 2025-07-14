/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        // pathname: '/username/**', // Opcional
      },
    ],
  },
  // Adicione esta parte nova para o Prisma:
  webpack: (config) => {
    config.externals = [...(config.externals || []), { '@prisma/client': 'PrismaClient' }];
    return config;
  }
};

export default nextConfig;