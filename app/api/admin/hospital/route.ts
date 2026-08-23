import { NextResponse } from "next/server";
import { getHospital, saveHospital } from "@/lib/catalog-store";

export async function GET() {
  return NextResponse.json({ hospital: await getHospital() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const current = await getHospital();
  const next = { ...current, ...body };
  await saveHospital(next);
  return NextResponse.json({ hospital: next });
}
