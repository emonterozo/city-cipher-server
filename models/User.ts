import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
} from "mongoose";

export type TUser = InferSchemaType<typeof userSchema>;
export type TUserDoc = HydratedDocument<TUser>;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  mobile_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_verify: { type: Boolean, default: false },
  verify_at: { type: Date, default: null },
  earned_points: { type: Number, default: 0 },
  current_level: { type: Number, default: 1 },
  current_level_words_found: { type: [String], default: [] },
  hinted_cells: {
    type: [
      {
        x: Number,
        y: Number,
      },
    ],
    default: [],
  },
  current_hearts: { type: Number, default: 5 },
  last_heart_update: { type: Date, default: Date.now },
  level_hints_used: { type: Number, default: 0 },
  ad_bonus_used_count: { type: Number, default: 0 },
  interstitial_ads_shown_level: { type: Number, default: 0 },

  ads_stats: {
    hint_ads: { type: Number, default: 0 },
    level_frequency_ads: { type: Number, default: 0 },
  },

  otp_send_count: { type: Number, default: 0 },
  otp_send_window_start: { type: Date, default: null },
  otp_send_blocked_until: { type: Date, default: null },
  refresh_token: { type: String, default: null },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

const User = models.User || model("User", userSchema);

export default User;
