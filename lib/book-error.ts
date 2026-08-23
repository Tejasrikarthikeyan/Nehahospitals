import type { TDict } from "./i18n";

export function bookApiError(code: string | undefined, t: TDict["book"]) {
  if (code === "INVALID_PHONE") return t.errPhone;
  if (code === "INVALID_OTP") return t.errOtp;
  if (code === "OTP_EXPIRED") return t.errExpired;
  if (code === "DOCTOR_NOT_FOUND") return t.errDoctor;
  if (code === "REQUIRED_FIELDS") return t.errFields;
  if (code === "SLOT_TAKEN" || code === "SLOT_UNAVAILABLE") return t.errSlot;
  return t.errGeneric;
}
