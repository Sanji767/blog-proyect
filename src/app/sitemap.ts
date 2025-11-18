// src/app/sitemap.ts
import { banks } from "@/lib/banks";

export default function sitemap() {
  const baseUrl = "https://bancoseuropa.com"; // cambia cuando tengas dominio

  const staticRoutes = [
    "/",
    "/bancos",
    "/comparativa",
    "/faq",
    "/ventajas",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const bankRoutes = banks.map((bank) => ({
    url: `${baseUrl}/programas/${bank.slug}`,
    lastModified: new Date(bank._lastUpdated ?? new Date()),
  }));

  return [...staticRoutes, ...bankRoutes];
}
