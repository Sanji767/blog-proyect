// src/components/layout/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import React from "react";

import Container from "./Container";
import { getPlatformIconByName } from "@/utils";

const siteName = "Bancos Europa";

const footerDetails = {
  subheading:
    "La mejor forma de gestionar tu dinero en Europa. Cuentas digitales, transferencias rápidas y sin comisiones ocultas.",
  quickLinks: [
    { text: "Bancos", url: "/bancos" },
    { text: "Ventajas", url: "/ventajas" },
    { text: "FAQ", url: "/faq" },
    { text: "Contacto", url: "/contacto" },
  ],
  email: "hola@bancoseuropa.com",
  telephone: "+34 900 123 456",
  socials: {
    Twitter: "https://twitter.com/bancoseuropa",
    Instagram: "https://instagram.com/bancoseuropa",
    LinkedIn: "https://linkedin.com/company/bancoseuropa",
  },
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50 text-foreground">
      <div className="py-12">
        <Container className="grid w-full max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          {/* Logo + Descripción */}
          <div className="flex flex-col">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <div className="relative h-7 w-7 md:h-8 md:w-8">
                <Image
                  src="/logo-bancos-europa.svg"
                  alt="Logo Bancos Europa"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h3 className="manrope text-lg font-semibold md:text-xl">
                {siteName}
              </h3>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-foreground-accent">
              {footerDetails.subheading}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-foreground">
              Enlaces rápidos
            </h4>
            <ul className="space-y-2 text-foreground-accent">
              {footerDetails.quickLinks.map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.url}
                    className="text-sm transition-colors hover:text-primary"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto + Redes */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-foreground">
              Contáctanos
            </h4>
            <div className="space-y-2 text-sm">
              {footerDetails.email && (
                <a
                  href={`mailto:${footerDetails.email}`}
                  className="block text-foreground-accent transition-colors hover:text-primary"
                >
                  Email: {footerDetails.email}
                </a>
              )}
              {footerDetails.telephone && (
                <a
                  href={`tel:${footerDetails.telephone}`}
                  className="block text-foreground-accent transition-colors hover:text-primary"
                >
                  Teléfono: {footerDetails.telephone}
                </a>
              )}
            </div>

            {footerDetails.socials &&
              Object.keys(footerDetails.socials).length > 0 && (
                <div className="mt-6 flex items-center gap-4">
                  {Object.keys(footerDetails.socials).map((platformName) => {
                    const url =
                      footerDetails.socials[
                        platformName as keyof typeof footerDetails.socials
                      ];
                    if (!url) return null;

                    return (
                      <Link
                        key={platformName}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platformName}
                        className="text-foreground-accent transition-colors hover:text-primary"
                      >
                        {getPlatformIconByName(platformName)}
                      </Link>
                    );
                  })}
                </div>
              )}
          </div>
        </Container>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 px-6 pb-8 pt-6 text-center text-xs text-gray-500">
        <p>
          © {currentYear} {siteName}. Todos los derechos reservados.
        </p>
        <p className="mt-1">
          Hecho con <span className="text-red-500">♥</span> por{" "}
          <a
            href="https://nexilaunch.com"
            target="_blank"
            rel="noopener"
            className="hover:text-primary"
          >
            Nexi Launch
          </a>
        </p>
        <p className="mt-1">
          UI inspirado en{" "}
          <a
            href="https://ui8.net/youthmind/products/fintech-finance-mobile-app-ui-kit"
            target="_blank"
            rel="noopener"
            className="hover:text-primary"
          >
            Youthmind
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
