import { parseFields, verifyAccessToken } from "@/lib/server/utils";
import Reward from "@/models/Reward";
import UserReward from "@/models/UserReward";
import { TokenExpiredError } from "jsonwebtoken";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { params } = context;

    const { searchParams } = new URL(req.url);

    const allowedFields = Object.keys(Reward.schema.paths);

    const fields = parseFields(searchParams.get("fields"), allowedFields);

    const { id } = await params;

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

    const query = UserReward.findOne({
      _id: new Types.ObjectId(id),
      user_id: new Types.ObjectId(decoded.user_id),
    });

    const userReward = await query
      .populate({
        path: "reward_id",
        select: fields,
        populate: {
          path: "store_id",
          select: "name",
        },
      })
      .lean();

    if (!userReward) {
      return NextResponse.json(
        { success: false, message: "User reward not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: userReward,
    });
  } catch (error) {
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
