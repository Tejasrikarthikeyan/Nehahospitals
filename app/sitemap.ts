import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nehahospitals.in";
  const paths = ["", "/about", "/doctors", "/departments", "/services", "/facilities", "/health-packages", "/patient-guide", "/contact", "/book-appointment"];
  return paths.map((p) => ({ url: base + p, lastModified: new Date() }));
}
