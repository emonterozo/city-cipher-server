import { Direction } from "@/lib/enums";
import { z } from "zod";

export const gridSchema = z.object({
  word: z.string().trim().min(1),
  x: z.number().min(0),
  y: z.number().min(0),
  dir: z.enum(Direction),
});

export const levelSchema = z.object({
  level: z.number().min(1),
  letters: z.array(z.string()).min(1),
  rows: z.number().min(1),
  cols: z.number().min(1),
  grid: z.array(gridSchema).min(1),
});

export const createLevelSchema = z.array(levelSchema).min(1);
