export type SubscriptionTier = "FREE" | "MONTHLY" | "YEARLY" | "ONE_OFF";

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: SubscriptionTier;
  searchesUsed: number;
  searchesResetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  type: "access" | "refresh";
}
