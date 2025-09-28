import { NextResponse, NextRequest } from "next/server";
import type { RegisterFormData } from "@/types/types";
import { supabase } from "@/utils/supabaseClient";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { name, phone, password }: RegisterFormData = await request.json();

    // Basic validation
    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: "تمام فیلدها الزامی هستند." },
        { status: 400 }
      );
    }

    const { data: existingUser, error: findError } = await supabase
      .from("users") // نام جدول شما
      .select("phone")
      .eq("phone", phone) // جستجو بر اساس شماره موبایل
      .single(); // .single() اگر رکوردی پیدا شود آن را برمی‌گرداند، در غیر این صورت null

    if (findError && findError.code !== "PGRST116") {
      // نادیده گرفتن خطای "عدم وجود ردیف" و بررسی سایر خطاهای احتمالی دیتابیس
      throw findError;
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "این شماره موبایل قبلاً ثبت‌نام کرده است." },
        { status: 409 } // 409 Conflict یک کد وضعیت مناسب برای این حالت است
      );
    }

    const saltRounds = 10; // تعداد دورهای هش کردن (استاندارد)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          fullName: name, // مطمئن شوید نام ستون‌ها با دیتابیس شما مطابقت دارد
          phone: phone,
          password: hashedPassword, // ذخیره رمز عبور هش شده
        },
      ])
      .select();

    if (insertError) {
      // اگر در زمان ساخت ردیف جدید خطایی رخ دهد
      throw insertError;
    }

    return NextResponse.json(
      { message: "ثبت‌نام با موفقیت انجام شد.", user: data },
      { status: 201 } // 201 Created
    );
  } catch (error: any) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: error.message || "یک خطای غیرمنتظره در سرور رخ داد." },
      { status: 500 }
    );
  }
}
