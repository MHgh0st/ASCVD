"use client";
import { Navbar, NavbarBrand, NavbarContent, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

const CustomNavbar = () => {
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
          <Button
            color="primary"
            className="text-content3 "
            startContent={
              <Icon icon="solar:login-3-bold-duotone" className="size-6" />
            }
          >
            ورود
          </Button>
        </NavbarContent>
      </Navbar>
    </>
  );
};
export default CustomNavbar;
