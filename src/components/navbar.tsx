"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const CustomNavbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <>
      <Navbar maxWidth="full" className="px-4">
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <img src="logo.png" alt="" className="w-8 h-8 md:w-12 md:h-12" />
            <p
              style={{ color: "#1F7674" }}
              className="-mb-1 text-lg md:text-xl"
            >
              هــــیلان
            </p>
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          {status === "unauthenticated" && (
            <Button
              color="primary"
              className="text-content3 text-sm md:text-base"
              startContent={
                <Icon
                  icon="solar:login-3-bold-duotone"
                  className="size-4 md:size-5"
                />
              }
              onPress={handleLoginClick}
            >
              ورود
            </Button>
          )}
          {status === "authenticated" && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="text-xs md:text-sm font-bold max-w-32 md:max-w-none"
                  variant="light"
                  color="secondary"
                  startContent={
                    <Icon
                      icon={`solar:user-circle-bold-duotone`}
                      className="size-8 md:size-14"
                    />
                  }
                >
                  <span className="truncate">{session.user.name}</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu color="secondary">
                <DropdownItem
                  key="profile page"
                  startContent={
                    <Icon icon={`solar:user-bold-duotone`} className="size-5" />
                  }
                  onPress={() => router.push("/profile")}
                >
                  پروفایل
                </DropdownItem>
                <DropdownItem
                  key="signOut"
                  color="danger"
                  startContent={
                    <Icon
                      icon={`solar:logout-2-bold-duotone`}
                      className="size-5"
                    />
                  }
                  onPress={() => signOut({ callbackUrl: "/" })}
                >
                  خروج
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarContent>
      </Navbar>
    </>
  );
};
export default CustomNavbar;
