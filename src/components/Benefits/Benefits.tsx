// src/components/benefits/Benefits.tsx
import BenefitSection from "./BenefitSection";
import { benefits } from "./data/benefits";

const Benefits: React.FC = () => {
  return (
    <section
      id="features"
      className="bg-gradient-to-b from-background to-muted/30 py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Beneficios
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Elige bancos europeos que de verdad encajan contigo
          </h2>
          <p className="mt-3 text-sm text-foreground-accent sm:text-base">
            Centraliza pagos, entiende las garantías de tus depósitos y compara
            bancos con información clara y honesta.
          </p>
        </header>

        <div>
          {benefits.map((item, index) => (
            <BenefitSection
              key={item.id ?? index}
              benefit={item}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
