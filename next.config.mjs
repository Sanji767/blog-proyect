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
  // Next 15 upgrade (2026-11-20): dropped `workerThreads` and
  // `staticWorkerRequestDeduping` here — both were Windows-only workarounds
  // and are not recognized options in Next 15; Vercel builds never needed them.
  experimental: {
    webpackBuildWorker: false,
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

  // Redirecciones 301 de fusiones de contenido (auditoría 2026-11-20).
  // La guía gemela de cuentas para adolescentes se fusionó en la canónica.
  async redirects() {
    return [
      // /programas → /bancos migration (2026-11-23): fichas moved to /bancos/<slug>.
      {
        source: "/programas/:slug",
        destination: "/bancos/:slug",
        permanent: true,
      },
      {
        source: "/en/programas/:slug",
        destination: "/en/bancos/:slug",
        permanent: true,
      },
      {
        source: "/blog/cuentas-bancarias-menores-adolescentes-2026",
        destination: "/blog/cuentas-bancarias-adolescentes-2026",
        permanent: true,
      },
      {
        source: "/blog/mejores-bancos-digitales-europa-2025",
        destination: "/blog/los-mejores-bancos-digitales-en-europa-en-2026",
        permanent: true,
      },
      // Fusiones de duplicados (auditoría SEO 2026-11-23, F-02).
      {
        source: "/blog/gua-rpida-sobre-prstamos-personales-y-tasas-de-inters",
        destination: "/blog/guia-de-prestamos-personales-y-tasas-de-interes",
        permanent: true,
      },
      {
        source: "/blog/las-mejores-apps-de-finanzas-para-controlar-tus-gastos-fcilmente",
        destination: "/blog/las-mejores-apps-de-finanzas-personales-para-controlar-gastos",
        permanent: true,
      },
      {
        source: "/blog/cmo-automatizar-tu-ahorro-mensual-fcilmente",
        destination: "/blog/como-ahorrar-dinero-automaticamente-cada-mes",
        permanent: true,
      },
      {
        source: "/blog/construir-fondo-emergencia-estrategia-2026",
        destination: "/blog/guia-fondo-emergencia",
        permanent: true,
      },
      {
        source: "/blog/mejores-brokers-inversion-low-cost-2026",
        destination: "/blog/comparativa-brokers-low-cost",
        permanent: true,
      },
      {
        source: "/blog/guerra-cuentas-remuneradas-noviembre-2026",
        destination: "/blog/mejores-cuentas-remuneradas-2026",
        permanent: true,
      },
      {
        source: "/blog/las-tarjetas-de-crdito-con-las-mejores-recompensas",
        destination: "/blog/las-mejores-tarjetas-de-credito-con-recompensas-en-2026",
        permanent: true,
      },
      // Slugs con letras perdidas por falta de normalización NFD (F-04):
      // los archivos MDX se renombraron a su forma correcta.
      {
        source: "/blog/c-mo-gestionar-tus-finanzas-personales-de-forma-eficiente",
        destination: "/blog/como-gestionar-tus-finanzas-personales-de-forma-eficiente",
        permanent: true,
      },
      {
        source: "/blog/cmo-ahorrar-dinero-automticamente-cada-mes",
        destination: "/blog/como-ahorrar-dinero-automaticamente-cada-mes",
        permanent: true,
      },
      {
        source: "/blog/gua-de-prstamos-personales-y-tasas-de-inters",
        destination: "/blog/guia-de-prestamos-personales-y-tasas-de-interes",
        permanent: true,
      },
      {
        source: "/blog/las-mejores-tarjetas-de-crdito-con-recompensas-en-2026",
        destination: "/blog/las-mejores-tarjetas-de-credito-con-recompensas-en-2026",
        permanent: true,
      },
      // Revisión Revolut: contenido verificado en noviembre de 2026, el año
      // del slug se actualiza de 2025 a 2026 (F-05).
      {
        source: "/blog/opiniones-revolut-2025",
        destination: "/blog/opiniones-revolut-2026",
        permanent: true,
      },
    ];
  },

  async headers() {
    // CSP para el sitio público: hecha a medida de lo que realmente carga
    // (GA, YouTube nocookie en vlogs, imágenes de Sanity, fuentes propias).
    // 'unsafe-inline' en scripts es obligatorio: next-themes y Next.js
    // inyectan scripts inline; sin él, el sitio se rompería.
    // Las banderas de /iban son locales (public/flags/4x3, react-country-flag
    // con cdnUrl local): sin dependencias de CDN externos.
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
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      },
      // includeSubDomains + preload endurecen el HSTS que Vercel ya envía.
      // 'preload' solo tiene efecto si se registra el dominio en
      // https://hstspreload.org (hacerlo solo cuando el HTTPS esté asentado).
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];

    // Cuando varias reglas coinciden, gana la ÚLTIMA para la misma cabecera:
    // la regla general va PRIMERO y la de /studio DESPUÉS, así /studio
    // recibe cspStudio y el resto cspPublic (verificado con curl tras el
    // despliegue: con el orden inverso, /studio recibía la CSP pública).
    return [
      {
        source: "/(.*)",
        headers: [
          ...common,
          { key: "Content-Security-Policy", value: cspPublic },
        ],
      },
      {
        source: "/studio/:path*",
        headers: [
          ...common,
          { key: "Content-Security-Policy", value: cspStudio },
        ],
      },
    ];
  },
};

export default nextConfig;
