import { OtpType } from "@/lib/enums";
import { Types } from "mongoose";
import { z } from "zod";

export const createOtpSchema = z.object({
  user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  type: z.enum(OtpType),
});

export const verifyOtpSchema = z.object({
  user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  otp: z.string(),
  type: z.enum(OtpType),
});
