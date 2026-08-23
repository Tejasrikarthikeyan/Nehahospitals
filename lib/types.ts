export type AppointmentStatus = "upcoming" | "confirmed" | "completed" | "cancelled" | "rescheduled" | "booked" | "arrived";

export type Appointment = {
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
  status: AppointmentStatus;
  createdAt: string;
  completedAt?: string;
  cancelReason?: string;
  whatsappSent: boolean;
};
