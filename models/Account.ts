import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
} from "mongoose";
import Store from "./Store";
import { AccountType } from "@/lib/enums";

export type TAccount = InferSchemaType<typeof accountSchema>;
export type TAccountDoc = HydratedDocument<TAccount>;

const accountSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  account_name: { type: String, required: true },
  type: { type: String, enum: AccountType, required: true },
  store_id: {
    type: Schema.Types.ObjectId,
    ref: Store.modelName,
    default: null,
  },
  refresh_token: { type: String, default: null },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

const Account = models.Account || model("Account", accountSchema);

export default Account;
