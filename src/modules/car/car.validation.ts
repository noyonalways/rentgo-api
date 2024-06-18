import { z } from "zod";

const create = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "name is required",
          invalid_type_error: "name must be string",
        })
        .min(1, "name must be more than 1 character"),
      description: z
        .string({
          required_error: "description is required",
          invalid_type_error: "description must be string",
        })
        .min(20, "description must be more than 20 character"),
      color: z
        .string({
          required_error: "color is required",
          invalid_type_error: "color must be string",
        })
        .min(1, "color must be more than 1 character"),
      isElectric: z.boolean({
        required_error: "isElectric is required",
        invalid_type_error: "isElectric must be boolean",
      }),
      features: z
        .array(
          z
            .string({
              required_error: "feature is required",
              invalid_type_error: "feature must be string",
            })
            .min(1, "feature must be more than 1 character")
            .trim(),
        )
        .min(1, { message: "features is required" }),
      pricePerHour: z
        .number({
          required_error: "pricePerHour is required",
          invalid_type_error: "pricePerHour must be number",
        })
        .positive({ message: "pricePerHour must be a positive number" }),
    })
    .strict(),
});

const update = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "name is required",
          invalid_type_error: "name must be string",
        })
        .min(1, "name must be more than 1 character")
        .optional(),
      description: z
        .string({
          required_error: "description is required",
          invalid_type_error: "description must be string",
        })
        .min(20, "description must be more than 20 character")
        .optional(),
      color: z
        .string({
          required_error: "color is required",
          invalid_type_error: "color must be string",
        })
        .min(1, "color must be more than 1 character")
        .optional(),
      isElectric: z
        .boolean({
          required_error: "isElectric is required",
          invalid_type_error: "isElectric must be boolean",
        })
        .optional(),
      features: z
        .array(
          z
            .string({
              required_error: "feature is required",
              invalid_type_error: "feature must be string",
            })
            .min(1, "feature must be more than 1 character")
            .trim(),
        )
        .min(1, { message: "features is required" })
        .optional(),
      pricePerHour: z
        .number({
          required_error: "pricePerHour is required",
          invalid_type_error: "pricePerHour must be number",
        })
        .positive({ message: "pricePerHour must be a positive number" })
        .optional(),
    })
    .strict(),
});

export const carValidationSchema = {
  create,
  update,
};
