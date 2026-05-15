import { NextResponse } from "next/server";
import connect from "@/lib/db/mongodb";
import z from "zod";
import { hashPassword } from "@/lib/server/utils";
import { createAccountSchema } from "@/validators/account";
import Account from "@/models/Account";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const result = createAccountSchema.safeParse(body);

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

    await Account.create({
      username: result.data.username,
      password,
      account_name: result.data.account_name,
      type: result.data.type,
      store_id: result.data.store_id || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your account has been created successfully.",
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

        if (field === "username") {
          message =
            "This username is already in use. Please use a different username.";
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
