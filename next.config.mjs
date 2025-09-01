/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Expose environment variables to the browser
    NEXT_PUBLIC_RPC_URL: process.env.SEPOLIA_RPC_URL,
    NEXT_PUBLIC_CHAIN_ID: process.env.CHAIN_ID,
  },
};

export default nextConfig;
