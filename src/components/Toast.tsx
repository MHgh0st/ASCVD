"use client";
import { addToast } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function Toast({
  title,
  message,
  type,
}: {
  title?: string;
  message?: string;
  type: "success" | "error";
}) {
  addToast({
    title: type === "success" ? title : title ? title : "خطایی رخ داد!",
    description: message,
    color: type === "success" ? "success" : "danger",
    timeout: 4000,
    variant: "flat",
    shouldShowTimeoutProgress: true,
    icon:
      type === "success" ? (
        <Icon icon="solar:check-square-bold-duotone" />
      ) : (
        <Icon icon="solar:danger-square-bold-duotone" />
      ),
  });
}
