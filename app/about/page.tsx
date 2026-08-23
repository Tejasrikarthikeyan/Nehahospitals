"use client";

import { HOSPITAL, IMAGES } from "@/lib/data";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";

export default function AboutPage() {
  const { t, lang } = useI18n();
  return (
    <SiteShell>
      <section className="relative h-[42vh] min-h-[280px]">
        <img src={IMAGES.building} alt="Neha Hospitals building" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="container-site relative flex h-full items-end pb-10">
          <div className="text-white">
            <h1 className="font-serif text-4xl sm:text-5xl">{t.about.title}</h1>
            <p className="mt-3 max-w-2xl text-white/85">{t.about.lead}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[15px] leading-7 text-muted">{t.about.p1}</p>
            <p className="mt-4 text-[15px] leading-7 text-muted">{t.about.p2}</p>
          </div>
          <img src={IMAGES.reception} alt="Hospital reception" className="h-[360px] w-full object-cover" />
        </div>
      </section>

      <section className="border-y border-line bg-paper py-16">
        <div className="container-site grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-navy">{t.about.missionT}</h2>
            <p className="mt-4 text-[15px] leading-7 text-muted">{t.about.mission}</p>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-navy">{t.about.visionT}</h2>
            <p className="mt-4 text-[15px] leading-7 text-muted">{t.about.vision}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site">
          <h2 className="font-serif text-3xl text-navy">{t.about.valuesT}</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <Value t={t.about.v1t} p={t.about.v1} />
            <Value t={t.about.v2t} p={t.about.v2} />
            <Value t={t.about.v3t} p={t.about.v3} />
            <Value t={t.about.v4t} p={t.about.v4} />
          </div>
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <img src={IMAGES.rooms} alt="Inpatient rooms" className="h-[380px] w-full object-cover" />
          <div>
            <h2 className="font-serif text-3xl text-navy">{t.about.infraT}</h2>
            <p className="mt-4 text-[15px] leading-7 text-muted">{t.about.infra}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-navy">{t.about.techT}</h2>
            <p className="mt-4 text-[15px] leading-7 text-muted">{t.about.tech}</p>
          </div>
          <img src={IMAGES.lab} alt="Diagnostic laboratory" className="h-[380px] w-full object-cover" />
        </div>
      </section>

      <section className="border-y border-line bg-paper py-16">
        <div className="container-site max-w-3xl">
          <h2 className="font-serif text-3xl text-navy">{t.about.pccT}</h2>
          <p className="mt-4 text-[15px] leading-7 text-muted">{t.about.pcc}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <img src={IMAGES.leadership} alt="Senior consultant" className="h-[380px] w-full object-cover" />
          <div>
            <h2 className="font-serif text-3xl text-navy">{t.about.leadT}</h2>
            <p className="mt-4 text-[15px] leading-7 text-muted">{t.about.leadP}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-12">
        <div className="container-site grid grid-cols-2 gap-8 md:grid-cols-5">
          <Stat n={`${HOSPITAL.stats.years}+`} l={t.home.years} />
          <Stat n={`${HOSPITAL.stats.doctors}+`} l={t.home.doctors} />
          <Stat n={`${HOSPITAL.stats.beds}`} l={t.home.beds} />
          <Stat n={`${HOSPITAL.stats.departments}`} l={t.home.depts} />
          <Stat n={HOSPITAL.stats.patients} l={t.home.patients} />
        </div>
      </section>

      <section className="py-16">
        <div className="container-site">
          <h2 className="font-serif text-3xl text-navy">{t.about.trustT}</h2>
          <ul className="mt-8 max-w-2xl space-y-3 text-[15px] text-muted">
            <li>— {t.about.t1}</li>
            <li>— {t.about.t2}</li>
            <li>— {t.about.t3}</li>
            <li>— {t.about.t4}</li>
          </ul>
          <p className="mt-8 text-sm text-muted">{lang === "ta" ? HOSPITAL.addressTa : HOSPITAL.address}</p>
        </div>
      </section>
    </SiteShell>
  );
}

function Value({ t, p }: { t: string; p: string }) {
  return (
    <div>
      <h3 className="font-serif text-xl text-navy">{t}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{p}</p>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="font-serif text-3xl text-navy">{n}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-muted">{l}</p>
    </div>
  );
}
