import { z } from "zod";
import { Types } from "mongoose";
import { RewardRuleType } from "@/lib/enums";

const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

const rewardRuleSchema = z.object({
  type: z.enum(RewardRuleType),
  value: z.union([z.number(), z.string(), z.boolean()]),
});

export const createRewardSchema = z.object({
  store_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  title: z.string().min(1),
  description: z.string().min(1),
  points_cost: z.number().min(0),
  total_quantity: z.number().min(1),
  per_user_limit: z.number().min(1),
  claim_valid_days: z.number().min(1),
  start_date: z.string().regex(isoRegex, "Invalid ISO 8601 format"),
  end_date: z.string().regex(isoRegex, "Invalid ISO 8601 format"),
  is_active: z.boolean(),
  rules: z.array(rewardRuleSchema).optional().default([]),
});
