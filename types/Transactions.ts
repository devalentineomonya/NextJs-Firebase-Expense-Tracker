import { Timestamp } from "firebase/firestore";

export type Transaction = {
  id: string;
  referenceNumber: string;
  amount: number;
  date: Timestamp;
  createdAt: Timestamp;
  receiverName: string;
  receiver: string;
  paymentMode: string;
  note?: string;
  status: "pending" | "success" | "failed";
  userId: string;
};
