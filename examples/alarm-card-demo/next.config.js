const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: [
    'ai',
    '@ai-sdk/gateway',
    '@ai-sdk/openai-compatible',
    '@ai-sdk/provider',
    '@ai-sdk/provider-utils',
    '@ai-sdk/react',
  ],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      ai: path.resolve(__dirname, '../../packages/ai/src/index.ts'),
      '@ai-sdk/gateway': path.resolve(
        __dirname,
        '../../packages/gateway/src/index.ts',
      ),
      '@ai-sdk/openai-compatible': path.resolve(
        __dirname,
        '../../packages/openai-compatible/src/index.ts',
      ),
      '@ai-sdk/provider': path.resolve(
        __dirname,
        '../../packages/provider/src/index.ts',
      ),
      '@ai-sdk/provider-utils': path.resolve(
        __dirname,
        '../../packages/provider-utils/src/index.ts',
      ),
      '@ai-sdk/react': path.resolve(
        __dirname,
        '../../packages/react/src/index.ts',
      ),
    };

    return config;
  },
};

module.exports = nextConfig;
