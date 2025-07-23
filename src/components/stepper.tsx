// src/components/Stepper.tsx

import React from "react";
import { Icon } from "@iconify/react";

// تعریف نوع داده برای هر مرحله
export type Step = {
  id: number | string;
  label: string;
};

// تعریف پراپ‌های ورودی کامپوننت
type StepperProps = {
  steps: Step[];
  currentStepId: number | string;
  className?: string;
};

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepId,
  className,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStepId;
        const isLastStep = index === steps.length - 1;

        return (
          // هر مرحله یک ردیف در یک کانتینر فلکس است
          <div key={step.id} className="flex justify-start gap-x-4">
            {/* بخش آیکون و خط اتصال‌دهنده */}
            <div className="flex flex-col items-center">
              {/* آیکون مربع شکل */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300
                  ${isCurrent ? "bg-primary" : step.id < currentStepId ? "" : "border-2 border-secondary"}`}
              >
                {/* مربع کوچک داخلی که فقط در حالت فعال نمایش داده می‌شود */}
                {isCurrent && (
                  <div className="w-2.5 h-2.5 bg-secondary rounded-sm" />
                )}
                {step.id < currentStepId && (
                  <Icon
                    icon="solar:check-square-bold-duotone"
                    className="text-4xl text-secondary"
                  />
                )}
              </div>

              {/* خط اتصال‌دهنده که برای آخرین مرحله رندر نمی‌شود */}
              {!isLastStep && <div className="w-0.5 h-5 bg-secondary my-1 " />}
            </div>

            {/* بخش متن یا لیبل */}
            <p
              className={`transition-colors duration-300 ${isCurrent ? "text-lg font-medium text-gray-900" : "font-medium text-gray-500"}`}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
