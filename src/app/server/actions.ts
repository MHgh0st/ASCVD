"use server";

import type { AscvdData } from "@/types/types";

export async function AscvdCalculator(Data: AscvdData) {
  const result = await fetch("http://localhost:3000/api/calculator", {
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
