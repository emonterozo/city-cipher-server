import { Rank } from "@/lib/enums";
import { z } from "zod";

export const rankSchema = z.object({
  rank: z.enum(Rank),
  min_level: z.number().min(1),
  max_level: z.number(),
  reward_per_level: z.number().min(1),
  max_hearts: z.number().min(1),
  heart_regen_mins: z.number().min(1),
  hint_cost: z.number().min(1),
  ad_frequency: z.number().min(1),
  hint_per_level_limit: z.number().min(1),
});

export const globalSettingSchema = z.object({
  points_to_peso_ratio: z.number().min(0),
  starting_points: z.number().min(0),
  total_levels: z.number().min(1),
});

export const createGameConfig = z.object({
  config_version: z.string(),
  is_active: z.boolean(),
  ranks: z.array(rankSchema),
});
