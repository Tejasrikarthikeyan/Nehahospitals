"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEPARTMENTS, DOCTORS, HOSPITAL, PACKAGES, SERVICES, type Department, type Doctor, type HealthPackage, type HospitalService } from "@/lib/data";

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

  function reload() {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        if (d.doctors) setDoctors(d.doctors);
        if (d.departments) setDepartments(d.departments);
        if (d.packages) setPackages(d.packages);
        if (d.services) setServices(d.services);
        if (d.hospital) setHospital({ ...HOSPITAL, ...d.hospital });
      })
      .catch(() => undefined);
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
