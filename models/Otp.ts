import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
} from "mongoose";

import { OtpType } from "@/lib/enums";
import User from "./User";

export type TOtp = InferSchemaType<typeof otpSchema>;
export type TOtpDoc = HydratedDocument<TOtp>;

const otpSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: User.modelName,
    required: true,
  },
  otp: { type: String, required: true },
  type: { type: String, enum: OtpType, required: true },
  created_at: {
    type: Date,
    default: Date.now,
    expires: 180,
  },
});

const Otp = models.Otp || model("Otp", otpSchema);

export default Otp;
