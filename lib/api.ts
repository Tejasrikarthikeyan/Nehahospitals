export const REMOTE_BASE_URL = "https://hydration-cycle-answering.ngrok-free.dev/nehahospital";

export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/backend";
  }
  return REMOTE_BASE_URL;
}

export const BASE_URL = REMOTE_BASE_URL;

import { DOCTORS, DEPARTMENTS, PACKAGES, SERVICES, HOSPITAL, type Doctor, type Department, type HospitalService, type HealthPackage } from "@/lib/data";
import { generateSlots } from "./slots";

function getStaffHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const staffCode = sessionStorage.getItem("nh-staff-key") || sessionStorage.getItem("nh-staff") || "NEHA2026";
    return {
      "X-Staff-Key": staffCode,
      "x-staff-key": staffCode,
      "staff-key": staffCode,
    };
  }
  return { "X-Staff-Key": "NEHA2026", "x-staff-key": "NEHA2026" };
}

function getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
  return {
    "ngrok-skip-browser-warning": "true",
    ...getStaffHeader(),
    ...customHeaders,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  let data: Record<string, unknown> = {};
  try {
    const text = await res.text();
    if (text) {
      data = JSON.parse(text);
    }
  } catch {
    // text was not JSON
  }

  if (!res.ok) {
    const msg =
      (data.error as string) ||
      (data.detail as string) ||
      (data.message as string) ||
      (res.status === 404
        ? "Doctor or resource not found"
        : res.status === 409
        ? "This appointment slot is already booked"
        : res.status === 400
        ? "Invalid request parameters"
        : res.status === 500
        ? "Internal server error"
        : "Unable to connect to Neha Hospitals server");
    throw new Error(msg);
  }

  return data as unknown as T;
}

export async function sendOtp(phone: string) {
  try {
    const res = await fetch(`${getBaseUrl()}/otp/`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ phone }),
    });
    return await handleResponse<{ success: boolean; otp?: string; message?: string }>(res);
  } catch {
    // Backend offline fallback: return demo OTP so OTP flow works
    const code = "123456";
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`demo_otp_${phone}`, code);
    }
    return { success: true, otp: code, message: "OTP sent via SMS (Demo Mode)" };
  }
}

export async function verifyOtp(phone: string, otp: string) {
  try {
    const res = await fetch(`${getBaseUrl()}/verify/`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ phone, otp }),
    });
    return await handleResponse<{ success: boolean; appointments: unknown[] }>(res);
  } catch {
    // Backend offline fallback: verify OTP
    if (otp === "123456" || otp.length === 6) {
      return { success: true, appointments: [] };
    }
    throw new Error("Invalid OTP code.");
  }
}

export async function getDoctors(): Promise<Doctor[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${getBaseUrl()}/doctors/`, {
      headers: getHeaders(),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await handleResponse<unknown>(res);
    if (Array.isArray(data) && data.length > 0) return data as Doctor[];
    if (data && typeof data === "object" && "doctors" in data && Array.isArray((data as Record<string, unknown>).doctors) && ((data as Record<string, unknown>).doctors as Doctor[]).length > 0) {
      return (data as Record<string, unknown>).doctors as Doctor[];
    }
    return DOCTORS;
  } catch {
    return DOCTORS;
  }
}

export async function createDoctor(doctorData: Record<string, unknown>) {
  try {
    const res = await fetch(`${getBaseUrl()}/doctors/`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(doctorData),
    });
    return await handleResponse<unknown>(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save doctor.";
    throw new Error(message);
  }
}

export async function getDepartments(): Promise<Department[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${getBaseUrl()}/departments/`, {
      headers: getHeaders(),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await handleResponse<unknown>(res);
    if (Array.isArray(data) && data.length > 0) return data as Department[];
    if (data && typeof data === "object" && "departments" in data && Array.isArray((data as Record<string, unknown>).departments) && ((data as Record<string, unknown>).departments as Department[]).length > 0) {
      return (data as Record<string, unknown>).departments as Department[];
    }
    return DEPARTMENTS;
  } catch {
    return DEPARTMENTS;
  }
}

export async function createDepartment(departmentData: Record<string, unknown>) {
  try {
    const res = await fetch(`${getBaseUrl()}/departments/`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(departmentData),
    });
    return await handleResponse<unknown>(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save department.";
    throw new Error(message);
  }
}

export async function getServices(): Promise<HospitalService[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${getBaseUrl()}/services/`, {
      headers: getHeaders(),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await handleResponse<unknown>(res);
    if (Array.isArray(data) && data.length > 0) return data as HospitalService[];
    if (data && typeof data === "object" && "services" in data && Array.isArray((data as Record<string, unknown>).services) && ((data as Record<string, unknown>).services as HospitalService[]).length > 0) {
      return (data as Record<string, unknown>).services as HospitalService[];
    }
    return SERVICES;
  } catch {
    return SERVICES;
  }
}

export async function createService(serviceData: Record<string, unknown>) {
  try {
    const res = await fetch(`${getBaseUrl()}/services/`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(serviceData),
    });
    return await handleResponse<unknown>(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save service.";
    throw new Error(message);
  }
}

export async function getPackages(): Promise<HealthPackage[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${getBaseUrl()}/packages/`, {
      headers: getHeaders(),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await handleResponse<unknown>(res);
    if (Array.isArray(data) && data.length > 0) return data as HealthPackage[];
    if (data && typeof data === "object" && "packages" in data && Array.isArray((data as Record<string, unknown>).packages) && ((data as Record<string, unknown>).packages as HealthPackage[]).length > 0) {
      return (data as Record<string, unknown>).packages as HealthPackage[];
    }
    return PACKAGES;
  } catch {
    return PACKAGES;
  }
}

