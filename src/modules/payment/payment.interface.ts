import { Types } from "mongoose";

export type TPaymentStatus = "pending" | "paid" | "cancelled";
export type TPaymentMethod = "amarpay" | "cash";
export type TPaymentCurrency = "BDT" | "USD";

export type TPayment = {
  currency: TPaymentCurrency;
  transactionId: string;
  paymentMethod: TPaymentMethod;
  status: TPaymentStatus;
  booking: Types.ObjectId;
  amount: number;
  paidAt: Date;
};
