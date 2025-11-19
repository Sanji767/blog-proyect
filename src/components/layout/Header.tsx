"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";
import { HiBars3, HiOutlineXMark, HiChevronDown } from "react-icons/hi2";
import { Sun, Moon } from "lucide-react";
import Logo from "@/components/ui/logo";
import Container from "./Container";
import { useTheme } from "next-themes";

// Lazy load del MegaMenu
const MegaMenu = dynamic(() => import("./MegaMenu"), {
  ssr: false,
  loading: () => null,
});

// Tipo para los items de menú
type MenuItem = {
  text: string;
  url: string;
  hasMega?: boolean;
};

const menuItems: MenuItem[] = [
  { text: "Bancos", url: "/bancos", hasMega: true },
  { text: "Blog", url: "/vlogs" },
  { text: "Ventajas", url: "/ventajas" },
  { text: "FAQ", url: "/faq" },
  { text: "Contacto", url: "/contacto" },
];

const ctaText = "Abrir cuenta recomendada";
const ctaUrl = "/programas/revolut";

const Header = memo(function Header() {
  const [isOpen, setIsOpen] = useState(false);      // menú móvil
  const [scrolled, setScrolled] = useState(false);  // efecto scroll
  const [megaOpen, setMegaOpen] = useState(false);  // mega menú Bancos

  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Cambia estilos al hacer scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Cierra menús al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const toggleMobileMenu = useCallback(
    () => setIsOpen((prev) => !prev),
    [],
  );

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50 w-full transition-all duration-500
        ${
          scrolled
            ? "bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-md border-b border-border/40 py-3"
            : "bg-transparent py-6"
        }
      `}
    >
      <Container className="px-4 md:px-8">
        <nav className="flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="group -ml-3">
            <Logo className="h-12 w-auto md:h-14 transition-transform group-hover:scale-110" />
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <li
                key={item.text}
                className="relative"
                // Cierra el mega menú cuando sales del bloque completo
                onMouseLeave={() => setMegaOpen(false)}
              >
                {item.hasMega ? (
                  <>
                    <button
                      type="button"
                      // Abre al hacer hover (desktop)
                      onMouseEnter={() => setMegaOpen(true)}
                      // Toggle al hacer click (móvil / accesible)
                      onClick={() =>
                        setMegaOpen((prev) => !prev)
                      }
                      className={`
                        flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all
                        hover:bg-black/5 dark:hover:bg-white/10
                        ${
                          pathname?.startsWith(item.url)
                            ? "text-primary"
                            : "text-foreground"
                        }
                      `}
                    >
                      {item.text}
                      <HiChevronDown
                        className={`h-4 w-4 transition-transform ${
                          megaOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {megaOpen && (
                      // Mientras el cursor esté sobre el menú, sigue abierto
                      <div onMouseEnter={() => setMegaOpen(true)}>
                        <MegaMenu onClose={() => setMegaOpen(false)} />
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.url}
                    className={`
                      px-5 py-3 rounded-2xl text-sm font-semibold transition-all
                      hover:bg-black/5 dark:hover:bg-white/10
                      ${
                        pathname === item.url
                          ? "text-primary"
                          : "text-foreground"
                      }
                    `}
                  >
                    {item.text}
                  </Link>
                )}
              </li>
            ))}

            {/* CTA */}
            <li className="ml-8">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-7 py-3.5 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                {ctaText} →
              </Link>
            </li>
          </ul>

          {/* ACCIONES MÓVIL */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-3 rounded-full hover:bg-muted/50"
              aria-label="Cambiar tema"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Botón menú móvil */}
            <button
              onClick={toggleMobileMenu}
              className="p-3 rounded-full bg-muted/50 hover:bg-muted"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? (
                <HiOutlineXMark className="h-6 w-6" />
              ) : (
                <HiBars3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </Container>

      {/* MENÚ MÓVIL */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-screen border-t border-border/40" : "max-h-0"
        }`}
      >
        <nav className="px-6 py-8 space-y-6 bg-background/95 backdrop-blur-xl">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              href={item.url}
              onClick={toggleMobileMenu}
              className="block text-2xl font-bold text-foreground hover:text-primary"
            >
              {item.text}
            </Link>
          ))}

          <Link
            href={ctaUrl}
            onClick={toggleMobileMenu}
            className="block py-5 text-center text-xl font-bold rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-xl"
          >
            {ctaText} →
          </Link>
        </nav>
      </div>
    </header>
  );
});

export default Header;
