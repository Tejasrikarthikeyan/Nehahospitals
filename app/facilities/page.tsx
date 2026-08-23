"use client";

import { IMAGES } from "@/lib/data";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";

export default function FacilitiesPage() {
  const { t, lang } = useI18n();
  const items = [
    { src: IMAGES.building, en: "Modern hospital building", ta: "நவீன மருத்துவமனை கட்டிடம்" },
    { src: IMAGES.reception, en: "Reception", ta: "வரவேற்பு" },
    { src: IMAGES.rooms, en: "Patient rooms", ta: "நோயாளி அறைகள்" },
    { src: IMAGES.icu, en: "ICU", ta: "ஐசியூ" },
    { src: IMAGES.ot, en: "Operation theatres", ta: "அறுவை சிகிச்சை அரங்குகள்" },
    { src: IMAGES.emergency, en: "Emergency department", ta: "அவசர சிகிச்சை பிரிவு" },
    { src: IMAGES.lab, en: "Diagnostic laboratory", ta: "நோயறிதல் ஆய்வகம்" },
    { src: IMAGES.pharmacy, en: "Pharmacy", ta: "மருந்தகம்" },
    { src: IMAGES.waiting, en: "Waiting areas", ta: "காத்திருப்பு இடங்கள்" },
    { src: IMAGES.cafeteria, en: "Cafeteria", ta: "உணவகம்" },
    { src: IMAGES.parking, en: "Parking", ta: "வாகன நிறுத்தம்" },
  ];

  return (
    <SiteShell>
      <section className="border-b border-line bg-paper py-14">
        <div className="container-site">
          <h1 className="font-serif text-4xl text-navy sm:text-5xl">{t.facilities.title}</h1>
          <p className="mt-3 max-w-2xl text-muted">{t.facilities.lead}</p>
        </div>
      </section>
      <section className="py-10">
        <div className="container-site columns-1 gap-4 md:columns-2">
          {items.map((it) => (
            <figure key={it.en} className="mb-4 break-inside-avoid">
              <img src={it.src} alt={lang === "ta" ? it.ta : it.en} className="w-full object-cover" />
              <figcaption className="mt-2 text-sm font-medium text-navy">{lang === "ta" ? it.ta : it.en}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
