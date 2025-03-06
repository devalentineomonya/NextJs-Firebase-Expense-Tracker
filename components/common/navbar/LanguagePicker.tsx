import React from "react";
import { US, CN, FR, SA } from "country-flag-icons/react/3x2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
const LanguagePicker = () => {
  const languages = [
    { name: "English", label: "EN", flag: US },
    { name: "Chinese", label: "CN", flag: CN },
    { name: "French", label: "FR", flag: FR },
    { name: "Arabic", label: "SA", flag: SA },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="dark:bg-gray-800 bg-white dark:text-white dark:hover:bg-gray-700 text-gray-600 hover:bg-gray-100"
          size="icon"
          variant="outline"
        >
          <US title="United States" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.label}
            className="py-3 pr-10 flex justify-start gap-x-2 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
          >
            <language.flag title={language.name} />
            <span>
              {language.name} ({language.label})
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguagePicker;
