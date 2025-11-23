"use client";
import {
  Modal,
  ModalContent,
  Button,
  Input,
  Form,
  InputOtp,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import type { RegisterFormData, AscvdData, AscvdResult } from "@/types/types";
import Toast from "@/components/Toast";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";

// 1. تایپ onSubmit رو به‌روزرسانی می‌کنیم تا داده‌ها رو هم ارسال کنه
export default function RegisterForm({
  ascvdData,
  ascvdResult,
}: {
  ascvdData: AscvdData;
  ascvdResult: AscvdResult;
}) {
  const { status } = useSession();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isOpen, setIsOpen] = useState(status === "unauthenticated");
  const [otpHash, setOtpHash] = useState<string>();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormData & { otp: string }>({
    defaultValues: {
      name: "",
      phone: "",
      otp: "",
      password: "",
    },
    mode: "onChange",
  });

  const formData = watch();

  // 2. افکت برای مدیریت تایمر شمارش معکوس
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      // پاک کردن اینتروال در صورت بسته شدن کامپوننت
      return () => clearInterval(interval);
    }
  }, [timer]);
  useEffect(() => {
    if (step === 2) {
      setTimer(30);
    }
  }, [step]);

  const validateStep1 = () => {
    let isValid = true;

    if (!formData.name?.trim()) {
      setError("name", { message: "وارد کردن نام و نام خانوادگی الزامی است." });
      isValid = false;
    }

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

    // Password validation
    if (!formData.password) {
      setError("password", { message: "وارد کردن رمز عبور الزامی است." });
      isValid = false;
    } else if (formData.password.length < 8) {
      setError("password", {
        message: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
      });
      isValid = false;
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      setError("password", {
        message: "رمز عبور باید حداقل شامل یک حرف کوچک انگلیسی باشد.",
      });
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError("password", {
        message: "رمز عبور باید حداقل شامل یک حرف بزرگ انگلیسی باشد.",
      });
      isValid = false;
    } else if (!/(?=.*\d)/.test(formData.password)) {
      setError("password", {
        message: "رمز عبور باید حداقل شامل یک عدد باشد.",
      });
      isValid = false;
    }
    //  else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
    //   setError("password", {
    //     message: "رمز عبور باید حداقل شامل یک کاراکتر خاص (@$!%*?&) باشد.",
    //   });
    //   isValid = false;
    // }

    return isValid;
  };

  // 3. تابع ولیدیشن برای کد OTP
  const validateStep2 = () => {
    let isValid = true;

    if (!formData.otp || formData.otp.length < 5) {
      setError("otp", {
        message: `کد تایید باید ۵ رقم باشد. شما ${formData.otp?.length || 0} رقم وارد کرده‌اید.`,
      });
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async (data: RegisterFormData) => {
    const response = await fetch("/api/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        registrationData: data, // داده‌های ثبت‌نام (نام، موبایل، پسورد)
        testData: ascvdData, // داده‌های ورودی تست
        testResult: ascvdResult, // نتیجه تست
      }),
    });
    if (!response.ok) {
      const resData = await response.json();
      const errorMessage =
        typeof resData.error === "object"
          ? resData.error.message
          : resData.error;
      Toast({
        message:
          errorMessage || "خطایی در ثبت‌نام رخ داد. لطفا دوباره تلاش کنید.",
        type: "error",
      });
      return;
    }
    // console.log("Mobile Form Data:", data);
    Toast({
      title: "ثبت نام با موفقیت انجام شد",
      message: "برای دیدن تست های خود وارد صفحه پروفایل شوید",
      type: "success",
    });
    setIsOpen(false);
  };

  const sendOTP = async (phoneNumber: string) => {
    const response = await fetch("/api/requestOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
      }),
    });
    const resData = await response.json();
    if (response.ok) {
      Toast({
        title: `کد ورود با موفقیت به شماره ی ${phoneNumber} ارسال شد`,
        type: "success",
      });
      return resData.hash;
    } else {
      Toast({
        title: "ارسال کد با خطا مواجه شد",
        message: resData.error,
        type: "error",
      });
      return "";
    }
  };

  const handleRequestOtp = async () => {
    if (validateStep1()) {
      setIsLoading(true);
      const hash = await sendOTP(formData.phone);
      if (hash !== "") {
        setOtpHash(hash);
        setStep(2);
      }
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (validateStep2()) {
      setIsLoading(true);
      const otpRes = await fetch("/api/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formData.phone,
          hash: otpHash,
          otp: formData.otp,
        }),
      });

      const data = await otpRes.json();

      if (data.isCorrect) {
        await handleRegister(formData);
      } else {
        // setTimeout(() => {
        //   setIsLoading(false);
        //   setError("otp", {
        //     message: "کد تایید اشتباه است. لطفا دوباره تلاش کنید.",
        //   });
        // }, 1000);
        Toast({
          title: "کد تایید اشتباه است، لطفا دوباره تلاش کنید.",
          type: "error",
        });
      }
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timer === 0) {
      setIsLoading(true);
      console.log("Resending OTP for:", formData.phone);
      const hash = await sendOTP(formData.phone);
      if (hash !== "") {
        setOtpHash(hash);
      }
      setIsLoading(false);
      setTimer(30);
    }
  };

  const onFormSubmit = (data: RegisterFormData & { otp: string }) => {
    if (step === 1) {
      handleRequestOtp();
    } else {
      handleVerifyOtp();
    }
  };

  const handleValueChange = (
    field: keyof RegisterFormData,
    value: string | number
  ) => {
    setValue(field, String(value));
    if (errors[field]) {
      clearErrors(field);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      backdrop="blur"
      isDismissable={false}
      hideCloseButton
      size="md"
    >
      <ModalContent className="flex flex-col justify-center items-center gap-y-2 p-4 md:p-6 text-content3">
        <p className="text-2xl md:text-3xl font-bold">از انتخابتان متشکریم</p>
        <Form
          validationBehavior="aria"
          className="w-full flex flex-col justify-center items-center"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          {step === 1 && (
            <>
              <p className="font-light text-sm text-center mb-4">
                لطفا به منظور ارائه خدمات بهتر در آینده، فرم زیر را تکمیل کنید
                :)
              </p>
              <Input
                label="نام و نام خانوادگی"
                placeholder="علی احمدی"
                value={formData.name}
                onValueChange={(value) => handleValueChange("name", value)}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
              <Input
                label="شماره موبایل"
                placeholder="09123456789"
                value={formData.phone}
                onValueChange={(value) =>
                  handleValueChange("phone", String(value))
                }
                isInvalid={!!errors.phone}
                errorMessage={errors.phone?.message}
              />
              <Input
                label="رمز عبور"
                placeholder="رمز عبور خود را وارد کنید"
                type="password"
                value={formData.password}
                onValueChange={(value) => handleValueChange("password", value)}
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
                دریافت کد تایید
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="absolute top-3 left-3" onClick={() => setStep(1)}>
                <Icon
                  icon={`solar:arrow-left-bold-duotone`}
                  className="size-6 hover:scale-110 cursor-pointer transition-all"
                />
              </div>
              <p className="font-light text-sm text-center mb-4">
                لطفا کد ارسال شده به شماره‌ی {formData.phone} را وارد کنید.
              </p>
              <div dir="ltr" className="mb-4">
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <InputOtp
                      length={5}
                      value={field.value}
                      isInvalid={!!errors.otp}
                      errorMessage={errors.otp?.message || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (errors.otp) {
                          clearErrors("otp");
                        }
                      }}
                      // Disable built-in validation to use only react-hook-form validation
                      isRequired={false}
                    />
                  )}
                />
              </div>

              {/* 4. متن برای ارسال مجدد کد */}
              <div className="text-center text-sm mb-6 h-5">
                {timer > 0 ? (
                  <p className="text-gray-500">
                    ارسال مجدد کد تا {timer} ثانیه دیگر
                  </p>
                ) : (
                  <p
                    className="text-primary cursor-pointer"
                    onClick={handleResendCode}
                  >
                    ارسال مجدد کد
                  </p>
                )}
              </div>

              <Button
                color="primary"
                className="text-content3"
                fullWidth
                type="submit"
                isLoading={isLoading}
              >
                تایید و ارسال
              </Button>
            </>
          )}
        </Form>
      </ModalContent>
    </Modal>
  );
}
