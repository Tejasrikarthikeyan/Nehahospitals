"use client";

import { useState } from "react";
import { HOSPITAL } from "@/lib/data";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";
import { ScrollReveal } from "@/components/ScrollReveal";

const SECTIONS = [
  {
    id: "before",
    en: "Before Your Visit",
    ta: "வருகைக்கு முன்",
    bodyEn:
      "Carry a government-issued photo identity card. Fast if your doctor or package instructions require it. Note your current medicines, allergies and previous reports. Arrive 15 minutes early for registration.",
    bodyTa:
      "அரசு அடையாள அட்டையை கொண்டு வாருங்கள். பரிசோதனைக்கு உண்ணாவிரதம் தேவைப்பட்டால் பின்பற்றுங்கள். தற்போதைய மருந்துகள் மற்றும் முந்தைய அறிக்கைகளை கொண்டு வாருங்கள்.",
  },
  {
    id: "during",
    en: "During Your Visit",
    ta: "வருகையின் போது",
    bodyEn:
      "Register at reception or proceed directly if you have a confirmed appointment. Nursing staff will record vital signs before the consultation. Please keep mobile phones silent in clinical areas.",
    bodyTa:
      "வரவேற்பில் பதிவு செய்யுங்கள். ஆலோசனைக்கு முன் செவிலியர் குழு உயிர் அறிகுறிகளை பதிவு செய்யும். மருத்துவப் பகுதிகளில் மொபைலை அமைதியாக வைத்திருங்கள்.",
  },
  {
    id: "after",
    en: "After Your Visit",
    ta: "வருகைக்குப் பின்",
    bodyEn:
      "Collect medicines from the hospital pharmacy when prescribed. Follow written advice on diet, rest and warning symptoms. Book investigations or a review appointment before you leave if advised.",
    bodyTa:
      "பரிந்துரைக்கப்பட்ட மருந்துகளை மருந்தகத்தில் பெற்றுக் கொள்ளுங்கள். உணவு மற்றும் ஓய்வு குறித்த எழுத்துப்பூர்வ அறிவுரைகளை பின்பற்றுங்கள்.",
  },
  {
    id: "documents",
    en: "Documents to Bring",
    ta: "கொண்டு வர வேண்டிய ஆவணங்கள்",
    bodyEn:
      "Photo ID, previous prescriptions, laboratory and imaging reports, insurance/TPA card, referral letter if any, and a list of current medications including tablets taken that morning.",
    bodyTa:
      "அடையாள அட்டை, முந்தைய மருந்துச்சீட்டுகள், ஆய்வக மற்றும் ஸ்கேன் அறிக்கைகள், காப்பீட்டு அட்டை மற்றும் தற்போதைய மருந்து பட்டியல்.",
  },
  {
    id: "appointment",
    en: "Appointment Information",
    ta: "அப்பாயின்மென்ட் தகவல்",
    bodyEn:
      "Appointments are booked with a verified mobile number. Each consultation is scheduled in 30-minute slots. If you are delayed, call the helpdesk so the slot can be managed for other patients.",
    bodyTa:
      "சரிபார்க்கப்பட்ட மொபைல் எண்ணுடன் அப்பாயின்மென்ட் பதிவு செய்யப்படும். ஒவ்வொரு ஆலோசனையும் 30 நிமிட இடைவெளியில் அமையும்.",
  },
  {
    id: "admission",
    en: "Admission Process",
    ta: "அனுமதி செயல்முறை",
    bodyEn:
      "Admission is advised by the treating doctor. The admission desk completes documentation, room allocation and an estimate. Emergency admissions are prioritised through the Emergency Department.",
    bodyTa:
      "சிகிச்சை மருத்துவர் அனுமதியை பரிந்துரைப்பார். அனுமதி மேசை ஆவணங்கள், அறை ஒதுக்கீடு மற்றும் மதிப்பீட்டை நிறைவு செய்யும்.",
  },
  {
    id: "discharge",
    en: "Discharge Process",
    ta: "வெளியேற்ற செயல்முறை",
    bodyEn:
      "Discharge is planned after clinical review. You will receive a summary, prescriptions and follow-up date. Billing and TPA clearance are completed at the discharge desk.",
    bodyTa:
      "மருத்துவ மதிப்பீட்டுக்குப் பின் வெளியேற்றம் திட்டமிடப்படும். சுருக்கம், மருந்துச்சீட்டு மற்றும் பின்தொடர்தல் தேதி வழங்கப்படும்.",
  },
  {
    id: "insurance",
    en: "Insurance & TPA",
    ta: "காப்பீடு மற்றும் TPA",
    bodyEn:
      "The TPA desk assists with pre-authorisation for eligible cashless admissions. Coverage depends on your policy. Please share your card and a valid ID at the time of admission.",
    bodyTa:
      "தகுதியான கேஷ்லெஸ் அனுமதிகளுக்கு TPA மேசை முன் அனுமதிக்கு உதவும். காப்பீட்டு வரம்பு உங்கள் பாலிசியைப் பொறுத்தது.",
  },
  {
    id: "billing",
    en: "Billing Information",
    ta: "கட்டண தகவல்",
    bodyEn:
      "OPD consultation fees are payable at the billing counter. Package prices are displayed on the Health Packages page. Estimates for admission are provided in writing before a planned stay.",
    bodyTa:
      "வெளிநோயாளர் கட்டணம் பில்லிங் கவுண்டரில் செலுத்தப்படும். தொகுப்பு விலைகள் உடல்நல தொகுப்புகள் பக்கத்தில் காட்டப்படும்.",
  },
  {
    id: "visiting",
    en: "Visiting Hours",
    ta: "பார்வையாளர் நேரம்",
    bodyEn:
      "General wards: 4:00 PM – 6:00 PM. ICU visiting is restricted and permitted for a short period as advised by the intensivist. Children may be limited in critical-care areas.",
    bodyTa:
      "பொது வார்டுகள்: மாலை 4:00 – 6:00. ஐசியூ பார்வை கட்டுப்படுத்தப்பட்டு, மருத்துவர் அறிவுரைப்படி குறுகிய நேரமே அனுமதிக்கப்படும்.",
  },
  {
    id: "rights",
    en: "Patient Rights",
    ta: "நோயாளி உரிமைகள்",
    bodyEn:
      "You have the right to respectful care, privacy, information about diagnosis and treatment options, a second opinion, and to refuse treatment after understanding the consequences.",
    bodyTa:
      "மரியாதையான சிகிச்சை, தனியுரிமை, நோயறிதல் மற்றும் சிகிச்சை விருப்பங்கள் பற்றிய தகவல், இரண்டாவது கருத்து மற்றும் சிகிச்சையை மறுக்கும் உரிமை உங்களுக்கு உண்டு.",
  },
  {
    id: "faq",
    en: "Frequently Asked Questions",
    ta: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    bodyEn:
      "Do I need an account? No. Verify your mobile number with OTP. Can I book the same slot twice? No — once a 30-minute slot is taken it is unavailable. How do I confirm? You receive a WhatsApp message with your appointment ID.",
    bodyTa:
      "கணக்கு தேவையா? இல்லை. OTP மூலம் மொபைல் எண்ணை சரிபார்க்கவும். ஒரே நேர இடத்தை இருவர் எடுக்க முடியுமா? இல்லை. உறுதிப்படுத்தல் வாட்ஸ்அப்பில் அப்பாயின்மென்ட் எண்ணுடன் வரும்.",
  },
];

