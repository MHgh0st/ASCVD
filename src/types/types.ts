export type AscvdData = {
  age: number;
  cholesterol: number;
  bloodPreasuer: number;
  HDLCholesterol: number;
  sex: "male" | "female";
  diabetes: "yes" | "no";
  smoke: "yes" | "no";
  bloodPreasureMedicine: "yes" | "no";
};

export type RiskType = "low" | "borderline" | "intermediate" | "high";
export type AscvdResult = {
  final_risk: number;
  risk_category: RiskType;
};
