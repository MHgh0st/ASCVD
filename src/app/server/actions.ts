"use server";

import type { AscvdData, AscvdResult } from "@/types/types";
import type { Advice } from "@/types/AdviceTypes";
import { filterAdvices } from "@/utils/filterAdvices";

export async function AscvdCalculator(Data: AscvdData) {
  const result = await fetch("https://ascvdupdates.vercel.app/api/calculator", {
    method: "POST",
    body: JSON.stringify(Data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!result.ok) {
    throw new Error("Failed to calculate ASCVD risk");
  }
  try {
    const data = await result.json();
    return data;
  } catch (error) {
    throw new Error("Failed to parse response from ASCVD calculator: " + error);
  }
}

export async function getAdvices(
  formData: AscvdData,
  ascvdResult: AscvdResult
): Promise<Advice[]> {
  try {
    const advices = filterAdvices(formData, ascvdResult);
    return advices;
  } catch (error) {
    console.error("Error in getAdvices server action:", error);
    throw new Error(`Failed to get advices due to a server error : ${error}`);
  }
}
