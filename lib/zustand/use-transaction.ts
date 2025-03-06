import { create } from "zustand";
import { Transaction } from "@/types/Transactions";

type TransactionModalState = {
  open: boolean;
  currentTransaction: Partial<Transaction> | null;
  onOpen: () => void;
  onEdit: (transaction: Partial<Transaction>) => void;
  onClose: () => void;
};

export const useTransactionModal = create<TransactionModalState>((set) => ({
  open: false,
  currentTransaction: null,
  onOpen: () => set({ open: true, currentTransaction: null }),
  onEdit: (transaction) => set({ open: true, currentTransaction: transaction }),
  onClose: () => set({ open: false, currentTransaction: null }),
}));
