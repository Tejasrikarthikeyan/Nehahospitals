"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HOSPITAL } from "@/lib/data";
import { Logo } from "./Logo";
import { useI18n } from "./LanguageProvider";
import { useCatalog } from "./CatalogProvider";

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

  const LangSwitch = ({ id }: { id: string }) => (
    <div
      className="inline-flex items-center text-[13px] font-semibold tracking-wide"
      role="group"
      aria-label={t.common.language}
    >
      <button
        type="button"
        id={id}
        onClick={() => setLang("en")}
        className={`min-h-10 px-1.5 py-0.5 ${lang === "en" ? "text-navy" : "text-muted hover:text-navy"}`}
      >
        English
      </button>
      <span className="text-line">|</span>
      <button
        type="button"
        onClick={() => setLang("ta")}
        className={`min-h-10 px-1.5 py-0.5 ${lang === "ta" ? "text-navy" : "text-muted hover:text-navy"}`}
      >
        தமிழ்
      </button>
    </div>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white ${scrolled ? "border-b border-line shadow-[0_1px_0_rgba(10,53,88,0.06)]" : "border-b border-transparent"}`}
      >
      <a href="#main" className="skip-link">
        {t.common.skip}
      </a>
      <div className="hidden border-b border-line bg-paper lg:block">
        <div className="container-site flex h-9 items-center justify-between text-[13px]">
          <p className="text-muted">
            {H.address.split(",")[1]?.trim()}, {H.city}
          </p>
          <div className="flex items-center gap-5">
            <a href={`tel:${H.emergencyRaw}`} className="font-semibold text-emergency">
              {t.nav.emergency}: {H.emergency}
            </a>
            <LangSwitch id="lang-desktop-top" />
          </div>
        </div>
      </div>

      <div className="container-site flex h-16 min-w-0 items-center justify-between gap-2 sm:h-[72px] sm:gap-4">
        <Link href="/" aria-label={t.common.home} className="min-w-0 shrink">
          <span className="sm:hidden">
            <Logo compact />
          </span>
          <span className="hidden sm:inline">
            <Logo />
          </span>
        </Link>

        <nav className="hidden items-center gap-x-3.5 2xl:flex" aria-label={t.common.primaryNav}>
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap text-[13px] font-medium ${active ? "text-navy" : "text-[#3d4a58] hover:text-navy"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div className="hidden lg:flex">
            <LangSwitch id="lang-desktop-header" />
          </div>
          <Link
            href="/book-appointment"
            className="hidden h-10 max-w-[14rem] items-center truncate bg-navy px-3.5 text-[13px] font-semibold text-white hover:bg-navy-deep lg:inline-flex lg:px-4"
          >
            {t.nav.book}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-line 2xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{t.common.menu}</span>
            <span className="flex flex-col gap-1.5">
              <span className="block h-px w-5 bg-navy" />
              <span className="block h-px w-5 bg-navy" />
              <span className="block h-px w-5 bg-navy" />
            </span>
          </button>
        </div>
      </div>

    </header>
      {open && (
        <div className="fixed inset-0 z-[45] 2xl:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-navy-deep/40"
            aria-label={t.common.close}
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav"
            className="absolute inset-x-0 top-[var(--header-h)] max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-line bg-white shadow-[0_8px_24px_rgba(10,53,88,0.12)]"
          >
            <nav className="container-site flex flex-col py-3" aria-label={t.common.mobileNav}>
              <div className="border-b border-line py-3">
                <LangSwitch id="lang-mobile-nav" />
              </div>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="border-b border-line py-3.5 text-base font-medium text-navy">
                  {l.label}
                </Link>
              ))}
              <Link href="/book-appointment" className="border-b border-line py-3.5 text-base font-semibold text-navy">
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
