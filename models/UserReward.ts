import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
} from "mongoose";
import User from "./User";
import Reward from "./Reward";
import { RewardStatus } from "@/lib/enums";

export type TUserReward = InferSchemaType<typeof userRewardSchema>;
export type TUserRewardDoc = HydratedDocument<TUserReward>;

const userRewardSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    reward_id: {
      type: Schema.Types.ObjectId,
      ref: Reward.modelName,
      required: true,
    },
    status: { type: String, enum: RewardStatus, default: RewardStatus.active },
    expired_at: { type: Date, required: true },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() },
  },
  { collection: "user_rewards" },
);

const UserReward = models.UserReward || model("UserReward", userRewardSchema);

export default UserReward;
