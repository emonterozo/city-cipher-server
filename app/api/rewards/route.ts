import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import { createRewardSchema } from "@/validators/reward";
import Reward from "@/models/Reward";
import z from "zod";
import { getRewards } from "@/lib/rewardService";
import { parseFields } from "@/lib/server/utils";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = createRewardSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: z.treeifyError(result.error),
        },
        { status: 400 },
      );
    }

    const reward = await Reward.create(result.data);

    return NextResponse.json(
      {
        success: true,
        data: reward,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  await connect();

  const { searchParams } = new URL(req.url);

  const isActiveParam = searchParams.get("is_active");
  const inStock = searchParams.get("in_stock") !== null;

  const isActive = isActiveParam === null ? true : isActiveParam === "true";

  const allowedFields = Object.keys(Reward.schema.paths);
  const fields = parseFields(searchParams.get("fields"), allowedFields) ?? "";

  const result = await getRewards({
    storeId: searchParams.get("store_id") || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    isActive,
    fields,
    inStock,
  });

  return Response.json({ success: true, ...result });
}
