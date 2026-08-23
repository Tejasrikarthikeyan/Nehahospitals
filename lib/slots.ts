import type { Doctor, Lang } from "./data";

export function displayLocale(lang: Lang = "en") {
  return lang === "ta" ? "ta-IN" : "en-IN";
}

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatTime12(hhmm: string, lang: Lang = "en") {
  const [hStr, m] = hhmm.split(":");
  const hour24 = Number(hStr);
  const hour12 = hour24 % 12 || 12;
  if (lang === "ta") {
    const period = hour24 < 12 ? "காலை" : hour24 < 16 ? "மதியம்" : "மாலை";
    return `${period} ${hour12}:${m}`;
  }
  return `${hour12}:${m} ${hour24 >= 12 ? "PM" : "AM"}`;
}

export function formatLongDate(iso: string, lang: Lang = "en") {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(displayLocale(lang), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateSlots(doctor: Doctor): string[] {
  const slots: string[] = [];
  const lunchS = toMinutes(doctor.lunchStart || "13:00");
  const lunchE = toMinutes(doctor.lunchEnd || "14:00");
  const pushRange = (from: string, to: string, skipBreak: boolean) => {
    if (!from || !to) return;
    const start = toMinutes(from);
    const end = toMinutes(to);
    if (!(end > start)) return;
    for (let t = start; t + 30 <= end; t += 30) {
      if (skipBreak && t >= lunchS && t < lunchE) continue;
      const key = fromMinutes(t);
      if (!slots.includes(key)) slots.push(key);
    }
  };
  pushRange(doctor.start, doctor.end, true);
  if (doctor.eveningStart && doctor.eveningEnd) {
    pushRange(doctor.eveningStart, doctor.eveningEnd, false);
  }
  return slots.sort();
}

export function upcomingDates(doctor: Doctor, days = 28) {
  if (!doctor) return [];
  const out: string[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = localYMD(d);
    if (!isWorkingDay(doctor, iso)) continue;
    const open = generateSlots(doctor).some((time) => !isSlotInPast(iso, time));
    if (!open) continue;
    out.push(iso);
  }
  return out;
}

export function localYMD(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isWorkingDay(doctor: Doctor, dateISO: string) {
  const d = new Date(`${dateISO}T12:00:00`);
  return doctor.days.includes(d.getDay());
}

export function isSlotInPast(dateISO: string, time: string, now = new Date()) {
  if (dateISO > localYMD(now)) return false;
  if (dateISO < localYMD(now)) return true;
  const [h, m] = time.split(":").map(Number);
  const slot = new Date(now);
  slot.setHours(h, m, 0, 0);
  return slot.getTime() <= now.getTime();
}

export function appointmentId() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `NH-${n}`;
}
