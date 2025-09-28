"use client";
import { Modal, ModalContent, Button, Input, Form } from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
export type LoginFormData = {
  phone: string;
  password: string;
};

export default function LoginForm({
  isOpen,
  onSubmit,
  onSwitchToRegister,
  onClose,
  isLoading,
}: {
  isOpen: boolean;
  onSubmit: (data: LoginFormData) => void;
  onSwitchToRegister?: () => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      phone: "",
      password: "",
    },
    mode: "onChange",
  });

  const formData = watch();

  const validateForm = () => {
    let isValid = true;

    const phoneRegex = /^09\d{9}$/;
    if (!formData.phone) {
      setError("phone", { message: "وارد کردن شماره موبایل الزامی است." });
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      setError("phone", {
        message: "فرمت شماره موبایل صحیح نیست (مثال: 09123456789)",
      });
      isValid = false;
    }

    if (!formData.password) {
      setError("password", { message: "وارد کردن رمز عبور الزامی است." });
      isValid = false;
    } else if (formData.password.length < 8) {
      setError("password", {
        message: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
      });
      isValid = false;
    }

    return isValid;
  };

  const onFormSubmit = (data: LoginFormData) => {
    if (validateForm()) {
      onSubmit(data);
    }
  };

  const handleValueChange = (field: keyof LoginFormData, value: string) => {
    if (errors[field]) {
      clearErrors(field);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      backdrop="blur"
      size="sm"
      onClose={() => {
        onClose();
      }}
    >
      <ModalContent className="flex flex-col justify-center items-center gap-y-2 p-4 md:p-6 text-content3">
        <p className="text-2xl md:text-3xl font-bold">ورود به حساب کاربری</p>
        <Form
          validationBehavior="aria"
          className="w-full flex flex-col justify-center items-center"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <p className="font-light text-sm text-center mb-4">
            لطفا اطلاعات خود را وارد کنید
          </p>

          <Input
            label="شماره موبایل"
            placeholder="09123456789"
            value={formData.phone}
            {...register("phone", {
              onChange: (e) => handleValueChange("phone", e.target.value),
            })}
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
          />

          <Input
            label="رمز عبور"
            placeholder="رمز عبور خود را وارد کنید"
            type="password"
            value={formData.password}
            {...register("password", {
              onChange: (e) => handleValueChange("password", e.target.value),
            })}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <Button
            color="primary"
            className="text-content3"
            fullWidth
            type="submit"
            isLoading={isLoading}
          >
            ورود
          </Button>

          {onSwitchToRegister && (
            <Button
              variant="light"
              className="text-content3 mt-2"
              fullWidth
              onPress={onSwitchToRegister}
            >
              ثبت نام
            </Button>
          )}
        </Form>
      </ModalContent>
    </Modal>
  );
}
