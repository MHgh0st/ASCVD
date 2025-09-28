"use client";
import InformationForm from "@/views/InformationForm";
import Results from "@/views/Results";
import Stepper from "@/components/stepper";
import RegisterForm from "@/components/RegisterFrom";
import Advices from "@/views/Advices";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { AscvdData, AscvdResult } from "@/types/types";
import { AscvdCalculator } from "@/app/server/actions";
import { getAdvices } from "@/app/server/actions";
import type { Advice } from "@/types/AdviceTypes";

const Page = () => {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [testSaved, setTestSaved] = useState(false); // اضافه کردن flag برای جلوگیری از ذخیره مجدد
  const [results, setResults] = useState<AscvdResult>({
    final_risk: 0,
    risk_category: "low",
  });
  const [advices, setAdvices] = useState<Advice[]>([]);
  const [formData, setFormData] = useState<AscvdData>({
    age: 58,
    cholesterol: 141,
    bloodPressureSystolic: 150,
    bloodPressureDiastolic: 90,
    HDLCholesterol: 34,
    LDLCholesterol: 50,
    sex: "male",
    diabetes: "no",
    smoke: "no",
    quitDuration: undefined,
    bloodPreasureMedicine: "no",
  });

  const onSubmit = async (submittedFormData?: AscvdData) => {
    if (step === 1) {
      // Save the form data before moving to next step
      if (submittedFormData) {
        setFormData(submittedFormData);
        // Use the submitted data directly for navigation to ensure we have the latest values
        setIsLoading(true);
        const data = (await AscvdCalculator(submittedFormData)) as AscvdResult;
        setResults(data);
        console.log("form data: ", submittedFormData);
        setStep(2);
      }
    } else if (step === 2) {
      // If user is authenticated, save the test data automatically (only if not already saved)
      if (status === "authenticated" && session?.user?.id && !testSaved) {
        try {
          const response = await fetch("/api/test/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              testData: formData,
              testResult: results,
            }),
          });

          if (response.ok) {
            console.log("تست با موفقیت برای کاربر authenticated ذخیره شد");
            setTestSaved(true); // تنظیم flag برای جلوگیری از ذخیره مجدد
          } else {
            const errorData = await response.json();
            console.error("خطا در ذخیره تست:", errorData.error);
          }
        } catch (error) {
          console.error("خطا در اتصال به API ذخیره تست:", error);
        }
      }

      setAdvices(await getAdvices(formData, results));
      console.log("advices: ", advices);
      setStep(3);
    }
    setIsLoading(false);
  };

  const onBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <>
      <div className="max-w-[940px] mx-auto mt-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-6">
          <div className="col-span-3">
            <Stepper
              className="mt-3"
              currentStepId={step}
              steps={[
                {
                  id: 1,
                  label: "وارد کردن اطلاعات",
                },
                {
                  id: 2,
                  label: "دیدن نتایج",
                },
                {
                  id: 3,
                  label: "حالا باید چیکار کنم؟",
                },
              ]}
            />
          </div>
          <div className="md:col-span-9 order-1 lg:order-2">
            {step === 1 && (
              <>
                <InformationForm
                  onSubmit={onSubmit}
                  isLoading={isLoading}
                  initialData={formData}
                />
              </>
            )}
            {step === 2 && (
              <Results
                results={results}
                onSubmit={onSubmit}
                onBack={onBack}
                testAlreadySaved={testSaved}
              />
            )}
            {step === 3 && (
              <>
                <RegisterForm ascvdData={formData} ascvdResult={results} />
                <Advices onBack={onBack} advices={advices} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;
