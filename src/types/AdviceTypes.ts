import type { AscvdData, AscvdResult, QuitDuration } from "@/types/types";

export type UserData = AscvdData & { ascvdRisk: number };
export type ComparisonCondition = {
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
};
export type ConditionValue =
  | string
  | number
  | ComparisonCondition
  | QuitDuration;
export type AdviceConditions = Partial<{
  [K in keyof UserData]: ConditionValue;
}>;
export interface Advice {
  id: string;
  title: string;
  details: string;
  source: string;
  conditions?: AdviceConditions;
}
export type AdviceCategories =
  | "general"
  | "hypertension"
  | "statin"
  | "smoking"
  | "aspirin"
  | "diabetes";
export type AdviceData = Record<AdviceCategories, Advice[]>;
export interface AdviceRequest {
  formData: AscvdData;
  ascvdResult: AscvdResult;
}
