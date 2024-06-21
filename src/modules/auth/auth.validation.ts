import { z } from "zod";
import { userRoles } from "../user/user.constant";

// todo: implement strong password validation
const checkStrongPassword = (input: string) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{6,}$/.test(input);
};

const singUp = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "name is required",
          invalid_type_error: "name must be string",
        })
        .min(1, "name must be more than 1 character"),
      email: z
        .string({
          required_error: "email is required",
          invalid_type_error: "email must be string",
        })
        .email("provide a valid email address"),
      role: z.enum([...userRoles] as [string, ...string[]]),
      password: z
        .string({
          required_error: "password is required",
          invalid_type_error: "password must be string",
        })
        .min(6, "password must be less than 6 characters")
        .max(32, "password can't be more than 32 characters")
        .refine(checkStrongPassword, {
          message: "password must contain at least one letter and one number",
        }),
      phone: z
        .string({
          required_error: "phone is required",
          invalid_type_error: "phone must be string",
        })
        .min(11, "phone must be 11 character"),
      address: z
        .string({
          required_error: "address is required",
          invalid_type_error: "address must be string",
        })
        .min(5, "address must be more than 5 character"),
    })
    .strict(),
});

const singIn = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "email is required",
          invalid_type_error: "email must be string",
        })
        .email("provide a valid email address"),
      password: z
        .string({
          required_error: "password is required",
          invalid_type_error: "password must be string",
        })
        .min(6, "password must be less than 6 characters")
        .max(32, "password can't be more than 32 characters"),
    })
    .strict(),
});

const refreshToken = z.object({
  cookies: z
    .object({
      refreshToken: z.string({
        invalid_type_error: "refreshToken must be a string",
        required_error: "refreshToken is required",
      }),
    })
    .strict(),
});

export const authValidationSchema = {
  singUp,
  singIn,
  refreshToken,
};
