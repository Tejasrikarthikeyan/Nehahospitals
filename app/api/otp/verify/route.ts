import { NextResponse } from "next/server";
import { getDepartments, getDoctors } from "@/lib/catalog-store";
import { getAppointments, getOtps, saveOtps } from "@/lib/store";

function digits(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

export async function POST(req: Request) {
  const body = await req.json();
  const phone = digits(String(body.phone || ""));
  const otp = String(body.otp || "").trim();
  const list = await getOtps();
  const rec = list.find((o) => o.phone === phone);
  if (!rec || rec.otp !== otp) {
    return NextResponse.json({ code: "INVALID_OTP", error: "Invalid OTP. Please try again." }, { status: 400 });
  }
  if (Date.now() > rec.expiresAt) {
    return NextResponse.json({ code: "OTP_EXPIRED", error: "OTP has expired. Please request a new code." }, { status: 400 });
  }
  rec.verified = true;
  await saveOtps(list);

  const [doctors, departments] = await Promise.all([getDoctors(), getDepartments()]);
  const appointments = (await getAppointments())
    .filter((a) => a.phone === phone && a.status !== "cancelled")
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
    .map((a) => {
      const doctor = doctors.find((d) => d.id === a.doctorId);
      const dept = departments.find((d) => d.id === a.departmentId);
      return {
        ...a,
        doctorName: doctor?.name || "",
        doctorNameTa: doctor?.nameTa || "",
        departmentName: dept?.name || "",
        departmentNameTa: dept?.nameTa || "",
      };
    });

  return NextResponse.json({ ok: true, phone, appointments });
}
