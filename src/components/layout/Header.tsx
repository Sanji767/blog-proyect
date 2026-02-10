// src/components/layout/Header.tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { memo, useCallback, useEffect, useRef, useState, KeyboardEvent } from "react";
import { HiBars3, HiOutlineXMark, HiChevronDown } from "react-icons/hi2";
import { Sun, Moon } from "lucide-react";
import Logo from "@/components/ui/logo";
import Container from "./Container";
import { useTheme } from "next-themes";

const MegaMenu = dynamic(() => import("./MegaMenu"), { ssr: false, loading: () => null });

type MenuItem = { text: string; url: string; hasMega?: boolean };

const menuItems: MenuItem[] = [
  { text: "Bancos", url: "/bancos", hasMega: true },
  { text: "Blog", url: "/blog" },
  { text: "Ventajas", url: "/ventajas" },
  { text: "FAQ", url: "/faq" },
  { text: "IBAN Scanner", url: "/iban" },
  { text: "Ebooks", url: "/ebooks" },
  { text: "Sobre", url: "/sobre" },
];

const Header = memo(function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";
  const { theme, setTheme } = useTheme();
  const isDark = mounted && theme === "dark";

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const toggleMobileMenu = useCallback(() => setIsOpen((p) => !p), []);

  const openMega = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMegaOpen(true);
  };

  const scheduleCloseMega = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const handleMegaKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") setMegaOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setMegaOpen((p) => !p);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled || !isHome
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-b border-border/30 py-3 md:py-4"
          : "bg-transparent py-4 md:py-5"
      }`}
    >
      <Container className="px-6 md:px-10">
        <nav className="flex items-center justify-between" aria-label="Navegación principal">
          {/* LOGO */}
          <Link href="/" className="group -ml-2" aria-label="Inicio">
            <Logo className="h-10 w-auto md:h-12 transition-transform duration-300 group-hover:scale-105" />
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => {
              const active = pathname === item.url || pathname?.startsWith(item.url);
              const navClass = `group relative px-4 py-2 text-sm font-medium tracking-tight transition-colors hover:text-primary ${
                active ? "text-primary" : "text-foreground/90"
              }`;

              if (item.hasMega) {
                return (
                  <li key={item.text} className="relative">
                    <div onMouseEnter={openMega} onMouseLeave={scheduleCloseMega}>
                      <button
                        onClick={() => setMegaOpen((p) => !p)}
                        onKeyDown={handleMegaKeyDown}
                        className={navClass}
                        aria-expanded={megaOpen}
                        aria-haspopup="menu"
                      >
                        {item.text}
                        <HiChevronDown
                          className={`ml-1 h-4 w-4 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* MegaMenu */}
                      <div
                        className={`absolute left-1/2 top-full z-50 -translate-x-1/2 mt-3 transition-all duration-200 ${
                          megaOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                        }`}
                        onMouseEnter={openMega}
                        onMouseLeave={scheduleCloseMega}
                      >
                        <div className="mx-auto h-2 w-2 rotate-45 bg-background shadow-lg" />
                        <div className="rounded-2xl border border-border/30 bg-background shadow-xl overflow-hidden">
                          <MegaMenu onClose={() => setMegaOpen(false)} />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.text}>
                  <Link href={item.url} className={navClass}>
                    {item.text}
                  </Link>
                </li>
              );
            })}

            {/* Theme toggle */}
            <li>
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 rounded-xl hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Cambiar tema"
              >
                {mounted && (isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
              </button>
            </li>
          </ul>

          {/* MOBILE BUTTONS */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
              aria-label="Cambiar tema"
            >
              {mounted && (isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl bg-muted/60 hover:bg-muted transition-colors"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? <HiOutlineXMark className="h-6 w-6" /> : <HiBars3 className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </Container>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden absolute left-0 right-0 top-full bg-background/95 backdrop-blur-md border-t border-border/30 transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-screen py-8" : "max-h-0"
        }`}
      >
        <div className="px-6 space-y-6">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              href={item.url}
              onClick={toggleMobileMenu}
              className="block text-2xl font-semibold tracking-tight text-foreground/90 hover:text-primary transition-colors"
            >
              {item.text}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
});

export default Header;
