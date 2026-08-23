"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { HOSPITAL } from "@/lib/data";
import { MONTHS } from "@/lib/i18n";
import { formatLongDate, formatTime12, upcomingDates } from "@/lib/slots";
import { bookApiError } from "@/lib/book-error";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/components/LanguageProvider";
import { useCatalog } from "@/components/CatalogProvider";

type Slot = { time: string; status: "available" | "booked" | "past" };

type ExistingAppt = {
  id: string;
  doctorId: string;
  departmentId: string;
  date: string;
  time: string;
  patientName: string;
  age: string;
  gender: string;
  phone: string;
  email?: string;
  reason?: string;
  status: string;
  doctorName: string;
  doctorNameTa: string;
  departmentName: string;
  departmentNameTa: string;
};

const STEPS = ["phone", "otp", "existing", "dept", "doctor", "date", "time", "details", "review", "done"] as const;
type Step = (typeof STEPS)[number];

export default function BookPage() {
  return (
    <Suspense>
      <BookInner />
    </Suspense>
  );
}

type BookingResult = {
  appointment: { id: string; date: string; time: string };
  doctor: string;
  doctorTa?: string;
  department: string;
  departmentTa?: string;
  hospital: string;
  patientName: string;
  phone: string;
  waUrl?: string;
  message?: string;
  whatsappDelivered?: boolean;
  whatsappTo?: string;
};

