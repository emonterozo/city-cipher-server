import { NextResponse } from "next/server";
import Store from "@/models/Store";
import { parseFields } from "@/lib/server/utils";
import { getRewards } from "@/lib/rewardService";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { params } = context;

    const { searchParams } = new URL(req.url);

    const allowedFields = Object.keys(Store.schema.paths);

    const fields = parseFields(searchParams.get("fields"), allowedFields);

    const { id } = await params;

    let query = Store.findById(id);

    if (fields) {
      query = query.select(fields);
    }

    const store = await query;

    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store not found." },
        { status: 404 },
      );
    }

    const result = await getRewards({
      storeId: id,
      page: 1,
      limit: 10,
      isActive: true,
      fields: "title points_cost",
      inStock: true
    });

    return NextResponse.json({
      success: true,
      data: {
        store,
        rewards: result.data,
        meta: result.meta,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
      data: null,
    });
  }
}
