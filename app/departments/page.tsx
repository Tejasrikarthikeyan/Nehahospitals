"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";
import { useCatalog } from "@/components/CatalogProvider";

export default function DepartmentsPage() {
  return (
    <Suspense>
      <DepartmentsInner />
    </Suspense>
  );
}

function DepartmentsInner() {
  const { t, lang } = useI18n();
  const { departments: DEPARTMENTS, doctors } = useCatalog();
  const params = useSearchParams();
  const [active, setActive] = useState(DEPARTMENTS[0]?.id || "");
  useEffect(() => {
    const open = params.get("open");
    if (open && DEPARTMENTS.some((d) => d.id === open)) setActive(open);
    else if (!active && DEPARTMENTS[0]) setActive(DEPARTMENTS[0].id);
  }, [params, DEPARTMENTS]);
  const dept = useMemo(() => DEPARTMENTS.find((d) => d.id === active) || DEPARTMENTS[0], [active, DEPARTMENTS]);
  const docs = doctors.filter((d) => d.departmentId === dept?.id);
  if (!dept) return <SiteShell><div className="container-site py-16" /></SiteShell>;

  return (
    <SiteShell>
      <section className="border-b border-line bg-paper py-14">
        <div className="container-site">
          <h1 className="font-serif text-4xl text-navy sm:text-5xl">{t.deptsPage.title}</h1>
          <p className="mt-3 max-w-2xl text-muted">{t.deptsPage.lead}</p>
        </div>
      </section>
      <section className="py-10">
        <div className="container-site grid gap-10 lg:grid-cols-[260px_1fr]">
          <nav className="lg:sticky lg:top-24 lg:self-start">
            <ul className="divide-y divide-line border-y border-line">
              {DEPARTMENTS.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => setActive(d.id)}
                    className={`w-full py-3 text-left text-sm ${active === d.id ? "font-semibold text-navy" : "text-muted hover:text-navy"}`}
                  >
                    {lang === "ta" ? d.nameTa : d.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <article>
            <img src={dept.image} alt="" className="h-[300px] w-full object-cover" />
            <h2 className="mt-6 font-serif text-3xl text-navy">{lang === "ta" ? dept.nameTa : dept.name}</h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-muted">{lang === "ta" ? dept.descriptionTa : dept.description}</p>
            <p className="mt-4 text-sm">
              <span className="font-semibold text-navy">{t.deptsPage.opd}: </span>
              <span className="text-muted">{dept.opd}</span>
            </p>
            <h3 className="mt-8 font-serif text-xl text-navy">{t.deptsPage.services}</h3>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {(lang === "ta" ? dept.servicesTa : dept.services).map((s) => (
                <li key={s}>— {s}</li>
              ))}
            </ul>
            <h3 className="mt-8 font-serif text-xl text-navy">{t.deptsPage.doctors}</h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {docs.length === 0 && <li className="py-3 text-sm text-muted">—</li>}
              {docs.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between py-3">
                  <Link href={`/doctors/${doc.slug}`} className="text-sm font-medium text-navy">
                    {lang === "ta" ? doc.nameTa : doc.name}
                  </Link>
                  <span className="text-xs text-muted">{doc.qualifications}</span>
                </li>
              ))}
            </ul>
            <Link href={`/book-appointment?department=${dept.id}`} className="mt-8 inline-flex h-11 items-center bg-navy px-5 text-sm font-semibold text-white">
              {t.deptsPage.book}
            </Link>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
