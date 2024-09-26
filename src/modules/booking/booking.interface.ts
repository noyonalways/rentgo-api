import { Types } from "mongoose";

export type TBookingStatus = "pending" | "approved" | "cancelled" | "completed";
export type TBookingPaymentStatus = "pending" | "paid";

export type TBooking = {
  bookingDate: Date;
  returnDate: Date;
  startTime: string;
  endTime: string;
  user: Types.ObjectId;
  car: Types.ObjectId;
  bookingAddress: string;
  nidOrPassport: string;
  drivingLicense: string;
  status: TBookingStatus;
  paymentStatus: TBookingPaymentStatus;
  transactionId: string;
  totalCost: number;
  totalHours: number;
};
