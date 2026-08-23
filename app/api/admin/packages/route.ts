import { NextResponse } from "next/server";
import { getPackages, savePackages, slugify } from "@/lib/catalog-store";
import type { HealthPackage } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ packages: await getPackages() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const list = await getPackages();
  const item = normalize(body, slugify(body.name || `pkg-${Date.now()}`));
  list.push(item);
  await savePackages(list);
  return NextResponse.json({ ok: true, package: item });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const list = await getPackages();
  const i = list.findIndex((d) => d.id === body.id);
  if (i < 0) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (body.action === "toggle") list[i].status = list[i].status === "inactive" ? "active" : "inactive";
  else list[i] = normalize({ ...list[i], ...body }, list[i].id);
  await savePackages(list);
  return NextResponse.json({ ok: true, package: list[i] });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  await savePackages((await getPackages()).filter((d) => d.id !== id));
  return NextResponse.json({ ok: true });
}

function normalize(body: Record<string, unknown>, id: string): HealthPackage {
  const tests = Array.isArray(body.tests) ? (body.tests as string[]) : String(body.tests || "").split(",").map((s) => s.trim()).filter(Boolean);
  return {
    id,
    slug: String(body.slug || id),
    name: String(body.name || ""),
    nameTa: String(body.nameTa || body.name || ""),
    suitable: String(body.suitable || ""),
    suitableTa: String(body.suitableTa || body.suitable || ""),
    tests,
    testsTa: tests,
    price: Number(body.price || 0),
    description: String(body.description || ""),
    type: String(body.type || "General"),
    originalPrice: Number(body.originalPrice || 0),
    duration: String(body.duration || ""),
    notes: String(body.notes || ""),
    image: String(body.image || ""),
    status: body.status === "inactive" ? "inactive" : "active",
  };
}
