"use client";
import { Icon } from "@iconify/react";
import { Form, NumberInput, Button, ButtonGroup } from "@heroui/react";
import React from "react";
import type { AscvdData } from "@/types/types";

type Options = {
  label: string;
  value: string;
  icon: string;
};

type RadioButtonGroupProps = {
  label: string;
  options: Options[];
  selectedValue: "male" | "female" | "yes" | "no" | "former";
  onValueChange: (value: "male" | "female" | "yes" | "no" | "former") => void;
};

const RadioButtonGroup = React.memo<RadioButtonGroupProps>(
  ({ label, options, selectedValue, onValueChange }) => {
    return (
      <div className="space-y-2 w-full">
        <p className="text-gray-800 text-sm">{label}</p>
        <ButtonGroup>
          {options.map((option) => (
            <Button
              key={option.value}
              onPress={() => onValueChange(option.value as any)}
              variant={selectedValue === option.value ? "solid" : "light"}
              color="secondary"
              startContent={<Icon icon={option.icon} className="text-xl" />}
              className={`!justify-end !py-3 !px-6 ${
                selectedValue === option.value
                  ? "bg-content1 text-secondary"
                  : "text-secondary"
              }`}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    );
  }
);
RadioButtonGroup.displayName = "RadioButtonGroup";

interface NumberInputConfig {
  name: keyof AscvdData;
  label: string;
  placeholder: string;
  min: number;
  max: number;
  rangeErrorMessage: string;
}

const numberInputFields: NumberInputConfig[] = [
  {
    name: "age",
    label: "سن",
    placeholder: "58",
    min: 40,
    max: 79,
    rangeErrorMessage: "سن باید بین 40 تا 79 سال باشد",
  },
  {
    name: "cholesterol",
    label: "سطح کلسترول تام (mg/dl)",
    placeholder: "141",
    min: 100,
    max: 400,
    rangeErrorMessage: "سطح کلسترول باید بین 100 تا 400 mg/dl باشد",
  },
  {
    name: "HDLCholesterol",
    label: "سطح کلسترول HDL (mg/dl)",
    placeholder: "34",
    min: 20,
    max: 100,
    rangeErrorMessage: "سطح کلسترول HDL باید بین 20 تا 100 mg/dl باشد",
  },
  {
    name: "LDLCholesterol",
    label: "سطح کلسترول بد LDL (mg/dl)",
    placeholder: "50",
    min: 20,
    max: 100,
    rangeErrorMessage: "سطح کلسترول بد LDL باید بین 20 تا 100 mg/dl باشد",
  },
  {
    name: "bloodPressureSystolic",
    label: "فشار خون سیستولیک",
    placeholder: "150",
    min: 80,
    max: 250,
    rangeErrorMessage: "فشار خون سیستولیک باید بین 80 تا 250 mmHg باشد",
  },
  {
    name: "bloodPressureDiastolic",
    label: "فشار خون دیاستولیک",
    placeholder: "150",
    min: 80,
    max: 250,
    rangeErrorMessage: "فشار خون دیاستولیک باید بین 80 تا 250 mmHg باشد",
  },
];

const InformationForm = (props: {
  onSubmit: (data: AscvdData) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = React.useState<AscvdData>({
    age: 58,
    cholesterol: 141,
    bloodPressureSystolic: 150,
    bloodPressureDiastolic: 90,
    HDLCholesterol: 34,
    LDLCholesterol: 50,
    sex: "male",
    diabetes: "no",
    smoke: "no",
    bloodPreasureMedicine: "no",
  });

  const handleChange = React.useCallback((key: keyof AscvdData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validateNumericField = (value: number, config: NumberInputConfig) => {
    if (value === null || value === undefined || isNaN(value)) {
      return `وارد کردن ${config.label} الزامی است`;
    }
    if (value < config.min || value > config.max) {
      return config.rangeErrorMessage;
    }
    return null;
  };

  return (
    <>
      <div className="flex items-end gap-2">
        <h1 className="font-bold text-3xl">تست سلامت قلبی و عروقی (ASCVD)</h1>
        <span>
          <Icon
            icon="solar:question-square-bold-duotone"
            className="text-xl cursor-pointer text-gray-500"
          />
        </span>
      </div>

      <Form
        className="grid grid-cols-1 md:grid-cols-12 gap-x-14 gap-y-14 mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit(formData);
        }}
      >
        <div className="col-span-1 md:col-span-6 flex flex-col gap-10 mt-2 max-w-64">
          {numberInputFields.map((field) => {
            const errorMessage = validateNumericField(
              formData[field.name] as number,
              field
            );
            return (
              <NumberInput
                key={field.name}
                hideStepper
                isRequired
                label={field.label}
                placeholder={field.placeholder}
                errorMessage={errorMessage}
                isInvalid={errorMessage !== null}
                labelPlacement="outside"
                onValueChange={(value) => handleChange(field.name, value)}
              />
            );
          })}
        </div>

        {/* ستون چپ */}
        <div className="col-span-1 md:col-span-6 flex flex-col gap-10">
          <RadioButtonGroup
            label="جنسیت"
            options={[
              { label: "مرد", value: "male", icon: "solar:men-bold-duotone" },
              {
                label: "زن",
                value: "female",
                icon: "solar:women-bold-duotone",
              },
            ]}
            selectedValue={formData.sex}
            onValueChange={(value) => handleChange("sex", value)}
          />
          <RadioButtonGroup
            label="آیا سابقه دیابت دارید؟"
            options={[
              {
                label: "بله",
                value: "yes",
                icon: "solar:check-square-bold-duotone",
              },
              {
                label: "خیر",
                value: "no",
                icon: "solar:close-square-bold-duotone",
              },
            ]}
            selectedValue={formData.diabetes}
            onValueChange={(value) => handleChange("diabetes", value)}
          />
          <RadioButtonGroup
            label="در حال حاضر سیگار میکشید؟"
            options={[
              {
                label: "بله",
                value: "yes",
                icon: "solar:check-square-bold-duotone",
              },
              {
                label: "قبلا میکشیدم",
                value: "former",
                icon: "solar:clock-square-bold-duotone",
              },
              {
                label: "خیر",
                value: "no",
                icon: "solar:close-square-bold-duotone",
              },
            ]}
            selectedValue={formData.smoke}
            onValueChange={(value) => handleChange("smoke", value)}
          />
          <RadioButtonGroup
            label="آیا داروی فشار خون مصرف میکنید؟"
            options={[
              {
                label: "بله",
                value: "yes",
                icon: "solar:check-square-bold-duotone",
              },
              {
                label: "خیر",
                value: "no",
                icon: "solar:close-square-bold-duotone",
              },
            ]}
            selectedValue={formData.bloodPreasureMedicine}
            onValueChange={(value) =>
              handleChange("bloodPreasureMedicine", value)
            }
          />
          <Button
            color="primary"
            className="text-content3 w-fit mt-4"
            type="submit"
            endContent={
              <Icon icon="solar:arrow-left-bold-duotone" className="text-xl" />
            }
            isLoading={props.isLoading}
          >
            ثبت اطلاعات و دیدن نتایج
          </Button>
        </div>
      </Form>
    </>
  );
};

export default InformationForm;
