import {
  TPaymentCurrency,
  TPaymentMethod,
  TPaymentStatus,
} from "./payment.interface";

export const PaymentStatus: TPaymentStatus[] = ["pending", "paid", "cancelled"];
export const PaymentMethods: TPaymentMethod[] = ["amarpay", "cash"];
export const PaymentCurrency: TPaymentCurrency[] = ["BDT", "USD"];
