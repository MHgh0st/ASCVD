"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm, { LoginFormData } from "@/components/LoginForm";
import Toast from "@/components/Toast";
import { signIn } from "next-auth/react";
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false, // مهم: برای جلوگیری از ریدایرکت خودکار
      phone: data.phone,
      password: data.password,
    });
    setIsLoading(false);

    if (result?.error) {
      // اگر خطایی در تابع authorize رخ داده باشد (مثلاً رمز اشتباه)
      Toast({ message: result.error, type: "error" });
    } else if (result?.ok) {
      Toast({ message: "شما با موفقیت وارد شدید!", type: "success" });
      router.push("/");
    }
  };

  const onCloseForm = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <img src="/logo.png" alt="هیلان" className="mx-auto h-12 w-12" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            ورود به حساب کاربری
          </h2>
          <p className="mt-2 text-sm text-gray-600">یا </p>
        </div>

        <LoginForm
          isOpen={true}
          onSubmit={handleLoginSubmit}
          onClose={onCloseForm}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
