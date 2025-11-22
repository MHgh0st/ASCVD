import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/utils/prisma"; // استفاده از کلاینت پریسما
import { authOptions } from "@/app/server/AuthOptions";
import { filterAdvices } from "@/utils/filterAdvices";
import type { AscvdData, AscvdResult } from "@/types/types";
import type { Advice } from "@/types/AdviceTypes";
import type { QuitDuration } from "@/types/types";
import type { RiskType } from "@/types/types";
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // تبدیل آیدی استرینگ سشن به عدد (چون در دیتابیس id از نوع Int است)
  const userId = session.user.id;

  // if (isNaN(userId)) {
  //   return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
  // }

  try {
    // Fetch user details and test history in parallel using Prisma
    const [userData, testsData] = await Promise.all([
      // 1. دریافت اطلاعات کاربر
      prisma.users.findUnique({
        where: { id: userId },
        select: {
          fullName: true,
          phone: true,
          created_at: true,
        },
      }),
      // 2. دریافت تاریخچه تست‌ها
      prisma.tests.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
      }),
    ]);

    if (!userData) {
      throw new Error("Could not fetch user profile.");
    }

    // نکته: در پریسما اگر اروری رخ دهد معمولا throw می‌شود، پس چک کردن testsData برای null بودن خیلی لازم نیست
    // اما آرایه خالی ممکن است برگردد که مشکلی نیست.

    // Get the latest test for advices
    const latestTest = testsData && testsData.length > 0 ? testsData[0] : null;

    let latestAdvices: Advice[] = [];
    if (latestTest) {
      try {
        // نکته: پریسما مقادیر null را برمی‌گرداند، برای اطمینان از مقادیر پیش‌فرض استفاده می‌کنیم
        const formData: AscvdData = {
          age: latestTest.age || 58,
          cholesterol: latestTest.total_cholesterol || 141,
          bloodPressureSystolic: latestTest.systolic_bp || 150,
          bloodPressureDiastolic: latestTest.diastolic_bp || 90,
          HDLCholesterol: latestTest.hdl_cholesterol || 34,
          LDLCholesterol: latestTest.ldl_cholesterol || 50,
          sex: (latestTest.sex as "male" | "female") || "male", // کست کردن تایپ برای اطمینان
          diabetes: latestTest.has_diabetes ? "yes" : "no",
          smoke: (latestTest.is_smoker as "yes" | "no") || "no",
          quitDuration: (latestTest.quit_duration as QuitDuration) || undefined,
          bloodPreasureMedicine: latestTest.on_bp_medicine ? "yes" : "no",
        };

        const ascvdResult: AscvdResult = {
          final_risk: latestTest.final_risk || 0,
          risk_category: (latestTest.risk_category as RiskType) || "low",
        };

        latestAdvices = filterAdvices(formData, ascvdResult);
      } catch (adviceError) {
        console.error("Error generating advices:", adviceError);
        latestAdvices = [];
      }
    }

    return NextResponse.json({
      user: userData,
      tests: testsData,
      latestAdvices: latestAdvices,
    });
  } catch (error: any) {
    console.error("Error in profile API:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
