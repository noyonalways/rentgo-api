import { z } from "zod";
import { userStatus } from "./user.constant";

const updateProfile = z.object({
  body: z
    .object({
      name: z
        .string({
          invalid_type_error: "Name must be string",
        })
        .min(1, "Name must be more than 1 character")
        .optional(),
      phone: z
        .string({
          invalid_type_error: "Phone must be string",
        })
        .optional(),
      profileImage: z
        .string({
          invalid_type_error: "Profile image must be string",
        })
        .url("Invalid Url")
        .optional(),
      dateOfBirth: z
        .string({
          invalid_type_error: "Date of Birth must be string",
        })
        .optional(),
      nidOrPassport: z
        .string({
          invalid_type_error: "Nid or Passport must be string",
        })
        .optional(),
      drivingLicense: z
        .string({
          invalid_type_error: "Driving License must be string",
        })
        .optional(),
      address: z
        .string({
          invalid_type_error: "Address must be string",
        })
        .optional(),
    })
    .strict(),
});

const changeStatus = z.object({
  body: z
    .object({
      status: z.enum([...userStatus] as [string, ...string[]], {
        required_error: "User status is required",
        invalid_type_error: "User status must be string",
      }),
    })
    .strict(),
});

export const userValidationSchema = {
  updateProfile,
  changeStatus,
};
