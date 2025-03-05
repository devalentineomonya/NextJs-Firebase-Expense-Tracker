import { create } from "zustand";

type TransactionFormValues = {
  id: string;
  amount: number;
  date: Date;
  description: string;
  type: "expense" | "income";
  status: "success" | "pending" | "failed";
  category: string;

};

type TransactionModalState = {
  open: boolean;
  currentTransaction: Partial<TransactionFormValues> | null;
  onOpen: () => void;
  onEdit: (transaction: Partial<TransactionFormValues>) => void;
  onClose: () => void;
};

export const useTransactionModal = create<TransactionModalState>((set) => ({
  open: false,
  currentTransaction: null,
  onOpen: () => set({ open: true, currentTransaction: null }),
  onEdit: (transaction) => set({ open: true, currentTransaction: transaction }),
  onClose: () => set({ open: false, currentTransaction: null }),
}));
