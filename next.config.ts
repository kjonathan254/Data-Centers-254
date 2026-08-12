import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/beginners",
        destination: "/data-centres",
        permanent: true,
      },
      {
        source: "/kenya",
        destination: "/data-centres",
        permanent: true,
      },
      {
        source: "/internet",
        destination: "/infrastructure",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
