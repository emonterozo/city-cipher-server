import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import z from "zod";
import { createLevelSchema } from "@/validators/level";
import { GameLevel } from "@/models/GameLevel";
import { GameConfig } from "@/models/GameConfig";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = createLevelSchema.safeParse(body);

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

    const res = await GameLevel.insertMany(result.data);

    await GameConfig.findOneAndUpdate(
      {
        config_version: "1.0.0",
        is_active: true,
      },
      {
        $set: {
          global_settings: {
            total_levels: res.length,
          },
        },
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Game level created successfully.",
        count: res.length,
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
