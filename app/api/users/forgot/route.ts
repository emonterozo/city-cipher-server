import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import User, { TUserDoc } from "@/models/User";
import { sendOtp } from "@/app/actions/sendOtp";
import { OtpType } from "@/lib/enums";
import { formatCountdown } from "@/lib/server/utils";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    if (!body.mobile_number) {
      return NextResponse.json(
        {
          success: false,
          message: "mobile_number is required",
        },
        { status: 400 },
      );
    }

    const { mobile_number } = body;

    const user: TUserDoc = await User.findOne({
      mobile_number: mobile_number,
    }).lean();
    if (user) {
      const now = Date.now();
      if (
        user.otp_send_blocked_until &&
        user.otp_send_blocked_until.getTime() > now
      ) {
        const now = Date.now();
        const countDown = Math.ceil(
          (user.otp_send_blocked_until.getTime() - now) / 1000,
        );

        return NextResponse.json(
          {
            success: false,
            message: `Too many attempts detected. Access is restricted for ${formatCountdown(countDown)}`,
            is_locked: true,
            retry_after: countDown,
          },
          { status: 200 },
        );
      }

      const otp = await sendOtp(
        user._id.toString(),
        user.mobile_number,
        OtpType.FORGOT,
      );

      return NextResponse.json(
        {
          ...otp,
          id: user._id.toString(),
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Incorrect details. Please check your information and try again.",
      },
      { status: 200 },
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
