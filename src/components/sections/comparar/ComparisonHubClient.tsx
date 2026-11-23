"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scale, ArrowRight, Trophy, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { banks } from "@/lib/banks";
import type { Locale } from "@/lib/i18n";

type Duel = {
  slug1: string;
  slug2: string;
  tagline: Record<Locale, string>;
  winnerSlug: string;
};

const POPULAR_DUELS: Duel[] = [
  {
    slug1: "revolut",
    slug2: "wise",
    tagline: {
      es: "Duelo de gigantes de cuentas multidivisa y viajes internacionales",
      en: "Multi-currency and international transfer heavyweights duel",
    },
    winnerSlug: "revolut",
  },
  {
    slug1: "revolut",
    slug2: "n26",
    tagline: {
      es: "Neobancos europeos frente a frente: ¿cuál es la mejor cuenta principal?",
      en: "Europe's top neobanks head-to-head: which is the best main account?",
    },
    winnerSlug: "n26",
  },
  {
    slug1: "revolut",
    slug2: "trade-republic",
    tagline: {
      es: "La batalla del ahorro remunerado: neobanco frente a bróker-banco",
      en: "The high-yield savings showdown: neobank vs broker-bank",
    },
    winnerSlug: "trade-republic",
  },
  {
    slug1: "santander",
    slug2: "bbva",
    tagline: {
      es: "Comparativa de cuentas digitales de la banca tradicional española",
      en: "Traditional Spanish banking titans face off in digital accounts",
    },
    winnerSlug: "bbva",
  },
];

// Savings-rate ranking (F-08/W6). Rates are the STANDARD (non-promo) EUR
// rates exactly as stated in src/lib/banks.ts. No scores are invented:
// banks that state no rate in banks.ts cannot appear here. `productType`
// distinguishes bank savings accounts from broker / money-market cash,
// because the protection regime differs — keep it honest.
// Trustpilot is read live from bank.rating at render (never hardcoded),
// so the table stays in sync with the profiles.
type RankedBank = {
  slug: string;
  rate: string;
  rateNote: Record<Locale, string>;
  productType: Record<Locale, string>;
};

const SAVINGS_RANKING: RankedBank[] = [
  {
    slug: "trade-republic",
    rate: "2.50%",
    rateNote: { es: "Promo: 4% nuevos clientes hasta 20.000 €, hasta 1 mar 2027", en: "Promo: 4% for new clients up to €20,000 until 1 Mar 2027" },
    productType: { es: "Efectivo en bróker-banco", en: "Cash at broker-bank" },
  },
  {
    slug: "freedom24",
    rate: "2.42%",
    rateNote: { es: "Cuenta D, variable según euríbor", en: "D Account, variable with EURIBOR" },
    productType: { es: "Efectivo en bróker", en: "Cash at broker" },
  },
  {
    slug: "trading-212",
    rate: "2.30%",
    rateNote: { es: "Variable; 4% en GBP", en: "Variable; 4% in GBP" },
    productType: { es: "Efectivo en bróker", en: "Cash at broker" },
  },
  {
    slug: "wise",
    rate: "~2.30%",
    rateNote: { es: "Wise Interest, variable, capital en riesgo", en: "Wise Interest, variable, capital at risk" },
    productType: { es: "Fondo monetario (EMI)", en: "Money-market fund (EMI)" },
  },
  {
    slug: "klarna",
    rate: "2.22%",
    rateNote: { es: "Cuenta Flex, variable", en: "Flex account, variable" },
    productType: { es: "Cuenta de ahorro bancaria", en: "Bank savings account" },
  },
  {
    slug: "revolut",
    rate: "1.15%",
    rateNote: { es: "Plan Estándar en España; planes superiores pagan más", en: "Standard plan in Spain; higher plans pay more" },
    productType: { es: "Cuenta de ahorro bancaria", en: "Bank savings account" },
  },
  {
    slug: "plum",
    rate: "1.12%",
    rateNote: { es: "Hasta 1,12% en el plan gratuito, variable", en: "Up to 1.12% on the free plan, variable" },
    productType: { es: "Fondo monetario (EMI)", en: "Money-market fund (EMI)" },
  },
  {
    slug: "n26",
    rate: "0.50%",
    rateNote: { es: "Plan Estándar; 1,30% con Metal", en: "Standard plan; 1.30% with Metal" },
    productType: { es: "Cuenta de ahorro bancaria", en: "Bank savings account" },
  },
];

