/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/api/(.*)",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*"
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,OPTIONS,DELETE,POST,PUT"
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type,Authorization"
                    },
                    {
                        key: "Content-range",
                        value: "bytes: 0-9/*"
                    }
                ]
            }
        ]
    }
};

export default nextConfig;