function BookInner() {
  const { t, lang } = useI18n();
  const { doctors: DOCTORS, departments: DEPARTMENTS } = useCatalog();
  const params = useSearchParams();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [smsOtp, setSmsOtp] = useState("");
  const [deptId, setDeptId] = useState(params.get("department") || "");
  const [doctorId, setDoctorId] = useState(params.get("doctor") || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Female");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [existing, setExisting] = useState<ExistingAppt[]>([]);

  const doctor = DOCTORS.find((d) => d.id === doctorId);
  const dept = DEPARTMENTS.find((d) => d.id === (doctor?.departmentId || deptId));
  const dates = doctor ? upcomingDates(doctor) : [];
  const doctors = deptId ? DOCTORS.filter((d) => d.departmentId === deptId) : DOCTORS;

  function statusText(s: string) {
    if (s === "confirmed") return t.admin.confirmed;
    if (s === "completed") return t.admin.completedShort;
    if (s === "cancelled") return t.admin.cancelledShort;
    if (s === "rescheduled") return t.admin.rescheduled;
    return t.admin.upcoming;
  }

  useEffect(() => {
    if (params.get("package")) setReason((r) => r || t.book.pkgReason);
  }, [lang, params, t.book.pkgReason]);

  useEffect(() => {
    if (doctorId && !deptId) {
      const d = DOCTORS.find((x) => x.id === doctorId);
      if (d) setDeptId(d.departmentId);
    }
  }, [doctorId, deptId]);

  useEffect(() => {
    if (step !== "time" || !doctorId || !date) return;
    let cancelled = false;
    setSlotsLoading(true);
    fetch(`/api/slots?doctorId=${doctorId}&date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setSlots(d.slots || []);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [step, doctorId, date]);

  async function sendOtp() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(bookApiError(data.code, t.book));
    setSmsOtp(data.otp);
    setStep("otp");
  }

  async function verifyOtp() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(bookApiError(data.code, t.book));
    const previous = (data.appointments || []) as ExistingAppt[];
    setExisting(previous);
    if (previous[0]) {
      const last = previous[0];
      setPatientName(last.patientName || "");
      setAge(last.age || "");
      if (last.gender) setGender(last.gender);
      setEmail(last.email || "");
    }
    if (previous.length) setStep("existing");
    else continueAfterVerify();
  }

  function continueAfterVerify() {
    if (doctorId) setStep("date");
    else if (deptId) setStep("doctor");
    else setStep("dept");
  }

  async function confirm() {
    setError("");
    setLoading(true);
    const waWindow = window.open("about:blank", "nh-whatsapp");
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, date, time, patientName, age, gender, phone, email, reason }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      waWindow?.close();
      return setError(bookApiError(data.code, t.book));
    }
    setResult(data);
    if (data.whatsappDelivered) {
      waWindow?.close();
    } else if (data.waUrl && waWindow && !waWindow.closed) {
      waWindow.location.href = data.waUrl;
    } else {
      waWindow?.close();
    }
    setStep("done");
  }

  return (
    <SiteShell>
      <section className="border-b border-line bg-paper py-10">
        <div className="container-site">
          <h1 className="font-serif text-4xl text-navy">{t.book.title}</h1>
          {step !== "done" && step !== "existing" && (
            <p className="mt-3 text-sm text-muted">
              {["phone", "otp", "dept", "doctor", "date", "time", "details", "review"].indexOf(step) + 1} / 8
            </p>
          )}
        </div>
      </section>
      <section className="py-10">
        <div className="container-site max-w-2xl">
          {error && <p className="mb-4 border border-emergency/30 bg-[#fdf4f3] p-3 text-sm text-emergency">{error}</p>}

          {step === "phone" && (
            <div>
              <h2 className="font-serif text-2xl text-navy">{t.book.stepPhone}</h2>
              <p className="mt-2 text-sm text-muted">{t.book.phoneHint}</p>
              <label className="mt-6 block text-sm font-medium text-navy">{t.book.mobile}</label>
              <div className="mt-2 flex">
                <span className="inline-flex h-12 items-center border border-r-0 border-line px-3 text-sm text-muted">+91</span>
                <input inputMode="numeric" maxLength={10} className="h-12 flex-1 border border-line px-3" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} />
              </div>
              <button disabled={phone.length !== 10 || loading} onClick={sendOtp} className="mt-6 h-12 bg-navy px-6 text-sm font-semibold text-white disabled:opacity-40">
                {t.book.sendOtp}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div>
              <h2 className="font-serif text-2xl text-navy">{t.book.enterOtp}</h2>
              <p className="mt-2 text-sm text-muted">{t.book.otpHint} +91 {phone}</p>
              {smsOtp && (
                <div className="mt-4 border border-line bg-paper p-4 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t.book.smsPreview}</p>
                  <p className="mt-2 text-navy">
                    {t.book.otpSms} <strong className="tracking-[0.3em]">{smsOtp}</strong>. {t.book.otpValid}
                  </p>
                </div>
              )}
              <input
                inputMode="numeric"
                maxLength={6}
                className="mt-6 h-14 w-full border border-line text-center text-xl tracking-[0.25em] sm:text-2xl sm:tracking-[0.5em]"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <button disabled={otp.length !== 6 || loading} onClick={verifyOtp} className="h-12 bg-navy px-6 text-sm font-semibold text-white disabled:opacity-40">
                  {t.book.verify}
                </button>
                <button onClick={sendOtp} className="h-12 border border-line px-6 text-sm font-semibold text-navy">
                  {t.book.resend}
                </button>
                <button type="button" onClick={() => setStep("phone")} className="h-12 text-sm font-semibold text-teal">
                  {t.book.back}
                </button>
              </div>
            </div>
          )}

          {step === "existing" && (
            <div>
              <h2 className="font-serif text-2xl text-navy">{t.book.existingTitle}</h2>
              <p className="mt-2 text-sm text-muted">{t.book.existingLead}</p>
              <div className="mt-6 border border-line">
                {existing.map((a, i) => (
                  <dl key={a.id} className={`divide-y divide-line px-5 ${i > 0 ? "border-t border-line" : ""}`}>
                    <Row k={t.book.id} v={a.id} />
                    <Row k={t.book.pname} v={a.patientName} />
                    <Row k={t.book.mobile} v={`+91 ${a.phone}`} />
                    <Row k={t.book.doctor} v={lang === "ta" ? a.doctorNameTa : a.doctorName} />
                    <Row k={t.book.dept} v={lang === "ta" ? a.departmentNameTa : a.departmentName} />
                    <Row k={t.book.date} v={formatLongDate(a.date, lang)} />
                    <Row k={t.book.time} v={formatTime12(a.time, lang)} />
                    <Row k={t.book.hospital} v={HOSPITAL.name} />
                    <Row k={t.book.status} v={statusText(a.status)} />
                  </dl>
                ))}
              </div>
              <button type="button" onClick={continueAfterVerify} className="mt-6 h-12 bg-navy px-6 text-sm font-semibold text-white">
                {t.book.bookAnother}
              </button>
            </div>
          )}

          {step === "dept" && (
            <div>
              <h2 className="font-serif text-2xl text-navy">{t.book.dept}</h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {DEPARTMENTS.filter((d) => d.id !== "radiology" && d.id !== "pathology").map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setDeptId(d.id);
                        setDoctorId("");
                        setStep("doctor");
                      }}
                      className="flex w-full items-center justify-between py-3 text-left"
                    >
                      <span className="text-sm font-medium text-navy">{lang === "ta" ? d.nameTa : d.name}</span>
                      <span className="text-sm text-muted">{lang === "ta" ? d.shortTa : d.short}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === "doctor" && (
            <div>
              <h2 className="font-serif text-2xl text-navy">{t.book.doctor}</h2>
              <p className="mt-1 text-sm text-muted">{lang === "ta" ? dept?.nameTa : dept?.name}</p>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {doctors.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-medium text-navy">{lang === "ta" ? d.nameTa : d.name}</p>
                      <p className="text-sm text-muted">
                        {lang === "ta" ? d.specialityTa : d.speciality} · {d.experience} {t.home.yearsExp} · {formatTime12(d.start, lang)} – {formatTime12(d.end, lang)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="h-10 shrink-0 bg-navy px-4 text-sm font-semibold text-white"
                      onClick={() => {
                        setDoctorId(d.id);
                        setStep("date");
                      }}
                    >
                      {t.book.next}
                    </button>
                  </li>
                ))}
              </ul>
              <button className="mt-4 text-sm text-teal" onClick={() => setStep("dept")}>{t.book.back}</button>
            </div>
          )}

          {step === "date" && doctor && (
            <div>
              <h2 className="font-serif text-2xl text-navy">{t.book.date}</h2>
              <p className="mt-2 text-sm text-muted">{t.book.dateHint}</p>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {dates.map((iso) => {
                  const d = new Date(`${iso}T12:00:00`);
                  const label = `${d.getDate()} ${MONTHS[lang][d.getMonth()]}`;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => {
                        setDate(iso);
                        setTime("");
                        setStep("time");
                      }}
                      className={`h-16 border text-sm ${date === iso ? "border-navy bg-navy text-white" : "border-line text-navy"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <button type="button" className="mt-4 text-sm text-teal" onClick={() => setStep("doctor")}>{t.book.back}</button>
            </div>
          )}

          {step === "time" && (
            <div>
              <h2 className="font-serif text-2xl text-navy">{t.book.time}</h2>
              <p className="mt-2 text-sm text-muted">{t.book.timeHint}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
                <span><i className="mr-1 inline-block h-2.5 w-2.5 bg-white ring-1 ring-line" /> {t.book.available}</span>
                <span><i className="mr-1 inline-block h-2.5 w-2.5 bg-navy" /> {t.book.selected}</span>
                <span><i className="mr-1 inline-block h-2.5 w-2.5 bg-[#d9dee5]" /> {t.book.booked}</span>
              </div>
              {slotsLoading && <p className="mt-6 text-sm text-muted">{t.book.loadingSlots}</p>}
              {!slotsLoading && slots.length > 0 && slots.every((s) => s.status !== "available") && (
                <p className="mt-6 text-sm text-emergency">{t.book.noSlots}</p>
              )}
              <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {!slotsLoading && slots.map((s) => {
                  const booked = s.status !== "available";
                  const selected = time === s.time;
                  return (
                    <button
                      key={s.time}
                      disabled={booked}
                      onClick={() => setTime(s.time)}
                      className={`h-11 text-sm ${
                        booked ? "cursor-not-allowed bg-[#e8edf2] text-muted" : selected ? "bg-navy text-white" : "border border-line text-navy"
                      }`}
                    >
                      {formatTime12(s.time, lang)}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => setStep("date")} className="h-12 border border-line px-6 text-sm font-semibold text-navy">
                  {t.book.back}
                </button>
                <button disabled={!time} onClick={() => setStep(patientName && age ? "review" : "details")} className="h-12 bg-navy px-6 text-sm font-semibold text-white disabled:opacity-40">
                  {t.book.next}
                </button>
              </div>
            </div>
          )}

          {step === "details" && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("review");
              }}
            >
              <h2 className="font-serif text-2xl text-navy">{t.book.details}</h2>
              <input required className="h-11 w-full border border-line px-3 text-sm" placeholder={t.book.pname} value={patientName} onChange={(e) => setPatientName(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input required className="h-11 border border-line px-3 text-sm" placeholder={t.book.age} value={age} onChange={(e) => setAge(e.target.value)} />
                <select className="h-11 border border-line px-3 text-sm" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="Female">{t.book.female}</option>
                  <option value="Male">{t.book.male}</option>
                  <option value="Other">{t.book.other}</option>
                </select>
              </div>
              <input className="h-11 w-full border border-line px-3 text-sm" value={`+91 ${phone}`} readOnly />
              <input className="h-11 w-full border border-line px-3 text-sm" placeholder={t.book.email} value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea className="min-h-24 w-full border border-line px-3 py-2 text-sm" placeholder={t.book.reason} value={reason} onChange={(e) => setReason(e.target.value)} />
              <div className="flex flex-wrap gap-3">
                <button type="button" className="h-12 border border-line px-6 text-sm font-semibold text-navy" onClick={() => setStep("time")}>{t.book.back}</button>
                <button className="h-12 bg-navy px-6 text-sm font-semibold text-white">{t.book.next}</button>
              </div>
            </form>
          )}

          {step === "review" && doctor && dept && (
            <div>
              <h2 className="font-serif text-2xl text-navy">{t.book.review}</h2>
              <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
                <Row k={t.book.pname} v={patientName} />
                <Row k={t.book.doctor} v={lang === "ta" ? doctor.nameTa : doctor.name} />
                <Row k={t.book.dept} v={lang === "ta" ? dept.nameTa : dept.name} />
                <Row k={t.book.date} v={formatLongDate(date, lang)} />
                <Row k={t.book.time} v={formatTime12(time, lang)} />
                <Row k={t.book.hospital} v={HOSPITAL.name} />
                <Row k={t.book.mobile} v={`+91 ${phone}`} />
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" className="h-12 border border-line px-6 text-sm font-semibold text-navy" onClick={() => setStep(patientName && age ? "time" : "details")}>{t.book.back}</button>
                <button disabled={loading} onClick={confirm} className="h-12 bg-navy px-6 text-sm font-semibold text-white">
                  {t.book.confirm}
                </button>
              </div>
            </div>
          )}

          {step === "done" && result && (
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">{t.book.success}</p>
              <h2 className="mt-3 font-serif text-4xl text-navy">{result.appointment.id}</h2>
              <p className="mt-4 text-sm text-muted">{t.book.waNote}</p>
              <p className="mt-2 text-sm font-medium text-teal">
                {t.book.waSent} {result.whatsappTo}
              </p>
              <dl className="mx-auto mt-8 max-w-md divide-y divide-line border-y border-line text-left text-sm">
                <Row k={t.book.pname} v={result.patientName} />
                <Row k={t.book.doctor} v={lang === "ta" ? result.doctorTa || result.doctor : result.doctor} />
                <Row k={t.book.dept} v={lang === "ta" ? result.departmentTa || result.department : result.department} />
                <Row k={t.book.date} v={formatLongDate(result.appointment.date, lang)} />
                <Row k={t.book.time} v={formatTime12(result.appointment.time, lang)} />
                <Row k={t.book.hospital} v={result.hospital} />
                <Row k={t.book.mobile} v={result.whatsappTo || `+91 ${result.phone}`} />
              </dl>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  className="inline-flex h-11 items-center border border-navy px-4 text-sm font-semibold text-navy"
                  href={icsHref(result)}
                  download={`${result.appointment.id}.ics`}
                >
                  {t.book.cal}
                </a>
                <button
                  type="button"
                  className="h-11 border border-navy px-4 text-sm font-semibold text-navy"
                  onClick={() => downloadPdf(result.appointment.id)}
                >
                  {t.book.download}
                </button>
                <Link href="/" className="inline-flex h-11 items-center bg-navy px-4 text-sm font-semibold text-white">
                  {t.book.home}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-muted">{k}</dt>
      <dd className="font-medium text-navy">{v}</dd>
    </div>
  );
}

function icsHref(result: BookingResult) {
  const [h, m] = result.appointment.time.split(":");
  const dt = result.appointment.date.replace(/-/g, "") + "T" + h + m + "00";
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${dt}\nSUMMARY:Neha Hospitals Appointment ${result.appointment.id}\nDESCRIPTION:${result.doctor} · ${result.department}\nLOCATION:${HOSPITAL.address}\nEND:VEVENT\nEND:VCALENDAR`;
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
}

function downloadPdf(id: string) {
  const a = document.createElement("a");
  a.href = `/api/appointments/receipt?id=${encodeURIComponent(id)}`;
  a.download = `${id}.pdf`;
  a.click();
}
