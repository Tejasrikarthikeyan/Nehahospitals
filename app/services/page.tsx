"use client";

import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";
import { useCatalog } from "@/components/CatalogProvider";

export default function ServicesPage() {
  const { t, lang } = useI18n();
  const { services } = useCatalog();
  return (
    <SiteShell>
      <section className="border-b border-line bg-paper py-14">
        <div className="container-site">
          <h1 className="font-serif text-4xl text-navy sm:text-5xl">{t.services.title}</h1>
          <p className="mt-3 max-w-2xl text-muted">{t.services.lead}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container-site divide-y divide-line border-y border-line">
          {services.map((s) => (
            <div key={s.id} className="grid gap-2 py-6 md:grid-cols-[280px_1fr]">
              <h2 className="font-serif text-xl text-navy">{lang === "ta" ? s.nameTa : s.name}</h2>
              <p className="text-sm leading-6 text-muted">{lang === "ta" ? s.descriptionTa : s.description}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
