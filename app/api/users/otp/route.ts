import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import z from "zod";
import User from "@/models/User";
import { sendOtp } from "@/app/actions/sendOtp";
import { OtpType } from "@/lib/enums";
import { createOtpSchema } from "@/validators/otp";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = createOtpSchema.safeParse(body);

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

    const user = await User.findById(result.data.user_id);

    const otp = await sendOtp(
      user._id.toString(),
      user.mobile_number,
      OtpType.REGISTRATION,
    );

    return NextResponse.json(
      {
        ...otp,
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
            : "Something went wrong while creating your account. Please try again later.",
      },
      { status: 500 },
    );
  }
}
