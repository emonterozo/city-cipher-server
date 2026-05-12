import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import { GameLevel } from "@/models/GameLevel";

export async function GET(req: Request) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);

    const currentLevel = Math.max(
      Number(searchParams.get("current_level")) || 0,
      0,
    );

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      100,
    );

    const levels = await GameLevel.find({
      level: { $gte: currentLevel },
    })
      .sort({ level: 1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: levels,
    });
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
