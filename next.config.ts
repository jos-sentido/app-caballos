import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lint is run explicitly (`npm run lint`), not during production builds,
  // so a lint warning never blocks a Vercel deploy. TypeScript errors still do.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
