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
      phone: z.string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be string",
      }),
    })
    .strict()
    .refine(validateStartTimeAndBookingDate, {
      message:
        "Invalid start time. For today's booking, the time must be at least the next available hour.",
      path: ["body", "startTime"],
    }),
});

const updateBooking = z.object({
  body: z
    .object({
      bookingAddress: z
        .string({
          required_error: "Booking address is required",
          invalid_type_error: "Booking address must be string",
        })
        .optional(),
      bookingDate: z
        .string({
          required_error: "Booking date is required",
          invalid_type_error: "Booking date must be string",
        })
        .refine(validateBookingDate, {
          message: "Booking date must be today or a future date",
        })
        .optional(),
      startTime: z
        .string({
          required_error: "Start time is required",
          invalid_type_error: "Start time must be string",
        })
        .refine(validateTime, {
          message: "Invalid time format, expected 'HH:MM' in 24-hour format",
        })
        .optional(),
      nidOrPassport: z
        .string({
          required_error: "NID or Passport number is required",
          invalid_type_error: "NID or Passport number must be string",
        })
        .min(5, "NID or Passport number must be greater than 5 characters")
        .optional(),
      drivingLicense: z
        .string({
          required_error: "Driving license number is required",
          invalid_type_error: "Driving license number must be string",
        })
        .min(5, "Driving license number must be greater than 5 characters")
        .optional(),
      phone: z
        .string({
          required_error: "Phone number is required",
          invalid_type_error: "Phone number must be string",
        })
        .optional(),
    })
    .strict()
    // Validate that both startTime and bookingDate are either both provided or both omitted
    .refine(
      (data) => {
        const hasStartTime = Boolean(data.startTime);
        const hasBookingDate = Boolean(data.bookingDate);
        return hasStartTime === hasBookingDate; // Both must be either present or absent
      },
      {
        message: "Both booking date and start time must be provided together.",
        path: ["body", "bookingDate"], // Error path to show on bookingDate
      },
    )
    // Conditionally apply validateStartTimeAndBookingDate if startTime and bookingDate are provided
    .refine(
      (data) => {
        if (data.startTime && data.bookingDate) {
          return validateStartTimeAndBookingDate({
            startTime: data.startTime,
            bookingDate: data.bookingDate,
          });
        }
        return true; // If either startTime or bookingDate is not provided, skip validation
      },
      {
        message:
          "Invalid start time. For today's booking, the time must be at least the next available hour.",
        path: ["body", "startTime"], // Path to show error in startTime
      },
    ),
});

export const bookingValidationSchema = {
  newBooking,
  updateBooking,
};
