import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import { createPromotionSchema } from "@/validators/promotion";
import Promotion, { TPromotion } from "@/models/Promotion";
import { parseFields } from "@/lib/server/utils";
import { z } from "zod";

type PromotionFilter = Partial<{
  is_active: TPromotion["is_active"];
}>;

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = createPromotionSchema.safeParse(body);

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

    const promotion = await Promotion.create(result.data);

    return NextResponse.json(
      {
        success: true,
        data: promotion,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  await connect();

  const { searchParams } = new URL(req.url);

  const allowedFields = Object.keys(Promotion.schema.paths);

  const fields = parseFields(searchParams.get("fields"), allowedFields);

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit")) || 10, 1),
    100,
  );

  const skip = (page - 1) * limit;

  const filter: PromotionFilter = {};

  const isActive = searchParams.get("is_active");

  if (isActive !== null) {
    filter.is_active = isActive === "true";
  }

  let query = Promotion.find(filter);

  if (fields) {
    query = query.select(fields);
  }

  query = query.skip(skip).limit(limit);

  const [stores, total] = await Promise.all([
    query,
    Promotion.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    success: true,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: stores,
  });
}
