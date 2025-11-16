// components/ComparativaPreview.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ComparativaPreview() {
  return (
    <section className="py-16 px-5 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Comparativa actualizada: Noviembre 2025
        </h2>
        <p className="text-foreground-accent mb-8 max-w-2xl mx-auto">
          Analizamos comisiones, velocidad, soporte y seguridad de los 8 mejores bancos digitales.
        </p>
        <Link
          href="#comparativa"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Ver tabla completa
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}