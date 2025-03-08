import { create } from "zustand";

type ProfileCompleteState = {
  isProfileComplete: boolean;
  setIsProfileComplete: (isProfileComplete: boolean) => void;
};

const useProfileComplete = create<ProfileCompleteState>((set) => ({
  isProfileComplete: false,
  setIsProfileComplete: (isProfileComplete: boolean) =>
    set({ isProfileComplete }),
}));

export default useProfileComplete;
