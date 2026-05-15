// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import connect from "@/lib/db/mongodb";
import Account from "@/models/Account";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/server/utils";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        await connect();
        const user = await Account.findOne({ username: credentials?.username });
        if (!user) return null;

        const isValid = await comparePassword(
          credentials.password as string,
          user.password,
        );

        if (!isValid) return null;

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        return {
          id: user._id.toString(),
          name: user.account_name,
          type: user.type,
          storeId: user.store_id?.toString() || null,
          access_token: accessToken,
          refresh_token: refreshToken,
        };
      },
    }),
  ],
});
