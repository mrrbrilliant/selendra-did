/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    target: "serverless",
    async rewrites() {
        return [
            {
                source: "/:any*",
                destination: "/",
            },
        ];
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    },
    images: {
        domains: ["avatars.dicebear.com", "api.lorem.space"],
    },
};

module.exports = nextConfig;
