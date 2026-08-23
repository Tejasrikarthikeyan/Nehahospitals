import { NextResponse } from "next/server";
import { getDoctors, saveDoctors, slugify } from "@/lib/catalog-store";
import { addNotification } from "@/lib/store";
import type { Doctor } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ doctors: await getDoctors() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const list = await getDoctors();
  const id = slugify(body.name || `dr-${Date.now()}`);
  const doctor: Doctor = normalize(body, id, `dr-${id}`);
  if (list.some((d) => d.id === doctor.id || d.slug === doctor.slug)) {
    doctor.id = `${doctor.id}-${Date.now()}`;
    doctor.slug = doctor.id;
  }
  list.push(doctor);
  await saveDoctors(list);
  await addNotification({ type: "doctor_added", title: "New doctor added", body: doctor.name });
  return NextResponse.json({ ok: true, doctor });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const list = await getDoctors();
  const i = list.findIndex((d) => d.id === body.id);
  if (i < 0) return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
  if (body.action === "toggle") {
    list[i].status = list[i].status === "inactive" ? "active" : "inactive";
  } else {
    list[i] = normalize({ ...list[i], ...body }, list[i].id, list[i].slug);
  }
  await saveDoctors(list);
  return NextResponse.json({ ok: true, doctor: list[i] });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";
  const list = (await getDoctors()).filter((d) => d.id !== id);
  await saveDoctors(list);
  return NextResponse.json({ ok: true });
}

function normalize(body: Record<string, unknown>, id: string, slug: string): Doctor {
  const days = Array.isArray(body.days) ? (body.days as number[]) : String(body.days || "1,2,3,4,5,6").split(",").map(Number);
  const expertise = Array.isArray(body.expertise) ? (body.expertise as string[]) : String(body.expertise || "").split(",").map((s) => s.trim()).filter(Boolean);
  return {
    id,
    slug,
    name: String(body.name || ""),
    nameTa: String(body.nameTa || body.name || ""),
    qualifications: String(body.qualifications || ""),
    departmentId: String(body.departmentId || ""),
    speciality: String(body.speciality || ""),
    specialityTa: String(body.specialityTa || body.speciality || ""),
    experience: Number(body.experience || 0),
    photo: String(body.photo || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80"),
    expertise,
    expertiseTa: expertise,
    bio: String(body.bio || ""),
    bioTa: String(body.bioTa || body.bio || ""),
    days: days.filter((n) => n >= 0 && n <= 6),
    start: String(body.start || "09:00"),
    end: String(body.end || "13:00"),
    lunchStart: String(body.lunchStart || "13:00"),
    lunchEnd: String(body.lunchEnd || "14:00"),
    eveningStart: String(body.eveningStart || ""),
    eveningEnd: String(body.eveningEnd || ""),
    registration: String(body.registration || ""),
    fee: Number(body.fee || 0),
    status: body.status === "inactive" ? "inactive" : "active",
  };
}
