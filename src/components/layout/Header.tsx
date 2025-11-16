// src/components/layout/Header.tsx
"use client";

import { Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { HiBars3, HiOutlineXMark } from "react-icons/hi2";

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
  { text: "Ventajas", url: "/ventajas" },
  { text: "FAQ", url: "/faq" },
  { text: "Contacto", url: "/contacto" },
];

const siteName = "Bancos Europa";
const ctaText = "Abrir cuenta recomendada";
const ctaUrl = "/programas/revolut";

const featuredBanks: BankItem[] = [
  {
    name: "Revolut",
    logo: "/banks/revolut.svg",
    url: "/programas/revolut",
    tag: "Recomendado",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    name: "N26",
    logo: "/banks/n26.svg",
    url: "/programas/n26",
    tag: "Gratis",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    name: "Wise",
    logo: "/banks/wise.svg",
    url: "/programas/wise",
    tag: "Transferencias",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    name: "Bunq",
    logo: "/banks/bunq.svg",
    url: "/programas/bunq",
    tag: "NL",
    tagColor: "bg-orange-100 text-orange-700",
  },
];

const Header = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const headerRef = useRef<HTMLElement | null>(null);
  const megaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (isOpen && headerRef.current && !headerRef.current.contains(target)) setIsOpen(false);
      if (megaOpen && megaRef.current && !megaRef.current.contains(target)) setMegaOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, megaOpen]);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const toggleMega = useCallback((open: boolean) => setMegaOpen(open), []);
  const isDark = theme === "dark";

  return (
    <header
      ref={headerRef}
      className={`
        fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300
        ${scrolled ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-sm" : "bg-transparent"}
        ${scrolled ? "py-3" : "py-5"}
      `}
    >
      <Container className="!px-0">
        <nav className="flex items-center justify-between px-5 lg:px-8" aria-label="Navegación principal">
          {/* Logo + Nombre */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Ir a inicio">
            <div className="relative h-10 w-10">
              <Image
                src="/logo-bancos-europa.svg"
                alt="Bancos Europa"
                fill
                className="object-contain transition-transform group-hover:scale-110"
                priority
              />
            </div>
            <span className="hidden text-xl font-semibold text-foreground sm:block">
              {siteName}
            </span>
          </Link>

          {/* Menú desktop */}
          <ul className="hidden items-center gap-1 lg:flex">
            {menuItems.map((item) => (
              <li key={item.text} className="relative">
                {item.hasMega ? (
                  <div
                    className="relative"
                    onMouseEnter={() => toggleMega(true)}
                    onMouseLeave={() => toggleMega(false)}
                  >
                    <button
                      type="button"
                      className={`
                        flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-foreground
                        transition-all duration-200 hover:text-blue-600
                        ${pathname.startsWith(item.url) ? "text-blue-600" : ""}
                      `}
                      aria-haspopup="true"
                      aria-expanded={megaOpen}
                    >
                      {item.text}
                      <motion.div
                        animate={{ rotate: megaOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <HiOutlineXMark className="h-3.5 w-3.5" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          ref={megaRef}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-1/2 top-full mt-3 w-80 -translate-x-1/2 rounded-xl border border-gray-200/70 bg-white/95 p-4 shadow-lg backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/95"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            {featuredBanks.map((bank) => (
                              <Link
                                key={bank.name}
                                href={bank.url}
                                className="group flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() => setMegaOpen(false)}
                              >
                                <div className="relative h-9 w-9 flex-shrink-0">
                                  <Image src={bank.logo} alt={bank.name} fill className="object-contain" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors">
                                    {bank.name}
                                  </p>
                                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${bank.tagColor}`}>
                                    {bank.tag}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/bancos"
                            className="mt-3 block text-center text-xs font-medium text-blue-600 hover:underline"
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
                      block rounded-full px-4 py-2 text-sm font-medium text-foreground
                      transition-all duration-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800
                      ${pathname.startsWith(item.url) ? "text-blue-600 bg-blue-50 dark:bg-blue-900/50" : ""}
                    `}
                  >
                    {item.text}
                  </Link>
                )}
              </li>
            ))}

            {/* CTA Profesional */}
            <li className="ml-6">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
              >
                {ctaText}
                <span className="text-xs">Go</span>
              </Link>
            </li>
          </ul>

          {/* Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="rounded-full p-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Cambiar tema"
              >
                {isDark ? "Light mode" : "Dark mode"}
              </button>
            )}
            <button
              onClick={toggleMenu}
              className="rounded-full bg-gray-100 p-2.5 text-foreground dark:bg-gray-800"
              aria-label="Menú"
            >
              {isOpen ? <HiOutlineXMark className="h-5 w-5" /> : <HiBars3 className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Menú móvil */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 -translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-4"
      >
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/95 lg:hidden">
          <nav className="space-y-1 px-5 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.text}
                href={item.url}
                className="block py-3 text-base font-medium text-foreground hover:text-blue-600"
                onClick={toggleMenu}
              >
                {item.text}
              </Link>
            ))}
            <Link
              href={ctaUrl}
              className="mt-4 block rounded-full bg-blue-600 py-3 text-center font-medium text-white"
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