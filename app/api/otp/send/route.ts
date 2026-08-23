import { NextResponse } from "next/server";
import { addNotification, getOtps, saveOtps } from "@/lib/store";

function digits(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

export async function POST(req: Request) {
  const body = await req.json();
  const phone = digits(String(body.phone || ""));
  if (phone.length !== 10) {
    return NextResponse.json({ code: "INVALID_PHONE", error: "Enter a valid 10-digit mobile number." }, { status: 400 });
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const list = await getOtps();
  const next = list.filter((o) => o.phone !== phone);
  next.push({ phone, otp, verified: false, expiresAt: Date.now() + 5 * 60 * 1000 });
  await saveOtps(next);
  await addNotification({
    type: "otp",
    title: "OTP sent",
    body: `A 6-digit OTP was generated for +91 ${phone}.`,
    phone,
  });
  return NextResponse.json({
    ok: true,
    phone,
    // Delivered to the verified handset in production via SMS gateway.
    // Exposed here so the OTP flow can be completed without an SMS vendor.
    otp,
    message: `OTP sent to +91 ${phone}`,
  });
}
