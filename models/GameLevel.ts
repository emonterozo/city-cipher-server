import { Direction } from "@/lib/enums";
import mongoose from "mongoose";

const gridSchema = new mongoose.Schema({
  word: { type: String, required: true },
  x: { type: Number, default: 50 },
  y: { type: Number, default: 50 },
  dir: { type: String, enum: Direction, required: true },
});

const gameLevelSchema = new mongoose.Schema(
  {
    level: { type: Number, required: true, unique: true },
    letters: { type: [String], required: true },
    rows: { type: Number, default: 50 },
    cols: { type: Number, default: 50 },
    grid: [gridSchema],
    prefilled_count: { type: Number, default: 0 },
  },
  {
    collection: "game_levels",
  },
);

export const GameLevel =
  mongoose.models.GameLevel || mongoose.model("GameLevel", gameLevelSchema);
