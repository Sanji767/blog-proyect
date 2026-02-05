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
        scrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl shadow-[0_8px_30px_-15px_rgb(0,0,0,0.1)] border-b border-border/50 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <Container className="px-6 md:px-10">
        <nav className="flex items-center justify-between" aria-label="Navegación principal">
          {/* LOGO */}
          <Link href="/" className="group -ml-2" aria-label="Inicio">
            <Logo className="h-11 w-auto md:h-14 transition-all duration-300 group-hover:scale-110 group-active:scale-95" />
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => {
              const active = pathname === item.url || pathname?.startsWith(item.url);

              const navClass = `
                group relative px-6 py-3.5 text-sm font-semibold tracking-[-0.01em] transition-all
                hover:text-primary
                ${active ? "text-primary" : "text-foreground"}
              `;

              if (item.hasMega) {
                return (
                  <li key={item.text} className="relative">
                    <div
                      onMouseEnter={openMega}
                      onMouseLeave={scheduleCloseMega}
                      className="relative"
                    >
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

                        {/* Subrayado animado */}
                        <span
                          className={`absolute bottom-0 left-1/2 h-[2.5px] -translate-x-1/2 bg-gradient-to-r from-primary to-cyan-500 rounded transition-all duration-300 ${
                            active ? "w-7" : "w-0 group-hover:w-7"
                          }`}
                        />
                      </button>

                      {/* MegaMenu */}
                      <div
                        className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 transition-all duration-200 ${
                          megaOpen
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-2"
                        }`}
                        onMouseEnter={openMega}
                        onMouseLeave={scheduleCloseMega}
                      >
                        <div className="mx-auto h-3 w-3 rotate-45 bg-background shadow-xl" />
                        <div className="-mt-1.5 rounded-3xl border border-border/50 bg-background shadow-2xl overflow-hidden">
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
                    <span
                      className={`absolute bottom-0 left-1/2 h-[2.5px] -translate-x-1/2 bg-gradient-to-r from-primary to-cyan-500 rounded transition-all duration-300 ${
                        active ? "w-7" : "w-0 group-hover:w-7"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}

            {/* CTA */}
            <li className="ml-10">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-8 py-4 font-bold text-white shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
              >
                {ctaText}
                <span className="text-xl">→</span>
              </Link>
            </li>

            {/* Theme toggle */}
            <li>
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-3 rounded-2xl hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Cambiar tema"
              >
                {mounted && (isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
              </button>
            </li>
          </ul>

          {/* MOBILE BUTTONS */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-3 rounded-2xl hover:bg-muted transition-colors"
              aria-label="Cambiar tema"
            >
              {mounted && (isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="p-3 rounded-2xl bg-muted/70 hover:bg-muted transition-colors"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? <HiOutlineXMark className="h-6 w-6" /> : <HiBars3 className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </Container>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[73px] bg-background/95 backdrop-blur-2xl border-t border-border/50 transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-screen py-10" : "max-h-0"
        }`}
      >
        <div className="px-8 space-y-8">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              href={item.url}
              onClick={toggleMobileMenu}
              className="block text-3xl font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
            >
              {item.text}
            </Link>
          ))}

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />

          <Link
            href={ctaUrl}
            onClick={toggleMobileMenu}
            className="block w-full text-center py-5 text-2xl font-bold rounded-3xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-xl"
          >
            {ctaText} →
          </Link>
        </div>
      </div>
    </header>
  );
});

export default Header;