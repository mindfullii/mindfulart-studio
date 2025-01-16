/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
};

module.exports = nextConfig; 