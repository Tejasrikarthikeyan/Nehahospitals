import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const file = path.join(process.cwd(), "data", "settings.json");

const defaults = {
  appointment_booked: true,
  appointment_rescheduled: true,
  appointment_cancelled: true,
  appointment_reminder: true,
  whatsapp_confirmation: true,
  sms_notification: true,
};

async function readSettings() {
  try {
    return { ...defaults, ...JSON.parse(await fs.readFile(file, "utf8")) };
  } catch {
    return defaults;
  }
}

export async function GET() {
  return NextResponse.json({ settings: await readSettings() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const current = await readSettings();
  const next = { ...current, ...body };
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(next, null, 2));
  return NextResponse.json({ settings: next });
}
