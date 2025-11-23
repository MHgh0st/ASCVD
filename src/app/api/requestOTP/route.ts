import { NextRequest, NextResponse } from "next/server";
import SmsWebService from "@/utils/SmsWebService";
import prisma from "@/utils/prisma";
const otpGenerator = require("otp-generator");
const otpTool = require("otp-without-db");

export async function POST(request: NextRequest) {
  const { phoneNumber }: { phoneNumber: string } = await request.json();

  const user = await prisma.users.findUnique({
    where: {
      phone: phoneNumber,
    },
  });

  if (user) {
    return NextResponse.json(
      {
        error:
          "کاربری با این شماره موبایل در دیتابیس موجود است، لطفا وارد شوید",
      },
      { status: 500 }
    );
  }

  const otp = otpGenerator.generate(5, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  try {
    const smsResponse = await SmsWebService.SendVerifyCode(
      phoneNumber,
      Number(process.env.SMSIR_TEMPLATE_ID),
      [
        {
          name: "Code",
          value: String(otp),
        },
      ]
    );
    if (smsResponse.status !== 200) {
      throw new Error(smsResponse.data);
    }
    const hash = otpTool.createNewOTP(
      phoneNumber,
      otp,
      process.env.OTP_SECRET_KEY
    );
    return NextResponse.json({
      phoneNumber: phoneNumber,
      hash: hash,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
