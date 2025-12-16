// next.config.mjs
import nextMDX from "@next/mdx";

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
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);