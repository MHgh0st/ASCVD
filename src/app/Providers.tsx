"use client";
import { HeroUIProvider } from "@heroui/react";

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <HeroUIProvider>{children}</HeroUIProvider>;
};

export default Providers;
