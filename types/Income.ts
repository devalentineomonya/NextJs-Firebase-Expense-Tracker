import { Timestamp } from "firebase/firestore";

export type Income = {
  id: string;
  userId: string;
  source: string;
  amount: number;
  period: "daily" | "weekly" | "monthly" | "annually";
  schedule: string;
  createdAt: Timestamp;
};
