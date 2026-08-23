"use client";

import { LanguageProvider } from "./LanguageProvider";
import { CatalogProvider } from "./CatalogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CatalogProvider>{children}</CatalogProvider>
    </LanguageProvider>
  );
}
