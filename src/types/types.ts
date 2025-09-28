export enum QuitDuration {
  LESS_THAN_ONE_MONTH = "کمتر از یک ماه",
  LESS_THAN_SIX_MONTHS = "کمتر از 6 ماه",
  MORE_THAN_SIX_MONTHS = "بیشتر از 6 ماه",
}

export type AscvdData = {
  age: number;
  cholesterol: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  HDLCholesterol: number;
  LDLCholesterol: number;
  sex: "male" | "female";
  diabetes: "yes" | "no";
  smoke: "yes" | "no" | "former";
  quitDuration?: QuitDuration;
  bloodPreasureMedicine: "yes" | "no";
};

export type RiskType = "low" | "borderline" | "intermediate" | "high";
export type AscvdResult = {
  final_risk: number;
  risk_category: RiskType;
};

export type MobileFormData = {
  name: string;
  phone: string;
  password: string;
};
