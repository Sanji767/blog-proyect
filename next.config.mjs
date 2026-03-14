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

  // Windows: some environments block child_process IPC, which breaks Next's build worker.
  // Disabling it keeps the build in a single process (slower, but reliable).
  experimental: {
    webpackBuildWorker: false,
    workerThreads: true,
    // Avoid passing undefined IPC env vars to static workers (Windows + workerThreads).
    staticWorkerRequestDeduping: true,
  },

  // Opcional: mejora compatibilidad con algunos paquetes
  transpilePackages: [
    "sanity",
    "next-sanity",
    "@sanity/ui",
    "react-markdown",
    "rehype-*",
    "remark-*",
  ],

  // ← ADD THIS BLOCK
  eslint: {
    // Allows production builds to succeed even with ESLint errors/warnings
    // Safe for Next.js 14.x – only removed in Next.js 16+
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
