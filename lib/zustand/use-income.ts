import { create } from "zustand";
import { Income } from "@/types/Income";

type IncomeModalState = {
  open: boolean;
  currentIncome: Partial<Income> | null;
  onOpen: () => void;
  onEdit: (income: Partial<Income>) => void;
  onClose: () => void;
};

export const useIncomeModal = create<IncomeModalState>((set) => ({
  open: false,
  currentIncome: null,
  onOpen: () => set({ open: true, currentIncome: null }),
  onEdit: (income) => set({ open: true, currentIncome: income }),
  onClose: () => set({ open: false, currentIncome: null }),
}));
