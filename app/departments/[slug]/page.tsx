"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCatalog } from "@/components/CatalogProvider";

export default function DepartmentSlugRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { departments } = useCatalog();
  useEffect(() => {
    const d = departments.find((x) => x.slug === slug || x.id === slug);
    router.replace(d ? `/departments?open=${d.id}` : "/departments");
  }, [slug, router, departments]);
  return null;
}
