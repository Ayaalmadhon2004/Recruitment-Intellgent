import type { NextConfig } from 'next';
import { buildSecurityHeaders } from './src/server/security-headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [...buildSecurityHeaders({ isDevelopment: process.env.NODE_ENV === 'development' })],
      },
    ];
  },
};

export default nextConfig;
