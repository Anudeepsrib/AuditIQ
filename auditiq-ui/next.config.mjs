/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/inference',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
