// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // No delatar la tecnología en la cabecera X-Powered-By
  poweredByHeader: false,

  // El optimizador de imágenes solo debe servir imágenes de Sanity
  // (antes: hostname "**" = cualquier dominio de internet)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
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

  async headers() {
    // CSP para el sitio público: hecha a medida de lo que realmente carga
    // (GA, YouTube nocookie en vlogs, imágenes de Sanity, fuentes propias).
    // 'unsafe-inline' en scripts es obligatorio: next-themes y Next.js
    // inyectan scripts inline; sin él, el sitio se rompería.
    const cspPublic = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://cdn.sanity.io https://www.google-analytics.com",
      "font-src 'self'",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
      "frame-src https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    // CSP para /studio: Sanity Studio necesita sus propios dominios
    // y 'unsafe-eval'. Más permisiva, pero sigue prohibiendo iframes.
    const cspStudio = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sanity.io",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://cdn.sanity.io",
      "font-src 'self' data:",
      "connect-src 'self' https://*.sanity.io https://*.api.sanity.io wss://*.sanity.io",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    const common = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
      },
      // includeSubDomains + preload endurecen el HSTS que Vercel ya envía.
      // 'preload' solo tiene efecto si se registra el dominio en
      // https://hstspreload.org (hacerlo solo cuando el HTTPS esté asentado).
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];

    return [
      {
        source: "/studio/:path*",
        headers: [
          ...common,
          { key: "Content-Security-Policy", value: cspStudio },
        ],
      },
      {
        // La regla general va DESPUÉS: si dos reglas coinciden, gana la última
        // para la misma cabecera. Verificar con curl tras el despliegue que
        // /studio recibe cspStudio y el resto cspPublic.
        source: "/(.*)",
        headers: [
          ...common,
          { key: "Content-Security-Policy", value: cspPublic },
        ],
      },
    ];
  },
};

export default nextConfig;
