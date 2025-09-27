"use client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  );
};

export default Providers;
