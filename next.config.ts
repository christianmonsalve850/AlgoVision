import type { NextConfig } from "next";
const withMDX = require('@next/mdx')()

const nextConfig: NextConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    experimental: {
        webpackBuildWorker: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // Google Profile Pictures
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com', // GitHub Profile Pictures
            },
        ],
    },
};

module.exports = withMDX(nextConfig)

export default nextConfig;
