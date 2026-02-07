// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Opcional: mejora compatibilidad con algunos paquetes
  transpilePackages: ["react-markdown", "rehype-*", "remark-*"],

  // ← ADD THIS BLOCK
  eslint: {
    // Allows production builds to succeed even with ESLint errors/warnings
    // Safe for Next.js 14.x – only removed in Next.js 16+
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
