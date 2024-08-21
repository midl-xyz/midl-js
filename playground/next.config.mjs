/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
    };
    return config;
  },
  rewrites() {
    return [
      {
        source: "/api/runes/:path*",
        destination: "https://api-testnet.unisat.io/query-v4/:path*",
      },
    ];
  },
};

export default nextConfig;
