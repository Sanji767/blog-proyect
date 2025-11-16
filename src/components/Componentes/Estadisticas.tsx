// components/Estadisticas.tsx
export default function Estadisticas() {
  const stats = [
    { value: '+€2.3B', label: 'Ahorrados por usuarios' },
    { value: '30M+', label: 'Cuentas activas' },
    { value: '4.8/5', label: 'Valoración media' },
  ];

  return (
    <section className="py-16 px-5 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-bold">{stat.value}</div>
              <p className="mt-2 text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}