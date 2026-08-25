"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useI18n } from "./LanguageProvider";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { t, lang } = useI18n();
  const pathname = usePathname();
  const showBookFab = pathname !== "/book-appointment";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col overflow-x-clip pt-[var(--header-h)]">
        <main id="main" className={`flex-1 animate-page-entrance ${showBookFab ? "pb-20 md:pb-0" : ""}`}>
          {children}
        </main>
        <Footer />
      </div>
      {showBookFab && (
        <Link
          href="/book-appointment"
          className="fixed z-40 bg-teal px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-teal-dark active:scale-95 md:hidden"
          aria-label={t.nav.book}
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom))", right: "max(1rem, env(safe-area-inset-right))" }}
        >
          {lang === "ta" ? "பதிவு" : "Book"}
        </Link>
      )}
    </div>
  );
}
