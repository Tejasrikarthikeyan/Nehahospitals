import { NextResponse } from "next/server";
import { getNotifications, saveNotifications } from "@/lib/store";

export async function GET() {
  const list = await getNotifications();
  return NextResponse.json({ notifications: list });
}

export async function PATCH() {
  const list = await getNotifications();
  list.forEach((n) => {
    n.read = true;
  });
  await saveNotifications(list);
  return NextResponse.json({ ok: true });
}
