import { NextResponse } from "next/server";
import { getDepartments, getDoctors } from "@/lib/catalog-store";
import { buildReceiptPdf } from "@/lib/receipt";
import { getAppointments } from "@/lib/store";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  const list = await getAppointments();
  const appt = list.find((a) => a.id === id);
  if (!appt) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  const [doctors, departments] = await Promise.all([getDoctors(), getDepartments()]);
  const doctor = doctors.find((d) => d.id === appt.doctorId);
  const dept = departments.find((d) => d.id === appt.departmentId);
  const bytes = await buildReceiptPdf({
    id: appt.id,
    patientName: appt.patientName,
    phone: appt.phone,
    doctor: doctor?.name || "",
    department: dept?.name || "",
    date: appt.date,
    time: appt.time,
  });
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${appt.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
