import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import z from "zod";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/server/utils";
import { accountLoginSchema } from "@/validators/account";
import Account from "@/models/Account";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = accountLoginSchema.safeParse(body);

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
    const { username, password } = result.data;

    const account = await Account.findOne({ username }).lean();
    if (account) {
      const isPasswordCorrect = await comparePassword(password, account.password);
      if (isPasswordCorrect) {
        const accessToken = generateAccessToken(account._id.toString());
        const refreshToken = generateRefreshToken(account._id.toString());

        await Account.findByIdAndUpdate(account._id, {
          $set: {
            updated_at: new Date(),
            refresh_token: refreshToken,
          },
        });

        return NextResponse.json(
          {
            success: true,
            id: account._id.toString(),
            type: account.type,
            account_name: account.account_name,
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
