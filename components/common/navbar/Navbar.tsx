"use client";
import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import NavbarActions from "./NavbarActions";
import BrandLogo from "./BrandLogo";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const pathname = usePathname();
  const showNavbar = pathname.includes("auth");
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/",
      active: pathname.includes("dashboard") || pathname === "/",
    },
    {
      label: "Income",
      href: "/income",
      active: pathname.includes("income"),
    },
    {
      label: "Expenses",
      href: "/expenses",
      active: pathname.includes("expenses"),
    },
    {
      label: "Transactions",
      href: "/transactions",
      active: pathname.includes("transactions"),
    },
  ];

  return (
    <header
      className={`w-full h-14 sticky top-0 flex items-center justify-center px-2 lg:px-0 border-b border-b-gray-200 dark:border-b-gray-600 backdrop-blur-sm z-10 ${
        showNavbar ? "hidden" : ""
      }`}
    >
      <NavigationMenu className="w-full max-w-[1200px] block">
        <NavigationMenuList className="flex justify-between w-full">
          <BrandLogo />

          <NavigationMenu className="gap-x-4 font-medium hidden sm:flex">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.active
                    ? "text-blue-700 border-b-2 border-b-blue-600 inline-block pb-1"
                    : "text-gray-500 hover:text-blue-600 transition-colors"
                }
              >
                {item.label}
              </Link>
            ))}
          </NavigationMenu>

          <div className="flex items-center gap-2 md:hidden">
            <NavbarActions user={user} loading={loading} />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          </div>

          {isOpen && (
            <div className="sm:hidden absolute top-14 left-0 right-0 bg-white dark:bg-gray-900 border-b shadow-lg">
              <div className="flex flex-col items-center py-4 gap-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={
                      item.active
                        ? "text-blue-700 border-b-2 border-b-blue-600 px-4 py-2"
                        : "text-gray-500 hover:text-blue-600 px-4 py-2 transition-colors"
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="hidden md:block">
            <NavbarActions user={user} loading={loading} />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Navbar;
