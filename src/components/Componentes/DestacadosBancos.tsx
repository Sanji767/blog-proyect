// components/DestacadosBancos.tsx
import Image from 'next/image';
import Link from 'next/link';

const banks = [
  { name: 'Revolut', logo: '/banks/revolut.svg', tag: 'Recomendado', url: '/bancos/revolut' },
  { name: 'N26', logo: '/banks/n26.svg', tag: 'Gratis', url: '/bancos/n26' },
  { name: 'Wise', logo: '/banks/wise.svg', tag: 'Transferencias', url: '/bancos/wise' },
];

export default function DestacadosBancos() {
  return (
    <section className="py-20 px-5 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Bancos destacados este mes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {banks.map((bank) => (
            <Link
              key={bank.name}
              href={bank.url}
              className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={bank.logo}
                    alt={bank.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {bank.tag}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                {bank.name}
              </h3>
              <p className="text-sm text-foreground-accent mt-2">
                Ver reseña completa →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}