import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/utils/supabaseClient";
import { authOptions } from "../../auth/[...nextauth]/route";
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

    // Save test data to database
    const { error: insertTestError } = await supabase
      .from("ascvd_test")
      .insert([
        {
          user_id: userId,
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
      console.error("Error saving test data:", insertTestError);
      return NextResponse.json(
        { error: "خطا در ذخیره تست. لطفا دوباره تلاش کنید." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "تست با موفقیت ذخیره شد." },
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