const UI_COPY: Record<Locale, {
  badge: string;
  title: string;
  subtitle: string;
  customTitle: string;
  customSubtitle: string;
  bank1Label: string;
  bank2Label: string;
  compareBtn: string;
  popularTitle: string;
  versus: string;
  viewComparison: string;
  methodology: string;
  disclosure: string;
  rankingBadge: string;
  rankingTitle: string;
  rankingIntro1: string;
  rankingIntro2: string;
  rankingIntro3: string;
  rankingTableTitle: string;
  colRank: string;
  colBank: string;
  colRate: string;
  colType: string;
  colTrustpilot: string;
  colProfile: string;
  rateAsOf: string;
  rateFootnote: string;
  freePlansTitle: string;
  freePlansIntro: string;
  methodologyNote: string;
}> = {
  es: {
    badge: "Comparador Cara a Cara",
    title: "Duelos y Comparativas Bancarias 2026",
    subtitle: "Analizamos las diferencias clave de comisiones, IBAN, apps y límites para ayudarte a decidir.",
    customTitle: "Crea tu propia comparativa",
    customSubtitle: "Selecciona dos entidades y analiza sus especificaciones cara a cara.",
    bank1Label: "Primer Banco",
    bank2Label: "Segundo Banco",
    compareBtn: "Comparar Ahora →",
    popularTitle: "Comparativas más buscadas",
    versus: "VS",
    viewComparison: "Ver duelo completo →",
    methodology: "Metodología",
    disclosure: "Aviso de afiliados",
    rankingBadge: "Ranking de rentabilidad",
    rankingTitle: "Cuentas que más pagan por tus ahorros (2026)",
    rankingIntro1: "Ordenamos las cuentas por el tipo estándar que pagan por el dinero en efectivo, en euros y sin promociones. El tipo promocional, cuando existe, aparece aparte y nunca decide el orden: lo que importa es lo que cobras después de que caduca la oferta.",
    rankingIntro2: "No todos los intereses son iguales. Algunos bancos pagan por el saldo de una cuenta de ahorro normal, con garantía de depósitos hasta 100.000 €. Otros —brókers y apps de ahorro— remuneran el efectivo a través de fondos monetarios o cuentas ómnibus: el tipo puede ser más alto, pero el dinero no tiene la misma protección. La columna «Tipo de producto» lo deja claro en cada fila; el detalle está en la ficha de cada entidad.",
    rankingIntro3: "Solo 8 de los 42 bancos de nuestro directorio indican un tipo de ahorro en su ficha, así que solo esos 8 pueden entrar en este ranking. Que un banco no aparezca no es una mala nota: es que no publica un tipo comparable. Los tipos son variables y cambian con el BCE; verifica siempre el tipo vigente en la web oficial antes de mover tu dinero.",
    rankingTableTitle: "Ranking por tipo estándar en euros",
    colRank: "#",
    colBank: "Entidad",
    colRate: "Tipo estándar (EUR)",
    colType: "Tipo de producto",
    colTrustpilot: "Trustpilot",
    colProfile: "Ficha",
    rateAsOf: "Tipos según las fichas de FinanzasEU (datos actualizados el 20 de noviembre de 2026). Los tipos son variables.",
    rateFootnote: "Revolut: 1,15 % TAE es el tipo Estándar en España según nuestra ficha; en Países Bajos el mismo plan paga 1,25 %. Los tipos varían por país de residencia.",
    freePlansTitle: "Cuentas sin cuota mensual",
    freePlansIntro: "Estas entidades tienen un plan explícitamente gratuito en su ficha — sin cuota mensual en el plan básico. Son 11 de 42; el resto indica «desde 0 € según condiciones» o no detalla la cuota.",
    methodologyNote: "Cómo ordenamos: por tipo estándar en euros, sin promociones; en caso de empate, primero el tipo exacto frente al aproximado. Sin puntuaciones inventadas: solo datos de nuestras fichas. Metodología completa en ",
  },
  en: {
    badge: "Head-to-Head Comparisons",
    title: "Bank Duels & Side-by-Side Reviews 2026",
    subtitle: "We break down fees, IBANs, app UX, and limits to help you choose the winner.",
    customTitle: "Create Your Custom Comparison",
    customSubtitle: "Select any two providers and compare specs head-to-head.",
    bank1Label: "First Provider",
    bank2Label: "Second Provider",
    compareBtn: "Compare Now →",
    popularTitle: "Popular Bank Duels",
    versus: "VS",
    viewComparison: "View full duel →",
    methodology: "Methodology",
    disclosure: "Affiliate disclosure",
    rankingBadge: "Yield ranking",
    rankingTitle: "Accounts that pay the most on your savings (2026)",
    rankingIntro1: "We rank accounts by the standard rate they pay on cash, in euros and excluding promotions. A promo rate, where one exists, is shown separately and never decides the order: what matters is what you earn after the offer ends.",
    rankingIntro2: "Not all interest is equal. Some banks pay interest on an ordinary savings account, covered by deposit protection up to €100,000. Others — brokers and savings apps — pay interest on cash held through money-market funds or omnibus accounts: the rate can be higher, but the money does not carry the same protection. The “Product type” column makes this clear in each row; the detail is on each bank's profile.",
    rankingIntro3: "Only 8 of the 42 banks in our directory state a savings rate in their profile, so only those 8 can enter this ranking. A bank missing from the table is not a bad grade — it simply publishes no comparable rate. Rates are variable and move with the ECB; always check the current rate on the official website before moving your money.",
    rankingTableTitle: "Ranked by standard euro rate",
    colRank: "#",
    colBank: "Provider",
    colRate: "Standard rate (EUR)",
    colType: "Product type",
    colTrustpilot: "Trustpilot",
    colProfile: "Profile",
    rateAsOf: "Rates as stated in the FinanzasEU bank profiles (data updated 20 November 2026). Rates are variable.",
    rateFootnote: "Revolut: 1.15% APR is the Standard rate in Spain per our profile; in the Netherlands the same plan pays 1.25%. Rates vary by country of residence.",
    freePlansTitle: "Accounts with no monthly fee",
    freePlansIntro: "These providers have an explicitly free plan in their profile — no monthly fee on the basic plan. That's 11 of 42; the rest state “from €0 depending on terms” or give no fee detail.",
    methodologyNote: "How we rank: by standard euro rate, excluding promotions; on a tie, an exact rate ranks ahead of an approximate one. No invented scores — only data from our profiles. Full methodology in ",
  },
};

