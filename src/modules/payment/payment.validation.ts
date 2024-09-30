import mongoose from "mongoose";
import { z } from "zod";
import { PaymentCurrency, PaymentMethods } from "./payment.constant";

const payPayment = z.object({
  body: z
    .object({
      booking: z
        .string({
          required_error: "Booking Id is required",
          invalid_type_error: "Booking Id must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid Booking Id",
        }),
      user: z
        .string({
          required_error: "User Id is required",
          invalid_type_error: "User Id must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid User Id",
        }),
      currency: z
        .enum([...PaymentCurrency] as [string, ...string[]], {
          required_error: "Payment currency is required",
          invalid_type_error: "Payment currency must be string",
        })
        .optional(),
      paymentMethod: z.enum([...PaymentMethods] as [string, ...string[]], {
        required_error: "Payment method is required",
        invalid_type_error: "Payment method must be string",
      }),
    })
    .strict(),
});

export const paymentValidationSchema = {
  payPayment,
};
