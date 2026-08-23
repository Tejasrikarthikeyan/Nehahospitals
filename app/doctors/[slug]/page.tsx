"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HOSPITAL } from "@/lib/data";
import { DAY_NAMES } from "@/lib/i18n";
import { formatTime12, upcomingDates } from "@/lib/slots";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";
import { useCatalog } from "@/components/CatalogProvider";

export default function DoctorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();
  const { doctors, departments } = useCatalog();
  const doctor = doctors.find((d) => d.slug === slug);
  if (!doctor) {
    return (
      <SiteShell>
        <div className="container-site py-20">
          <p>{t.doctors.notFound}</p>
          <Link href="/doctors" className="mt-6 inline-block text-sm font-semibold text-teal">
            {t.doctors.allDoctors}
          </Link>
        </div>
      </SiteShell>
    );
  }
  const dept = departments.find((d) => d.id === doctor.departmentId);
  const dates = upcomingDates(doctor, 14);
  const days = doctor.days.map((d) => DAY_NAMES[lang][d]).join(", ");

  return (
    <SiteShell>
      <section className="border-b border-line bg-paper py-12">
        <div className="container-site grid gap-10 lg:grid-cols-[280px_1fr]">
          <img src={doctor.photo} alt={doctor.name} className="h-[340px] w-full object-cover" />
          <div>
            <Link href="/doctors" className="text-sm font-semibold text-teal">
              ← {t.doctors.allDoctors}
            </Link>
            <h1 className="mt-4 font-serif text-4xl text-navy">{lang === "ta" ? doctor.nameTa : doctor.name}</h1>
            <p className="mt-2 text-muted">{doctor.qualifications}</p>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">{t.profile.department}</dt>
                <dd className="font-medium text-navy">{lang === "ta" ? dept?.nameTa : dept?.name}</dd>
              </div>
              <div>
                <dt className="text-muted">{t.profile.speciality}</dt>
                <dd className="font-medium text-navy">{lang === "ta" ? doctor.specialityTa : doctor.speciality}</dd>
              </div>
              <div>
                <dt className="text-muted">{t.profile.experience}</dt>
                <dd className="font-medium text-navy">{doctor.experience} {t.home.yearsExp}</dd>
              </div>
              <div>
                <dt className="text-muted">{t.profile.location}</dt>
                <dd className="font-medium text-navy">{HOSPITAL.address}</dd>
              </div>
            </dl>
            <Link href={`/book-appointment?doctor=${doctor.id}`} className="mt-8 inline-flex h-12 items-center bg-navy px-7 text-sm font-semibold text-white">
              {t.profile.book}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl text-navy">{t.profile.bio}</h2>
            <p className="mt-4 text-[15px] leading-7 text-muted">{lang === "ta" ? doctor.bioTa : doctor.bio}</p>
            <h2 className="mt-10 font-serif text-2xl text-navy">{t.profile.expertise}</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {(lang === "ta" ? doctor.expertiseTa : doctor.expertise).map((e) => (
                <li key={e}>— {e}</li>
              ))}
            </ul>
          </div>
          <aside className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h2 className="font-serif text-2xl text-navy">{t.profile.timings}</h2>
            <p className="mt-3 text-sm text-muted">{t.profile.days}</p>
            <p className="text-sm font-medium text-navy">{days}</p>
            <p className="mt-3 text-sm text-navy">
              {formatTime12(doctor.start, lang)} – {formatTime12(doctor.end, lang)}
            </p>
            <p className="text-sm text-muted">
              {t.profile.lunch}: {formatTime12(doctor.lunchStart, lang)} – {formatTime12(doctor.lunchEnd, lang)}
            </p>
            <h3 className="mt-8 font-serif text-xl text-navy">{t.profile.dates}</h3>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {dates.slice(0, 8).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
