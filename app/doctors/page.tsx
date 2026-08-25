"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { type Doctor, type Department } from "@/lib/data";
import { useCatalog } from "@/components/CatalogProvider";
import { formatTime12 } from "@/lib/slots";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function DoctorsPage() {
  const { t, lang } = useI18n();
  const { doctors: DOCTORS, departments: DEPARTMENTS } = useCatalog();
  const [name, setName] = useState("");
  const [spec, setSpec] = useState("");
  const [dept, setDept] = useState("");
  const [exp, setExp] = useState("");
  const [avail, setAvail] = useState("");

  const list = useMemo(() => {
    return DOCTORS.filter((d: Doctor) => {
      const n = (lang === "ta" ? d.nameTa : d.name).toLowerCase();
      const s = (lang === "ta" ? d.specialityTa : d.speciality).toLowerCase();
      if (name && !n.includes(name.toLowerCase())) return false;
      if (spec && !s.includes(spec.toLowerCase())) return false;
      if (dept && d.departmentId !== dept) return false;
      if (exp === "10" && d.experience < 10) return false;
      if (exp === "15" && d.experience < 15) return false;
      if (avail === "weekdays" && d.days.includes(6) && d.days.length <= 6) {
        /* still include weekday doctors */
      }
      if (avail === "sat" && !d.days.includes(6)) return false;
      return true;
    });
  }, [name, spec, dept, exp, avail, lang, DOCTORS]);

  return (
    <SiteShell>
      <section className="border-b border-line bg-paper py-14">
        <ScrollReveal className="container-site">
          <h1 className="font-serif text-4xl text-navy sm:text-5xl">{t.doctors.title}</h1>
          <p className="mt-3 max-w-2xl text-muted">{t.doctors.lead}</p>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <input className="h-11 border border-line bg-white px-3 text-sm focus:border-navy focus:ring-1 focus:ring-navy" placeholder={t.doctors.searchName} value={name} onChange={(e) => setName(e.target.value)} />
            <input className="h-11 border border-line bg-white px-3 text-sm focus:border-navy focus:ring-1 focus:ring-navy" placeholder={t.doctors.searchSpec} value={spec} onChange={(e) => setSpec(e.target.value)} />
            <select className="h-11 border border-line bg-white px-3 text-sm focus:border-navy focus:ring-1 focus:ring-navy" value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="">{t.doctors.dept}: {t.doctors.all}</option>
              {DEPARTMENTS.map((d: Department) => (
                <option key={d.id} value={d.id}>{lang === "ta" ? d.nameTa : d.name}</option>
              ))}
            </select>
            <select className="h-11 border border-line bg-white px-3 text-sm focus:border-navy focus:ring-1 focus:ring-navy" value={exp} onChange={(e) => setExp(e.target.value)}>
              <option value="">{t.doctors.exp}: {t.doctors.expAny}</option>
              <option value="10">{t.doctors.exp10}</option>
              <option value="15">{t.doctors.exp15}</option>
            </select>
            <select className="h-11 border border-line bg-white px-3 text-sm focus:border-navy focus:ring-1 focus:ring-navy" value={avail} onChange={(e) => setAvail(e.target.value)}>
              <option value="">{t.doctors.avail}: {t.doctors.all}</option>
              <option value="weekdays">{t.doctors.weekdays}</option>
              <option value="sat">{t.doctors.sat}</option>
            </select>
          </div>
        </ScrollReveal>
      </section>

      <section className="py-10">
        <div className="container-site divide-y divide-line">
          {list.length === 0 && <p className="py-10 text-muted">{t.doctors.none}</p>}
          {list.map((d: Doctor, i: number) => (
            <ScrollReveal key={d.id} delay={i * 60}>
              <article className="group grid gap-6 py-8 md:grid-cols-[160px_1fr_auto] card-hover-elevate hover:bg-paper/40 px-3 -mx-3">
                <div className="img-zoom h-40 w-40 max-w-full">
                  <img src={d.photo} alt={d.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-navy transition-colors duration-200 group-hover:text-teal">{lang === "ta" ? d.nameTa : d.name}</h2>
                  <p className="text-sm text-muted">{d.qualifications}</p>
                  <p className="mt-1 text-sm font-medium text-teal">{lang === "ta" ? d.specialityTa : d.speciality}</p>
                  <p className="mt-2 text-sm text-muted">
                    {d.experience} {t.doctors.years} · {t.doctors.timings}: {formatTime12(d.start, lang)} – {formatTime12(d.end, lang)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 self-center">
                  <Link href={`/doctors/${d.slug}`} className="inline-flex h-10 items-center justify-center bg-navy px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-navy-deep active:scale-95">
                    {t.doctors.view}
                  </Link>
                  <Link href={`/book-appointment?doctor=${d.id}`} className="inline-flex h-10 items-center justify-center bg-navy px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-navy-deep hover:shadow active:scale-95">
                    {t.doctors.book}
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
