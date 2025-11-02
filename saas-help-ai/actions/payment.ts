"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { SUBSCRIPTION_TIERS } from "@/constants";
import connectDB from "@/lib/db";
import { createPayPalOrder } from "@/lib/paypal";
import User from "@/models/User";
import type { SubscriptionTier } from "@/types";

export async function createPaymentIntent(
  tier: Exclude<SubscriptionTier, "FREE">
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const tierConfig = SUBSCRIPTION_TIERS[tier];
    const amount = tierConfig.price;

    // Get base URL for return/cancel URLs
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/payment/return?tier=${tier}`;
    const cancelUrl = `${baseUrl}/payment/cancel`;

    // Create PayPal order
    const { orderId, approvalUrl } = await createPayPalOrder(
      amount,
      "USD",
      returnUrl,
      cancelUrl
    );

    return {
      success: true,
      orderId,
      approvalUrl,
      amount,
      tier,
    };
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create payment intent",
    };
  }
}

export async function capturePayment(
  orderId: string,
  tier: Exclude<SubscriptionTier, "FREE">
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const { capturePayPalOrder } = await import("@/lib/paypal");

    // Capture the PayPal order
    const result = await capturePayPalOrder(orderId);

    if (!result.success) {
      return { error: "Payment capture failed" };
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return { error: "User not found" };
    }

    // Update user subscription
    user.subscriptionTier = tier;
    if (tier !== "ONE_OFF") {
      user.searchesResetAt = new Date(
        Date.now() + (tier === "YEARLY" ? 365 : 30) * 24 * 60 * 60 * 1000
      );
    } else {
      // For one-off, set a far future date
      user.searchesResetAt = new Date("2099-12-31");
    }
    user.searchesUsed = 0;
    await user.save();

    // Note: revalidatePath is called after redirect in the route handler

    return { success: true, transactionId: result.transactionId };
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to confirm payment",
    };
  }
}
