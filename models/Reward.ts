import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
} from "mongoose";
import Store from "./Store";
import { RewardRuleType } from "@/lib/enums";

export type TReward = InferSchemaType<typeof rewardSchema>;
export type TRewardDoc = HydratedDocument<TReward>;

const rewardSchema = new Schema({
  store_id: {
    type: Schema.Types.ObjectId,
    ref: Store.modelName,
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  points_cost: { type: Number, required: true, min: 0 },
  total_quantity: { type: Number, required: true, min: 1 },
  claimed_quantity: { type: Number, default: 0 },
  redeemed_quantity: { type: Number, default: 0 },
  per_user_limit: { type: Number, min: 1 },
  claim_valid_days: { type: Number, required: true, min: 1 },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  is_active: { type: Boolean, default: true },
  rules: [
    {
      type: {
        type: String,
        enum: RewardRuleType,
        required: true,
      },
      value: {
        type: Schema.Types.Mixed,
        required: true,
      },
    },
  ],
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

const Reward = models.Reward || model("Reward", rewardSchema);

export default Reward;

//user claimed reward,  Update any Expire reserved → Count active slots → Check limits (total + per user) → If available reserve slot (create UserReward with token + expires_at) → Deduct points
