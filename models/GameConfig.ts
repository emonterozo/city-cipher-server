import { Rank } from "@/lib/enums";
import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

export type TGameConfig = InferSchemaType<typeof gameConfigSchema>;
export type TGameConfigDoc = HydratedDocument<TGameConfig>;

export type TRank = InferSchemaType<typeof rankSchema>;
export type TRankDoc = HydratedDocument<TRank>;

const rankSchema = new mongoose.Schema({
  rank: { type: String, enum: Rank, required: true },
  min_level: { type: Number, required: true },
  max_level: { type: Number, required: true }, // Use -1 for Expert
  reward_per_level: { type: Number, required: true },
  max_hearts: { type: Number, required: true },
  heart_regen_mins: { type: Number, required: true },
  hint_cost: { type: Number, required: true },
  ad_frequency: { type: Number, required: true },
  hint_per_level_limit: { type: Number, default: 3 },
});

const gameConfigSchema = new mongoose.Schema(
  {
    config_version: { type: String, required: true, default: "1.0.0" },
    is_active: { type: Boolean, default: true },
    ranks: [rankSchema],
    global_settings: {
      points_to_peso_ratio: { type: Number, default: 1000 },
      starting_points: { type: Number, default: 0 },
      total_levels: { type: Number, default: 1 },
    },
  },
  {
    collection: "game_configs",
  },
);

export const GameConfig =
  mongoose.models.GameConfig || mongoose.model("GameConfig", gameConfigSchema);
