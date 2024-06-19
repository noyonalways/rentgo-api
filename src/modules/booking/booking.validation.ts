import mongoose from "mongoose";
import { z } from "zod";
import validateTime from "../../utils/validateTIme";

// const validateDate = (date: string) => {
//   const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//   return dateRegex.test(date); //yyyy-mm-dd
// };

const book = z.object({
  body: z
    .object({
      carId: z
        .string({
          required_error: "carId is required",
          invalid_type_error: "carId id must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "invalid car id",
        }),
      date: z
        .string({
          required_error: "date is required",
          invalid_type_error: "date must be string",
        })
        .date("Invalid date format, expected 'YYYY-MM-DD' format"),
      startTime: z
        .string({
          required_error: "start time is required",
          invalid_type_error: "start time must be string",
        })
        .refine(validateTime, {
          message: "Invalid time format, expected 'HH:MM' in 24 hours format",
        }),
    })
    .strict(),
});

export const bookingValidationSchema = {
  book,
};
