import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import Store, { TStore } from "@/models/Store";
import { createStoreSchema } from "@/validators/store";
import { parseFields } from "@/lib/server/utils";
import z from "zod";

type StoreFilter = Partial<{
  is_active: TStore["is_active"];
}> & {
  $or?: Array<{
    name?: { $regex: string; $options: string };
    category?: { $regex: string; $options: string };
    "branches.address"?: { $regex: string; $options: string };
  }>;
};
export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = createStoreSchema.safeParse(body);

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

    const store = await Store.create(result.data);

    return NextResponse.json(
      {
        success: true,
        data: store,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  await connect();

  const { searchParams } = new URL(req.url);
  const sortField = searchParams.get("sort");
  const order = searchParams.get("order");
  const search = searchParams.get("search");

  const allowedFields = Object.keys(Store.schema.paths);

  const sort: Record<string, 1 | -1> = {};

  if (sortField && allowedFields.includes(sortField)) {
    sort[sortField] = order === "desc" ? -1 : 1;
  }

  const fields = parseFields(searchParams.get("fields"), allowedFields);

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit")) || 10, 1),
    100,
  );

  const skip = (page - 1) * limit;

  const filter: StoreFilter = {};

  const isActive = searchParams.get("is_active");

  if (isActive !== null) {
    filter.is_active = isActive === "true";
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { "branches.address": { $regex: search, $options: "i" } },
    ];
  }

  let query = Store.find(filter);

  if (fields) {
    query = query.select(fields);
  }

  query = query.skip(skip).limit(limit).sort(sort);

  const [stores, total] = await Promise.all([
    query,
    Store.countDocuments(filter),
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
