import { z } from "zod";

const hintedCellSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const updateUserGameDataSchema = z.object({
  earned_points: z.number().nonnegative().optional(),
  current_level: z.number().int().min(1).optional(),
  current_level_words_found: z.array(z.string()).optional(),
  current_hearts: z.number().int().min(0).optional(),
  last_heart_update: z.coerce.date().optional(),
  last_activity_date: z.string().optional(),
  daily_ads_watched: z.number().int().nonnegative().optional(),
  levels_completed_today: z.number().int().nonnegative().optional(),
  hinted_cells: z.array(hintedCellSchema).optional(),
  interstitial_ads_shown_level: z.number().int().nonnegative().optional(),
  is_free_hint: z.boolean().optional(),
});
