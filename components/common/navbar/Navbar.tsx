"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Logo from "@/public/logo.png";
import Image from "next/image";
import ThemeToggler from "./ThemeToggler";
import { Button } from "@/components/ui/button";
import { BellDot } from "lucide-react";
import LanguagePicker from "./LanguagePicker";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
const Navbar = () => {
    const pathname = usePathname();
    const showNavbar = pathname.includes("auth");
  return (
    <header className={`w-full h-14 sticky top-0 flex items-center justify-center px-2 lg:px-0 border-b border-b-gray-200 dark:border-b-gray-600 backdrop-blur-sm z-10 ${showNavbar ? "hidden" : ""}`}>
      <NavigationMenu className="w-full max-w-[1200px] block">
        <NavigationMenuList className={`flex justify-between w-full`}>
          <NavigationMenuItem className="col-span-2 font-grotesk font-medium text-2xl flex items-center gap-x-2">
            <Image src={Logo} alt="Logo" className="w-20 sm:w-8" />
            <span className="max-sm:hidden">DeExpenser</span>
          </NavigationMenuItem>
          <NavigationMenuItem className="col-span-2">
            <NavigationMenuList className="gap-x-1">
              <NavigationMenuItem>
                <LanguagePicker />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <ThemeToggler />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  className="dark:bg-gray-800 bg-white dark:text-white dark:hover:bg-gray-700 text-gray-600 hover:bg-gray-100"
                  size="icon"
                  variant="ghost"
                >
                  <BellDot />
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>

                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-gray-800 dark:bg-white text-white hover:bg-gray-500 dark:text-gray-600 dark:hover:bg-gray-100 "
                  >
                    <GitHubLogoIcon />
                  </Button>
              
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="https://github.com/devalentineomonya"
                  target="_blank"
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-gray-800 dark:bg-white text-white hover:bg-gray-500 dark:text-gray-600 dark:hover:bg-gray-100 "
                  >
                    <GitHubLogoIcon />
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Navbar;
