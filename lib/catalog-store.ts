import { DEPARTMENTS, DOCTORS, HOSPITAL, PACKAGES, SERVICES, type Department, type Doctor, type HealthPackage, type HospitalService } from "./data";
import { getAppointments, readJson, writeJson } from "./store";

export function slugify(text: string) {
  const s = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || `item-${Date.now()}`;
}

function withActive<T extends { status?: "active" | "inactive" }>(list: T[]): T[] {
  return list.map((x) => ({ ...x, status: x.status || "active" }));
}

export async function getDoctors(): Promise<Doctor[]> {
  const seeded = withActive(DOCTORS);
  const list = await readJson<Doctor[] | null>("doctors.json", null);
  if (!list || !list.length) {
    await writeJson("doctors.json", seeded);
    return seeded;
  }
  return withActive(list);
}

export async function saveDoctors(list: Doctor[]) {
  await writeJson("doctors.json", list);
}

export async function getDepartments(): Promise<Department[]> {
  const seeded = withActive(DEPARTMENTS);
  const list = await readJson<Department[] | null>("departments.json", null);
  if (!list || !list.length) {
    await writeJson("departments.json", seeded);
    return seeded;
  }
  return withActive(list);
}

export async function saveDepartments(list: Department[]) {
  await writeJson("departments.json", list);
}

export async function getPackages(): Promise<HealthPackage[]> {
  const seeded = withActive(PACKAGES);
  const list = await readJson<HealthPackage[] | null>("packages.json", null);
  if (!list || !list.length) {
    await writeJson("packages.json", seeded);
    return seeded;
  }
  return withActive(list);
}

export async function savePackages(list: HealthPackage[]) {
  await writeJson("packages.json", list);
}

export async function getServices(): Promise<HospitalService[]> {
  const seeded = withActive(SERVICES);
  const list = await readJson<HospitalService[] | null>("services.json", null);
  if (!list || !list.length) {
    await writeJson("services.json", seeded);
    return seeded;
  }
  return withActive(list);
}

export async function saveServices(list: HospitalService[]) {
  await writeJson("services.json", list);
}

export type HospitalInfo = typeof HOSPITAL & {
  advanceDays?: number;
  sameDayBooking?: boolean;
  slotMinutes?: number;
};

export async function getHospital(): Promise<HospitalInfo> {
  const extra = await readJson<Partial<HospitalInfo>>("hospital.json", {});
  return { ...HOSPITAL, slotMinutes: 30, advanceDays: 28, sameDayBooking: true, ...extra };
}

export async function saveHospital(info: HospitalInfo) {
  await writeJson("hospital.json", info);
}

export async function getCatalog() {
  const [doctors, departments, packages, services, hospital] = await Promise.all([
    getDoctors(),
    getDepartments(),
    getPackages(),
    getServices(),
    getHospital(),
  ]);
  return { doctors, departments, packages, services, hospital };
}

export async function getPublicCatalog() {
  const c = await getCatalog();
  return {
    doctors: c.doctors.filter((d) => d.status !== "inactive"),
    departments: c.departments.filter((d) => d.status !== "inactive"),
    packages: c.packages.filter((p) => p.status !== "inactive"),
    services: c.services.filter((s) => s.status !== "inactive"),
    hospital: c.hospital,
  };
}

export function occupyStatuses() {
  return ["booked", "upcoming", "confirmed", "rescheduled", "arrived"];
}

export async function liveSlotTaken(doctorId: string, date: string, time: string, exceptId?: string) {
  const list = await getAppointments();
  const occupy = occupyStatuses();
  return list.some(
    (a) => a.doctorId === doctorId && a.date === date && a.time === time && occupy.includes(a.status) && a.id !== exceptId
  );
}
