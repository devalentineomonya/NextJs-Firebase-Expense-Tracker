import { Timestamp } from "firebase/firestore";

export type Expense = {
  id: string;
  amount: number;
  createdAt: Timestamp;
  dateSpent: Date;
  expenditureType: string;
  note?: string;
  paymentMethod: string;
  referenceNumber: string;
  userId: string;
};
