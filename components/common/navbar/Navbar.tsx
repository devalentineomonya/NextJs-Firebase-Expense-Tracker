"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import NavbarActions from "./NavbarActions";
import BrandLogo from "./BrandLogo";

const Navbar = () => {
  const pathname = usePathname();
  const showNavbar = pathname.includes("auth");
  const [user, loading] = useAuthState(auth);

  return (
    <header
      className={`w-full h-14 sticky top-0 flex items-center justify-center px-2 lg:px-0 border-b border-b-gray-200 dark:border-b-gray-600 backdrop-blur-sm z-10 ${
        showNavbar ? "hidden" : ""
      }`}
    >
      <NavigationMenu className="w-full max-w-[1200px] block">
        <NavigationMenuList className="flex justify-between w-full">
          <BrandLogo />
          <NavbarActions user={user} loading={loading} />
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Navbar;
