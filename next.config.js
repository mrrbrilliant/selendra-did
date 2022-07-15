/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  images: {
    domains: [
      "avatars.dicebear.com",
      "api.lorem.space",
      "avatars.githubusercontent.com",
      "upload.wikimedia.org",
      "media-exp2.licdn.com",
      "gateway.kumandra.org",
      "cloudflare-ipfs.com",
    ],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
