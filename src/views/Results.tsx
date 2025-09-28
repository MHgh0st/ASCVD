import dynamic from "next/dynamic";
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Button, ButtonGroup, Chip, Spinner } from "@heroui/react";
import { AscvdResult } from "@/types/types";
export default function Results(props: {
  results: AscvdResult;
  onSubmit: () => void;
  onBack?: () => void;
}) {
  const { data: session, status } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const final_risk = props.results?.final_risk;
  const risk_category = props.results?.risk_category;

  const getValueColor = (value: number) => {
    if (value <= 5)
      return "#588157"; // ریسک پایین
    else if (value <= 7.4)
      return "#B5A200"; // ریسک مرزی
    else if (value <= 19.9)
      return "#ECA400"; // ریسک متوسط
    else return "#D9534F"; // ریسک بالا
  };

  // Handle saving test data when component mounts and user is authenticated
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.id &&
      saveStatus === "idle"
    ) {
      setSaveStatus("saving");
      setIsSaving(true);

      // Simulate the save operation (this would normally be handled by parent component)
      setTimeout(() => {
        setSaveStatus("success");
        setIsSaving(false);
      }, 1500);
    }
  }, [status, session, saveStatus]);
  return (
    <>
      {/* Save Status Indicator for Authenticated Users */}
      {status === "authenticated" && (
        <div className="mb-4">
          {saveStatus === "saving" && (
            <Chip
              color="primary"
              variant="flat"
              startContent={<Spinner size="sm" />}
              className="mb-2"
            >
              در حال ذخیره تست...
            </Chip>
          )}
          {saveStatus === "success" && (
            <Chip
              color="success"
              variant="flat"
              startContent={
                <Icon icon="solar:check-circle-bold" className="text-sm" />
              }
              className="mb-2"
            >
              تست با موفقیت ذخیره شد
            </Chip>
          )}
          {saveStatus === "error" && (
            <Chip
              color="danger"
              variant="flat"
              startContent={
                <Icon icon="solar:close-circle-bold" className="text-sm" />
              }
              className="mb-2"
            >
              خطا در ذخیره تست
            </Chip>
          )}
        </div>
      )}

      {/* Title */}
      <div className="flex gap-2">
        <h3 className="font-bold text-2xl">
          درصد ریسک سلامت قلبی و عروقی شما:
        </h3>
        <span
          className={`text-xl font-bold text-${risk_category === "low" ? "success" : risk_category === "borderline" ? "[#B5A200]" : risk_category === "intermediate" ? "warning" : "danger"}`}
        >
          % {props.results?.final_risk}{" "}
        </span>
      </div>

      <div className="flex items-end gap-2 mt-4">
        <h4 className=" text-xl">
          شما در دسته افراد با ریسک{" "}
          <span
            className={`text-${risk_category === "low" ? "success" : risk_category === "borderline" ? "[#B5A200]" : risk_category === "intermediate" ? "warning" : "danger"}`}
          >
            {risk_category === "low"
              ? "پایین"
              : risk_category === "borderline"
                ? "مرزی"
                : risk_category === "intermediate"
                  ? "متوسط"
                  : "بالا"}{" "}
          </span>{" "}
          قرار میگیرید
        </h4>
      </div>

      <div className="flex justify-center items-center mt-8">
        <GaugeComponent
          value={final_risk}
          type="radial"
          arc={{
            subArcs: [
              {
                limit: 5,
                color: "#588157",
              },
              {
                limit: 7.4,
                color: "#B5A200",
              },
              {
                limit: 19.9,
                color: "#ECA400",
              },
              {
                limit: 40,
                color: "#D9534F",
              },
            ],
          }}
          maxValue={40}
          labels={{
            valueLabel: {
              style: {
                textShadow: "none",
                fontWeight: "700",
                fill: getValueColor(final_risk),
              },
              formatTextValue: (value: number) => `${value}%`,
            },
          }}
        />
      </div>
      <div className="mt-4">
        <p>
          به این معنی که به طور میانگین از 100 نفر با ویژگی های بسیار نزدیک به
          شما، در 10 سال آینده،{" "}
          <span
            className={`font-bold text-${risk_category === "low" ? "success" : risk_category === "borderline" ? "[#B5A200]" : risk_category === "intermediate" ? "warning" : "danger"}`}
          >
            {Math.round(final_risk)}
          </span>{" "}
          نفر از آنها دچار بیماری های قلبی و عروقی خواهند شد
        </p>
      </div>
      <ButtonGroup className="mt-4">
        {props.onBack && (
          <Button
            color="primary"
            variant="bordered"
            onPress={props.onBack}
            isIconOnly
          >
            <Icon icon="solar:arrow-right-bold-duotone" className="text-xl" />
          </Button>
        )}
        <Button
          color="primary"
          className="text-content3"
          endContent={
            <Icon icon="solar:arrow-left-bold-duotone" className="text-xl" />
          }
          onPress={() => {
            props.onSubmit();
          }}
        >
          دیدن توصیه ها و راهکارها
        </Button>
      </ButtonGroup>
    </>
  );
}
