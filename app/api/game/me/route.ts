import connect from "@/lib/db/mongodb";
import { verifyAccessToken } from "@/lib/server/utils";
import { GameConfig, TRankDoc } from "@/models/GameConfig";
import User from "@/models/User";
import { updateUserGameDataSchema } from "@/validators/userGameData";
import { TokenExpiredError } from "jsonwebtoken";
import { NextResponse } from "next/server";
import z from "zod";

export async function GET(req: Request) {
  try {
    await connect();

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

    const user = await User.findById(decoded.user_id).select(
      "earned_points current_level current_level_words_found hinted_cells current_hearts last_heart_update level_hints_used ad_bonus_used_count interstitial_ads_shown_level",
    );

    const gameConfig = await GameConfig.findOne({
      config_version: "1.0.0",
      is_active: true,
    });

    const rank = gameConfig.ranks.find((r: TRankDoc) => {
      const max = r.max_level === -1 ? Infinity : r.max_level;
      return user.current_level >= r.min_level && user.current_level <= max;
    });

    const now = new Date();
    const lastUpdate = new Date(user.last_heart_update);

    const diffMs = now.getTime() - lastUpdate.getTime();
    const regenIntervalMs = rank.heart_regen_mins * 60 * 1000;

    const heartsToAdd = Math.floor(diffMs / regenIntervalMs);

    if (heartsToAdd > 0 && user.current_hearts < rank.max_hearts) {
      const newHearts = Math.min(
        user.current_hearts + heartsToAdd,
        rank.max_hearts,
      );

      const actualHeartsAdded = newHearts - user.current_hearts;

      user.current_hearts = newHearts;

      // advance only consumed time
      user.last_heart_update = new Date(
        lastUpdate.getTime() + actualHeartsAdded * regenIntervalMs,
      );

      await user.save();
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      return NextResponse.json(
        { success: false, message: "Token expired" },
        { status: 401 },
      );
    }

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

export async function PATCH(req: Request) {
  try {
    await connect();

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

    const body = await req.json();

    const result = updateUserGameDataSchema.safeParse(body);

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

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({
        success: true,
        message: "No fields to update",
      });
    }

    const updateData = {
      ...body,
      updated_at: new Date(),
    };

    if (result.data.current_hearts) {
      updateData.last_heart_update = new Date();
    }

    let hintAd = 0;
    let levelFrequencyAd = 0;
    if (result.data.is_free_hint) {
      hintAd = 1;
    }

    if (result.data.interstitial_ads_shown_level) {
      levelFrequencyAd = 1;
    }

    await User.findByIdAndUpdate(decoded.user_id, {
      $set: updateData,
      $inc: {
        "ads_stats.hint_ads": hintAd,
        "ads_stats.level_frequency_ads": levelFrequencyAd,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Updated successfully.",
    });
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      return NextResponse.json(
        { success: false, message: "Token expired" },
        { status: 401 },
      );
    }

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
