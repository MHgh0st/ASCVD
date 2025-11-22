import { NextResponse, NextRequest } from "next/server";
import type { RegisterFormData, AscvdData, AscvdResult } from "@/types/types";
import prisma from "@/utils/prisma"; // استفاده از کلاینت پریسما
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    // ۱. دریافت تمام داده‌ها از کلاینت
    const { registrationData, testData, testResult } = await request.json();
    const { name, phone, password }: RegisterFormData = registrationData;

    // ولیدیشن اولیه
    if (!name || !phone || !password || !testData || !testResult) {
      return NextResponse.json(
        { error: "داده‌های ارسالی ناقص است." },
        { status: 400 }
      );
    }

    // ۲. چک کردن کاربر تکراری با استفاده از findUnique
    // (چون در مرحله قبل @unique را به phone اضافه کردیم، این دستور کار می‌کند)
    const existingUser = await prisma.users.findUnique({
      where: { phone: phone },
      select: { id: true }, // فقط چک می‌کنیم هست یا نه
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "این شماره موبایل قبلاً ثبت‌نام کرده است." },
        { status: 409 }
      );
    }

    // ۳. هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ۴. استفاده از Transaction برای تضمین یکپارچگی داده‌ها
    // یا هر دو (کاربر و تست) ذخیره می‌شوند، یا هیچکدام.
    const createdUser = await prisma.$transaction(async (tx) => {
      // الف) ساخت کاربر جدید
      const newUser = await tx.users.create({
        data: {
          fullName: name,
          phone: phone,
          password: hashedPassword,
        },
      });

      // ب) ذخیره تست و اتصال آن به کاربر جدید
      await tx.tests.create({
        data: {
          user_id: newUser.id, // استفاده از آیدی کاربری که همین الان ساخته شد
          age: testData.age,
          sex: testData.sex,
          total_cholesterol: testData.cholesterol,
          hdl_cholesterol: testData.HDLCholesterol,
          ldl_cholesterol: testData.LDLCholesterol,
          systolic_bp: testData.bloodPressureSystolic,
          diastolic_bp: testData.bloodPressureDiastolic,

          // تبدیل Boolean ها
          has_diabetes: testData.diabetes === "yes" ? 1 : 0,
          is_smoker: testData.smoke,
          quit_duration: testData.quitDuration || null, // مدیریت undefined
          on_bp_medicine: testData.bloodPreasureMedicine === "yes" ? 1 : 0,

          final_risk: testResult.final_risk,
          risk_category: testResult.risk_category,
        },
      });

      return newUser; // بازگرداندن اطلاعات کاربر برای پاسخ نهایی
    });

    return NextResponse.json(
      {
        message: "ثبت‌نام و ذخیره تست با موفقیت انجام شد.",
        userId: createdUser.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error during registration and test save:", error);

    // مدیریت خطاهای خاص پریسما (اختیاری)
    // کد P2002 یعنی محدودیت یکتا بودن (Unique Constraint) نقض شده است
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "این شماره موبایل قبلاً ثبت‌نام کرده است." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "یک خطای غیرمنتظره در سرور رخ داد." },
      { status: 500 }
    );
  }
}
