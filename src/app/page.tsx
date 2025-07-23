"use client";
import InformationForm from "@/views/InformationForm";
import Results from "@/views/Results";
import Stepper from "@/components/stepper";
import { useState } from "react";
import { Button } from "@heroui/react";
import { AscvdData, RiskType, AscvdResult } from "@/types/types";
import { AscvdCalculator } from "@/app/server/actions";
const Page = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AscvdResult>();

  const onSubmit = async (formData: AscvdData) => {
    if (step === 1) {
      setIsLoading(true);
      const data = (await AscvdCalculator(formData)) as AscvdResult;
      setResults(data);
      setStep(2);
    }

    setIsLoading(false);
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
            <InformationForm onSubmit={onSubmit} isLoading={isLoading} />
          )}
          {step === 2 && <Results results={results} />}
        </div>
      </div>
    </>
  );
};
export default Page;
