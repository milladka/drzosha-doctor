/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-Robots-Tag",
                        value: "noindex, nofollow",
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'keyhantex.ir',
            pathname: '/drzosha/loader/image/**',
          },
        ],
    }
};

export default nextConfig;
