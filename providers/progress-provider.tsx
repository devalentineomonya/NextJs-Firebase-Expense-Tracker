"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import useProfileComplete from "@/lib/zustand/use-profile-complete";
import { useTheme } from "next-themes";

const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const { isProfileComplete } = useProfileComplete();
  return (
    <>
      {children}
      <ProgressBar
      
        height="4px"
        color={theme === "dark" ? "#fffd00" : "#000000"}
              shallowRouting
        options={{ showSpinner: isProfileComplete }}
      />
    </>
  );
};

export default ProgressProvider;
