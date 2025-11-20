// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,        // ← Esto desactiva el optimizador que está rompiendo tus logos
  },
  // Si usas App Router y exportas estático (no lo creo, pero por si acaso)
  // output: "export",   ← NO pongas esto si tienes "use client" y localStorage
};

export default nextConfig;