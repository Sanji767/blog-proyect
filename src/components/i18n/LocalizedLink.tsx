"use client";

import Link, { type LinkProps } from "next/link";
import type { UrlObject } from "url";

import { withLocale, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    locale?: Locale;
  };

function localizeHref(href: Props["href"], locale: Locale): Props["href"] {
  if (typeof href === "string") return withLocale(href, locale);
  const nextHref: UrlObject = { ...href };
  if (typeof nextHref.pathname === "string") {
    nextHref.pathname = withLocale(nextHref.pathname, locale);
  }
  return nextHref;
}

export default function LocalizedLink({
  href,
  locale: localeProp,
  ...rest
}: Props) {
  const { locale } = useLocale();
  const effectiveLocale = localeProp ?? locale;
  return <Link href={localizeHref(href, effectiveLocale)} {...rest} />;
}

