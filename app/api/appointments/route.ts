import { NextResponse } from "next/server";
import { getDoctors, getDepartments, getHospital } from "@/lib/catalog-store";
import { appointmentId, formatLongDate, formatTime12 } from "@/lib/slots";
import { addNotification, getAppointments, isSlotTaken, saveAppointments, withLock, type Appointment } from "@/lib/store";
import { confirmationMessage, sendWhatsAppConfirmation } from "@/lib/whatsapp";

function digits(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

function displayStatus(s: string) {
  if (s === "booked" || s === "arrived") return "upcoming";
  return s;
}

export async function GET() {
  const list = (await getAppointments()).map((a) => ({ ...a, status: displayStatus(a.status) as Appointment["status"] }));
  return NextResponse.json({ appointments: list });
}

export async function POST(req: Request) {
  return withLock(async () => {
    const body = await req.json();
    const doctors = await getDoctors();
    const departments = await getDepartments();
    const hospital = await getHospital();
    const doctor = doctors.find((d) => d.id === body.doctorId && d.status !== "inactive");
    if (!doctor) return NextResponse.json({ code: "DOCTOR_NOT_FOUND", error: "Doctor not found." }, { status: 400 });
    const date = String(body.date || "");
    const time = String(body.time || "");
    const phone = digits(String(body.phone || ""));
    const patientName = String(body.patientName || "").trim();
    if (!date || !time || phone.length !== 10 || !patientName) {
      return NextResponse.json({ code: "REQUIRED_FIELDS", error: "Please complete all required fields." }, { status: 400 });
    }
    if (await isSlotTaken(doctor.id, date, time)) {
      return NextResponse.json({ code: "SLOT_TAKEN", error: "This time slot has just been booked. Please choose another." }, { status: 409 });
    }
    const dept = departments.find((d) => d.id === doctor.departmentId);
    const list = await getAppointments();
    const firstForPhone = !list.some((a) => a.phone === phone);
    const appt: Appointment = {
      id: appointmentId(),
      doctorId: doctor.id,
      departmentId: doctor.departmentId,
      date,
      time,
      patientName,
      age: String(body.age || ""),
      gender: String(body.gender || ""),
      phone,
      email: body.email ? String(body.email) : "",
      reason: body.reason ? String(body.reason) : "",
      status: "upcoming",
      createdAt: new Date().toISOString(),
      whatsappSent: false,
    };
    list.push(appt);
    await saveAppointments(list);

    const message = confirmationMessage({
      patientName,
      doctor: doctor.name,
      department: dept?.name || "",
      date: formatLongDate(date),
      time: formatTime12(time),
      id: appt.id,
    });
    const wa = await sendWhatsAppConfirmation(phone, message);
    appt.whatsappSent = wa.delivered || wa.method === "whatsapp_link";
    await saveAppointments(list);

    await addNotification({
      type: "appointment_booked",
      title: "New appointment booked",
      body: `${patientName} · ${doctor.name} · ${date} ${formatTime12(time)} · ${appt.id}`,
      phone,
      href: "appointments",
    });
    if (firstForPhone) {
      await addNotification({
        type: "patient_registered",
        title: "New patient registered",
        body: `${patientName} · +91 ${phone}`,
        phone,
        href: "patients",
      });
    }
    await addNotification({
      type: "whatsapp_confirmation",
      title: wa.delivered ? "WhatsApp confirmation delivered" : "WhatsApp confirmation queued",
      body: `Confirmation for ${appt.id} to +91 ${phone}`,
      phone,
      href: "appointments",
    });

    return NextResponse.json({
      ok: true,
      appointment: appt,
      doctor: doctor.name,
      doctorTa: doctor.nameTa,
      department: dept?.name,
      departmentTa: dept?.nameTa,
      hospital: hospital.name,
      patientName,
      phone,
      whatsappSent: true,
      whatsappDelivered: wa.delivered,
      waUrl: wa.waUrl,
      message: wa.message,
      whatsappTo: `+91 ${phone}`,
    });
  });
}

export async function PATCH(req: Request) {
  return withLock(async () => {
    const body = await req.json();
    const list = await getAppointments();
    const appt = list.find((a) => a.id === body.id);
    if (!appt) return NextResponse.json({ code: "APPT_NOT_FOUND", error: "Appointment not found." }, { status: 404 });
    const doctors = await getDoctors();
    const departments = await getDepartments();
    const doctor = doctors.find((d) => d.id === appt.doctorId);
    const dept = departments.find((d) => d.id === appt.departmentId);

    if (body.action === "cancel") {
      appt.status = "cancelled";
      appt.cancelReason = String(body.reason || "");
      await addNotification({
        type: "appointment_cancelled",
        title: "Appointment cancelled",
        body: `${appt.id} cancelled${appt.cancelReason ? ` · ${appt.cancelReason}` : ""}.`,
        phone: appt.phone,
        href: "appointments",
      });
      await sendWhatsAppConfirmation(
        appt.phone,
        `Dear ${appt.patientName},\n\nYour appointment ${appt.id} at Neha Hospitals has been cancelled.\nDoctor: ${doctor?.name || ""}\nDate: ${formatLongDate(appt.date)}\nTime: ${formatTime12(appt.time)}\n${appt.cancelReason ? `Reason: ${appt.cancelReason}\n` : ""}\nPlease call the hospital to rebook.\n\nThank you for choosing Neha Hospitals.`
      );
    } else if (body.action === "confirm") {
      appt.status = "confirmed";
    } else if (body.action === "arrived") {
      appt.status = "confirmed";
    } else if (body.action === "complete") {
      appt.status = "completed";
      appt.completedAt = new Date().toISOString();
      await addNotification({
        type: "appointment_completed",
        title: "Appointment completed",
        body: `${appt.id} completed.`,
        phone: appt.phone,
        href: "appointments",
      });
    } else if (body.action === "reschedule") {
      const doctorId = String(body.doctorId || appt.doctorId);
      const date = String(body.date || "");
      const time = String(body.time || "");
      if (await isSlotTaken(doctorId, date, time, appt.id)) {
        return NextResponse.json({ code: "SLOT_UNAVAILABLE", error: "That slot is unavailable." }, { status: 409 });
      }
      const nextDoc = doctors.find((d) => d.id === doctorId) || doctor;
      appt.doctorId = doctorId;
      appt.departmentId = nextDoc?.departmentId || appt.departmentId;
      appt.date = date;
      appt.time = time;
      appt.status = "rescheduled";
      await addNotification({
        type: "appointment_rescheduled",
        title: "Appointment rescheduled",
        body: `${appt.id} moved to ${date} ${formatTime12(time)}.`,
        phone: appt.phone,
        href: "appointments",
      });
      await sendWhatsAppConfirmation(
        appt.phone,
        `Dear ${appt.patientName},\n\nYour appointment at Neha Hospitals has been rescheduled.\n\nDoctor: ${nextDoc?.name || ""}\nDepartment: ${departments.find((d) => d.id === appt.departmentId)?.name || dept?.name || ""}\nDate: ${formatLongDate(date)}\nTime: ${formatTime12(time)}\nAppointment ID: ${appt.id}\n\nPlease arrive 10–15 minutes before your appointment.\n\nThank you for choosing Neha Hospitals.`
      );
    }
    await saveAppointments(list);
    return NextResponse.json({ ok: true, appointment: { ...appt, status: displayStatus(appt.status) } });
  });
}
