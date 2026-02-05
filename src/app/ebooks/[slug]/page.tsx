"use client";

import { useParams } from "next/navigation";
import { ebooks } from "@/lib/ebooks-data";
import { motion } from "framer-motion";

export default function EbookDetailPage() {
  const params = useParams();
  const ebookId = params.slug as string;
  const ebook = ebooks.find((e) => e.id === ebookId);

  if (!ebook) {
    return <div className="text-center py-20">Ebook no encontrado</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid gap-12 md:grid-cols-2"
      >
        <div className="flex justify-center">
          <img src={ebook.image} alt={ebook.title} className="rounded-2xl shadow-2xl max-w-sm" />
        </div>

        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{ebook.title}</h1>
          <p className="text-xl text-gray-600">{ebook.description}</p>

          {ebook.author && (
            <div className="mt-4 text-gray-700">
              <p className="font-semibold">{ebook.author.name}</p>
              <p>{ebook.author.bio}</p>
            </div>
          )}

          <a
            href={ebook.hotmartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-400 text-black px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition"
          >
            Acceder al Curso Ahora
          </a>
        </div>
      </motion.section>

      <section className="mt-20 space-y-14">
        {ebook.learnings && ebook.learnings.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-4">¿Qué aprenderás?</h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-gray-700">
              {ebook.learnings.map((item, i) => (
                <li key={i}>✔️ {item}</li>
              ))}
            </ul>
          </div>
        )}

        {ebook.targetAudience && (
          <div>
            <h2 className="text-3xl font-bold mb-4">¿Para quién es este curso?</h2>
            <p className="text-gray-700 max-w-3xl">{ebook.targetAudience}</p>
          </div>
        )}

        {ebook.whyInvest && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Por qué invertir / tomar este curso</h2>
            <p className="text-gray-700 max-w-3xl">{ebook.whyInvest}</p>
          </div>
        )}

        {ebook.reviews && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Evaluaciones</h2>
            <p>
              ⭐ {ebook.reviews.rating} ({ebook.reviews.count} evaluaciones)
            </p>
          </div>
        )}

        <div className="bg-black p-10 rounded-3xl text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-white">Empieza hoy</h2>
          <p className="text-gray-300">
            Accede ahora al curso y transforma tu aprendizaje en resultados reales.
          </p>
          <a
            href={ebook.hotmartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-400 text-black px-12 py-4 rounded-xl font-bold text-lg hover:scale-105 transition"
          >
            Acceder al Curso Ahora
          </a>
        </div>
      </section>
    </main>
  );
}
