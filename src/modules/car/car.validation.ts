import mongoose from "mongoose";
import { z } from "zod";
import { validateTime } from "../../utils";
import { CarMileageUnit, CarStatus, CarTransMission } from "./car.constant";
import { startAndEndTimeValidation } from "./car.utils";

const create = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be string",
        })
        .min(1, "Name must be more than 1 character"),
      description: z
        .string({
          required_error: "Description is required",
          invalid_type_error: "Description must be string",
        })
        .min(20, "Description must be more than 20 character"),
      image: z
        .string({
          required_error: "Image is required",
          invalid_type_error: "Image must be string",
        })
        .url("Provide a valid url"),
      brand: z.string({
        required_error: "Brand is required",
        invalid_type_error: "Brand must be string",
      }),
      model: z.string({
        required_error: "Model is required",
        invalid_type_error: "Model is required",
      }),
      type: z.string({
        required_error: "Type is required",
        invalid_type_error: "Type must be string",
      }),
      category: z.string({
        required_error: "Category is required",
        invalid_type_error: "Category must be string",
      }),
      year: z.string({
        required_error: "Year is required",
        invalid_type_error: "Year must be string",
      }),
      color: z
        .string({
          required_error: "Color is required",
          invalid_type_error: "Color must be string",
        })
        .min(1, "Color must be more than 1 character"),
      seatCapacity: z.number({
        required_error: "Seat capacity is required",
        invalid_type_error: "Seat capacity must be number",
      }),
      mileage: z.number({
        required_error: "Mileage is required",
        invalid_type_error: "Mileage must be number",
      }),
      mileageUnit: z
        .enum([...CarMileageUnit] as [string, ...string[]], {
          required_error: "Mileage unit is required",
          invalid_type_error: "Mileage unit must be string",
        })
        .optional(),
      isElectric: z.boolean({
        required_error: "Is Electric is required",
        invalid_type_error: "Is Electric must be boolean",
      }),
      galleryImages: z
        .array(
          z.object({
            url: z.string({ required_error: "Url is required" }),
          }),
        )
        .optional(),
      features: z
        .array(
          z
            .string({
              required_error: "Feature is required",
              invalid_type_error: "Feature must be string",
            })
            .min(1, "Feature must be more than 1 character")
            .trim(),
        )
        .min(1, { message: "Features is required" }),
      pricePerHour: z
        .number({
          required_error: "Price per hour is required",
          invalid_type_error: "Price per hour must be number",
        })
        .positive({ message: "Price per hour must be a positive number" }),
      transmission: z.enum([...CarTransMission] as [string, ...string[]], {
        required_error: "Transmission is required",
        invalid_type_error: "Transmission must be string",
      }),
    })
    .strict(),
});

const update = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be string",
        })
        .min(1, "Name must be more than 1 character")
        .optional(),
      description: z
        .string({
          required_error: "Description is required",
          invalid_type_error: "Description must be string",
        })
        .min(20, "Description must be more than 20 character")
        .optional(),
      image: z
        .string({
          required_error: "Image is required",
          invalid_type_error: "Image must be string",
        })
        .url("Provide a valid url")
        .optional(),
      brand: z
        .string({
          required_error: "Brand is required",
          invalid_type_error: "Brand must be string",
        })
        .optional(),
      model: z
        .string({
          required_error: "Model is required",
          invalid_type_error: "Model is required",
        })
        .optional(),
      type: z
        .string({
          required_error: "Type is required",
          invalid_type_error: "Type must be string",
        })
        .optional(),
      category: z
        .string({
          required_error: "Category is required",
          invalid_type_error: "Category must be string",
        })
        .optional(),
      year: z
        .string({
          required_error: "Year is required",
          invalid_type_error: "Year must be string",
        })
        .optional(),
      color: z
        .string({
          required_error: "Color is required",
          invalid_type_error: "Color must be string",
        })
        .min(1, "Color must be more than 1 character")
        .optional(),
      seatCapacity: z
        .string({
          required_error: "Seat capacity is required",
          invalid_type_error: "Seat capacity must be string",
        })
        .optional(),
      mileage: z
        .string({
          required_error: "Mileage is required",
          invalid_type_error: "Mileage must be string",
        })
        .optional(),
      mileageUnit: z
        .enum([...CarMileageUnit] as [string, ...string[]], {
          required_error: "Mileage unit is required",
          invalid_type_error: "Mileage unit must be string",
        })
        .optional(),
      isElectric: z
        .boolean({
          required_error: "Is Electric is required",
          invalid_type_error: "Is Electric must be boolean",
        })
        .optional(),
      galleryImages: z
        .array(
          z.object({
            url: z.string({ required_error: "Url is required" }),
          }),
        )
        .optional(),
      features: z
        .array(
          z
            .string({
              required_error: "Feature is required",
              invalid_type_error: "Feature must be string",
            })
            .min(1, "Feature must be more than 1 character")
            .trim(),
        )
        .min(1, { message: "Features is required" })
        .optional(),
      pricePerHour: z
        .number({
          required_error: "Price per hour is required",
          invalid_type_error: "Price per hour must be number",
        })
        .positive({ message: "Price per hour must be a positive number" })
        .optional(),
      transmission: z
        .enum([...CarTransMission] as [string, ...string[]], {
          required_error: "Transmission is required",
          invalid_type_error: "Transmission must be string",
        })
        .optional(),
      status: z
        .enum([...CarStatus] as [string, ...string[]], {
          required_error: "Status is required",
          invalid_type_error: "Status must be string",
        })
        .optional(),
    })
    .strict(),
});

const returnTheCar = z.object({
  body: z
    .object({
      bookingId: z
        .string({
          required_error: "Booking Id is required",
          invalid_type_error: "Booking Id must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid Booking Id",
        }),
      returnDate: z
        .string({
          required_error: "Return date is required",
          invalid_type_error: "Return date must be string",
        })
        .date("Invalid date"),
      endTime: z
        .string({
          required_error: "End time is required",
          invalid_type_error: "End time must be string",
        })
        .refine(validateTime, {
          message: "Invalid time format, expected 'HH:MM' in 24 hours format",
        }),
    })
    .strict()
    .refine(startAndEndTimeValidation, {
      message: "End time should be after start time",
      path: ["body", "endTime"],
    }),
});

export const carValidationSchema = {
  create,
  update,
  returnTheCar,
};
