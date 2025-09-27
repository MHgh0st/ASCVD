import { AscvdData, RiskType } from "@/types/types";

export default function AscvdCalculator(data: AscvdData) {
  const age = data.age;
  const total_chol = data.cholesterol;
  const hdl_chol = data.HDLCholesterol;
  const systolic_bp = data.bloodPressureSystolic;
  const is_smoker = data.smoke === "yes" ? 1 : 0;
  const has_diabetes = data.diabetes === "yes" ? 1 : 0;
  const on_bp_meds = data.bloodPreasureMedicine === "yes" ? 1 : 0;

  let risk_sum = 0;
  let final_risk = 0;

  if (data.sex === "male") {
    risk_sum += 12.344 * Math.log(age);
    risk_sum += 11.853 * Math.log(total_chol);
    risk_sum += -2.664 * Math.log(age) * Math.log(total_chol);
    risk_sum += -7.99 * Math.log(hdl_chol);
    risk_sum += 1.769 * Math.log(age) * Math.log(hdl_chol);
    if (on_bp_meds === 1) {
      risk_sum += 1.797 * Math.log(systolic_bp);
    } else {
      risk_sum += 1.764 * Math.log(systolic_bp);
    }
    risk_sum += 7.837 * is_smoker;
    risk_sum += -1.795 * Math.log(age) * is_smoker;
    risk_sum += 0.658 * has_diabetes;

    const mean_risk = 61.18;
    const baseline_survival = 0.9144;
    final_risk =
      (1 - Math.pow(baseline_survival, Math.exp(risk_sum - mean_risk))) * 100;
  } else if (data.sex === "female") {
    risk_sum += -29.799 * Math.log(age);
    risk_sum += 4.884 * Math.pow(Math.log(age), 2);
    risk_sum += 13.54 * Math.log(total_chol);
    risk_sum += -3.114 * Math.log(age) * Math.log(total_chol);
    risk_sum += -13.578 * Math.log(hdl_chol);
    risk_sum += 3.149 * Math.log(age) * Math.log(hdl_chol);
    if (on_bp_meds === 1) risk_sum += 2.019 * Math.log(systolic_bp);
    else risk_sum += 1.957 * Math.log(systolic_bp);
    risk_sum += 7.574 * is_smoker;
    risk_sum += -1.665 * Math.log(age) * is_smoker;
    risk_sum += 0.661 * has_diabetes;

    const mean_risk = -29.18;
    const baseline_survival = 0.9665;

    final_risk =
      (1 - Math.pow(baseline_survival, Math.exp(risk_sum - mean_risk))) * 100;
  }
  final_risk = Math.round(final_risk * 100) / 100;
  let risk_category: RiskType;
  if (final_risk < 5) {
    risk_category = "low";
  } else if (final_risk >= 5 && final_risk < 7.4) {
    risk_category = "borderline";
  } else if (final_risk >= 7.4 && final_risk < 19.9) {
    risk_category = "intermediate";
  } else {
    risk_category = "high";
  }
  return { final_risk, risk_category };
}
