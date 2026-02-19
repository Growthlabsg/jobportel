const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Ensure build uses this package as root when there are multiple lockfiles (e.g. parent directory)
  outputFileTracingRoot: path.join(__dirname),
}

module.exports = nextConfig

