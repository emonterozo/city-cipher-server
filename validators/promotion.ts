import { Types } from "mongoose";
import { z } from "zod";

export const createPromotionSchema = z.object({
  store_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  label: z.string().min(1).max(10),
  title: z.string().min(1).max(35),
  banner: z.string().min(1),
  url: z.string(),
  is_active: z.boolean().optional(),
});
