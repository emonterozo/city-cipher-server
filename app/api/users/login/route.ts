import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import z from "zod";
import User, { TUserDoc } from "@/models/User";
import { sendOtp } from "@/app/actions/sendOtp";
import { OtpType } from "@/lib/enums";
import { userLoginSchema } from "@/validators/user";
import {
  comparePassword,
  formatCountdown,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/server/utils";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = userLoginSchema.safeParse(body);

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
    const { mobile_number, password } = result.data;

    const user: TUserDoc = await User.findOne({
      mobile_number: mobile_number,
    }).lean();
    if (user) {
      const isPasswordCorrect = await comparePassword(password, user.password);
      if (isPasswordCorrect) {
        if (!user.is_verify) {
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
            OtpType.REGISTRATION,
          );

          return NextResponse.json(
            {
              ...otp,
              id: user._id.toString(),
            },
            { status: 201 },
          );
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        await User.findByIdAndUpdate(user._id, {
          $set: {
            updated_at: new Date(),
            refresh_token: refreshToken,
          },
        });

        return NextResponse.json(
          {
            success: true,
            id: user._id.toString(),
            access_token: accessToken,
            refresh_token: refreshToken,
          },
          { status: 200 },
        );
      }
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
