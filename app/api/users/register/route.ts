import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import z from "zod";
import { createUserSchema } from "@/validators/user";
import User from "@/models/User";
import { hashPassword } from "@/lib/server/utils";
import { sendOtp } from "@/app/actions/sendOtp";
import { OtpType } from "@/lib/enums";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = createUserSchema.safeParse(body);

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

    const password = await hashPassword(body.password);

    const user = await User.create({
      ...result.data,
      password,
    });

    const otp = await sendOtp(
      user._id.toString(),
      user.mobile_number,
      OtpType.REGISTRATION,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Your account has been created successfully.",
        user_id: user._id.toString(),
        retry_after: otp.retry_after,
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    let message =
      "Something went wrong while creating your account. Please try again later.";

    if (err && typeof err === "object" && "code" in err) {
      interface MongoDuplicateError {
        code: number | string;
        keyPattern?: Record<string, number>;
        keyValue?: Record<string, string>;
      }

      const mongoError = err as MongoDuplicateError;

      if (mongoError.code === 11000 || mongoError.code === "11000") {
        const field = mongoError.keyPattern
          ? Object.keys(mongoError.keyPattern)[0]
          : "";

        if (field === "mobile_number") {
          message =
            "This mobile number is already in use. Please use a different number.";
        }

        return NextResponse.json(
          {
            success: false,
            message,
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
