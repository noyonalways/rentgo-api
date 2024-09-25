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
];
