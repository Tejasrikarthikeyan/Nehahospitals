"use client";

import { useState } from "react";
import { HOSPITAL } from "@/lib/data";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";

export default function ContactPage() {
  const { t, lang } = useI18n();
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <section className="border-b border-line bg-paper py-14">
        <div className="container-site">
          <h1 className="font-serif text-4xl text-navy sm:text-5xl">{t.contact.title}</h1>
          <p className="mt-3 max-w-2xl text-muted">{t.contact.lead}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <div className="border border-emergency/30 bg-[#fdf4f3] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emergency">{t.contact.emergency}</p>
              <a href={`tel:${HOSPITAL.emergencyRaw}`} className="mt-2 block font-serif text-3xl text-emergency">
                {HOSPITAL.emergency}
              </a>
              <p className="mt-2 text-sm text-muted">{t.contact.edNote}</p>
            </div>
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="text-muted">{t.contact.address}</dt>
                <dd className="font-medium text-navy">{lang === "ta" ? HOSPITAL.addressTa : HOSPITAL.address}</dd>
              </div>
              <div>
                <dt className="text-muted">{t.contact.phone}</dt>
                <dd className="font-medium text-navy">{HOSPITAL.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">{t.contact.email}</dt>
                <dd className="font-medium text-navy">{HOSPITAL.email}</dd>
              </div>
              <div>
                <dt className="text-muted">{t.contact.hours}</dt>
                <dd className="font-medium text-navy">{lang === "ta" ? HOSPITAL.hoursTa : HOSPITAL.hours}</dd>
              </div>
            </dl>
            <a
              href={`https://wa.me/${HOSPITAL.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-11 items-center bg-[#128C7E] px-5 text-sm font-semibold text-white"
            >
              {t.contact.wa}
            </a>
          </div>
          <form
            className="border border-line p-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <h2 className="font-serif text-2xl text-navy">{t.contact.form}</h2>
            {sent ? (
              <p className="mt-6 text-sm text-teal">{t.contact.sent}</p>
            ) : (
              <div className="mt-6 space-y-4">
                <input required className="h-11 w-full border border-line px-3 text-sm" placeholder={t.contact.name} />
                <input required className="h-11 w-full border border-line px-3 text-sm" placeholder={t.contact.phone} />
                <textarea required className="min-h-32 w-full border border-line px-3 py-2 text-sm" placeholder={t.contact.message} />
                <button type="submit" className="h-11 bg-navy px-5 text-sm font-semibold text-white">
                  {t.contact.send}
                </button>
              </div>
            )}
          </form>
        </div>
        <div className="container-site mt-12">
          <h2 className="font-serif text-2xl text-navy">{t.contact.map}</h2>
          <iframe title="Neha Hospitals location" className="mt-4 h-[360px] w-full border-0" src={HOSPITAL.mapEmbed} loading="lazy" />
        </div>
      </section>
    </SiteShell>
  );
}
