import adviceData from "@/data/advices.json";
import type {
  Advice,
  AdviceCategories,
  ConditionValue,
  ComparisonCondition,
  UserData,
  AdviceData,
} from "@/types/AdviceTypes";
import type { AscvdData, AscvdResult } from "@/types/types";

// این تابع بدون تغییر باقی می‌ماند چون منطق آن کاملا درست است
const checkCondition = (
  userValue: string | number | undefined,
  condition: ConditionValue
): boolean => {
  if (userValue === undefined) {
    return false;
  }

  if (typeof condition === "object" && condition !== null) {
    if (typeof userValue !== "number") {
      return false;
    }
    return (Object.keys(condition) as Array<keyof ComparisonCondition>).every(
      (operator) => {
        const conditionValue = condition[operator];
        if (conditionValue === undefined) return true;

        switch (operator) {
          case "lt":
            return userValue < conditionValue;
          case "lte":
            return userValue <= conditionValue;
          case "gt":
            return userValue > conditionValue;
          case "gte":
            return userValue >= conditionValue;
          default:
            return false;
        }
      }
    );
  }
  return userValue === condition;
};

/**
 * این تابع اصلی منطق فیلتر کردن توصیه‌ها است.
 * هم سرور اکشن و هم API Route می‌توانند از این تابع استفاده کنند.
 * @param formData اطلاعات فرم کاربر
 * @param ascvdResult نتیجه محاسبه ریسک
 * @returns آرایه‌ای از توصیه‌های فیلتر شده
 */
export function filterAdvices(
  formData: AscvdData,
  ascvdResult: AscvdResult
): Advice[] {
  const userData: UserData = {
    ...formData,
    ascvdRisk: ascvdResult.final_risk,
  };

  const filteredAdvice: Advice[] = [...(adviceData as AdviceData).general];

  (Object.keys(adviceData) as AdviceCategories[]).forEach((category) => {
    if (category === "general") return;

    const advicesInCategory = (adviceData as AdviceData)[category];

    advicesInCategory.forEach((advice) => {
      if (advice.conditions) {
        const isMatch = (
          Object.keys(advice.conditions) as Array<keyof UserData>
        ).every((key) => {
          const userValue = userData[key];
          const conditionValue = advice.conditions![key];

          // اگر شرط یا مقدار کاربر تعریف نشده بود، آن را نادیده بگیر
          // نکته: اینجا userValue === undefined بررسی نمی‌شود چون checkCondition آن را مدیریت می‌کند
          if (conditionValue === undefined) return true;

          return checkCondition(userValue, conditionValue);
        });

        if (isMatch) {
          filteredAdvice.push(advice);
        }
      }
    });
  });

  return filteredAdvice;
}
