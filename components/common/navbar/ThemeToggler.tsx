"use client"
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import React from "react";

const ThemeToggler = () => {
  const { setTheme, theme } = useTheme();
  return (
    <Button
    className="dark:bg-gray-800 bg-white dark:text-white dark:hover:bg-gray-700 text-gray-600 hover:bg-gray-100"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      variant="outline"
      size="icon"
    >
      {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
    </Button>
  );
};

export default ThemeToggler;
