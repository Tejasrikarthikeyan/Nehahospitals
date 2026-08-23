"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/data";
import { dict, type TDict } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TDict;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("nh-lang") as Lang | null;
    const next = saved === "en" || saved === "ta" ? saved : "en";
    setLangState(next);
    document.documentElement.lang = next === "ta" ? "ta" : "en";
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("nh-lang", l);
    document.documentElement.lang = l === "ta" ? "ta" : "en";
  };

  const value = useMemo(() => ({ lang, setLang, t: dict(lang) }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
