import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://finanzaseu.com" },
    { url: "https://finanzaseu.com/bancos" },
    { url: "https://finanzaseu.com/ventajas" },
    { url: "https://finanzaseu.com/faq" },
    { url: "https://finanzaseu.com/contacto" },
    { url: "https://finanzaseu.com/vlogs" },
    { url: "https://finanzaseu.com/comparativa" },
  ];
}
