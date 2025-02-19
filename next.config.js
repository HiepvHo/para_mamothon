const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Bật tính năng minification với SWC
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'worker_threads': false,
        'fs': false,
        'net': false,
        'tls': false,
      };
    }
    return config;
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  experimental: {
    serverActions: true,
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_PARA_API_KEY: process.env.NEXT_PUBLIC_PARA_API_KEY,
  }
};

module.exports = nextConfig;