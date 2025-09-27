"use client";
import InformationForm from "@/views/InformationForm";
import Results from "@/views/Results";
import Stepper from "@/components/stepper";
import MobileForm from "@/components/MobileFrom";
import Advices from "@/views/Advices";
import { useState } from "react";
import { AscvdData, AscvdResult } from "@/types/types";
import { AscvdCalculator } from "@/app/server/actions";
import type { MobileFormData } from "@/types/types";
import { addToast } from "@heroui/react";
import { Icon } from "@iconify/react";

const Page = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(true);
  const [results, setResults] = useState<AscvdResult>({
    final_risk: 0,
    risk_category: "low",
  });

  const onSubmit = async (formData?: AscvdData) => {
    if (step === 1) {
      setIsLoading(true);
      const data = (await AscvdCalculator(formData!)) as AscvdResult;
      setResults(data);
      console.log("results: ", data);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      console.log("going to step 3...");
    }
    setIsLoading(false);
  };

  const SubmitMobileForm = (data: MobileFormData) => {
    // TODO: در اینجا باید api مربوط به ثبت نام کاربر رو فراخوانی کنی
    console.log("Mobile Form Data:", data);
    addToast({
      title: "ثبت نام با موفقیت انجام شد!",
      description: "برای دیدن تست های خود، وارد شوید.",
      color: "success",
      variant: "flat",
      icon: (
        <Icon icon="solar:check-square-bold-duotone" className="text-2xl" />
      ),
      timeout: 4000,
      shouldShowTimeoutProgress: true,
    });
    setIsMobileFormOpen(false);
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
          {step === 2 && <Results results={results} onSubmit={onSubmit} />}
          {step === 3 && (
            <>
              {/* <MobileForm
                isOpen={isMobileFormOpen}
                onSubmit={SubmitMobileForm}
              /> */}
              <Advices />
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Page;
