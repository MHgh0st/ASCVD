"use client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import SessionProvider from "@/utils/SessionProvder";
import { useRouter } from "next/navigation";

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  return (
    <SessionProvider>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider />
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
};

export default Providers;
