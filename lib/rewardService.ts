import Reward, { TReward } from "@/models/Reward";
import { Types } from "mongoose";

type MongoExpr = {
  $lt?: [string, string];
};

type RewardFilter = Partial<{
  is_active: TReward["is_active"];
  store_id: Types.ObjectId;
  $expr: MongoExpr;
}>;

export async function getRewards({
  storeId,
  page = 1,
  limit = 10,
  isActive,
  sortField,
  order,
  fields,
  inStock,
}: {
  storeId?: string;
  page?: number;
  limit?: number;
  isActive: boolean;
  sortField?: string;
  order?: "asc" | "desc";
  fields?: string;
  inStock?: boolean;
}) {
  const skip = (page - 1) * limit;

  const filter: RewardFilter = {};

  if (storeId) {
    if (!Types.ObjectId.isValid(storeId)) {
      throw new Error("Invalid store_id");
    }
    filter.store_id = new Types.ObjectId(storeId);
  }

  filter.is_active = isActive;

  if (inStock) {
    filter.$expr = {
      $lt: ["$claimed_quantity", "$total_quantity"],
    };
  }

  const sort: Record<string, 1 | -1> = {};
  if (sortField) {
    sort[sortField] = order === "desc" ? -1 : 1;
  }

  let query = Reward.find(filter).skip(skip).limit(limit).sort(sort);

  if (fields) {
    query = query.select(fields);
  }

  const [data, total] = await Promise.all([
    query,
    Reward.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
