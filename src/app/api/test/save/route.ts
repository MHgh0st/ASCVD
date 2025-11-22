import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/utils/prisma"; // استفاده از پریسما
import { authOptions } from "@/app/server/AuthOptions";
import type { AscvdData, AscvdResult } from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "برای ذخیره تست باید وارد حساب کاربری خود شوید." },
        { status: 401 }
      );
    }

    // تبدیل آیدی به عدد (چون در دیتابیس شما ID ها عددی هستند)
    const userId = session.user.id;

    const {
      testData,
      testResult,
    }: { testData: AscvdData; testResult: AscvdResult } = await request.json();

    // Validation
    if (!testData || !testResult) {
      return NextResponse.json(
        { error: "داده‌های تست ناقص است." },
        { status: 400 }
      );
    }

    // Save test data to database using Prisma
    // نکته: فرض بر این است که نام مدل شما در schema.prisma برابر با "tests" است.
    // اگر نام مدل "ascvd_test" است، لطفا "prisma.tests" را به "prisma.ascvd_test" تغییر دهید.
    const savedTest = await prisma.tests.create({
      data: {
        user_id: userId,
        age: testData.age,
        sex: testData.sex,
        total_cholesterol: testData.cholesterol,
        hdl_cholesterol: testData.HDLCholesterol,
        ldl_cholesterol: testData.LDLCholesterol,
        systolic_bp: testData.bloodPressureSystolic,
        diastolic_bp: testData.bloodPressureDiastolic,

        // تبدیل مقادیر به فرمت دیتابیس
        // اگر در دیتابیس این فیلدها Boolean هستند، کد زیر درست است.
        // اگر String هستند، باید بنویسید: testData.diabetes === "yes" ? "yes" : "no"
        has_diabetes: testData.diabetes === "yes" ? 1 : 0,
        is_smoker: testData.smoke, // معمولا string است ("yes"/"no")
        quit_duration: testData.quitDuration || null, // مقدار undefined را به null تبدیل می‌کنیم
        on_bp_medicine: testData.bloodPreasureMedicine === "yes" ? 1 : 0, // تبدیل به true/false

        final_risk: testResult.final_risk,
        risk_category: testResult.risk_category,
      },
    });

    return NextResponse.json(
      { message: "تست با موفقیت ذخیره شد.", id: savedTest.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving test:", error);
    return NextResponse.json(
      { error: error.message || "یک خطای غیرمنتظره در سرور رخ داد." },
      { status: 500 }
    );
  }
}
