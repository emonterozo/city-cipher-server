import { z } from "zod";
import { Day, Social } from "@/lib/enums";

const socialSchema = z.object({
  social: z.enum(Social),
  url: z.string(),
});

const openingHourSchema = z.object({
  day: z.enum(Day),
  open: z.number().min(0).max(1440),
  close: z.number().min(0).max(1440),
});

const branchSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  opening_hours: z.array(openingHourSchema),
  socials: z.array(socialSchema).optional(),
});

export const createStoreSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  logo: z.string(),
  images: z.array(z.string()),
  website: z.string().optional(),
  branches: z.array(branchSchema),
  is_active: z.boolean().optional(),
  sort_order: z.int()
});
