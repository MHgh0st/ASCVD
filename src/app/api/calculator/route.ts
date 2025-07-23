import { NextResponse, NextRequest } from "next/server";
import type { AscvdData } from "@/types/types";
import AscvdCalculator from "@/utils/ascvd";
export async function POST(request: NextRequest) {
  const data = (await request.json()) as AscvdData;
  const { final_risk, risk_category } = AscvdCalculator(data);
  return NextResponse.json({ final_risk, risk_category });
}
