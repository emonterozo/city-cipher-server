import { Day, Social } from "@/lib/enums";
import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
} from "mongoose";

export type TStore = InferSchemaType<typeof storeSchema>;
export type TStoreDoc = HydratedDocument<TStore>;

const socialSchema = new Schema({
  social: {
    type: String,
    enum: Social,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const openingHourSchema = new Schema({
  day: {
    type: String,
    enum: Day,
    required: true,
  },
  open: {
    type: Number, // minutes since midnight
    required: true,
  },
  close: {
    type: Number, // minutes since midnight
    required: true,
  },
});

const branchSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
      require: true,
    },
  },
  opening_hours: [openingHourSchema],
  socials: [socialSchema],
});

const storeSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  logo: { type: String, required: true },
  images: { type: [String], required: true },
  website: { type: String, default: null },
  branches: [branchSchema],
  sort_order: { type: Number, required: true },
  is_active: { type: Boolean, default: false },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

storeSchema.index({ location: "2dsphere" });
storeSchema.index({ name: 1 });
storeSchema.index({ category: 1 });
storeSchema.index({ "branches.address": 1 });

const Store = models.Store || model("Store", storeSchema);

export default Store;
