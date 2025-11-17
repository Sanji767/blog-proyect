// src/components/layout/Header.tsx
"use client";

import { Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { HiBars3, HiOutlineXMark, HiChevronDown } from "react-icons/hi2";
import { Sun, Moon } from "lucide-react";
import Logo from "@/components/ui/logo";
import Container from "./Container";

type MenuItem = {
  text: string;
  url: string;
  hasMega?: boolean;
};

type BankItem = {
  name: string;
  logo: string;
  url: string;
  tag: string;
  tagColor: string;
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

const featuredBanks: BankItem[] = [
  {
    name: "Revolut",
    logo: "/logos/revolut.svg",
    url: "/programas/revolut",
    tag: "Recomendado",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  {
    name: "N26",
    logo: "/banks/n26.svg",
    url: "/programas/n26",
    tag: "Gratis",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    name: "Wise",
    logo: "/banks/wise.svg",
    url: "/programas/wise",
    tag: "Transferencias",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    name: "Bunq",
    logo: "/banks/bunq.svg",
    url: "/programas/bunq",
    tag: "NL",
    tagColor: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
];

const Header = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const headerRef = useRef<HTMLElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Montaje
  useEffect(() => setMounted(true), []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menús al cambiar ruta
  useEffect(() => {
    setIsOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // Cerrar menú móvil
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        headerRef.current &&
        !headerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }

      // Cerrar mega menú
      if (megaOpen && megaRef.current && !megaRef.current.contains(target)) {
        setMegaOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); // ← CORREGIDO
  }, [isOpen, megaOpen]);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const toggleMega = useCallback((open: boolean) => () => setMegaOpen(open), []);
  const isDark = theme === "dark";

  return (
    <header
      ref={headerRef}
      className={`
        fixed inset-x-0 top-0 z-50 w-full transition-all duration-300
        ${scrolled ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-sm" : "bg-transparent"}
        ${scrolled ? "py-3" : "py-5"}
      `}
      aria-label="Cabecera principal"
    >
      <Container className="!px-0">
        <nav className="flex items-center justify-between px-5 lg:px-8" aria-label="Navegación principal">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Ir a Bancos Europa">
            <Logo className="h-8 w-auto transition-transform hover:scale-105" />
          </Link>

          {/* Menú Desktop */}
          <ul className="hidden items-center gap-1 lg:flex">
            {menuItems.map((item) => (
              <li key={item.text} className="relative">
                {item.hasMega ? (
                  <div
                    className="group"
                    onMouseEnter={toggleMega(true)}
                    onMouseLeave={toggleMega(false)}
                  >
                    <button
                      type="button"
                      className={`
                        flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
                        hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                        ${pathname.startsWith(item.url) ? "text-primary" : "text-foreground"}
                      `}
                      aria-haspopup="true"
                      aria-expanded={megaOpen}
                    >
                      {item.text}
                      <motion.div
                        animate={{ rotate: megaOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <HiChevronDown className="h-3.5 w-3.5" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          ref={megaRef}
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute left-1/2 top-full mt-3 w-80 -translate-x-1/2 rounded-2xl border border-border bg-background/95 p-5 shadow-xl backdrop-blur-xl"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            {featuredBanks.map((bank) => (
                              <Link
                                key={bank.name}
                                href={bank.url}
                                className="group flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-muted"
                                onClick={() => setMegaOpen(false)}
                              >
                                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-white p-1 shadow-sm">
                                  <Image
                                    src={bank.logo}
                                    alt={bank.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {bank.name}
                                  </p>
                                  <span
                                    className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${bank.tagColor}`}
                                  >
                                    {bank.tag}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/bancos"
                            className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
                          >
                            Ver todos los bancos →
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.url}
                    className={`
                      block rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
                      hover:text-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                      ${pathname.startsWith(item.url) ? "text-primary bg-primary/5" : "text-foreground"}
                    `}
                  >
                    {item.text}
                  </Link>
                )}
              </li>
            ))}

            {/* CTA */}
            <li className="ml-6">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                {ctaText}
                <span className="text-xs">→</span>
              </Link>
            </li>
          </ul>

          {/* Mobile Controls */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="rounded-full p-2 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="rounded-full bg-muted p-2.5 text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Abrir menú"
              aria-expanded={isOpen}
            >
              {isOpen ? <HiOutlineXMark className="h-5 w-5" /> : <HiBars3 className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-300 transform"
        enterFrom="opacity-0 -translate-y-4 scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in duration-200 transform"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 -translate-y-4 scale-95"
      >
        <div
          ref={mobileMenuRef}
          className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <nav className="space-y-1 px-5 py-5">
            {menuItems.map((item) => (
              <Link
                key={item.text}
                href={item.url}
                className="block rounded-lg py-3 text-base font-medium text-foreground transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                {item.text}
              </Link>
            ))}
            <Link
              href={ctaUrl}
              className="mt-5 block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              onClick={toggleMenu}
            >
              {ctaText}
            </Link>
          </nav>
        </div>
      </Transition>
    </header>
  );
});

Header.displayName = "Header";

export default Header;