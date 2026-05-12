import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export type DecodedToken = {
  user_id: string;
  iat: number;
  exp: number;
};

export async function hashPassword(plainPassword: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(
    plainPassword,
    process.env.SALT_ROUNDS ? Number.parseInt(process.env.SALT_ROUNDS) : 10,
  );
  return hashedPassword;
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export function parseFields(
  fields: string | null,
  allowedFields: string[],
): string | null {
  if (!fields) return null;

  const safeFields = fields
    .split(",")
    .map((f) => f.trim())
    .filter((f) => {
      // allow direct match OR nested match
      return allowedFields.some(
        (allowed) => f === allowed || f.startsWith(allowed + "."),
      );
    });

  return safeFields.length ? safeFields.join(" ") : null;
}

export function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export const formatCountdown = (countdown: number): string => {
  if (countdown <= 59) {
    return `${countdown} ${countdown === 1 ? "second" : "seconds"}`;
  }

  if (countdown < 3600) {
    const mins = Math.floor(countdown / 60);
    const secs = countdown % 60;

    return `${mins}:${secs.toString().padStart(2, "0")} ${
      mins === 1 ? "minute" : "minutes"
    }`;
  }

  const hours = Math.ceil(countdown / 3600);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
};

export function generateAccessToken(user_id: string) {
  return jwt.sign({ user_id }, process.env.ACCESS_SECRET!, {
    expiresIn: "1d",
  });
}

export function generateRefreshToken(user_id: string) {
  return jwt.sign({ user_id }, process.env.REFRESH_SECRET!, {
    expiresIn: "90d",
  });
}

export function verifyAccessToken(token: string): DecodedToken {
  return jwt.verify(token, process.env.ACCESS_SECRET!) as DecodedToken;
}

export function verifyRefreshToken(token: string): DecodedToken {
  return jwt.verify(token, process.env.REFRESH_SECRET!) as DecodedToken;
}
