import { NextResponse } from "next/server";
import { getDoctors } from "@/lib/catalog-store";
import { generateSlots, isSlotInPast } from "@/lib/slots";
import { getAppointments } from "@/lib/store";

const occupy = ["booked", "upcoming", "confirmed", "rescheduled", "arrived"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId") || "";
  const date = searchParams.get("date") || "";
  const doctors = await getDoctors();
  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor || !date) return NextResponse.json({ slots: [] });
  const all = generateSlots(doctor);
  const appts = await getAppointments();
  const taken = new Set(
    appts.filter((a) => a.doctorId === doctorId && a.date === date && occupy.includes(a.status)).map((a) => a.time)
  );
  return NextResponse.json({
    slots: all.map((time) => {
      const booked = taken.has(time) || isSlotInPast(date, time);
      return { time, status: booked ? "booked" : "available" };
    }),
  });
}
