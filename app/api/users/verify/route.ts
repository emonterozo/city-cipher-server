import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import z from "zod";
import { verifyOtpSchema } from "@/validators/otp";
import Otp, { TOtpDoc } from "@/models/Otp";
import { Types } from "mongoose";
import User from "@/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/server/utils";
import { OtpType } from "@/lib/enums";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = verifyOtpSchema.safeParse(body);

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
    const { user_id, type, otp } = result.data;

    const otpDoc: TOtpDoc = await Otp.findOne({
      user_id: new Types.ObjectId(user_id),
      type: type,
    })
      .sort({ created_at: -1 })
      .lean();

    if (otpDoc) {
      if (otpDoc.otp === otp) {
        const accessToken = generateAccessToken(otpDoc.user_id.toString());
        const refreshToken = generateRefreshToken(otpDoc.user_id.toString());

        if (type == OtpType.REGISTRATION) {
          await User.findByIdAndUpdate(otpDoc.user_id, {
            $set: {
              is_verify: true,
              otp_send_count: 0,
              otp_send_window_start: null,
              verify_at: new Date(),
              updated_at: new Date(),
              refresh_token: refreshToken,
            },
          });
        } else {
          await User.findByIdAndUpdate(otpDoc.user_id, {
            $set: {
              is_verify: true,
              verify_at: new Date(),
              updated_at: new Date(),
            },
          });
        }

        await Otp.deleteMany({ user_id: otpDoc.user_id, type });

        return NextResponse.json(
          {
            success: true,
            id: otpDoc.user_id,
            access_token: accessToken,
            refresh_token: refreshToken,
          },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              "The OTP you entered is invalid. Please check and try again.",
          },
          { status: 200 },
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new one.",
        },
        { status: 200 },
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
