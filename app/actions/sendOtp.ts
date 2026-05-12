"use server";

import { OtpType } from "@/lib/enums";
import { generateOtp } from "@/lib/server/utils";
import Otp from "@/models/Otp";
import { Types } from "mongoose";
import connect from "@/lib/db/mongodb";

import { sendMessage } from "@/lib/sendMessage";
import User from "@/models/User";

const otpMessageTemplate = (otpCode: string, type: OtpType) => {
  const baseMessage = `Your verification code is ${otpCode}.`;
  const brand = `\n\n- City Cipher ✨`;

  switch (type) {
    case OtpType.REGISTRATION:
      return (
        `${baseMessage} It will expire in 3 minutes. Use it to complete your registration.` +
        brand
      );

    default:
      return `${baseMessage} It will expire in 3 minutes.` + brand;
  }
};

export const sendOtp = async (
  user_id: string,
  contact_number: string,
  type: OtpType,
) => {
  await connect();

  const now = Date.now();
  const LIMIT = 5;
  const BLOCK_TIME = 24 * 60 * 60 * 1000;
  const user = await User.findById(user_id);

  // ----------------------------
  // 1. HANDLE BLOCK + AUTO RESET
  // ----------------------------
  if (user.otp_send_blocked_until) {
    const blockedUntil = user.otp_send_blocked_until.getTime();

    if (blockedUntil > now) {
      const countDown = Math.ceil((blockedUntil - now) / 1000);

      return {
        success: false,
        message: `Too many attempts detected. Access is restricted for ${countDown}`,
        is_locked: true,
        resend_count: user.otp_send_count,
        remaining_send: 0,
        retry_after: countDown,
      };
    }

    // ✅ EXPIRED → RESET STATE
    user.otp_send_blocked_until = null;
    user.otp_send_count = 0;
    user.otp_send_window_start = new Date();
  }

  // ----------------------------
  // 2. WINDOW RESET LOGIC
  // ----------------------------
  if (
    !user.otp_send_window_start ||
    now - user.otp_send_window_start.getTime() > BLOCK_TIME
  ) {
    user.otp_send_window_start = new Date();
    user.otp_send_count = 0;
  }

  // ----------------------------
  // 3. RATE LIMIT CHECK
  // ----------------------------
  if (user.otp_send_count >= LIMIT) {
    user.otp_send_blocked_until = new Date(now + BLOCK_TIME);

    await user.save();

    const countDown = BLOCK_TIME / 1000;

    return {
      success: false,
      message: `Too many attempts detected. Access is restricted for ${countDown}`,
      is_locked: true,
      resend_count: user.otp_send_count,
      remaining_send: 0,
      retry_after: countDown,
    };
  }

  // ----------------------------
  // 4. OTP VALIDATION WINDOW
  // ----------------------------
  const existingOtp = await Otp.findOne({
    user_id: new Types.ObjectId(user_id),
    type,
  });

  if (existingOtp) {
    const expiresAt = existingOtp.created_at.getTime() + 180 * 1000;

    if (now < expiresAt) {
      const retry_after = Math.ceil((expiresAt - now) / 1000);

      return {
        success: false,
        message: "You can request a new code after the timer ends.",
        resend_count: user.otp_send_count,
        remaining_send: LIMIT - user.otp_send_count,
        retry_after,
      };
    }
  }

  // ----------------------------
  // 5. GENERATE OTP
  // ----------------------------
  const otpCode = generateOtp();

  await Otp.create({
    user_id: new Types.ObjectId(user_id),
    type,
    otp: otpCode,
    created_at: new Date(),
  });

  await sendMessage({
    message: otpMessageTemplate(otpCode, type),
    phoneNumbers: [contact_number],
  });

  // ----------------------------
  // 6. UPDATE COUNTERS
  // ----------------------------
  user.otp_send_count += 1;

  if (!user.otp_send_window_start) {
    user.otp_send_window_start = new Date();
  }

  await user.save();

  return {
    success: true,
    message: "We’ve sent you a verification code.",
    resend_count: user.otp_send_count,
    remaining_send: LIMIT - user.otp_send_count,
    retry_after: 180,
  };
};
