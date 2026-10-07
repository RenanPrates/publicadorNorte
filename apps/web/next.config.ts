import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // upload de vídeos da pasta _media passa pelo proxy (senha da equipe)
    proxyClientMaxBodySize: '100mb',
  },
};

export default nextConfig;
