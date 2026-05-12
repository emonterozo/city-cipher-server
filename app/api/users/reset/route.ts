import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import z from "zod";
import User from "@/models/User";
import { resetPasswordSchema } from "@/validators/user";
import { hashPassword } from "@/lib/server/utils";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = resetPasswordSchema.safeParse(body);

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
    const { user_id, password } = result.data;

    const hashedPassword = await hashPassword(password);

    const user = await User.findByIdAndUpdate(user_id, {
      $set: {
        password: hashedPassword,
        otp_send_count: 0,
        otp_send_window_start: null,
        otp_send_blocked_until: null,
      },
    });

    if (user) {
      return NextResponse.json(
        {
          success: true,
          message: "Password updated successfully.",
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            "Something went wrong while creating your account. Please try again later.",
        },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating your account. Please try again later.",
      },
      { status: 500 },
    );
  }
}