export default function GuidePage() {
  const { t, lang } = useI18n();
  const [id, setId] = useState(SECTIONS[0].id);
  const sec = SECTIONS.find((s) => s.id === id)!;
  return (
    <SiteShell>
      <section className="border-b border-line bg-paper py-14">
        <ScrollReveal className="container-site">
          <h1 className="font-serif text-4xl text-navy sm:text-5xl">{t.guide.title}</h1>
          <p className="mt-3 max-w-2xl text-muted">{t.guide.lead}</p>
        </ScrollReveal>
      </section>
      <section className="py-10">
        <div className="container-site grid gap-10 lg:grid-cols-[260px_1fr]">
          <nav className="lg:sticky lg:top-24 lg:self-start">
            <ul className="divide-y divide-line border-y border-line">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => setId(s.id)} className={`w-full py-3 text-left text-sm transition-all duration-200 ${id === s.id ? "font-semibold text-navy pl-2 border-l-2 border-teal bg-paper/50" : "text-muted hover:text-navy hover:pl-1"}`}>
                    {lang === "ta" ? s.ta : s.en}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <article className="animate-fade-in key={sec.id}">
            <h2 className="font-serif text-3xl text-navy">{lang === "ta" ? sec.ta : sec.en}</h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-muted">{lang === "ta" ? sec.bodyTa : sec.bodyEn}</p>
            <p className="mt-8 text-sm text-muted">{HOSPITAL.phone} · {HOSPITAL.email}</p>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
