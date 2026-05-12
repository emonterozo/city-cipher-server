import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import z from "zod";
import { createGameConfig } from "@/validators/gameConfig";
import { GameConfig, TGameConfig } from "@/models/GameConfig";

type GameConfigFilter = Partial<{
  is_active: TGameConfig["is_active"];
  config_version: TGameConfig["config_version"];
}>;

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = createGameConfig.safeParse(body);

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

    const res = await GameConfig.insertOne(result.data);

    return NextResponse.json(
      {
        success: true,
        message: "Game level created successfully.",
        game_config: res,
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
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get("is_active");
    const configVersion = searchParams.get("config_version");
    const limit = Number(searchParams.get("limit"));

    const filter: GameConfigFilter = {};

    if (isActive !== null) {
      filter.is_active = isActive === "true";
    }

    if (configVersion !== null) {
      filter.config_version = configVersion;
    }

    let query = GameConfig.find(filter);

    query = query.limit(limit).lean();

    const config = await query;

    return NextResponse.json({
      success: true,
      data: config,
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
