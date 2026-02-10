// app/terminos/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso | FinanzasEU",
  description: "Condiciones legales de uso de FinanzasEU – web independiente de información financiera.",
};

export default function Terminos() {
  const currentYear = new Date().getFullYear();
  return (
    <article className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-black mb-8 text-center md:text-left">
        Términos y Condiciones de Uso
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <p className="lead text-lg font-medium text-foreground">
          Última actualización: 21 de noviembre de 2025
        </p>

        <section>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            1. Aceptación de los términos
          </h2>
          <p>
            Al acceder y utilizar <strong>FinanzasEU</strong> (en adelante “el Sitio”), aceptas estar vinculado por estos Términos y Condiciones de Uso, todas las leyes y regulaciones aplicables, y aceptas que eres responsable del cumplimiento de cualquier ley local aplicable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            2. Naturaleza del contenido
          </h2>
          <p>
            FinanzasEU es una <strong>web informativa independiente</strong>. No somos una entidad bancaria, asesor financiero registrado ni intermediario financiero.
          </p>
          <p>
            Toda la información publicada tiene <strong>carácter orientativo y educativo</strong>. No constituye asesoramiento financiero, fiscal, legal ni de ningún otro tipo.
          </p>
          <p className="font-medium text-foreground">
            Tú eres el único responsable de las decisiones que tomes basándote en nuestro contenido.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            3. Enlaces de afiliados y transparencia
          </h2>
          <p>
            Parte de los enlaces a productos bancarios son <strong>enlaces de afiliado</strong>. Esto significa que, si abres una cuenta a través de ellos, FinanzasEU puede recibir una comisión <strong>sin coste adicional para ti</strong>.
          </p>
          <p>
            Esta comisión nos ayuda a mantener la web gratuita y actualizada, pero <strong>nunca influye en nuestras opiniones ni en el orden de los rankings</strong>. Solo recomendamos productos que consideramos útiles y que nosotros mismos usaríamos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            4. Exactitud de la información
          </h2>
          <p>
            Nos esforzamos al máximo por mantener la información actualizada, pero las condiciones de los bancos pueden cambiar en cualquier momento. 
            <strong>Verifica siempre las condiciones oficiales en la web del banco antes de contratar cualquier producto</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            5. Propiedad intelectual
          </h2>
          <p>
            Todo el contenido original de FinanzasEU (textos, comparativas, guías, imágenes propias) está protegido por derechos de autor. 
            Puedes compartirlo citando la fuente, pero queda prohibida su reproducción masiva o con fines comerciales sin autorización previa.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            6. Limitación de responsabilidad
          </h2>
          <p>
            En ningún caso FinanzasEU ni sus responsables serán responsables de ningún daño directo, indirecto, incidental o consecuente derivado del uso o la imposibilidad de uso de esta web.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            7. Modificaciones
          </h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. 
            Te recomendamos revisarlos periódicamente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            8. Contacto
          </h2>
          <p>
            Si tienes cualquier duda sobre estos términos, puedes contactarnos en:{" "}
            <a href="mailto:hola@finanzaseu.com" className="text-primary underline">
              hola@finanzaseu.com
            </a>
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {currentYear} FinanzasEU – Todos los derechos reservados</p>
        </div>
      </div>
    </article>
  );
}
