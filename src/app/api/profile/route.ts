import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/utils/supabaseClient";
// Assuming your NextAuth handler is exported from this path
import { authOptions } from "@/app/server/AuthOptions";
import { filterAdvices } from "@/utils/filterAdvices";
import type { AscvdData, AscvdResult } from "@/types/types";
import type { Advice } from "@/types/AdviceTypes";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Fetch user details and test history in parallel
    const [userPromise, testsPromise] = await Promise.all([
      supabase
        .from("users")
        .select("fullName, phone, created_at")
        .eq("id", userId)
        .single(),
      supabase
        .from("ascvd_test")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

    const { data: userData, error: userError } = userPromise;
    const { data: testsData, error: testsError } = testsPromise;

    if (userError) {
      console.error("Error fetching user data:", userError);
      throw new Error("Could not fetch user profile.");
    }

    if (testsError) {
      console.error("Error fetching test history:", testsError);
      throw new Error("Could not fetch test history.");
    }

    // Get the latest test for advices
    const latestTest = testsData && testsData.length > 0 ? testsData[0] : null;

    let latestAdvices: Advice[] = [];
    if (latestTest) {
      try {
        const formData: AscvdData = {
          age: latestTest.age || 58,
          cholesterol: latestTest.total_cholesterol || 141,
          bloodPressureSystolic: latestTest.systolic_bp || 150,
          bloodPressureDiastolic: latestTest.diastolic_bp || 90,
          HDLCholesterol: latestTest.hdl_cholesterol || 34,
          LDLCholesterol: latestTest.ldl_cholesterol || 50,
          sex: latestTest.sex || "male",
          diabetes: latestTest.has_diabetes || "no",
          smoke: latestTest.is_smoker || "no",
          quitDuration: latestTest.quit_duration || undefined,
          bloodPreasureMedicine: latestTest.on_bp_medicine || "no",
        };

        const ascvdResult: AscvdResult = {
          final_risk: latestTest.final_risk || 0,
          risk_category: latestTest.risk_category || "low",
        };

        latestAdvices = filterAdvices(formData, ascvdResult);
      } catch (adviceError) {
        console.error("Error generating advices:", adviceError);
        // Continue without advices if there's an error
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
