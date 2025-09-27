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
