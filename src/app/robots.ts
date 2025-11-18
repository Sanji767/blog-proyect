// src/app/robots.ts
export default function robots() {
  const baseUrl = "https://finanzaseu.com"; // cambia cuando toque

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
