"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Skeleton,
  Chip,
  Divider,
  Avatar,
  Listbox,
  ListboxItem,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import type { Advice } from "@/types/AdviceTypes";

// Define types for the data we expect from the API
interface UserProfile {
  fullName: string;
  phone: string;
  created_at: string;
}

interface TestHistory {
  id: string;
  created_at: string;
  final_risk: number;
  risk_category: string;
  age?: number;
  sex?: string;
  total_cholesterol?: number;
  hdl_cholesterol?: number;
  ldl_cholesterol?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  on_bp_medicine?: string;
  has_diabetes?: string;
  is_smoker?: string;
  quit_duration?: number;
}

interface ProfileData {
  user: UserProfile;
  tests: TestHistory[];
  latestAdvices: any[];
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tests, setTests] = useState<TestHistory[]>([]);
  const [latestAdvices, setLatestAdvices] = useState<Advice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      const fetchProfileData = async () => {
        try {
          const response = await fetch("/api/profile");
          if (!response.ok) {
            throw new Error("Failed to fetch profile data.");
          }
          const data = await response.json();
          setUser(data.user);
          setTests(data.tests);
          setLatestAdvices(data.latestAdvices || []);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfileData();
    }
  }, [status, router]);

  // Skeleton loading component
  const LoadingSkeleton = () => (
    <div className="mx-auto p-4 md:p-8">
      <Skeleton className="h-10 w-64 mx-auto mb-8 rounded-md bg-zinc-500" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <Card className="bg-default">
            <CardHeader>
              <Skeleton className="h-6 w-24 rounded-md bg-zinc-500" />
            </CardHeader>
            <CardBody className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md bg-zinc-500" />
              <Skeleton className="h-4 w-full rounded-md bg-zinc-500" />
              <Skeleton className="h-4 w-full rounded-md bg-zinc-500" />
            </CardBody>
          </Card>
        </div>
        <div className="md:col-span-9">
          <Card className="bg-default">
            <CardHeader>
              <Skeleton className="h-6 w-32 rounded-md bg-zinc-500" />
            </CardHeader>
            <CardBody className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md bg-zinc-500" />
                  <Skeleton className="h-4 w-3/4 rounded-md bg-zinc-500" />
                  <Skeleton className="h-4 w-1/2 rounded-md bg-zinc-500" />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );

  if (isLoading || status === "loading") {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <Card>
          <CardBody>
            <p className="text-red-500">خطا: {error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <Card>
          <CardBody>
            <p>نتوانستیم اطلاعات کاربر را بارگذاری کنیم.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Function to get risk category color
  const getRiskColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "low":
        return "success";
      case "intermediate":
        return "warning";
      case "high":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className=" mx-auto p-4 md:p-8 ">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">پروفایل کاربر</h1>
        <p className="text-gray-600">مشاهده اطلاعات شخصی و تاریخچه تست‌ها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Right Column (Smaller) - User Information */}
        <div className="md:col-span-3 ">
          <Card
            shadow="none"
            className="bg-transparent border-2 border-primary sticky top-20"
          >
            <CardHeader>
              <h2 className="text-2xl font-semibold">اطلاعات کاربر</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center space-x-3 text-right">
                <Avatar name={user.fullName} size="md" />
                <div>
                  <p className="font-semibold">نام و نام خانوادگی:</p>
                  <p className="text-gray-600">{user.fullName}</p>
                </div>
              </div>
              <Divider />
              <div className="text-right">
                <p className="font-semibold">شماره موبایل:</p>
                <p className="text-gray-600">{user.phone}</p>
              </div>
              <Divider />
              <div className="text-right">
                <p className="font-semibold">تاریخ عضویت:</p>
                <p className="text-gray-600">
                  {new Date(user.created_at).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </CardBody>
            {/* <CardFooter>
              <Button color="primary" variant="flat" fullWidth>
                ویرایش اطلاعات
              </Button>
            </CardFooter> */}
          </Card>
        </div>
        {/* Left Column (Wider) - Test History */}
        <div className="md:col-span-9">
          <Card
            shadow="none"
            className="bg-transparent border-2 border-primary"
          >
            <CardHeader>
              <h2 className="text-2xl font-semibold">تاریخچه تست‌ها</h2>
            </CardHeader>
            <CardBody>
              {tests.length > 0 ? (
                <Accordion variant="light" fullWidth>
                  {tests.map((test) => (
                    <AccordionItem
                      key={test.id}
                      title={
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <p className="font-semibold">
                              تاریخ:{" "}
                              {new Date(test.created_at).toLocaleDateString(
                                "fa-IR"
                              )}
                            </p>
                            <p className="text-gray-600 text-sm">
                              امتیاز ریسک: {test.final_risk}%
                            </p>
                          </div>
                          <Chip
                            color={getRiskColor(test.risk_category)}
                            variant="flat"
                          >
                            {test.risk_category === "low" && "کم"}
                            {test.risk_category === "intermediate" && "متوسط"}
                            {test.risk_category === "high" && "زیاد"}
                            {test.risk_category !== "low" &&
                              test.risk_category !== "intermediate" &&
                              test.risk_category !== "high" &&
                              test.risk_category}
                          </Chip>
                        </div>
                      }
                    >
                      <div className="space-y-4">
                        {/* Basic Information */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <p className="font-semibold text-sm text-gray-600">
                              سن
                            </p>
                            <p className="text-lg">
                              {test.age || "نامشخص"} سال
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <p className="font-semibold text-sm text-gray-600">
                              جنسیت
                            </p>
                            <p className="text-lg">
                              {test.sex === "male"
                                ? "مرد"
                                : test.sex === "female"
                                  ? "زن"
                                  : "نامشخص"}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <p className="font-semibold text-sm text-gray-600">
                              امتیاز ریسک
                            </p>
                            <p className="text-lg">{test.final_risk || 0}%</p>
                          </div>
                        </div>

                        {/* Health Metrics */}
                        <div className="border-t pt-4 text-center">
                          <h4 className="font-semibold mb-3 text-gray-700 ">
                            شاخص‌های سلامتی
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="font-medium text-sm text-gray-600">
                                کلسترول کل
                              </p>
                              <p className="text-gray-800">
                                {test.total_cholesterol || "نامشخص"} mg/dL
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-600">
                                HDL کلسترول
                              </p>
                              <p className="text-gray-800">
                                {test.hdl_cholesterol || "نامشخص"} mg/dL
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-600">
                                LDL کلسترول
                              </p>
                              <p className="text-gray-800">
                                {test.ldl_cholesterol || "نامشخص"} mg/dL
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-600">
                                فشار خون سیستولیک
                              </p>
                              <p className="text-gray-800">
                                {test.systolic_bp || "نامشخص"} mmHg
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-600">
                                فشار خون دیاستولیک
                              </p>
                              <p className="text-gray-800">
                                {test.diastolic_bp || "نامشخص"} mmHg
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-600">
                                داروی فشار خون
                              </p>
                              <p className="text-gray-800">
                                {test.on_bp_medicine === "yes" ? "بله" : "خیر"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Risk Factors */}
                        <div className="border-t pt-4 text-center">
                          <h4 className="font-semibold mb-3 text-gray-700">
                            عوامل خطر
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="font-medium text-sm text-gray-600">
                                دیابت
                              </p>
                              <p className="text-gray-800">
                                {test.has_diabetes === "yes" ? "بله" : "خیر"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-600">
                                سیگار
                              </p>
                              <p className="text-gray-800">
                                {test.is_smoker === "yes"
                                  ? "بله"
                                  : test.is_smoker === "former"
                                    ? "سابق (ترک کرده)"
                                    : "خیر"}
                              </p>
                            </div>
                            {test.is_smoker === "former" &&
                              test.quit_duration && (
                                <div>
                                  <p className="font-medium text-sm text-gray-600">
                                    مدت ترک سیگار
                                  </p>
                                  <p className="text-gray-800">
                                    {test.quit_duration}
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Risk Assessment */}
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-3 text-gray-700 text-center">
                            ارزیابی خطر
                          </h4>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                دسته‌بندی خطر:
                              </span>
                              <Chip
                                color={getRiskColor(test.risk_category)}
                                variant="flat"
                                size="lg"
                              >
                                {test.risk_category === "low" && "خطر کم"}
                                {test.risk_category === "intermediate" &&
                                  "خطر متوسط"}
                                {test.risk_category === "high" && "خطر زیاد"}
                                {test.risk_category !== "low" &&
                                  test.risk_category !== "intermediate" &&
                                  test.risk_category !== "high" &&
                                  test.risk_category}
                              </Chip>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 text-center">
                              احتمال خطر قلبی عروقی ۱۰ ساله:{" "}
                              <span className="font-bold">
                                {test.final_risk || 0}%
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  هیچ تاریخچه تستی یافت نشد.
                </p>
              )}
            </CardBody>
          </Card>

          {/* Latest Advices Section */}
          {latestAdvices.length > 0 && (
            <Card
              shadow="none"
              className="bg-transparent border-2 border-primary mt-8"
            >
              <CardHeader className="space-x-2">
                <h2 className="text-2xl font-semibold">توصیه‌های شما</h2>
                <p className="text-sm text-gray-600 mt-1">
                  بر اساس آخرین تست شما (
                  {tests.length > 0
                    ? new Date(tests[0].created_at).toLocaleDateString("fa-IR")
                    : ""}
                  )
                </p>
              </CardHeader>
              <CardBody>
                <Accordion variant="splitted" fullWidth>
                  {latestAdvices.map((advice) => (
                    <AccordionItem
                      key={advice.id}
                      title={advice.title}
                      className="shadow-none"
                    >
                      <div className="space-y-2">
                        <p className="text-gray-700 text-right">
                          {advice.details}
                        </p>
                        {/* {advice.source && (
                          <p className="text-xs text-gray-500 mt-2">
                            منبع: {advice.source}
                          </p>
                        )} */}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
