import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    type?: string;
    storeId?: string | null;
    access_token?: string;
    refresh_token?: string;
  }

  interface Session {
    user: {
      id: string;
      type?: string;
      storeId?: string | null;
      accessToken?: string;
      refreshToken?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type?: string;
    storeId?: string | null;
    accessToken?: string;
    refreshToken?: string;
  }
}
