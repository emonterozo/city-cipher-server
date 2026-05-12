import { Types } from "mongoose";
import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  mobile_number: z
    .string()
    .trim()
    .regex(
      /^09\d{9}$/,
      "Please enter a valid contact number (11 digits, starting with 09).",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password is too long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character.",
    ),
});

export const userLoginSchema = z.object({
  mobile_number: z.string(),
  password: z.string(),
});

export const resetPasswordSchema = z.object({
  user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password is too long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character.",
    ),
});
