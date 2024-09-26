import {
  TPaymentCurrency,
  TPaymentMethod,
  TPaymentStatus,
} from "./payment.interface";

export const PaymentStatus: TPaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "cancelled",
];
export const PaymentMethods: TPaymentMethod[] = ["aamarpay", "cash"];
export const PaymentCurrency: TPaymentCurrency[] = ["BDT", "USD"];

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;
