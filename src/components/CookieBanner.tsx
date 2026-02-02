"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur text-white">
      <div className="container mx-auto flex flex-col md:flex-row gap-4 justify-between items-center p-4">
        <p className="text-sm text-center md:text-left">
          Usamos cookies técnicas y analíticas anónimas para mejorar la experiencia.
          Puedes leer nuestra{" "}
          <Link href="/cookies" className="underline">
            Política de Cookies
          </Link>.
        </p>
        <button
          onClick={acceptCookies}
          className="bg-white text-black px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
