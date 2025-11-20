// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Con las imágenes en /public ya no necesitas esto, pero por si usas externas algún día
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // unoptimized: true ← ya NO hace falta si usas /public correctamente
  },
};

export default nextConfig;