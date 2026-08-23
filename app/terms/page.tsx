"use client";

import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";

export default function TermsPage() {
  const { t } = useI18n();
  return (
    <SiteShell>
      <article className="container-site max-w-3xl py-16">
        <h1 className="font-serif text-4xl text-navy">{t.legal.termsTitle}</h1>
        <p className="mt-6 text-[15px] leading-7 text-muted">{t.legal.termsBody}</p>
      </article>
    </SiteShell>
  );
}
