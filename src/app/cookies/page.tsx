export const metadata = {
  title: "Política de Cookies | FinanzasEU",
  description:
    "Información sobre el uso de cookies en FinanzasEU: qué son, qué tipos utilizamos y cómo puedes gestionarlas.",
};

export default function CookiesPage() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-20">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Política de Cookies
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          En FinanzasEU utilizamos cookies para mejorar tu experiencia de navegación
          y analizar el uso del sitio de forma anónima y responsable.
        </p>
      </header>

      <section className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos que se almacenan en tu dispositivo cuando
          visitas un sitio web. Sirven para garantizar el correcto funcionamiento de
          la página y para recopilar información estadística anónima.
        </p>

        <h2>¿Qué tipos de cookies utilizamos?</h2>
        <ul>
          <li>
            <strong>Cookies técnicas:</strong> necesarias para el funcionamiento básico
            del sitio.
          </li>
          <li>
            <strong>Cookies analíticas:</strong> utilizadas para medir de forma anónima
            cómo los usuarios interactúan con la web (por ejemplo, mediante Plausible).
          </li>
        </ul>

        <h2>¿Usamos cookies de publicidad?</h2>
        <p>
          No. En FinanzasEU no utilizamos cookies de remarketing ni publicidad
          personalizada. No vendemos ni compartimos datos personales con terceros.
        </p>

        <h2>Gestión de cookies</h2>
        <p>
          Puedes aceptar o rechazar el uso de cookies desde el banner que aparece al
          acceder al sitio. Además, puedes configurar tu navegador para bloquear o
          eliminar cookies en cualquier momento.
        </p>

        <h2>Actualizaciones de esta política</h2>
        <p>
          Esta política puede actualizarse en función de cambios legales o técnicos.
          Te recomendamos revisarla periódicamente.
        </p>
      </section>
    </article>
  );
}
