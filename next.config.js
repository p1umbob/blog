const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: isProd ? 'https://fulgari.github.io' : '',
  images: {
  loader: 'akamai',
  path: '',
  },

}

module.exports = nextConfig
