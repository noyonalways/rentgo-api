import { Types } from "mongoose";

export type TBookingStatus = "pending" | "approved" | "cancelled" | "completed";
export type TPaymentStatus = "pending" | "paid";

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
  paymentStatus: TPaymentStatus;
  totalCost: number;
  totalHour: number;
};
