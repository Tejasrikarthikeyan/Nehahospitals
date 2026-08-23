"use client";

import Link from "next/link";
import { HOSPITAL } from "@/lib/data";
import { Logo } from "./Logo";
import { useI18n } from "./LanguageProvider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto bg-navy-deep text-white">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-block brightness-0 invert" aria-label={t.common.home}>
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">{t.footer.tagline}</p>
          <p className="mt-4 text-sm text-white/80">{HOSPITAL.address}</p>
          <p className="mt-2 text-sm font-semibold text-white">{HOSPITAL.emergency}</p>
        </div>
        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white/55">{t.footer.explore}</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            <li><Link href="/">{t.nav.home}</Link></li>
            <li><Link href="/about">{t.nav.about}</Link></li>
            <li><Link href="/doctors">{t.nav.doctors}</Link></li>
            <li><Link href="/departments">{t.nav.departments}</Link></li>
            <li><Link href="/services">{t.nav.services}</Link></li>
            <li><Link href="/facilities">{t.nav.facilities}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white/55">{t.footer.care}</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            <li><Link href="/patient-guide">{t.nav.guide}</Link></li>
            <li><Link href="/health-packages">{t.nav.packages}</Link></li>
            <li><Link href="/book-appointment">{t.nav.book}</Link></li>
            <li><Link href="/contact">{t.nav.contact}</Link></li>
            <li><a href={`tel:${HOSPITAL.emergencyRaw}`}>{t.nav.emergency}</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white/55">{t.footer.legal}</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            <li><Link href="/privacy">{t.footer.privacy}</Link></li>
            <li><Link href="/terms">{t.footer.terms}</Link></li>
            <li><Link href="/admin">{t.footer.staff}</Link></li>
          </ul>
          <div className="mt-6 flex gap-3 text-white/80">
            <Social href="https://www.facebook.com" label="Facebook">
              <path d="M14 8h-2a3 3 0 0 0-3 3v2H7v3h2v6h3v-6h2.2l.8-3H12v-1.2c0-.4.2-.8.8-.8H14V8z" />
            </Social>
            <Social href="https://www.instagram.com" label="Instagram">
              <rect x="6" y="6" width="12" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="16.2" cy="7.8" r="0.7" />
            </Social>
            <Social href="https://www.youtube.com" label="YouTube">
              <path d="M18.6 8.2a2 2 0 0 0-1.4-1.4C16 6.5 12 6.5 12 6.5s-4 0-5.2.3a2 2 0 0 0-1.4 1.4C5.1 9.4 5.1 12 5.1 12s0 2.6.3 3.8a2 2 0 0 0 1.4 1.4c1.2.3 5.2.3 5.2.3s4 0 5.2-.3a2 2 0 0 0 1.4-1.4c.3-1.2.3-3.8.3-3.8s0-2.6-.3-3.8zM10.8 14.5V9.5l4.2 2.5-4.2 2.5z" />
            </Social>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-4 text-xs text-white/55 sm:flex-row sm:justify-between">
          <p>{t.footer.rights}</p>
          <p>{HOSPITAL.email}</p>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center border border-white/20 hover:border-white/50"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        {children}
      </svg>
    </a>
  );
}
