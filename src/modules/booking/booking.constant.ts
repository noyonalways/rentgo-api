import { TBookingPaymentStatus, TBookingStatus } from "./booking.interface";

export const BookingStatus: TBookingStatus[] = [
  "pending",
  "approved",
  "cancelled",
  "completed",
];

export const BookingPaymentStatus: TBookingPaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "cancelled",
];

export const BOOKING_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const;
