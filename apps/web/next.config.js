//@ts-check

const path = require('path');
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},
  compress: true,
  turbopack: { root: path.resolve(__dirname, '../..') },
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**', port: '3001' },
      { protocol: 'http', hostname: '127.0.0.1', pathname: '/**', port: '3001' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
    ],
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
