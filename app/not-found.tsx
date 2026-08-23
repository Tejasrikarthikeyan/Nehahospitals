"use client";

import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <SiteShell>
      <section className="py-20">
        <div className="container-site max-w-lg">
          <h1 className="font-serif text-4xl text-navy">{t.common.notFoundTitle}</h1>
          <p className="mt-4 text-muted">{t.common.notFoundBody}</p>
          <Link href="/" className="mt-8 inline-flex h-12 items-center bg-navy px-6 text-sm font-semibold text-white">
            {t.nav.home}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
