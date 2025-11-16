// components/CTAFinal.tsx
import Link from 'next/link';

export default function CTAFinal() {
  return (
    <section className="py-20 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Elige el banco que más te conviene
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Sin comisiones ocultas. Sin letra pequeña. Solo transparencia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#comparativa"
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all"
          >
            Ver comparativa completa
          </Link>
          <Link
            href="/bancos/revolut"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
          >
            Abrir cuenta en Revolut →
          </Link>
        </div>
      </div>
    </section>
  );
}