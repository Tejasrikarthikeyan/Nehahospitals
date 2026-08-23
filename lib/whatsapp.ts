export type WhatsAppResult = {
  delivered: boolean;
  method: "cloud_api" | "whatsapp_link";
  waUrl: string;
  message: string;
  to: string;
  error?: string;
};

export function confirmationMessage(input: {
  patientName: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  id: string;
}) {
  return `Dear ${input.patientName},

Your appointment at Neha Hospitals has been successfully booked.

Doctor: ${input.doctor}
Department: ${input.department}
Date: ${input.date}
Time: ${input.time}
Appointment ID: ${input.id}

Please arrive 10–15 minutes before your appointment.

Thank you for choosing Neha Hospitals.`;
}

export function whatsappUrl(phone: string, message: string) {
  return `https://api.whatsapp.com/send?phone=91${phone}&text=${encodeURIComponent(message)}`;
}

export async function sendWhatsAppConfirmation(phone: string, message: string): Promise<WhatsAppResult> {
  const to = `91${phone}`;
  const waUrl = whatsappUrl(phone, message);
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (token && phoneNumberId) {
    const template = process.env.WHATSAPP_TEMPLATE_NAME;
    const payload: Record<string, unknown> = template
      ? {
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: template,
            language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en" },
          },
        }
      : {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { preview_url: false, body: message },
        };

    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as { error?: { message?: string }; messages?: { id: string }[] };
    if (res.ok && json.messages?.[0]?.id) {
      return { delivered: true, method: "cloud_api", waUrl, message, to: `+${to}` };
    }
    return {
      delivered: false,
      method: "whatsapp_link",
      waUrl,
      message,
      to: `+${to}`,
      error: json.error?.message,
    };
  }

  return { delivered: false, method: "whatsapp_link", waUrl, message, to: `+${to}` };
}
