import { promises as fs } from "fs";
import path from "path";
import type { Appointment } from "./types";

export type { Appointment };

const dir = path.join(process.cwd(), "data");

export type OtpRecord = {
  phone: string;
  otp: string;
  verified: boolean;
  expiresAt: number;
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  phone?: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

async function ensure() {
  await fs.mkdir(dir, { recursive: true });
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensure();
  const p = path.join(dir, file);
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(file: string, data: unknown) {
  await ensure();
  await fs.writeFile(path.join(dir, file), JSON.stringify(data, null, 2), "utf8");
}

export async function getAppointments(): Promise<Appointment[]> {
  return readJson("appointments.json", []);
}

export async function saveAppointments(list: Appointment[]) {
  await writeJson("appointments.json", list);
}

export async function getOtps(): Promise<OtpRecord[]> {
  return readJson("otps.json", []);
}

export async function saveOtps(list: OtpRecord[]) {
  await writeJson("otps.json", list);
}

export async function getNotifications(): Promise<Notification[]> {
  return readJson("notifications.json", []);
}

export async function saveNotifications(list: Notification[]) {
  await writeJson("notifications.json", list);
}

export async function addNotification(n: Omit<Notification, "id" | "createdAt" | "read">) {
  const list = await getNotifications();
  list.unshift({
    ...n,
    id: `N-${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
  });
  await saveNotifications(list.slice(0, 200));
}

export async function isSlotTaken(doctorId: string, date: string, time: string, exceptId?: string) {
  const occupy = ["booked", "upcoming", "confirmed", "rescheduled", "arrived"];
  const list = await getAppointments();
  return list.some(
    (a) =>
      a.doctorId === doctorId &&
      a.date === date &&
      a.time === time &&
      occupy.includes(a.status) &&
      a.id !== exceptId
  );
}

let chain: Promise<unknown> = Promise.resolve();
export function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(() => undefined, () => undefined);
  return run;
}
