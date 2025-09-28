"use client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import SessionProvider from "@/utils/SessionProvder";
const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SessionProvider>
      <HeroUIProvider>
        <ToastProvider />
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
};

export default Providers;
