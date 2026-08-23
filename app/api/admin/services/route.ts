import { NextResponse } from "next/server";
import { getServices, saveServices, slugify } from "@/lib/catalog-store";
import type { HospitalService } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ services: await getServices() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const list = await getServices();
  const item: HospitalService = {
    id: slugify(body.name || `svc-${Date.now()}`),
    name: String(body.name || ""),
    nameTa: String(body.nameTa || body.name || ""),
    description: String(body.description || ""),
    descriptionTa: String(body.descriptionTa || body.description || ""),
    status: "active",
  };
  list.push(item);
  await saveServices(list);
  return NextResponse.json({ ok: true, service: item });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const list = await getServices();
  const i = list.findIndex((d) => d.id === body.id);
  if (i < 0) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (body.action === "toggle") list[i].status = list[i].status === "inactive" ? "active" : "inactive";
  else Object.assign(list[i], body, { status: body.status || list[i].status });
  await saveServices(list);
  return NextResponse.json({ ok: true, service: list[i] });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  await saveServices((await getServices()).filter((d) => d.id !== id));
  return NextResponse.json({ ok: true });
}
