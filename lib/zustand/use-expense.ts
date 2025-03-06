import { create } from "zustand";
import { Expense } from "@/types/Expenses";

type ExpenseModalState = {
  open: boolean;
  currentExpense: Partial<Expense> | null;
  onOpen: () => void;
  onEdit: (expense: Partial<Expense>) => void;
  onClose: () => void;
};

export const useExpenseModal = create<ExpenseModalState>((set) => ({
  open: false,
  currentExpense: null,
  onOpen: () => set({ open: true, currentExpense: null }),
  onEdit: (expense) => set({ open: true, currentExpense: expense }),
  onClose: () => set({ open: false, currentExpense: null }),
}));
