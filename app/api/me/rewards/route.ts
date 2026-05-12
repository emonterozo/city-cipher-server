import connect from "@/lib/db/mongodb";
import { parseFields, verifyAccessToken } from "@/lib/server/utils";
import { NextResponse } from "next/server";
import { TokenExpiredError } from "jsonwebtoken";
import UserReward from "@/models/UserReward";
import { Types } from "mongoose";
import Reward from "@/models/Reward";

export async function GET(req: Request) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Missing or invalid token.",
        },
        { status: 401 },
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyAccessToken(token);

    const allowedFields = Object.keys(Reward.schema.paths);
    const rewardFields =
      parseFields(searchParams.get("fields"), allowedFields) ?? "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const filter: Partial<{
      status: string;
      user_id: Types.ObjectId;
    }> = {
      user_id: new Types.ObjectId(decoded.user_id),
    };

    if (status) {
      filter.status = status;
    }

    let query = UserReward.find(filter)
      .skip(skip)
      .limit(limit)
      .select("status expired_at created_at updated_at");

    if (rewardFields) {
      query = query.populate({
        path: "reward_id",
        select: rewardFields,
      });
    }

    const [data, total] = await Promise.all([
      query,
      UserReward.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      return NextResponse.json(
        { success: false, message: "Token expired" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
      data: null,
    });
  }
}
