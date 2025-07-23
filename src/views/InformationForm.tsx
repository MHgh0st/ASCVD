"use client";
import { Icon } from "@iconify/react";
import { Form, NumberInput, Button, ButtonGroup } from "@heroui/react";
import React, { useState } from "react";
import type { AscvdData } from "@/types/types";

type Options = {
  label: string;
  value: string;
  icon: string;
};

type RadioButtonGroupProps = {
  label: string;
  options: Options[];
  selectedValue: "male" | "female" | "yes" | "no";
  onValueChange: (value: any) => void;
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
              onPress={() => onValueChange(option.value)}
              variant={selectedValue === option.value ? "solid" : "light"}
              color="secondary"
              startContent={<Icon icon={option.icon} className="text-xl" />}
              className={`!justify-end !py-3 !px-6 ${selectedValue === option.value ? "bg-content1 text-secondary" : "text-secondary"}`}
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

const InformationForm = (props: {
  onSubmit: (data: AscvdData) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<AscvdData>({
    age: 58,
    cholesterol: 141,
    bloodPreasuer: 150,
    HDLCholesterol: 34,
    sex: "male",
    diabetes: "no",
    smoke: "no",
    bloodPreasureMedicine: "no",
  });

  const handleChange = React.useCallback((key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const ageErrors = (age: number) => {
    if (age < 30 || age > 99) {
      return "سن باید بین 30 تا 99 سال باشد";
    } else if (age === null || age === undefined || isNaN(age)) {
      return "وارد کردن سن الزامی است";
    }
    return null;
  };

  const cholesterolErrors = (cholesterol: number) => {
    if (cholesterol < 100 || cholesterol > 400) {
      return "سطح کلسترول باید بین 100 تا 400 mg/dl باشد";
    } else if (
      cholesterol === null ||
      cholesterol === undefined ||
      isNaN(cholesterol)
    ) {
      return "وارد کردن سطح کلسترول الزامی است";
    }
    return null;
  };

  const HDLcholesterolErrors = (HDLCholesterol: number) => {
    if (HDLCholesterol < 20 || HDLCholesterol > 100) {
      return "سطح کلسترول HDL باید بین 20 تا 100 mg/dl باشد";
    } else if (
      HDLCholesterol === null ||
      HDLCholesterol === undefined ||
      isNaN(HDLCholesterol)
    ) {
      return "وارد کردن سطح کلسترول HDL الزامی است";
    }
    return null;
  };

  const bloodPreasuerErrors = (bloodPreasuer: number) => {
    if (bloodPreasuer < 80 || bloodPreasuer > 250) {
      return "فشار خون سیستولیک باید بین 80 تا 250 mmHg باشد";
    } else if (
      bloodPreasuer === null ||
      bloodPreasuer === undefined ||
      isNaN(bloodPreasuer)
    ) {
      return "وارد کردن فشار خون سیستولیک الزامی است";
    }
    return null;
  };
  return (
    <div className="text-right ">
      {/* Title */}
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
        {/* ستون راست */}
        <div className="col-span-1 md:col-span-6 flex flex-col gap-10 mt-2 max-w-64">
          <NumberInput
            isRequired
            label="سن"
            errorMessage={ageErrors(formData.age)}
            isInvalid={ageErrors(formData.age) !== null}
            labelPlacement="outside"
            // value={formData.age}
            placeholder="58"
            onValueChange={(value) => {
              handleChange("age", value);
            }}
          />
          <NumberInput
            isRequired
            label="سطح کلسترول (mg/dl)"
            errorMessage={cholesterolErrors(formData.cholesterol)}
            isInvalid={cholesterolErrors(formData.cholesterol) !== null}
            labelPlacement="outside"
            // value={formData.cholesterol}
            placeholder="141"
            onValueChange={(value) => {
              handleChange("cholesterol", value);
            }}
          />
          <NumberInput
            isRequired
            label="سطح کلسترول HDL (mg/dl)"
            errorMessage={HDLcholesterolErrors(formData.HDLCholesterol)}
            isInvalid={HDLcholesterolErrors(formData.HDLCholesterol) !== null}
            labelPlacement="outside"
            // value={formData.HDLCholesterol}
            placeholder="34"
            onValueChange={(value) => {
              handleChange("HDLCholesterol", value);
            }}
          />
          <NumberInput
            isRequired
            label="فشار خون سیستولیک"
            errorMessage={bloodPreasuerErrors(formData.bloodPreasuer)}
            isInvalid={bloodPreasuerErrors(formData.bloodPreasuer) !== null}
            labelPlacement="outside"
            // value={formData.bloodPreasuer}
            placeholder="150"
            onValueChange={(value) => {
              handleChange("bloodPreasuer", value);
            }}
          />
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
        </div>
        <Button
          color="primary"
          className="text-content3 col-span-4"
          type="submit"
          endContent={
            <Icon icon="solar:arrow-left-bold-duotone" className="text-xl" />
          }
          isLoading={props.isLoading}
        >
          ثبت اطلاعات و دیدن نتایج
        </Button>
      </Form>
    </div>
  );
};

export default InformationForm;
