"use client";
import { Icon } from "@iconify/react";
import {
  Form,
  NumberInput,
  Button,
  ButtonGroup,
  Select,
  SelectItem,
} from "@heroui/react";
import React, { useEffect } from "react";
import type { AscvdData } from "@/types/types";
import { QuitDuration } from "@/types/types";

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
  initialData?: AscvdData;
}) => {
  const [formData, setFormData] = React.useState<AscvdData>(
    props.initialData || {
      age: 0,
      cholesterol: 0,
      bloodPressureSystolic: 0,
      bloodPressureDiastolic: 0,
      HDLCholesterol: 0,
      LDLCholesterol: 0,
      sex: "male",
      diabetes: "no",
      smoke: "no",
      quitDuration: undefined,
      bloodPreasureMedicine: "no",
    }
  );

  const handleChange = React.useCallback((key: keyof AscvdData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Update form data when initialData prop changes
  useEffect(() => {
    if (props.initialData) {
      console.log(
        "InformationForm: Updating form data with initialData:",
        props.initialData
      );
      setFormData(props.initialData);
    }
  }, [props.initialData]);

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
        <h1 className="font-bold text-3xl text-center md:text-right">
          تست سلامت قلبی و عروقی (ASCVD)
        </h1>
        {/* <span>
          <Icon
            icon="solar:question-square-bold-duotone"
            className="text-xl cursor-pointer text-gray-500"
          />
        </span> */}
      </div>
      <p className="mt-2 font-medium text-sm text-content3/60 text-center md:text-right">
        این محاسبه گر تنها برای افرادی کاربرد دارد که سابقه هیچ گونه ابتلایی به
        بیماری های قلبی عروقی ناشی از آترواسکلروز از قبیل سکته قلبی و مغزی،
        ندارند.
      </p>

      <Form
        className="mt-6 justify-center items-center pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit(formData);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14">
          <div className="flex flex-col gap-6 md:gap-10 mt-2">
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
                  value={formData[field.name] as number}
                  onValueChange={(value) => handleChange(field.name, value)}
                />
              );
            })}
          </div>

          {/* ستون چپ */}
          <div className="flex flex-col gap-6 md:gap-10">
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

            {formData.smoke === "former" && (
              <Select
                label="چه مدتیه که سیگار رو ترک کردید"
                placeholder="مدت زمان ترک سیگار را انتخاب کنید"
                selectedKeys={
                  formData.quitDuration ? [formData.quitDuration] : []
                }
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys)[0] as QuitDuration;
                  handleChange("quitDuration", selectedValue);
                }}
              >
                <SelectItem key={QuitDuration.LESS_THAN_ONE_MONTH}>
                  کمتر از یک ماه
                </SelectItem>
                <SelectItem key={QuitDuration.LESS_THAN_SIX_MONTHS}>
                  کمتر از 6 ماه
                </SelectItem>
                <SelectItem key={QuitDuration.MORE_THAN_SIX_MONTHS}>
                  بیشتر از 6 ماه
                </SelectItem>
              </Select>
            )}

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
                <Icon
                  icon="solar:arrow-left-bold-duotone"
                  className="text-xl"
                />
              }
              isLoading={props.isLoading}
            >
              ثبت اطلاعات و دیدن نتایج
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default InformationForm;
