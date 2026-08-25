"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { HOSPITAL, DOCTORS, DEPARTMENTS, PACKAGES, SERVICES, type Department, type Doctor, type HealthPackage, type HospitalService } from "@/lib/data";
import { getDepartments, getDoctors, getPackages, getServices, getSettings } from "@/lib/api";

type Catalog = {
  doctors: Doctor[];
  departments: Department[];
  packages: HealthPackage[];
  services: HospitalService[];
  hospital: typeof HOSPITAL;
  reload: () => void;
};

const CatalogContext = createContext<Catalog | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS);
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [packages, setPackages] = useState<HealthPackage[]>(PACKAGES);
  const [services, setServices] = useState<HospitalService[]>(SERVICES);
  const [hospital, setHospital] = useState(HOSPITAL);

  async function reload() {
    try {
      const [docs, depts, pkgs, svcs, sett] = await Promise.all([
        getDoctors(),
        getDepartments(),
        getPackages(),
        getServices(),
        getSettings(),
      ]);
      if (docs && docs.length > 0) setDoctors(docs);
      if (depts && depts.length > 0) setDepartments(depts);
      if (pkgs && pkgs.length > 0) setPackages(pkgs);
      if (svcs && svcs.length > 0) setServices(svcs);
      if (sett && Object.keys(sett).length) setHospital((h) => ({ ...h, ...sett }));
    } catch {
      // Keep default pre-populated catalog when backend is offline
    }
  }

  useEffect(() => {
    reload();
  }, []);

  const value = useMemo(
    () => ({ doctors, departments, packages, services, hospital, reload }),
    [doctors, departments, packages, services, hospital]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    return {
      doctors: DOCTORS,
      departments: DEPARTMENTS,
      packages: PACKAGES,
      services: SERVICES,
      hospital: HOSPITAL,
      reload: () => undefined,
    };
  }
  return ctx;
}
