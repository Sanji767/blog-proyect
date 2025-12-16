// src/components/layout/Header.tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { HiBars3, HiOutlineXMark, HiChevronDown } from "react-icons/hi2";
import { Sun, Moon } from "lucide-react";
import Logo from "@/components/ui/logo";
import Container from "./Container";
import { useTheme } from "next-themes";

// Lazy load del MegaMenu (solo cliente)
const MegaMenu = dynamic(() => import("./MegaMenu"), {
  ssr: false,
  loading: () => null,
});

/** Tipado correcto para evitar error hasMega */
type BaseItem = { text: string; url: string };
type MegaItem = BaseItem & { hasMega: true };
type NormalItem = BaseItem & { hasMega?: false };
type MenuItem = MegaItem | NormalItem;

const menuItems: MenuItem[] = [
  { text: "Bancos", url: "/bancos", hasMega: true },
  { text: "Blog", url: "/blog" },
  { text: "Ventajas", url: "/ventajas" },
  { text: "FAQ", url: "/faq" },
  { text: "Contacto", url: "/contacto" },
];

const ctaText = "Abrir cuenta recomendada";
const ctaUrl = "/programas/revolut";

const Header = memo(function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isDark = mounted && theme === "dark";

  /** Para evitar que el mega menú se cierre al mínimo movimiento */
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Montado (para next-themes)
  useEffect(() => setMounted(true), []);

  // Scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const toggleMobileMenu = useCallback(
    () => setIsOpen((prev) => !prev),
    []
  );

  /** Abrir mega sin delays */
  const openMega = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMegaOpen(true);
  };

  /** Cerrar mega con pequeño delay anti-flicker */
  const scheduleCloseMega = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setMegaOpen(false);
    }, 140);
  };

  const handleMegaKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") setMegaOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setMegaOpen((prev) => !prev);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-md border-b border-border/40 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <Container className="px-4 md:px-8" as="div">
        <nav
          className="flex items-center justify-between"
          aria-label="Navegación principal"
        >
          {/* LOGO */}
          <Link href="/" className="group -ml-3" aria-label="Inicio">
            <Logo className="h-12 w-auto md:h-14 transition-transform group-hover:scale-110" />
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const active =
                pathname === item.url ||
                (item.url !== "/" && pathname?.startsWith(item.url));

              if ("hasMega" in item && item.hasMega) {
                return (
                  <li key={item.text} className="relative">
                    {/* Área completa hover (botón + menú) */}
                    <div
                      className="relative"
                      onMouseEnter={openMega}
                      onMouseLeave={scheduleCloseMega}
                    >
                      <button
                        type="button"
                        onClick={() => setMegaOpen((prev) => !prev)}
                        onKeyDown={handleMegaKeyDown}
                        className={`
                          flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all
                          hover:bg-black/5 dark:hover:bg-white/10
                          ${active ? "text-primary" : "text-foreground"}
                        `}
                        aria-expanded={megaOpen}
                        aria-haspopup="menu"
                        aria-controls="mega-bancos"
                      >
                        {item.text}
                        <HiChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            megaOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Mega menú */}
                      <div
                        id="mega-bancos"
                        className={`
                          absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3
                          transition-all duration-200 ease-out
                          ${
                            megaOpen
                              ? "opacity-100 visible translate-y-0 pointer-events-auto"
                              : "opacity-0 invisible -translate-y-1 pointer-events-none"
                          }
                        `}
                        onMouseEnter={openMega}
                        onMouseLeave={scheduleCloseMega}
                      >
                        {/* Flecha */}
                        <div className="mx-auto h-3 w-3 rotate-45 rounded-sm bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.06)]" />
                        <div className="-mt-1.5">
                          <MegaMenu onClose={() => setMegaOpen(false)} />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.text} className="relative">
                  <Link
                    href={item.url}
                    className={`
                      px-5 py-3 rounded-2xl text-sm font-semibold transition-all
                      hover:bg-black/5 dark:hover:bg-white/10
                      ${active ? "text-primary" : "text-foreground"}
                    `}
                  >
                    {item.text}
                  </Link>
                </li>
              );
            })}

            {/* CTA */}
            <li className="ml-8">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-7 py-3.5 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                {ctaText} →
              </Link>
            </li>

            {/* Theme toggle desktop */}
            <li className="ml-2">
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-3 rounded-full hover:bg-muted/50 transition-colors"
                aria-label="Cambiar tema"
              >
                {mounted && (isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                ))}
              </button>
            </li>
          </ul>

          {/* BOTONES MÓVIL */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Botón tema */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-3 rounded-full hover:bg-muted/50 transition-colors"
              aria-label="Cambiar tema"
            >
              {mounted && (isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              ))}
            </button>

            {/* Botón menú móvil */}
            <button
              onClick={toggleMobileMenu}
              className="p-3 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
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
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-screen border-t border-border/40" : "max-h-0"
        }`}
        aria-hidden={!isOpen}
      >
        <nav className="px-6 py-8 space-y-6 bg-background/95 backdrop-blur-xl">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              href={item.url}
              onClick={toggleMobileMenu}
              className="block text-2xl font-bold text-foreground hover:text-primary transition-colors"
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
