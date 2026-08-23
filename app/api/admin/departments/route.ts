import { NextResponse } from "next/server";
import { getDepartments, saveDepartments, slugify } from "@/lib/catalog-store";
import { addNotification } from "@/lib/store";
import type { Department } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ departments: await getDepartments() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const list = await getDepartments();
  const id = slugify(body.name || `dept-${Date.now()}`);
  const dept = normalize(body, id, id);
  list.push(dept);
  await saveDepartments(list);
  await addNotification({ type: "department_added", title: "New department added", body: dept.name });
  return NextResponse.json({ ok: true, department: dept });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const list = await getDepartments();
  const i = list.findIndex((d) => d.id === body.id);
  if (i < 0) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (body.action === "toggle") list[i].status = list[i].status === "inactive" ? "active" : "inactive";
  else list[i] = normalize({ ...list[i], ...body }, list[i].id, list[i].slug);
  await saveDepartments(list);
  return NextResponse.json({ ok: true, department: list[i] });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  await saveDepartments((await getDepartments()).filter((d) => d.id !== id));
  return NextResponse.json({ ok: true });
}

function normalize(body: Record<string, unknown>, id: string, slug: string): Department {
  const desc = String(body.description || body.short || "");
  return {
    id,
    slug,
    name: String(body.name || ""),
    nameTa: String(body.nameTa || body.name || ""),
    short: String(body.short || desc).slice(0, 140),
    shortTa: String(body.shortTa || body.short || desc).slice(0, 140),
    description: desc,
    descriptionTa: String(body.descriptionTa || desc),
    services: Array.isArray(body.services) ? (body.services as string[]) : String(body.services || "").split(",").map((s) => s.trim()).filter(Boolean),
    servicesTa: [],
    opd: String(body.opd || "Monday – Saturday, 9:00 AM – 5:00 PM"),
    image: String(body.image || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80"),
    hod: String(body.hod || ""),
    status: body.status === "inactive" ? "inactive" : "active",
  };
}
