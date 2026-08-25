import { NextResponse } from "next/server";
import { getAppointments, getDepartments, getDoctors } from "@/lib/api";
import { buildReceiptPdf } from "@/lib/receipt";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  const list = (await getAppointments()) as Record<string, unknown>[];
  const appt = (list || []).find((a) => a.id === id);
  if (!appt) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  const [doctors, departments] = await Promise.all([
    getDoctors() as Promise<Record<string, unknown>[]>,
    getDepartments() as Promise<Record<string, unknown>[]>,
  ]);
  const doctor = (doctors || []).find((d) => d.id === appt.doctorId);
  const dept = (departments || []).find((d) => d.id === appt.departmentId);
  const bytes = await buildReceiptPdf({
    id: String(appt.id || ""),
    patientName: String(appt.patientName || ""),
    phone: String(appt.phone || ""),
    doctor: String(doctor?.name || appt.doctorName || ""),
    department: String(dept?.name || appt.departmentName || ""),
    date: String(appt.date || ""),
    time: String(appt.time || ""),
  });
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${appt.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
