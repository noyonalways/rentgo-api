import mongoose from "mongoose";
import { z } from "zod";
import {
  validateBookingDate,
  validateStartTimeAndBookingDate,
  validateTime,
} from "./booking.utils";

const newBooking = z.object({
  body: z
    .object({
      bookingDate: z
        .string({
          required_error: "Booking date is required",
          invalid_type_error: "Booking date must be string",
        })
        .refine(validateBookingDate, {
          message: "Booking date must be today or a future date",
        }),
      startTime: z
        .string({
          required_error: "Start time is required",
          invalid_type_error: "Start time must be string",
        })
        // First refine to check if the time format is valid
        .refine(validateTime, {
          message: "Invalid time format, expected 'HH:MM' in 24-hour format",
        }),
      car: z
        .string({
          required_error: "Car id is required",
          invalid_type_error: "Car id must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid car id",
        }),
      bookingAddress: z
        .string({
          required_error: "Booking address is required",
          invalid_type_error: "Booking address must be string",
        })
        .min(1, "Booking address must be greater than 1 character"),
      nidOrPassport: z
        .string({
          required_error: "NID or Passport number is required",
          invalid_type_error: "NID or Passport number must be string",
        })
        .min(5, "NID or Passport number must be greater than 5 characters"),
      drivingLicense: z
        .string({
          required_error: "Driving license number is required",
          invalid_type_error: "Driving license number must be string",
        })
        .min(5, "Driving license number must be greater than 5 characters"),
    })
    .strict()
    .refine(validateStartTimeAndBookingDate, {
      message:
        "Invalid start time. For today's booking, the time must be at least the next available hour.",
      path: ["body", "startTime"],
    }),
});

export const bookingValidationSchema = {
  newBooking,
};
