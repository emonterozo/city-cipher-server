import { AccountType } from "@/lib/enums";
import { Types } from "mongoose";
import { z } from "zod";

export const createAccountSchema = z
  .object({
    username: z.string().min(2),
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
    account_name: z.string().min(2),
    type: z.enum(AccountType),
    store_id: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "store" && !data.store_id) {
      ctx.addIssue({
        code: "custom",
        path: ["store_id"],
        message: "store_id is required when type is store",
      });
    }
  });

export const accountLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
