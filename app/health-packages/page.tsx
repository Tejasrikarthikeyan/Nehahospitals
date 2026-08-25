"use client";

import Link from "next/link";
import { useState } from "react";
import { fmtINR, type HealthPackage } from "@/lib/data";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";
import { useCatalog } from "@/components/CatalogProvider";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function PackagesPage() {
  const { t, lang } = useI18n();
  const { packages: PACKAGES } = useCatalog();
  const [open, setOpen] = useState<string | null>(null);
  const pkg = PACKAGES.find((p: HealthPackage) => p.id === open);

  return (
    <SiteShell>
      <section className="border-b border-line bg-paper py-14">
        <ScrollReveal className="container-site">
          <h1 className="font-serif text-4xl text-navy sm:text-5xl">{t.packages.title}</h1>
          <p className="mt-3 max-w-2xl text-muted">{t.packages.lead}</p>
        </ScrollReveal>
      </section>
      <section className="py-10">
        <div className="container-site divide-y divide-line border-y border-line">
          {PACKAGES.map((p: HealthPackage, i: number) => (
            <ScrollReveal key={p.id} delay={i * 70}>
              <article className="group grid gap-4 py-7 md:grid-cols-[1fr_160px_auto] md:items-center transition-colors duration-200 hover:bg-paper/40 px-3 -mx-3">
                <div>
                  <h2 className="font-serif text-2xl text-navy transition-colors duration-200 group-hover:text-teal">{lang === "ta" ? p.nameTa : p.name}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {t.packages.suitable}: {lang === "ta" ? p.suitableTa : p.suitable}
                  </p>
                </div>
                <p className="font-serif text-2xl text-navy">{fmtINR(p.price)}</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setOpen(p.id)} className="h-10 bg-teal px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-dark active:scale-95">
                    {t.packages.details}
                  </button>
                  <Link href={`/book-appointment?package=${p.id}`} className="inline-flex h-10 items-center bg-navy px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-navy-deep active:scale-95">
                    {t.packages.book}
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
      {pkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4 animate-modal-backdrop" onClick={() => setOpen(null)}>
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto bg-white p-8 animate-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-2xl text-navy">{lang === "ta" ? pkg.nameTa : pkg.name}</h3>
            <p className="mt-2 text-sm text-muted">{lang === "ta" ? pkg.suitableTa : pkg.suitable}</p>
            <p className="mt-4 text-sm font-semibold text-navy">{t.packages.tests}</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {(lang === "ta" ? pkg.testsTa : pkg.tests).map((x: string) => (
                <li key={x}>— {x}</li>
              ))}
            </ul>
            <p className="mt-4 font-serif text-2xl text-navy">{fmtINR(pkg.price)}</p>
            <button type="button" className="mt-6 text-sm font-semibold text-teal transition-colors duration-200 hover:text-teal-dark active:scale-95" onClick={() => setOpen(null)}>
              {t.packages.close}
            </button>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
