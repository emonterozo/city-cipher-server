import { generateAccessToken, verifyRefreshToken } from "@/lib/server/utils";

import { NextResponse } from "next/server";
import z from "zod";

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = refreshTokenSchema.safeParse(body);

    const decoded = verifyRefreshToken(result.data?.refresh_token ?? "");

    const newAccessToken = generateAccessToken(decoded.user_id);

    return NextResponse.json({
      success: true,
      access_token: newAccessToken,
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 },
    );
  }
}
