"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HOSPITAL } from "@/lib/data";
import { Logo } from "./Logo";
import { useI18n } from "./LanguageProvider";
import { useCatalog } from "./CatalogProvider";

function LangSwitch({
  id,
  lang,
  setLang,
  ariaLabel,
}: {
  id: string;
  lang: "en" | "ta";
  setLang: (l: "en" | "ta") => void;
  ariaLabel: string;
}) {
  return (
    <div
      className="inline-flex items-center h-8 text-[13px] font-semibold tracking-wide"
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        id={id}
        onClick={() => setLang("en")}
        className={`lang-toggle-btn inline-flex h-8 items-center px-2 py-0.5 leading-none transition-colors duration-200 ${lang === "en" ? "text-navy font-bold" : "text-muted hover:text-navy font-normal"}`}
      >
        English
      </button>
      <span className="text-line px-0.5 select-none">|</span>
      <button
        type="button"
        onClick={() => setLang("ta")}
        className={`lang-toggle-btn inline-flex h-8 items-center px-2 py-0.5 leading-none transition-colors duration-200 ${lang === "ta" ? "text-navy font-bold" : "text-muted hover:text-navy font-normal"}`}
      >
        தமிழ்
      </button>
    </div>
  );
}

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { hospital } = useCatalog();
  const H = { ...HOSPITAL, ...hospital };
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/doctors", label: t.nav.doctors },
    { href: "/departments", label: t.nav.departments },
    { href: "/services", label: t.nav.services },
    { href: "/facilities", label: t.nav.facilities },
    { href: "/health-packages", label: t.nav.packages },
    { href: "/patient-guide", label: t.nav.guide },
    { href: "/contact", label: t.nav.contact },
  ];

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "border-b border-line shadow-[0_1px_0_rgba(10,53,88,0.06)]" : "border-b border-transparent"}`}
      >
      <a href="#main" className="skip-link">
        {t.common.skip}
      </a>
      <div className="hidden border-b border-line bg-paper lg:block">
        <div className="container-site flex h-9 items-center justify-between text-[13px]">
          <p className="text-muted">
            {H.address.split(",")[1]?.trim()}, {H.city}
          </p>
          <a href={`tel:${H.emergencyRaw}`} className="font-semibold text-emergency transition-opacity duration-200 hover:opacity-80">
            {t.nav.emergency}: {H.emergency}
          </a>
        </div>
      </div>

      <div className="container-site flex h-16 w-full items-center justify-between gap-2 sm:h-[72px] sm:gap-4">
        {/* LOGO SECTION */}
        <div className="logo-section flex shrink-0 items-center justify-start pr-2 lg:pr-4">
          <Link href="/" aria-label={t.common.home} className="inline-flex shrink-0 items-center">
            <span className="sm:hidden">
              <Logo compact />
            </span>
            <span className="hidden sm:inline">
              <Logo />
            </span>
          </Link>
        </div>

        {/* NAVIGATION SECTION */}
        <nav className="navigation-section hidden min-w-0 flex-1 items-center justify-center px-1 xl:flex" aria-label={t.common.primaryNav}>
          <div className={`flex flex-wrap items-center justify-center ${lang === "ta" ? "gap-x-2 gap-y-0.5 xl:gap-x-2.5 2xl:gap-x-4 text-[11.5px] xl:text-[12px] 2xl:text-[13px]" : "gap-x-2 xl:gap-x-3 2xl:gap-x-5 text-[12.5px] 2xl:text-[13px]"}`}>
            {links.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative py-1 whitespace-nowrap font-medium transition-colors duration-200 ${active ? "text-navy font-semibold" : "text-[#3d4a58] hover:text-navy"}`}
                >
                  <span>{l.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full bg-teal transition-transform duration-300 ease-out origin-left ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ACTION SECTION */}
        <div className="action-section flex shrink-0 items-center justify-end gap-2 sm:gap-3 pl-2 xl:pl-4">
          <div className="hidden xl:flex items-center">
            <LangSwitch id="lang-desktop-header" lang={lang} setLang={setLang} ariaLabel={t.common.language} />
          </div>
          <Link
            href="/book-appointment"
            className={`hidden h-10 shrink-0 items-center justify-center whitespace-nowrap bg-navy font-semibold text-white transition-all duration-200 hover:bg-navy-deep active:scale-95 xl:inline-flex ${lang === "ta" ? "px-3 text-[11.5px] xl:px-3 xl:text-[11.5px] 2xl:px-3.5 2xl:text-[12.5px]" : "px-3.5 text-xs xl:px-4 xl:text-[13px]"}`}
          >
            {t.nav.book}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-line xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{t.common.menu}</span>
            <span className="flex flex-col gap-1.5">
              <span className={`block h-px w-5 bg-navy transition-transform duration-200 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-navy transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`block h-px w-5 bg-navy transition-transform duration-200 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
    </header>

      {open && (
        <div className="fixed inset-0 z-[45] xl:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-navy-deep/40 animate-fade-in"
            aria-label={t.common.close}
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav"
            className="absolute inset-x-0 top-[var(--header-h)] max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-line bg-white shadow-[0_8px_24px_rgba(10,53,88,0.12)] animate-fade-up"
          >
            <nav className="container-site flex flex-col py-3" aria-label={t.common.mobileNav}>
              <div className="border-b border-line py-3">
                <LangSwitch id="lang-mobile-nav" lang={lang} setLang={setLang} ariaLabel={t.common.language} />
              </div>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="border-b border-line py-3.5 text-base font-medium text-navy transition-colors duration-200 hover:text-teal">
                  {l.label}
                </Link>
              ))}
              <Link href="/book-appointment" className="border-b border-line py-3.5 text-base font-semibold text-navy transition-colors duration-200 hover:text-teal">
                {t.nav.book}
              </Link>
              <a href={`tel:${H.emergencyRaw}`} className="py-3.5 text-base font-semibold text-emergency">
                {t.nav.emergency}: {H.emergency}
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
