import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
} from "mongoose";
import Store from "./Store";

export type TPromotion = InferSchemaType<typeof promotionSchema>;
export type TPromotionDoc = HydratedDocument<TPromotion>;

const promotionSchema = new Schema({
  store_id: {
    type: Schema.Types.ObjectId,
    ref: Store.modelName,
    required: true,
  },
  label: { type: String, required: true, length: 10 },
  title: { type: String, required: true, length: 35 },
  banner: { type: String, required: true },
  url: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

const Promotion = models.Promotion || model("Promotion", promotionSchema);

export default Promotion;
