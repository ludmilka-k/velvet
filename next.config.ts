import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      {
        protocol: 'https',
        // hostname: 'kuhyy7wk80.ufs.sh',
        hostname: `${process.env.UPLOADTHING_APPID}.ufs.sh`,
        port: '',
      },
    ],
  },
};

export default nextConfig;
