"use client";
import InformationForm from "@/views/InformationForm";
import Results from "@/views/Results";
import Stepper from "@/components/stepper";
import RegisterForm from "@/components/RegisterFrom";
import Advices from "@/views/Advices";
import { useState } from "react";
import { AscvdData, AscvdResult } from "@/types/types";
import { AscvdCalculator } from "@/app/server/actions";
import { getAdvices } from "@/app/server/actions";
import type { Advice } from "@/types/AdviceTypes";

const Page = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
      <div className="max-w-[940px] mx-auto mt-6 grid grid-cols-12">
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
        <div className="col-span-9">
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
            <Results results={results} onSubmit={onSubmit} onBack={onBack} />
          )}
          {step === 3 && (
            <>
              <RegisterForm />
              <Advices onBack={onBack} advices={advices} />
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Page;
