import { NextResponse } from "next/server";
import { getPublicCatalog } from "@/lib/catalog-store";

export async function GET() {
  return NextResponse.json(await getPublicCatalog());
}
