/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        // Opcional: restringir a caminhos específicos
        // pathname: '/username/**',
      },
    ],
  },
};

export default nextConfig;