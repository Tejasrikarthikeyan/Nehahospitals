"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HOSPITAL } from "@/lib/data";
import type { Department, Doctor, HealthPackage, HospitalService } from "@/lib/data";
import { DAY_NAMES } from "@/lib/i18n";
import { formatTime12, generateSlots, localYMD, upcomingDates, displayLocale } from "@/lib/slots";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/components/LanguageProvider";
import type { Appointment } from "@/lib/types";

const CODE = "NEHA2026";
const occupy = ["booked", "upcoming", "confirmed", "rescheduled", "arrived"];

type Tab =
  | "dash"
  | "appointments"
  | "doctors"
  | "departments"
  | "patients"
  | "services"
  | "packages"
  | "reports"
  | "notifications"
  | "settings";

type Note = { id: string; title: string; body: string; createdAt: string; type: string; read?: boolean; href?: string };

export default function AdminPage() {
  const { t, lang, setLang } = useI18n();
  const A = t.admin;
  const loc = displayLocale(lang);

  function settingLabel(k: string) {
    const map: Record<string, string> = {
      appointment_booked: A.settingAppointmentBooked,
      appointment_rescheduled: A.settingAppointmentRescheduled,
      appointment_cancelled: A.settingAppointmentCancelled,
      appointment_reminder: A.settingAppointmentReminder,
      whatsapp_confirmation: A.settingWhatsappConfirmation,
      sms_notification: A.settingSmsNotification,
    };
    return map[k] ?? A.notifySettings;
  }

  function noteTitle(type: string) {
    const map: Record<string, string> = {
      appointment_booked: A.nBooked,
      appointment_rescheduled: A.nRescheduled,
      appointment_cancelled: A.nCancelled,
      appointment_completed: A.nCompleted,
      patient_registered: A.nRegistered,
      whatsapp_confirmation: A.nWhatsapp,
      doctor_added: A.nDoctorAdded,
      department_added: A.nDeptAdded,
      otp: A.nOtp,
    };
    return map[type] ?? A.notifications;
  }
  const [authed, setAuthed] = useState(false);
  const [code, setCode] = useState("");
  const [tab, setTab] = useState<Tab>("dash");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<Record<string, boolean | number | string>>({});
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<HospitalService[]>([]);
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [hospital, setHospital] = useState(HOSPITAL);
  const [q, setQ] = useState("");
  const [fDoc, setFDoc] = useState("");
  const [fDept, setFDept] = useState("");
  const [fDate, setFDate] = useState("");
  const [reschedule, setReschedule] = useState<Appointment | null>(null);
  const [newDoctorId, setNewDoctorId] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rsSlots, setRsSlots] = useState<{ time: string; status: string }[]>([]);
  const [timelineDoc, setTimelineDoc] = useState("");
  const [timelineDate, setTimelineDate] = useState(localYMD());
  const [formOpen, setFormOpen] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [cancelAppt, setCancelAppt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState("Doctor unavailable");
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [patientPhone, setPatientPhone] = useState<string | null>(null);
  const [reportFilter, setReportFilter] = useState<string | null>(null);
  const [flashId, setFlashId] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("nh-staff") === "1") setAuthed(true);
  }, []);

  async function load() {
    const [a, n, s, c, h] = await Promise.all([
      fetch("/api/appointments").then((r) => r.json()),
      fetch("/api/notifications").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/admin/doctors").then((r) => r.json()).catch(() => ({})),
      fetch("/api/admin/hospital").then((r) => r.json()).catch(() => ({})),
    ]);
    const [dpt, svc, pkg] = await Promise.all([
      fetch("/api/admin/departments").then((r) => r.json()),
      fetch("/api/admin/services").then((r) => r.json()),
      fetch("/api/admin/packages").then((r) => r.json()),
    ]);
    setAppointments(a.appointments || []);
    setNotes(n.notifications || []);
    setSettings(s.settings || {});
    setDoctors(c.doctors || []);
    setDepartments(dpt.departments || []);
    setServices(svc.services || []);
    setPackages(pkg.packages || []);
    if (h.hospital) setHospital({ ...HOSPITAL, ...h.hospital });
    if (!timelineDoc && (c.doctors || [])[0]) setTimelineDoc(c.doctors[0].id);
  }

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  useEffect(() => {
    if (!reschedule) return;
    const docId = newDoctorId || reschedule.doctorId;
    if (!newDate || !docId) return;
    fetch(`/api/slots?doctorId=${docId}&date=${newDate}`)
      .then((r) => r.json())
      .then((d) => setRsSlots(d.slots || []));
  }, [reschedule, newDoctorId, newDate]);

  const today = localYMD();
  function norm(s: Appointment["status"]): Appointment["status"] {
    if (s === "booked" || s === "arrived") return "upcoming";
    return s;
  }
  const live: Appointment[] = appointments.map((a) => ({ ...a, status: norm(a.status) }));
  const todays = live.filter((a) => a.date === today && a.status !== "cancelled");
  const completed = live.filter((a) => a.status === "completed");
  const cancelled = live.filter((a) => a.status === "cancelled");
  const upcoming = live.filter((a) => a.status === "upcoming" || a.status === "confirmed" || a.status === "rescheduled");
  const pending = live.filter((a) => a.status === "upcoming" || a.status === "rescheduled");

  const availableToday = useMemo(() => {
    let n = 0;
    for (const d of doctors) {
      const slots = generateSlots(d);
      const taken = new Set(live.filter((a) => a.doctorId === d.id && a.date === today && occupy.includes(a.status)).map((a) => a.time));
      n += slots.filter((s) => !taken.has(s)).length;
    }
    return n;
  }, [doctors, live, today]);

  const weekStart = (() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return localYMD(d);
  })();
  const monthPrefix = today.slice(0, 7);
  const thisWeek = live.filter((a) => a.date >= weekStart && a.status !== "cancelled");
  const thisMonth = live.filter((a) => a.date.startsWith(monthPrefix));

  const filtered = live.filter((a) => {
    if (q && !a.patientName.toLowerCase().includes(q.toLowerCase()) && !a.phone.includes(q) && !a.id.toLowerCase().includes(q.toLowerCase())) return false;
    if (fDoc && a.doctorId !== fDoc) return false;
    if (fDept && a.departmentId !== fDept) return false;
    if (fDate && a.date !== fDate) return false;
    return true;
  });

  const patients = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of live) {
      const arr = map.get(a.phone) || [];
      arr.push(a);
      map.set(a.phone, arr);
    }
    return [...map.entries()].map(([phone, list]) => {
      const sorted = [...list].sort((x, y) => `${y.date}${y.time}`.localeCompare(`${x.date}${x.time}`));
      return {
        phone,
        name: sorted[0].patientName,
        age: sorted[0].age,
        gender: sorted[0].gender,
        total: list.length,
        completed: list.filter((x) => x.status === "completed").length,
        upcoming: list.filter((x) => x.status === "upcoming" || x.status === "confirmed" || x.status === "rescheduled").length,
        cancelled: list.filter((x) => x.status === "cancelled").length,
        last: sorted[0],
        status: list.some((x) => x.status === "upcoming" || x.status === "confirmed") ? A.active : A.inactive,
        list: sorted,
      };
    });
  }, [live, A.active, A.inactive]);

  async function act(id: string, action: string, extra?: object) {
    const res = await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, ...extra }),
    });
    if (action === "complete") {
      setFlashId(id);
      setTimeout(() => setFlashId(""), 1200);
    }
    await load();
    setReschedule(null);
    setCancelAppt(null);
    if (detail?.id === id) {
      const data = await res.json();
      setDetail(data.appointment || null);
    }
  }

  function statusLabel(s: string) {
    const x = norm(s as Appointment["status"]);
    if (x === "upcoming") return A.upcoming;
    if (x === "confirmed") return A.confirmed;
    if (x === "completed") return A.completedShort;
    if (x === "cancelled") return A.cancelledShort;
    if (x === "rescheduled") return A.rescheduled;
    return x;
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <form
          className="w-full max-w-md border border-line bg-white p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (code === CODE) {
              sessionStorage.setItem("nh-staff", "1");
              setAuthed(true);
            }
          }}
        >
          <Logo />
          <h1 className="mt-6 font-serif text-2xl text-navy">{A.gate}</h1>
          <p className="mt-2 text-sm text-muted">{A.gateHint}</p>
          <input className="mt-6 h-11 w-full border border-line px-3 text-sm" placeholder={A.code} value={code} onChange={(e) => setCode(e.target.value)} />
          <button className="mt-4 h-11 w-full bg-navy text-sm font-semibold text-white">{A.enter}</button>
          <p className="mt-4 text-xs text-muted">{A.accessNote}</p>
          <Link href="/" className="mt-6 inline-block text-sm text-teal">
            ← Neha Hospitals
          </Link>
        </form>
      </div>
    );
  }

  const nav: { id: Tab; label: string }[] = [
    { id: "dash", label: A.dash },
    { id: "appointments", label: A.appointments },
    { id: "doctors", label: A.doctors },
    { id: "departments", label: A.departments },
    { id: "patients", label: A.patients },
    { id: "services", label: A.services },
    { id: "packages", label: A.packages },
    { id: "reports", label: A.reports },
    { id: "notifications", label: A.notifications },
    { id: "settings", label: A.settings },
  ];

  const tlDoctor = doctors.find((d) => d.id === timelineDoc) || doctors[0];
  const tlSlots = tlDoctor ? generateSlots(tlDoctor) : [];
  const tlTaken = new Map(live.filter((a) => a.doctorId === tlDoctor?.id && a.date === timelineDate && occupy.includes(a.status)).map((a) => [a.time, a]));

  const rsDoctor = doctors.find((d) => d.id === (newDoctorId || reschedule?.doctorId));

  function reportList() {
    if (reportFilter === "total") return live;
    if (reportFilter === "completed") return completed;
    if (reportFilter === "upcoming") return pending;
    if (reportFilter === "cancelled") return cancelled;
    if (reportFilter === "today") return todays;
    if (reportFilter === "week") return thisWeek;
    if (reportFilter === "month") return thisMonth;
    return [];
  }

  const inp = "h-10 w-full border border-line px-3 text-sm";

  return (
    <div className="min-h-screen bg-[#f3f6f9] text-ink">
      <div className="grid min-h-screen lg:grid-cols-[220px_1fr]">
        {navOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-navy-deep/40 lg:hidden"
            aria-label={t.common.menu}
            onClick={() => setNavOpen(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[min(220px,85vw)] overflow-y-auto bg-navy-deep text-white transition-transform lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${navOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="border-b border-white/10 px-5 py-5">
            <div className="brightness-0 invert">
              <Logo compact />
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-white/50">{A.title}</p>
          </div>
          <nav className="p-3">
            {nav.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  setTab(n.id);
                  setFormOpen(null);
                  setReportFilter(null);
                  setPatientPhone(null);
                  setNavOpen(false);
                }}
                className={`mb-0.5 block w-full px-3 py-2.5 text-left text-sm ${tab === n.id ? "bg-white/10 text-white" : "text-white/70 hover:text-white"}`}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="space-y-2 px-5 py-4 text-xs text-white/50">
            <Link href="/" className="block text-white/70 hover:text-white">
              {A.publicSite}
            </Link>
            <button type="button" onClick={() => { sessionStorage.removeItem("nh-staff"); setAuthed(false); }}>
              {A.logout}
            </button>
          </div>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-line bg-white px-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-line lg:hidden"
                aria-expanded={navOpen}
                onClick={() => setNavOpen(true)}
              >
                <span className="sr-only">{t.common.menu}</span>
                <span className="flex flex-col gap-1.5">
                  <span className="block h-px w-5 bg-navy" />
                  <span className="block h-px w-5 bg-navy" />
                  <span className="block h-px w-5 bg-navy" />
                </span>
              </button>
              <p className="truncate text-sm text-muted">{hospital.address || HOSPITAL.address}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-sm font-semibold sm:gap-4">
              <button type="button" onClick={() => setLang("en")} className={`min-h-10 ${lang === "en" ? "text-navy" : "text-muted"}`}>English</button>
              <span className="text-line">|</span>
              <button type="button" onClick={() => setLang("ta")} className={`min-h-10 ${lang === "ta" ? "text-navy" : "text-muted"}`}>தமிழ்</button>
            </div>
          </header>
          <div className="p-4 sm:p-6">
            {tab === "dash" && (
              <div>
                <h1 className="font-serif text-3xl text-navy">{A.dash}</h1>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Metric label={A.today} value={todays.length} />
                  <Metric label={A.upcoming} value={upcoming.length} />
                  <Metric label={A.pending} value={pending.length} />
                  <Metric label={A.slots} value={availableToday} />
                  <Metric label={A.completed} value={completed.length} />
                  <Metric label={A.cancelled} value={cancelled.length} />
                </div>
                <h2 className="mt-10 font-serif text-xl text-navy">{A.timeline}</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  <select className="h-10 border border-line bg-white px-3 text-sm" value={timelineDoc} onChange={(e) => setTimelineDoc(e.target.value)}>
                    {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <input type="date" className="h-10 border border-line px-3 text-sm" value={timelineDate} onChange={(e) => setTimelineDate(e.target.value)} />
                </div>
                <ol className="mt-4 divide-y divide-line border-y border-line bg-white">
                  {tlSlots.map((s) => {
                    const a = tlTaken.get(s);
                    return (
                      <li key={s} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="font-medium text-navy">{formatTime12(s, lang)}</span>
                        {a ? <span>{a.patientName} · {a.id} · {statusLabel(a.status)}</span> : <span className="text-teal">{A.available}</span>}
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {tab === "appointments" && (
              <div>
                <h1 className="font-serif text-3xl text-navy">{A.appointments}</h1>
                <div className="mt-4 grid gap-2 md:grid-cols-4">
                  <input className="h-10 border border-line px-3 text-sm" placeholder={A.search} value={q} onChange={(e) => setQ(e.target.value)} />
                  <select className="h-10 border border-line px-3 text-sm" value={fDoc} onChange={(e) => setFDoc(e.target.value)}>
                    <option value="">{A.filterDoc}</option>
                    {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <select className="h-10 border border-line px-3 text-sm" value={fDept} onChange={(e) => setFDept(e.target.value)}>
                    <option value="">{A.filterDept}</option>
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <input type="date" className="h-10 border border-line px-3 text-sm" value={fDate} onChange={(e) => setFDate(e.target.value)} />
                </div>
                <ApptTable
                  rows={filtered}
                  doctors={doctors}
                  A={A}
                  lang={lang}
                  statusLabel={statusLabel}
                  flashId={flashId}
                  onRow={setDetail}
                  onAction={(a, action) => {
                    if (action === "reschedule") {
                      setReschedule(a);
                      setNewDoctorId(a.doctorId);
                      setNewDate(a.date);
                      setNewTime(a.time);
                    } else if (action === "cancel") setCancelAppt(a);
                    else act(a.id, action);
                  }}
                />
                {detail && (
                  <div className="mt-6 border border-line bg-white p-4">
                    <p className="font-medium text-navy">{A.details} {detail.id}</p>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div>{A.patient}: {detail.patientName}</div>
                      <div>{A.phone}: +91 {detail.phone}</div>
                      <div>{A.doctors}: {doctors.find((d) => d.id === detail.doctorId)?.name}</div>
                      <div>{A.department}: {departments.find((d) => d.id === detail.departmentId)?.name}</div>
                      <div>{A.filterDate}: {detail.date} {formatTime12(detail.time, lang)}</div>
                      <div>{A.status}: {statusLabel(detail.status)}</div>
                      <div>{A.bookingDate}: {new Date(detail.createdAt).toLocaleString(loc)}</div>
                      {detail.completedAt && <div>{A.completedAt}: {new Date(detail.completedAt).toLocaleString(loc)}</div>}
                    </dl>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button className="text-xs font-semibold text-teal" onClick={() => act(detail.id, "complete")}>{A.markComplete}</button>
                      <button className="text-xs font-semibold text-navy" onClick={() => { setReschedule(detail); setNewDoctorId(detail.doctorId); setNewDate(detail.date); setNewTime(detail.time); }}>{A.reschedule}</button>
                      <button className="text-xs font-semibold text-emergency" onClick={() => setCancelAppt(detail)}>{A.cancel}</button>
                      <button className="text-xs font-semibold text-muted" onClick={() => setDetail(null)}>{A.close}</button>
                    </div>
                  </div>
                )}
                {cancelAppt && (
                  <div className="mt-6 border border-line bg-white p-4">
                    <p className="font-medium text-navy">{A.confirmCancel}</p>
                    <select className="mt-3 h-10 border border-line px-3 text-sm" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
                      <option>{A.reasonDoctor}</option>
                      <option>{A.reasonSchedule}</option>
                      <option>{A.reasonEmergency}</option>
                      <option>{A.reasonOther}</option>
                    </select>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button className="h-10 bg-navy px-4 text-sm font-semibold text-white" onClick={() => act(cancelAppt.id, "cancel", { reason: cancelReason })}>{A.yesCancel}</button>
                      <button className="h-10 border border-line px-4 text-sm" onClick={() => setCancelAppt(null)}>{A.close}</button>
                    </div>
                  </div>
                )}
                {reschedule && rsDoctor && (
                  <div className="mt-6 border border-line bg-white p-4">
                    <p className="font-medium text-navy">{A.reschedule} {reschedule.id}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <select className="h-10 border border-line px-3 text-sm" value={newDoctorId} onChange={(e) => setNewDoctorId(e.target.value)}>
                        {doctors.filter((d) => d.status !== "inactive").map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                      <select className="h-10 border border-line px-3 text-sm" value={newDate} onChange={(e) => setNewDate(e.target.value)}>
                        {upcomingDates(rsDoctor).map((d) => <option key={d}>{d}</option>)}
                      </select>
                      <select className="h-10 border border-line px-3 text-sm" value={newTime} onChange={(e) => setNewTime(e.target.value)}>
                        {rsSlots.filter((s) => s.status === "available" || s.time === reschedule.time).map((s) => (
                          <option key={s.time} value={s.time}>{formatTime12(s.time, lang)}</option>
                        ))}
                      </select>
                      <button className="h-10 bg-navy px-4 text-sm font-semibold text-white" onClick={() => act(reschedule.id, "reschedule", { doctorId: newDoctorId, date: newDate, time: newTime })}>{A.save}</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "doctors" && (
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="font-serif text-3xl text-navy">{A.doctors}</h1>
                  <button className="h-10 bg-navy px-4 text-sm font-semibold text-white" onClick={() => { setFormOpen("doctor"); setEditing({ start: "09:00", end: "13:00", lunchStart: "13:00", lunchEnd: "14:00", eveningStart: "16:00", eveningEnd: "19:00", days: "1,2,3,4,5,6", status: "active" }); }}>{A.addDoctor}</button>
                </div>
                <ul className="mt-6 divide-y divide-line border-y border-line bg-white">
                  {doctors.map((d) => (
                    <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm text-navy">
                      <span>{d.name} · {d.speciality} · {d.experience} {A.experience} · {formatTime12(d.start, lang)}–{formatTime12(d.end, lang)} · {d.status === "inactive" ? A.inactive : A.active}</span>
                      <span className="flex flex-wrap gap-3">
                        <button className="text-xs font-semibold text-navy" onClick={() => { setFormOpen("doctor"); setEditing({ name: d.name, id: d.id, slug: d.slug, photo: d.photo, qualifications: d.qualifications, speciality: d.speciality, departmentId: d.departmentId, experience: String(d.experience), registration: d.registration || "", fee: String(d.fee || ""), expertise: (d.expertise || []).join(", "), start: d.start, end: d.end, lunchStart: d.lunchStart, lunchEnd: d.lunchEnd, eveningStart: d.eveningStart || "", eveningEnd: d.eveningEnd || "", days: d.days.join(","), bio: d.bio, status: d.status || "active" }); }}>{A.edit}</button>
                        <button className="text-xs font-semibold text-navy" onClick={async () => { await fetch("/api/admin/doctors", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: d.id, action: "toggle" }) }); load(); }}>{A.toggle}</button>
                        <button className="text-xs font-semibold text-emergency" onClick={async () => { await fetch(`/api/admin/doctors?id=${d.id}`, { method: "DELETE" }); load(); }}>{A.del}</button>
                      </span>
                    </li>
                  ))}
                </ul>
                {formOpen === "doctor" && (
                  <form className="mt-6 grid gap-3 border border-line bg-white p-4 sm:grid-cols-2" onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch("/api/admin/doctors", { method: editing.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
                    setFormOpen(null);
                    load();
                  }}>
                    <input className={inp} placeholder={A.name} value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                    <input className={inp} placeholder={A.photo} value={editing.photo || ""} onChange={(e) => setEditing({ ...editing, photo: e.target.value })} />
                    <input className={inp} placeholder={A.qualification} value={editing.qualifications || ""} onChange={(e) => setEditing({ ...editing, qualifications: e.target.value })} />
                    <input className={inp} placeholder={A.speciality} value={editing.speciality || ""} onChange={(e) => setEditing({ ...editing, speciality: e.target.value })} />
                    <select className={inp} value={editing.departmentId || ""} onChange={(e) => setEditing({ ...editing, departmentId: e.target.value })}>
                      <option value="">{A.department}</option>
                      {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input className={inp} placeholder={A.experience} value={editing.experience || ""} onChange={(e) => setEditing({ ...editing, experience: e.target.value })} />
                    <input className={inp} placeholder={A.registration} value={editing.registration || ""} onChange={(e) => setEditing({ ...editing, registration: e.target.value })} />
                    <input className={inp} placeholder={A.fee} value={editing.fee || ""} onChange={(e) => setEditing({ ...editing, fee: e.target.value })} />
                    <input className={`${inp} sm:col-span-2`} placeholder={A.expertise} value={editing.expertise || ""} onChange={(e) => setEditing({ ...editing, expertise: e.target.value })} />
                    <input type="time" className={inp} value={editing.start || "09:00"} onChange={(e) => setEditing({ ...editing, start: e.target.value })} />
                    <input type="time" className={inp} value={editing.end || "13:00"} onChange={(e) => setEditing({ ...editing, end: e.target.value })} />
                    <input type="time" className={inp} value={editing.lunchStart || "13:00"} onChange={(e) => setEditing({ ...editing, lunchStart: e.target.value })} />
                    <input type="time" className={inp} value={editing.lunchEnd || "14:00"} onChange={(e) => setEditing({ ...editing, lunchEnd: e.target.value })} />
                    <input type="time" className={inp} value={editing.eveningStart || ""} onChange={(e) => setEditing({ ...editing, eveningStart: e.target.value })} />
                    <input type="time" className={inp} value={editing.eveningEnd || ""} onChange={(e) => setEditing({ ...editing, eveningEnd: e.target.value })} />
                    <div className="sm:col-span-2 flex flex-wrap gap-3 text-sm">
                      {DAY_NAMES[lang].map((day, i) => (
                        <label key={day} className="flex items-center gap-1">
                          <input type="checkbox" checked={String(editing.days || "").split(",").includes(String(i))} onChange={(e) => {
                            const set = new Set(String(editing.days || "").split(",").filter(Boolean));
                            if (e.target.checked) set.add(String(i)); else set.delete(String(i));
                            setEditing({ ...editing, days: [...set].join(",") });
                          }} />
                          {day}
                        </label>
                      ))}
                    </div>
                    <textarea className="min-h-20 border border-line px-3 py-2 text-sm sm:col-span-2" placeholder={A.bio} value={editing.bio || ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
                    <select className={inp} value={editing.status || "active"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                      <option value="active">{A.active}</option>
                      <option value="inactive">{A.inactive}</option>
                    </select>
                    <div className="flex gap-2">
                      <button className="h-10 bg-navy px-4 text-sm font-semibold text-white">{A.save}</button>
                      <button type="button" className="h-10 border border-line px-4 text-sm" onClick={() => setFormOpen(null)}>{A.close}</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {tab === "departments" && (
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="font-serif text-3xl text-navy">{A.departments}</h1>
                  <button className="h-10 bg-navy px-4 text-sm font-semibold text-white" onClick={() => { setFormOpen("dept"); setEditing({ status: "active" }); }}>{A.addDept}</button>
                </div>
                <ul className="mt-6 divide-y divide-line border-y border-line bg-white">
                  {departments.map((d) => (
                    <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm text-navy">
                      <span>{d.name} · {d.opd} · {doctors.filter((x) => x.departmentId === d.id).length} · {d.status === "inactive" ? A.inactive : A.active}</span>
                      <span className="flex flex-wrap gap-3">
                        <button className="text-xs font-semibold text-navy" onClick={() => { setFormOpen("dept"); setEditing(d as unknown as Record<string, string>); }}>{A.edit}</button>
                        <button className="text-xs font-semibold text-navy" onClick={async () => { await fetch("/api/admin/departments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: d.id, action: "toggle" }) }); load(); }}>{A.toggle}</button>
                        <button className="text-xs font-semibold text-emergency" onClick={async () => { await fetch(`/api/admin/departments?id=${d.id}`, { method: "DELETE" }); load(); }}>{A.del}</button>
                      </span>
                    </li>
                  ))}
                </ul>
                {formOpen === "dept" && (
                  <form className="mt-6 grid gap-3 border border-line bg-white p-4 sm:grid-cols-2" onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch("/api/admin/departments", { method: editing.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
                    setFormOpen(null);
                    load();
                  }}>
                    <input className={inp} placeholder={A.name} required value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                    <input className={inp} placeholder={A.hod} value={editing.hod || ""} onChange={(e) => setEditing({ ...editing, hod: e.target.value })} />
                    <input className={inp} placeholder={A.opd} value={editing.opd || ""} onChange={(e) => setEditing({ ...editing, opd: e.target.value })} />
                    <input className={inp} placeholder={A.image} value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
                    <textarea className="min-h-20 border border-line px-3 py-2 text-sm sm:col-span-2" placeholder={A.description} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                    <select className={inp} value={editing.status || "active"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                      <option value="active">{A.active}</option>
                      <option value="inactive">{A.inactive}</option>
                    </select>
                    <div className="flex gap-2">
                      <button className="h-10 bg-navy px-4 text-sm font-semibold text-white">{A.save}</button>
                      <button type="button" className="h-10 border border-line px-4 text-sm" onClick={() => setFormOpen(null)}>{A.close}</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {tab === "patients" && (
              <div>
                <h1 className="font-serif text-3xl text-navy">{A.patients}</h1>
                <div className="mt-4 overflow-x-auto bg-white">
                  <table className="w-full min-w-[860px] text-left text-sm">
                    <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                      <tr>
                        <th className="px-3 py-3">{A.patient}</th>
                        <th className="px-3 py-3">{A.phone}</th>
                        <th className="px-3 py-3">{A.age}</th>
                        <th className="px-3 py-3">{A.gender}</th>
                        <th className="px-3 py-3">{A.total}</th>
                        <th className="px-3 py-3">{A.completedShort}</th>
                        <th className="px-3 py-3">{A.upcoming}</th>
                        <th className="px-3 py-3">{A.cancelledShort}</th>
                        <th className="px-3 py-3">{A.lastVisit}</th>
                        <th className="px-3 py-3">{A.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((p) => (
                        <tr key={p.phone} className="cursor-pointer border-b border-line" onClick={() => setPatientPhone(p.phone)}>
                          <td className="px-3 py-3 font-medium">{p.name}</td>
                          <td className="px-3 py-3">+91 {p.phone}</td>
                          <td className="px-3 py-3">{p.age}</td>
                          <td className="px-3 py-3">{p.gender}</td>
                          <td className="px-3 py-3">{p.total}</td>
                          <td className="px-3 py-3">{p.completed}</td>
                          <td className="px-3 py-3">{p.upcoming}</td>
                          <td className="px-3 py-3">{p.cancelled}</td>
                          <td className="px-3 py-3">{p.last.date}</td>
                          <td className="px-3 py-3">{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {patientPhone && (
                  <div className="mt-6">
                    <p className="font-medium text-navy">{A.history}</p>
                    <ApptTable rows={patients.find((p) => p.phone === patientPhone)?.list || []} doctors={doctors} A={A} lang={lang} statusLabel={statusLabel} flashId="" onRow={setDetail} onAction={() => undefined} />
                  </div>
                )}
              </div>
            )}

            {tab === "services" && (
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="font-serif text-3xl text-navy">{A.services}</h1>
                  <button className="h-10 bg-navy px-4 text-sm font-semibold text-white" onClick={() => { setFormOpen("svc"); setEditing({ status: "active" }); }}>{A.addService}</button>
                </div>
                <ul className="mt-6 divide-y divide-line border-y border-line bg-white">
                  {services.map((s) => (
                    <li key={s.id} className="grid gap-1 px-4 py-4 sm:grid-cols-[240px_1fr_auto] sm:items-center">
                      <p className="text-sm font-medium text-navy">{lang === "ta" ? s.nameTa : s.name}</p>
                      <p className="text-sm text-muted">{lang === "ta" ? s.descriptionTa : s.description}</p>
                      <span className="flex items-center gap-3 text-xs font-semibold">
                        <span className="text-muted">{s.status === "inactive" ? A.inactive : A.active}</span>
                        <button className="text-navy" onClick={() => { setFormOpen("svc"); setEditing(s as unknown as Record<string, string>); }}>{A.edit}</button>
                        <button className="text-navy" onClick={async () => { await fetch("/api/admin/services", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: s.id, action: "toggle" }) }); load(); }}>{A.toggle}</button>
                        <button className="text-emergency" onClick={async () => { await fetch(`/api/admin/services?id=${s.id}`, { method: "DELETE" }); load(); }}>{A.del}</button>
                      </span>
                    </li>
                  ))}
                </ul>
                {formOpen === "svc" && (
                  <form className="mt-6 grid gap-3 border border-line bg-white p-4" onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch("/api/admin/services", { method: editing.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
                    setFormOpen(null);
                    load();
                  }}>
                    <input className={inp} placeholder={A.name} required value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                    <textarea className="min-h-20 border border-line px-3 py-2 text-sm" placeholder={A.description} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                    <button className="h-10 w-fit bg-navy px-4 text-sm font-semibold text-white">{A.save}</button>
                  </form>
                )}
              </div>
            )}

            {tab === "packages" && (
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="font-serif text-3xl text-navy">{A.packages}</h1>
                  <button className="h-10 bg-navy px-4 text-sm font-semibold text-white" onClick={() => { setFormOpen("pkg"); setEditing({ status: "active" }); }}>{A.addPackage}</button>
                </div>
                <ul className="mt-6 divide-y divide-line border-y border-line bg-white">
                  {packages.map((p) => (
                    <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm text-navy">
                      <span>{p.name} · ₹{p.price} · {p.status === "inactive" ? A.inactive : A.active}</span>
                      <span className="flex flex-wrap gap-3">
                        <button className="text-xs font-semibold text-navy" onClick={() => { setFormOpen("pkg"); setEditing({ ...p, tests: (p.tests || []).join(", ") } as unknown as Record<string, string>); }}>{A.edit}</button>
                        <button className="text-xs font-semibold text-navy" onClick={async () => { await fetch("/api/admin/packages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, action: "toggle" }) }); load(); }}>{A.toggle}</button>
                        <button className="text-xs font-semibold text-emergency" onClick={async () => { await fetch(`/api/admin/packages?id=${p.id}`, { method: "DELETE" }); load(); }}>{A.del}</button>
                      </span>
                    </li>
                  ))}
                </ul>
                {formOpen === "pkg" && (
                  <form className="mt-6 grid gap-3 border border-line bg-white p-4 sm:grid-cols-2" onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch("/api/admin/packages", { method: editing.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
                    setFormOpen(null);
                    load();
                  }}>
                    <input className={inp} placeholder={A.name} required value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                    <input className={inp} placeholder={A.type} value={editing.type || ""} onChange={(e) => setEditing({ ...editing, type: e.target.value })} />
                    <input className={inp} placeholder={A.price} value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
                    <input className={inp} placeholder={A.originalPrice} value={editing.originalPrice || ""} onChange={(e) => setEditing({ ...editing, originalPrice: e.target.value })} />
                    <input className={inp} placeholder={A.suitable} value={editing.suitable || ""} onChange={(e) => setEditing({ ...editing, suitable: e.target.value })} />
                    <input className={inp} placeholder={A.duration} value={editing.duration || ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} />
                    <input className={`${inp} sm:col-span-2`} placeholder={A.tests} value={editing.tests || ""} onChange={(e) => setEditing({ ...editing, tests: e.target.value })} />
                    <textarea className="min-h-16 border border-line px-3 py-2 text-sm sm:col-span-2" placeholder={A.description} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                    <textarea className="min-h-16 border border-line px-3 py-2 text-sm sm:col-span-2" placeholder={A.notes} value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
                    <button className="h-10 bg-navy px-4 text-sm font-semibold text-white">{A.save}</button>
                  </form>
                )}
              </div>
            )}

            {tab === "reports" && (
              <div>
                <h1 className="font-serif text-3xl text-navy">{A.reports}</h1>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <button type="button" onClick={() => setReportFilter("total")}><Metric label={A.totalAppts} value={live.length} /></button>
                  <button type="button" onClick={() => setReportFilter("completed")}><Metric label={A.completedShort} value={completed.length} /></button>
                  <button type="button" onClick={() => setReportFilter("upcoming")}><Metric label={`${A.upcoming} / ${A.pending}`} value={pending.length} /></button>
                  <button type="button" onClick={() => setReportFilter("cancelled")}><Metric label={A.cancelledShort} value={cancelled.length} /></button>
                  <button type="button" onClick={() => setReportFilter("today")}><Metric label={A.todayShort} value={todays.length} /></button>
                  <button type="button" onClick={() => setReportFilter("week")}><Metric label={A.thisWeek} value={thisWeek.length} /></button>
                  <button type="button" onClick={() => setReportFilter("month")}><Metric label={A.thisMonth} value={thisMonth.length} /></button>
                </div>
                {reportFilter && (
                  <div className="mt-6">
                    <ApptTable rows={reportList()} doctors={doctors} A={A} lang={lang} statusLabel={statusLabel} flashId="" onRow={setDetail} onAction={() => undefined} />
                  </div>
                )}
              </div>
            )}

            {tab === "notifications" && (
              <div>
                <h1 className="font-serif text-3xl text-navy">{A.notifications}</h1>
                <ul className="mt-6 divide-y divide-line border-y border-line bg-white">
                  {notes.map((n) => (
                    <li key={n.id} className="cursor-pointer px-4 py-3 text-sm" onClick={() => n.href && setTab(n.href as Tab)}>
                      <p className="font-medium text-navy">
                        {!n.read && <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-teal" />}
                        {noteTitle(n.type)}
                      </p>
                      <p className="text-muted">{n.body}</p>
                      <p className="text-xs text-muted">{new Date(n.createdAt).toLocaleString(loc)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "settings" && (
              <div>
                <h1 className="font-serif text-3xl text-navy">{A.settings}</h1>
                <p className="mt-2 text-sm text-muted">{A.settingsLead}</p>
                <h2 className="mt-8 font-serif text-xl text-navy">{A.notifySettings}</h2>
                <ul className="mt-4 space-y-3">
                  {Object.keys(settings).map((k) => (
                    <li key={k} className="flex items-center justify-between border-b border-line py-3 text-sm">
                      <span className="text-navy">{settingLabel(k)}</span>
                      <input type="checkbox" checked={!!settings[k]} onChange={async (e) => {
                        const next = { ...settings, [k]: e.target.checked };
                        setSettings(next);
                        await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
                      }} />
                    </li>
                  ))}
                </ul>
                <h2 className="mt-8 font-serif text-xl text-navy">{A.apptSettings}</h2>
                <p className="mt-2 text-sm text-muted">{A.slotMins}: 30 {A.minutes}</p>
                <h2 className="mt-8 font-serif text-xl text-navy">{A.language}</h2>
                <p className="mt-2 text-sm">{lang === "ta" ? "தமிழ்" : "English"}</p>
                <h2 className="mt-8 font-serif text-xl text-navy">{A.hospitalInfo}</h2>
                <form className="mt-4 grid max-w-xl gap-3" onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const body = Object.fromEntries(fd.entries());
                  const res = await fetch("/api/admin/hospital", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                  const d = await res.json();
                  if (d.hospital) setHospital({ ...HOSPITAL, ...d.hospital });
                }}>
                  <input name="name" className={inp} defaultValue={hospital.name} placeholder={A.name} />
                  <input name="phone" className={inp} defaultValue={hospital.phone} placeholder={A.phone} />
                  <input name="email" className={inp} defaultValue={hospital.email} />
                  <input name="emergency" className={inp} defaultValue={hospital.emergency} />
                  <input name="address" className={inp} defaultValue={hospital.address} />
                  <button className="h-10 w-fit bg-navy px-4 text-sm font-semibold text-white">{A.save}</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="animate-fade-up border border-line bg-white p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl text-navy transition-all duration-300">{value}</p>
    </div>
  );
}

function ApptTable({
  rows, doctors, A, lang, statusLabel, flashId, onRow, onAction,
}: {
  rows: Appointment[];
  doctors: Doctor[];
  A: { patient: string; status: string; actions: string; reschedule: string; cancel: string; markComplete: string; confirmAppt: string; empty: string; doctors: string; filterDate: string; timeline: string; colId: string };
  lang: "en" | "ta";
  statusLabel: (s: string) => string;
  flashId: string;
  onRow: (a: Appointment) => void;
  onAction: (a: Appointment, action: string) => void;
}) {
  return (
    <div className="mt-4 overflow-x-auto bg-white border border-line shadow-xs">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-line bg-paper/60 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-3 py-3">{A.colId}</th>
            <th className="px-3 py-3">{A.patient}</th>
            <th className="px-3 py-3">{A.doctors}</th>
            <th className="px-3 py-3">{A.filterDate}</th>
            <th className="px-3 py-3">{A.timeline}</th>
            <th className="px-3 py-3">{A.status}</th>
            <th className="px-3 py-3">{A.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.length === 0 && (
            <tr><td className="px-3 py-6 text-muted" colSpan={7}>{A.empty}</td></tr>
          )}
          {rows.map((a) => {
            const done = a.status === "completed";
            return (
              <tr key={a.id} className={`transition-colors duration-200 hover:bg-paper/50 ${done ? "bg-[#f7faf8] text-muted" : ""} ${flashId === a.id ? "bg-[#e8f4f2] transition-colors duration-500" : ""}`}>
                <td className="px-3 py-3 font-medium text-navy">
                  <button type="button" className="transition-colors duration-200 hover:text-teal font-semibold" onClick={() => onRow(a)}>{a.id}</button>
                </td>
                <td className="px-3 py-3">
                  {a.patientName}
                  <div className="text-xs text-muted">+91 {a.phone}</div>
                </td>
                <td className="px-3 py-3">{doctors.find((d) => d.id === a.doctorId)?.name}</td>
                <td className="px-3 py-3">{a.date}</td>
                <td className="px-3 py-3">{formatTime12(a.time, lang)}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full transition-all duration-300 ${done ? "text-teal bg-teal/10" : a.status === "cancelled" ? "text-emergency bg-emergency/10" : "text-navy bg-navy/5"}`}>
                    {done ? "✓ " : ""}
                    {statusLabel(a.status)}
                  </span>
                  {a.completedAt && <div className="text-[11px] text-muted mt-0.5">{new Date(a.completedAt).toLocaleString(displayLocale(lang))}</div>}
                </td>
                <td className="px-3 py-3">
                  {!done && a.status !== "cancelled" && (
                    <select className="h-8 border border-line bg-white text-xs transition-colors duration-200 hover:border-navy focus:border-navy focus:ring-1 focus:ring-navy" defaultValue="" onChange={(e) => { if (e.target.value) onAction(a, e.target.value); e.target.value = ""; }}>
                      <option value="">{A.actions}</option>
                      <option value="confirm">{A.confirmAppt}</option>
                      <option value="complete">{A.markComplete}</option>
                      <option value="reschedule">{A.reschedule}</option>
                      <option value="cancel">{A.cancel}</option>
                    </select>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
