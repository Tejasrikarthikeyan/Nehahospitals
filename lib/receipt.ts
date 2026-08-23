import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { HOSPITAL } from "./data";
import { formatLongDate, formatTime12 } from "./slots";

export type ReceiptData = {
  id: string;
  patientName: string;
  phone: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
};

export async function buildReceiptPdf(data: ReceiptData) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const navy = rgb(0.039, 0.208, 0.345);
  const teal = rgb(0.08, 0.478, 0.447);
  const ink = rgb(0.106, 0.141, 0.188);
  const muted = rgb(0.357, 0.404, 0.459);
  const line = rgb(0.863, 0.894, 0.925);

  page.drawRectangle({ x: 0, y: 780, width: 595.28, height: 62, color: navy });
  page.drawRectangle({ x: 0, y: 776, width: 595.28, height: 4, color: teal });
  page.drawText("NEHA HOSPITALS", {
    x: 48,
    y: 808,
    size: 18,
    font: serifBold,
    color: rgb(1, 1, 1),
  });
  page.drawText("Appointment confirmation", {
    x: 48,
    y: 790,
    size: 10,
    font: sans,
    color: rgb(0.82, 0.9, 0.92),
  });
  page.drawText(data.id, {
    x: 400,
    y: 806,
    size: 12,
    font: sansBold,
    color: rgb(1, 1, 1),
  });

  page.drawText("Official OPD receipt", {
    x: 48,
    y: 742,
    size: 16,
    font: serifBold,
    color: navy,
  });
  page.drawText("This document confirms a scheduled consultation at Neha Hospitals, Chromepet, Chennai.", {
    x: 48,
    y: 722,
    size: 9,
    font: sans,
    color: muted,
  });

  const rows: [string, string][] = [
    ["Appointment ID", data.id],
    ["Patient name", data.patientName],
    ["Verified mobile", `+91 ${data.phone}`],
    ["Doctor", data.doctor],
    ["Department", data.department],
    ["Date", formatLongDate(data.date)],
    ["Time", formatTime12(data.time)],
    ["Duration", "30 minutes"],
    ["Hospital", HOSPITAL.name],
    ["Address", HOSPITAL.address],
    ["OPD desk", HOSPITAL.phone],
    ["Emergency", HOSPITAL.emergency],
  ];

  let y = 688;
  for (const [label, value] of rows) {
    page.drawLine({ start: { x: 48, y: y + 16 }, end: { x: 547, y: y + 16 }, thickness: 0.6, color: line });
    page.drawText(label, { x: 48, y: y, size: 9, font: sans, color: muted });
    const lines = wrap(value, 62);
    lines.forEach((ln, i) => {
      page.drawText(ln, { x: 220, y: y - i * 12, size: 10, font: sansBold, color: ink });
    });
    y -= 18 + (lines.length - 1) * 12;
  }

  y -= 10;
  page.drawRectangle({ x: 48, y: y - 52, width: 499, height: 58, color: rgb(0.96, 0.973, 0.984) });
  page.drawText("Please arrive 10–15 minutes before your appointment with a photo ID and previous reports.", {
    x: 60,
    y: y - 18,
    size: 9,
    font: sans,
    color: ink,
  });
  page.drawText("A WhatsApp confirmation has been sent to the verified mobile number.", {
    x: 60,
    y: y - 34,
    size: 9,
    font: sans,
    color: teal,
  });

  page.drawText("Computer-generated receipt · No signature required · © 2026 Neha Hospitals", {
    x: 48,
    y: 48,
    size: 8,
    font: sans,
    color: muted,
  });
  page.drawText(HOSPITAL.email, {
    x: 48,
    y: 36,
    size: 8,
    font: sans,
    color: muted,
  });

  return pdf.save();
}

function wrap(text: string, max: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > max) {
      if (cur) lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [text];
}
