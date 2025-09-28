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
      <Navbar maxWidth="full">
        <NavbarBrand>
          <img src="logo.png" alt="" width={48} />
          <p style={{ color: "#1F7674" }} className="-mb-4 text-xl">
            هــــیلان
          </p>
        </NavbarBrand>
        <NavbarContent justify="end">
          {status === "unauthenticated" && (
            <Button
              color="primary"
              className="text-content3 "
              startContent={
                <Icon icon="solar:login-3-bold-duotone" className="size-6" />
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
                  className="text-sm font-bold"
                  variant="light"
                  color="secondary"
                  startContent={
                    <Icon
                      icon={`solar:user-circle-bold-duotone`}
                      className="size-14"
                    />
                  }
                >
                  {session.user.name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu color="secondary">
                <DropdownItem
                  key="profile page"
                  startContent={
                    <Icon icon={`solar:user-bold-duotone`} className="size-5" />
                  }
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
