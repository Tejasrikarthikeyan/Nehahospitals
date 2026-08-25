"use client";

import Link from "next/link";
import { HOSPITAL, IMAGES, fmtINR } from "@/lib/data";
import { formatTime12 } from "@/lib/slots";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";
import { useCatalog } from "@/components/CatalogProvider";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function HomePage() {
  const { t, lang } = useI18n();
  const { doctors: DOCTORS, departments: DEPARTMENTS, packages: PACKAGES } = useCatalog();
  const featured = DOCTORS.slice(0, 4);
  const specs = DEPARTMENTS.slice(0, 8);

  return (
    <SiteShell>
      <section className="relative min-h-[65vh] sm:min-h-[72vh] lg:min-h-[76vh] overflow-hidden flex items-center">
        <img src={IMAGES.hero} alt="Neha Hospitals campus in Chennai" className="absolute inset-0 h-full w-full object-cover img-slow-pan" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06243a]/92 via-[#06243a]/75 to-[#06243a]/30" />
        <div className="container-site relative flex w-full items-center py-12 sm:py-16 lg:py-20">
          <div className="max-w-xl sm:max-w-2xl text-white">
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-white/75" style={{ animationDelay: "100ms" }}>
              {t.home.kicker}
            </p>
            <h1 className="animate-fade-up mt-3 sm:mt-4 font-serif text-2xl leading-[1.25] text-balance sm:text-4xl lg:text-[2.75rem] xl:text-[3.1rem]" style={{ animationDelay: "220ms" }}>
              {t.home.headline}
            </h1>
            <p className="animate-fade-up mt-4 sm:mt-5 max-w-lg sm:max-w-xl text-sm leading-relaxed text-white/85 sm:text-base lg:text-lg" style={{ animationDelay: "340ms" }}>
              {t.home.support}
            </p>
            <div className="animate-fade-up mt-7 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4" style={{ animationDelay: "460ms" }}>
              <Link href="/book-appointment" className="inline-flex h-11 sm:h-12 items-center bg-teal px-5 sm:px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-dark hover:shadow-md active:scale-95">
                {t.home.ctaBook}
              </Link>
              <Link href="/doctors" className="inline-flex h-11 sm:h-12 items-center border border-white/50 px-5 sm:px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-95">
                {t.home.ctaFind}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <ScrollReveal className="container-site grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4">
          <Quick href="/book-appointment" label={t.home.qaBook} sub={HOSPITAL.phone} />
          <Quick href="/doctors" label={t.home.qaFind} sub={lang === "ta" ? "சிறப்புத் துறை ஆலோசகர்கள்" : "Consultants by speciality"} />
          <Quick href="/departments" label={t.home.qaDept} sub={`${HOSPITAL.stats.departments} ${lang === "ta" ? "துறைகள்" : "clinical units"}`} />
          <Quick href={`tel:${HOSPITAL.emergencyRaw}`} label={t.home.qaEm} sub={HOSPITAL.emergency} emergency />
        </ScrollReveal>
      </section>

      <section className="py-20">
        <ScrollReveal className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Neha Hospitals</p>
            <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">{t.home.trusted}</h2>
            <p className="mt-5 text-[15px] leading-7 text-muted">{t.home.intro}</p>
            <p className="mt-4 text-[15px] leading-7 text-muted">{t.home.intro2}</p>
          </div>
          <div className="img-zoom">
            <img src={IMAGES.intro} alt="Clinician consulting a patient" className="h-56 w-full object-cover sm:h-[420px] transition-transform duration-500 ease-out hover:scale-[1.02] img-subtle-float" />
          </div>
        </ScrollReveal>
      </section>

      <section className="border-y border-line bg-paper py-10">
        <ScrollReveal className="container-site grid grid-cols-2 gap-8 md:grid-cols-5">
          <Stat n={`${HOSPITAL.stats.years}+`} l={t.home.years} />
          <Stat n={`${HOSPITAL.stats.doctors}+`} l={t.home.doctors} />
          <Stat n={`${HOSPITAL.stats.beds}`} l={t.home.beds} />
          <Stat n={`${HOSPITAL.stats.departments}`} l={t.home.depts} />
          <Stat n={HOSPITAL.stats.patients} l={t.home.patients} />
        </ScrollReveal>
      </section>

      <section className="py-20">
        <div className="container-site">
          <ScrollReveal>
            <h2 className="font-serif text-3xl text-navy sm:text-4xl">{t.home.why}</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            <ScrollReveal delay={100}><Why n="01" t={t.home.why1t} p={t.home.why1} /></ScrollReveal>
            <ScrollReveal delay={200}><Why n="02" t={t.home.why2t} p={t.home.why2} /></ScrollReveal>
            <ScrollReveal delay={300}><Why n="03" t={t.home.why3t} p={t.home.why3} /></ScrollReveal>
            <ScrollReveal delay={400}><Why n="04" t={t.home.why4t} p={t.home.why4} /></ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-site">
          <ScrollReveal className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl text-navy sm:text-4xl">{t.home.specs}</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted">{t.home.specsLead}</p>
            </div>
            <Link href="/departments" className="group hidden text-sm font-semibold text-teal md:inline transition-colors duration-200 hover:text-teal-dark">
              {t.home.viewDepts} <span className="inline-block arrow-shift">→</span>
            </Link>
          </ScrollReveal>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {specs.map((d, i) => (
              <li key={d.id}>
                <ScrollReveal delay={i * 50}>
                  <Link href={`/departments/${d.slug}`} className="group flex items-center justify-between gap-4 py-4 transition-colors duration-200 hover:bg-white/80 px-2 -mx-2">
                    <span>
                      <span className="block font-medium text-navy transition-colors duration-200 group-hover:text-teal">{lang === "ta" ? d.nameTa : d.name}</span>
                      <span className="text-sm text-muted">{lang === "ta" ? d.shortTa : d.short}</span>
                    </span>
                    <span className="text-teal arrow-shift">→</span>
                  </Link>
                </ScrollReveal>
              </li>
            ))}
          </ul>
          <Link href="/departments" className="mt-6 inline-block text-sm font-semibold text-teal md:hidden">
            {t.home.viewDepts}
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="container-site">
          <ScrollReveal className="flex items-end justify-between gap-3">
            <h2 className="min-w-0 font-serif text-3xl text-navy sm:text-4xl">{t.home.featured}</h2>
            <Link href="/doctors" className="shrink-0 text-sm font-semibold text-teal transition-colors duration-200 hover:text-teal-dark">
              {t.home.viewAll}
            </Link>
          </ScrollReveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((d, i) => (
              <ScrollReveal key={d.id} delay={i * 80}>
                <article className="group border-b border-line pb-6 transition-all duration-300 hover:-translate-y-1">
                  <div className="overflow-hidden">
                    <img src={d.photo} alt={d.name} className="h-64 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-navy transition-colors duration-200 group-hover:text-teal">{lang === "ta" ? d.nameTa : d.name}</h3>
                  <p className="text-sm text-muted">{d.qualifications}</p>
                  <p className="mt-1 text-sm font-medium text-teal">{lang === "ta" ? d.specialityTa : d.speciality}</p>
                  <p className="mt-1 text-sm text-muted">
                    {d.experience} {t.home.yearsExp} · {formatTime12(d.start, lang)} – {formatTime12(d.end, lang)}
                  </p>
                  <Link href={`/doctors/${d.slug}`} className="mt-3 inline-block text-sm font-semibold text-navy transition-colors duration-200 group-hover:text-teal">
                    {t.doctors.view}
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-site">
          <ScrollReveal>
            <h2 className="font-serif text-3xl text-navy sm:text-4xl">{t.home.facTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm text-muted">{t.home.facLead}</p>
          </ScrollReveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <ScrollReveal className="md:col-span-2">
              <Link href="/facilities" className="group block overflow-hidden">
                <div className="overflow-hidden">
                  <img src={IMAGES.building} alt="Hospital building" className="h-[340px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
                </div>
                <p className="mt-3 text-sm font-medium text-navy transition-colors duration-200 group-hover:text-teal">{lang === "ta" ? "நவீன மருத்துவமனை வளாகம்" : "Modern hospital campus"}</p>
              </Link>
            </ScrollReveal>
            <div className="grid gap-4">
              <ScrollReveal delay={100}>
                <Link href="/facilities" className="group block overflow-hidden">
                  <div className="overflow-hidden">
                    <img src={IMAGES.ot} alt="Operation theatre" className="h-[160px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-navy transition-colors duration-200 group-hover:text-teal">{lang === "ta" ? "அறுவை சிகிச்சை அரங்குகள்" : "Operation theatres"}</p>
                </Link>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <Link href="/facilities" className="group block overflow-hidden">
                  <div className="overflow-hidden">
                    <img src={IMAGES.rooms} alt="Patient room" className="h-[160px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-navy transition-colors duration-200 group-hover:text-teal">{lang === "ta" ? "நோயாளி அறைகள்" : "Patient rooms"}</p>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-site">
          <ScrollReveal className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl text-navy sm:text-4xl">{t.home.pkgTitle}</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted">{t.home.pkgLead}</p>
            </div>
            <Link href="/health-packages" className="text-sm font-semibold text-teal transition-colors duration-200 hover:text-teal-dark">
              {t.home.viewPkgs}
            </Link>
          </ScrollReveal>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {PACKAGES.slice(0, 4).map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 60}>
                <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between transition-colors duration-200 hover:bg-paper/50 px-2 -mx-2">
                  <div>
                    <p className="font-medium text-navy">{lang === "ta" ? p.nameTa : p.name}</p>
                    <p className="text-sm text-muted">{lang === "ta" ? p.suitableTa : p.suitable}</p>
                  </div>
                  <p className="text-sm font-semibold text-navy">
                    {t.home.from} {fmtINR(p.price)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-16">
        <ScrollReveal className="container-site flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-3xl text-navy">{t.home.infoTitle}</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">{t.home.infoLead}</p>
          </div>
          <Link href="/patient-guide" className="inline-flex h-11 items-center bg-navy px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-navy-deep active:scale-95">
            {t.home.infoCta}
          </Link>
        </ScrollReveal>
      </section>

      <section className="relative overflow-hidden py-24">
        <img src={IMAGES.corridor} alt="" className="absolute inset-0 h-full w-full object-cover img-slow-pan" />
        <div className="absolute inset-0 bg-navy/88" />
        <ScrollReveal className="container-site relative text-center text-white">
          <h2 className="font-serif text-4xl sm:text-5xl">{t.home.finalTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">{t.home.finalLead}</p>
          <Link href="/book-appointment" className="mt-8 inline-flex h-12 items-center bg-teal px-7 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-dark hover:shadow-lg active:scale-95">
            {t.home.finalBtn}
          </Link>
        </ScrollReveal>
      </section>
    </SiteShell>
  );
}

function Quick({ href, label, sub, emergency }: { href: string; label: string; sub: string; emergency?: boolean }) {
  if (href.startsWith("tel:")) {
    return (
      <a href={href} className="group px-4 py-6 sm:px-6 transition-colors duration-200 hover:bg-paper">
        <p className={`text-sm font-semibold ${emergency ? "text-emergency" : "text-navy"}`}>{label}</p>
        <p className="mt-1 text-xs text-muted">{sub}</p>
      </a>
    );
  }
  return (
    <Link href={href} className="group px-4 py-6 sm:px-6 transition-colors duration-200 hover:bg-paper">
      <p className={`text-sm font-semibold ${emergency ? "text-emergency" : "text-navy"}`}>{label}</p>
      <p className="mt-1 text-xs text-muted">{sub}</p>
    </Link>
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

function Why({ n, t, p }: { n: string; t: string; p: string }) {
  return (
    <div className="flex gap-5">
      <span className="font-serif text-2xl text-teal">{n}</span>
      <div>
        <h3 className="font-serif text-xl text-navy">{t}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{p}</p>
      </div>
    </div>
  );
}
