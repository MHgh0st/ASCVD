import { NextResponse, NextRequest } from "next/server";
import type { RegisterFormData, AscvdData, AscvdResult } from "@/types/types";
import { supabase } from "@/utils/supabaseClient";
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

    // ۲. چک کردن کاربر تکراری (بدون تغییر)
    const { data: existingUser } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", phone)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "این شماره موبایل قبلاً ثبت‌نام کرده است." },
        { status: 409 }
      );
    }

    // ۳. هش کردن رمز عبور (بدون تغییر)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ۴. ساخت کاربر جدید و دریافت id او
    const { data: newUser, error: insertUserError } = await supabase
      .from("users")
      .insert([
        {
          fullName: name,
          phone: phone,
          password: hashedPassword,
        },
      ])
      .select("id") // فقط id کاربر جدید را برمی‌گردانیم
      .single();

    if (insertUserError || !newUser) {
      throw insertUserError || new Error("کاربر جدید ساخته نشد.");
    }

    const userId = newUser.id;

    // ۵. ذخیره کردن نتایج تست در جدول tests با استفاده از userId
    const { error: insertTestError } = await supabase
      .from("ascvd_test")
      .insert([
        {
          user_id: userId, // اتصال تست به کاربر جدید
          age: testData.age,
          sex: testData.sex,
          total_cholesterol: testData.cholesterol,
          hdl_cholesterol: testData.HDLCholesterol,
          ldl_cholesterol: testData.LDLCholesterol,
          systolic_bp: testData.bloodPressureSystolic,
          diastolic_bp: testData.bloodPressureDiastolic,
          has_diabetes: testData.diabetes === "yes",
          is_smoker: testData.smoke,
          quit_duration: testData.quitDuration,
          on_bp_medicine: testData.bloodPreasureMedicine === "yes",
          final_risk: testResult.final_risk,
          risk_category: testResult.risk_category,
        },
      ]);

    if (insertTestError) {
      // اگر ذخیره تست با خطا مواجه شد (برای عیب‌یابی)
      console.error("Error saving test data:", insertTestError);
      // اینجا می‌توانید تصمیم بگیرید که آیا کاربر ساخته شده را حذف کنید یا نه
      // اما برای MVP، فقط لاگ کردن خطا کافی است
      throw new Error(insertTestError.message);
    }

    return NextResponse.json(
      { message: "ثبت‌نام و ذخیره تست با موفقیت انجام شد.", userId: userId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error during registration and test save:", error);
    return NextResponse.json(
      { error: error.message || "یک خطای غیرمنتظره در سرور رخ داد." },
      { status: 500 }
    );
  }
}
