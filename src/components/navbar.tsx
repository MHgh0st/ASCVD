"use client";
import { Navbar, NavbarBrand } from "@heroui/react";

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
      </Navbar>
    </>
  );
};
export default CustomNavbar;