export default function ComparisonHubClient() {
  const { locale } = useLocale();
  const copy = UI_COPY[locale];
  const router = useRouter();

  // Sort all banks alphabetically by name for easy selection
  const availableBanks = [...banks].sort((a, b) => a.name.localeCompare(b.name));

  // Banks with an EXPLICITLY free monthly plan in banks.ts. The
  // createDraftBank() default "Desde 0 € (según condiciones)" is placeholder
  // text, not a verified free plan, so it is deliberately not counted.
  const freePlanBanks = availableBanks.filter(
    (b) =>
      b._status !== "draft" &&
      (/^0\s*€/.test(b.fees.monthly) || /^gratis$/i.test(b.fees.monthly.trim())),
  );

  const [bank1, setBank1] = useState<string>("revolut");
  const [bank2, setBank2] = useState<string>("wise");

  const handleCustomCompare = () => {
    if (bank1 === bank2) return;
    const path = locale === "en" ? `/en/comparar/${bank1}-vs-${bank2}` : `/comparar/${bank1}-vs-${bank2}`;
    router.push(path);
  };

  return (
    <div className="space-y-12 md:space-y-16">
      <header className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary-text uppercase tracking-wider">
          <Scale className="h-3.5 w-3.5 text-primary-text" />
          <span>{copy.badge}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
          {copy.title}
        </h1>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
          {copy.subtitle}
        </p>
        <p className="text-xs text-muted-foreground">
          <LocalizedLink href="/sobre#metodologia" className="font-semibold text-primary-text underline-offset-4 hover:underline">
            {copy.methodology}
          </LocalizedLink>
          {" · "}
          <LocalizedLink href="/aviso-afiliados" className="font-semibold text-primary-text underline-offset-4 hover:underline">
            {copy.disclosure}
          </LocalizedLink>
        </p>
      </header>

      {/* Custom Comparison Generator */}
      <section className="relative overflow-hidden rounded-xl border border-accent bg-secondary p-6 md:p-8 shadow-soft">
        <div className="max-w-xl mx-auto text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-black text-accent">{copy.customTitle}</h2>
          <p className="text-xs md:text-sm text-secondary-foreground/80">{copy.customSubtitle}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-12 items-center max-w-3xl mx-auto">
          <div className="sm:col-span-5 space-y-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground/70">
              {copy.bank1Label}
            </label>
            <select
              value={bank1}
              onChange={(e) => setBank1(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background p-3.5 text-sm font-bold text-foreground shadow-sm focus:border-ring focus:outline-none"
            >
              {availableBanks.map((b) => (
                <option key={b.slug} value={b.slug} className="bg-background text-foreground py-1">
                  {b.name} ({b.ibanPrefix || b.country})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-center py-2 sm:py-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent bg-accent/10 font-black text-accent text-sm shadow-sm">
              VS
            </span>
          </div>

          <div className="sm:col-span-5 space-y-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground/70">
              {copy.bank2Label}
            </label>
            <select
              value={bank2}
              onChange={(e) => setBank2(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background p-3.5 text-sm font-bold text-foreground shadow-sm focus:border-ring focus:outline-none"
            >
              {availableBanks.map((b) => (
                <option key={b.slug} value={b.slug} className="bg-background text-foreground py-1">
                  {b.name} ({b.ibanPrefix || b.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            onClick={handleCustomCompare}
            disabled={bank1 === bank2}
            className="font-bold px-8"
          >
            {copy.compareBtn}
          </Button>
        </div>
      </section>

      {/* Popular Duels Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
            {copy.popularTitle}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {POPULAR_DUELS.map((duel) => {
            const b1 = availableBanks.find((b) => b.slug === duel.slug1);
            const b2 = availableBanks.find((b) => b.slug === duel.slug2);
            if (!b1 || !b2) return null;

            const comparisonSlug = `${duel.slug1}-vs-${duel.slug2}`;

            return (
              <motion.article
                key={comparisonSlug}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-secondary-foreground/10 bg-secondary p-6 shadow-soft transition-all hover:border-accent"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-lg text-accent">{b1.name}</span>
                      <span className="rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 text-xs font-black text-accent">
                        {copy.versus}
                      </span>
                      <span className="font-black text-lg text-accent">{b2.name}</span>
                    </div>

                    <Trophy className="h-5 w-5 text-accent shrink-0" />
                  </div>

                  <p className="mt-4 text-xs md:text-sm leading-relaxed text-secondary-foreground/80">
                    {duel.tagline[locale]}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-secondary-foreground/10 flex justify-end">
                  <Button asChild variant="ghost" size="sm" className="gap-1 font-bold text-secondary-foreground hover:bg-secondary-foreground/5 group-hover:text-accent">
                    <LocalizedLink href={`/comparar/${comparisonSlug}`}>
                      {copy.viewComparison}
                    </LocalizedLink>
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Savings-rate ranking (W6) */}
      <section className="space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary-text uppercase tracking-wider">
            <Trophy className="h-3.5 w-3.5 text-primary-text" />
            <span>{copy.rankingBadge}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
            {copy.rankingTitle}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{copy.rankingIntro1}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{copy.rankingIntro2}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{copy.rankingIntro3}</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">{copy.rankingTableTitle}</caption>
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">{copy.colRank}</th>
                <th className="px-4 py-3">{copy.colBank}</th>
                <th className="px-4 py-3">{copy.colRate}</th>
                <th className="px-4 py-3">{copy.colType}</th>
                <th className="px-4 py-3">{copy.colTrustpilot}</th>
                <th className="px-4 py-3">{copy.colProfile}</th>
              </tr>
            </thead>
            <tbody>
              {SAVINGS_RANKING.map((row, index) => {
                const bank = availableBanks.find((b) => b.slug === row.slug);
                if (!bank) return null;
                return (
                  <tr key={row.slug} className="border-b border-border/50">
                    <td className="px-4 py-3 font-black">{index + 1}</td>
                    <td className="px-4 py-3 font-bold">{bank.name}</td>
                    <td className="px-4 py-3">
                      <span className="font-black text-primary">{row.rate}</span>
                      <span className="block text-[11px] font-normal text-muted-foreground">
                        {row.rateNote[locale]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {row.productType[locale]}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {bank.rating?.trustpilot
                        ? `${bank.rating.trustpilot.toFixed(1)} / 5${
                            bank.rating.totalReviews
                              ? ` (${bank.rating.totalReviews.toLocaleString(locale === "en" ? "en-US" : "es-ES")})`
                              : ""
                          }`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <LocalizedLink
                        href={`/programas/${row.slug}`}
                        className="font-semibold text-primary-text hover:underline"
                      >
                        {copy.colProfile} →
                      </LocalizedLink>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">{copy.rateAsOf}</p>
        <p className="text-xs text-muted-foreground">{copy.rateFootnote}</p>
        <p className="text-xs text-muted-foreground">
          {copy.methodologyNote}
          <LocalizedLink href="/sobre#metodologia" className="font-semibold text-primary-text underline-offset-4 hover:underline">
            {copy.methodology}
          </LocalizedLink>
          .
        </p>

        <div className="space-y-3 pt-4">
          <h3 className="text-lg font-black tracking-tight text-foreground">
            {copy.freePlansTitle}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{copy.freePlansIntro}</p>
          <ul className="flex flex-wrap gap-2">
            {freePlanBanks.map((bank) => (
              <li key={bank.slug}>
                <LocalizedLink
                  href={`/programas/${bank.slug}`}
                  className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
                >
                  {bank.name} →
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
