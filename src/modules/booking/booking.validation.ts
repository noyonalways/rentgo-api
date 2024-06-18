import mongoose from "mongoose";
import { z } from "zod";

const checkTimeValidation = (time: string) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
  return regex.test(time);
};

const book = z.object({
  body: z
    .object({
      car: z
        .string({
          required_error: "car id is required",
          invalid_type_error: "car id must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "invalid car id",
        }),
      date: z
        .string({
          required_error: "date is required",
          invalid_type_error: "date must be string",
        })
        .datetime({ message: "date is not valid" }),
      startTime: z
        .string({
          required_error: "start time is required",
          invalid_type_error: "start time must be string",
        })
        .refine(checkTimeValidation, {
          message: "Invalid time format , expected 'HH:MM' in 24 hours format",
        }),
    })
    .strict(),
});

export const bookingValidationSchema = {
  book,
};
