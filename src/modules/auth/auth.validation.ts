import { z } from "zod";

// todo: implement strong password validation
const checkStrongPassword = (input: string) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{6,}$/.test(input);
};

const singUp = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be string",
        })
        .min(1, "Name must be more than 1 character"),
      email: z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be string",
        })
        .email("Provide a valid email address"),
      phone: z.string({
        required_error: "Phone is required",
        invalid_type_error: "Phone must be string",
      }),
      profileImage: z
        .string({
          invalid_type_error: "Profile Image must be string",
        })
        .url({ message: "Provide a valid url" })
        .optional(),
      password: z
        .string({
          required_error: "Password is required",
          invalid_type_error: "Password must be string",
        })
        .min(6, "Password must be less than 6 characters")
        .max(32, "Password can't be more than 32 characters")
        .refine(checkStrongPassword, {
          message: "Password must contain at least one letter and one number",
        }),
      dateOfBirth: z
        .string({
          required_error: "Date of Birth is required",
          invalid_type_error: "Date of Birth must be string",
        })
        .date("Invalid Date"),
      address: z.string({
        required_error: "Address is required",
        invalid_type_error: "Address must be string",
      }),
    })
    .strict(),
});

const singIn = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be string",
        })
        .email("Provide a valid email address"),
      password: z
        .string({
          required_error: "Password is required",
          invalid_type_error: "Password must be string",
        })
        .min(6, "Password must be less than 6 characters")
        .max(32, "Password can't be more than 32 characters"),
    })
    .strict(),
});

const refreshToken = z.object({
  cookies: z
    .object({
      refreshToken: z.string({
        invalid_type_error: "Refresh Token must be a string",
        required_error: "Refresh Token is required",
      }),
    })
    .strict(),
});

export const authValidationSchema = {
  singUp,
  singIn,
  refreshToken,
};