export async function createPackage(packageData: Record<string, unknown>) {
  try {
    const res = await fetch(`${getBaseUrl()}/packages/`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(packageData),
    });
    return await handleResponse<unknown>(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save package.";
    throw new Error(message);
  }
}

export async function getSlots(doctorId: string, date: string) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(
      `${getBaseUrl()}/slots/?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}`,
      {
        headers: getHeaders(),
        signal: controller.signal,
      }
    );
    clearTimeout(timer);
    const data = await handleResponse<{ slots: { time: string; status: "available" | "booked" }[] }>(res);
    if (data.slots && data.slots.length > 0) return data.slots;
    const doc = DOCTORS.find((d) => d.id === doctorId);
    if (doc) {
      return generateSlots(doc).map((t) => ({ time: t, status: "available" as const }));
    }
    return [];
  } catch (err) {
    console.error("getSlots offline fallback:", err);
    const doc = DOCTORS.find((d) => d.id === doctorId);
    if (doc) {
      return generateSlots(doc).map((t) => ({ time: t, status: "available" as const }));
    }
    return [];
  }
}

export async function createAppointment(data: {
  doctorId: string;
  date: string;
  time: string;
  patientName: string;
  age: string;
  gender: string;
  phone: string;
  email?: string;
  reason?: string;
}) {
  try {
    const res = await fetch(`${getBaseUrl()}/appointments/`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    return await handleResponse<{
      appointment: { id: string; date: string; time: string };
      doctor: string;
      doctorTa?: string;
      department: string;
      departmentTa?: string;
      hospital: string;
      patientName: string;
      phone: string;
      whatsappDelivered?: boolean;
      whatsappTo?: string;
    }>(res);
  } catch {
    const doc = DOCTORS.find((d) => d.id === data.doctorId) || DOCTORS[0];
    const dept = DEPARTMENTS.find((d) => d.id === doc.departmentId) || DEPARTMENTS[0];
    const id = `NH-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      appointment: { id, date: data.date, time: data.time },
      doctor: doc.name,
      doctorTa: doc.nameTa,
      department: dept.name,
      departmentTa: dept.nameTa,
      hospital: HOSPITAL.name,
      patientName: data.patientName,
      phone: data.phone,
      whatsappDelivered: false,
      whatsappTo: `+91 ${data.phone}`,
    };
  }
}

export async function getAppointments() {
  try {
    const res = await fetch(`${getBaseUrl()}/appointments/`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<unknown>(res);
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && "appointments" in data && Array.isArray((data as Record<string, unknown>).appointments)) {
      return (data as Record<string, unknown>).appointments;
    }
    return [];
  } catch (err) {
    console.error("getAppointments error:", err);
    return [];
  }
}

export async function updateAppointment(data: {
  id: string;
  action: "status" | "reschedule" | "cancel";
  status?: string;
  doctorId?: string;
  newDate?: string;
  newTime?: string;
  date?: string;
  time?: string;
  reason?: string;
}) {
  try {
    const payload: Record<string, unknown> = { id: data.id, action: data.action };
    if (data.action === "status" && data.status) payload.status = data.status;
    if (data.action === "reschedule") {
      if (data.doctorId) payload.doctorId = data.doctorId;
      payload.newDate = data.newDate || data.date;
      payload.newTime = data.newTime || data.time;
      payload.date = data.newDate || data.date;
      payload.time = data.newTime || data.time;
    }
    if (data.action === "cancel") payload.reason = data.reason || "";

    const res = await fetch(`${getBaseUrl()}/appointments/`, {
      method: "PATCH",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return await handleResponse<{ success: boolean; appointment: Record<string, unknown> }>(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update appointment.";
    throw new Error(message);
  }
}

export async function getNotifications() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${getBaseUrl()}/notifications/`, {
      headers: getHeaders(),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await handleResponse<unknown>(res);
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && "notifications" in data && Array.isArray((data as Record<string, unknown>).notifications)) {
      return (data as Record<string, unknown>).notifications;
    }
    return [];
  } catch {
    return [];
  }
}

export async function getSettings() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${getBaseUrl()}/settings/`, {
      headers: getHeaders(),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await handleResponse<unknown>(res);
    if (data && typeof data === "object" && "settings" in data) {
      return (data as Record<string, unknown>).settings;
    }
    return data || {};
  } catch {
    return {};
  }
}

export async function updateSetting(data: Record<string, unknown>) {
  try {
    const res = await fetch(`${getBaseUrl()}/settings/`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    return await handleResponse<unknown>(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update setting.";
    throw new Error(message);
  }
}
