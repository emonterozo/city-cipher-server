import { NextResponse } from "next/server";
import { parseFields, verifyAccessToken } from "@/lib/server/utils";
import Reward from "@/models/Reward";
import { TokenExpiredError } from "jsonwebtoken";
import UserReward from "@/models/UserReward";
import { Types } from "mongoose";
import User from "@/models/User";

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

    let query = Reward.findById(id);

    if (fields) {
      query = query.select(fields);
    }

    const reward = await query.populate("store_id", "name");

    if (!reward) {
      return NextResponse.json(
        { success: false, message: "Reward not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: reward,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
      data: null,
    });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { params } = context;

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

    const reward = await Reward.findById(id).lean();

    if (!reward) {
      return NextResponse.json(
        {
          success: false,
          message: "Reward does not exist.",
        },
        { status: 404 },
      );
    }

    if (reward.claimed_quantity >= reward.total_quantity) {
      return NextResponse.json({
        success: false,
        message: "This reward is no longer available.",
      });
    }

    const user = await User.findById(decoded.user_id).lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist.",
        },
        { status: 404 },
      );
    }

    if (user.earned_points < reward.points_cost) {
      return NextResponse.json({
        success: false,
        message: "You don’t have enough points to claim this reward.",
      });
    }

    const userRewardCount = await UserReward.countDocuments({
      reward_id: new Types.ObjectId(id),
      user_id: new Types.ObjectId(decoded.user_id),
    });

    if (userRewardCount < reward.per_user_limit) {
      await Reward.findByIdAndUpdate(id, {
        $set: {
          updated_at: new Date(),
        },
        $inc: {
          claimed_quantity: 1,
        },
      });

      await UserReward.create({
        user_id: decoded.user_id,
        reward_id: reward._id,
        expired_at: new Date(
          Date.now() + reward.claim_valid_days * 24 * 60 * 60 * 1000,
        ),
      });

      await User.findByIdAndUpdate(decoded.user_id, {
        $set: {
          earned_points: Math.max(0, user.earned_points - reward.points_cost),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Reward successfully claimed.",
      });
    } else {
      return NextResponse.json({
        success: false,
        message:
          "You’ve reached the maximum number of claims allowed for this reward per user.",
      });
    }
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
