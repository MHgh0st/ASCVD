import { NextRequest, NextResponse } from "next/server";
const otpTool = require("otp-without-db");

export async function POST(request: NextRequest) {
  const {
    hash,
    phoneNumber,
    otp,
  }: { hash: string; phoneNumber: string; otp: string } = await request.json();

  const isCorrect = otpTool.verifyOTP(
    phoneNumber,
    otp,
    hash,
    process.env.OTP_SECRET_KEY
  );

  return NextResponse.json({ isCorrect: isCorrect });
}
