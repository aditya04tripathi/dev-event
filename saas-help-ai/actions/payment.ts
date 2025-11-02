"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import {
  createPayPalSubscription,
  createPayPalSubscriptionPlan,
  getPayPalSubscription,
  getPayPalSubscriptionUpdatePaymentUrl,
  updatePayPalSubscription,
} from "@/lib/paypal";
import { deleteCache, getCache, setCache } from "@/lib/redis";
import User from "@/models/User";

export async function changePlanDirectly(
  tier: "MONTHLY" | "YEARLY",
  planType: "BASIC" | "PRO"
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return { error: "User not found" };
    }

    // Check if user has an active PayPal subscription
    if (!user.paypalSubscriptionId) {
      return {
        error:
          "No active subscription found. Please complete PayPal subscription first.",
      };
    }

    const { SUBSCRIPTION_PLANS } = await import("@/constants");
    const planConfig = SUBSCRIPTION_PLANS[planType];
    const amount =
      tier === "MONTHLY" ? planConfig.monthlyPrice : planConfig.yearlyPrice;

    // Create or get the new subscription plan
    const { planId } = await createPayPalSubscriptionPlan(
      amount,
      "USD",
      tier === "MONTHLY" ? "MONTH" : "YEAR",
      1
    );

    // Update the PayPal subscription to use the new plan
    await updatePayPalSubscription(user.paypalSubscriptionId, planId);

    // Update user subscription in database
    user.subscriptionTier = tier;
    user.subscriptionPlan = planType;
    user.searchesResetAt = new Date(
      Date.now() + (tier === "YEARLY" ? 365 : 30) * 24 * 60 * 60 * 1000
    );
    user.searchesUsed = 0;
    await user.save();

    revalidatePath("/pricing");
    revalidatePath("/dashboard");
    revalidatePath("/billing");

    return {
      success: true,
      user: {
        subscriptionTier: user.subscriptionTier,
        subscriptionPlan: user.subscriptionPlan,
        searchesUsed: user.searchesUsed,
        searchesResetAt: user.searchesResetAt,
      },
    };
  } catch (error) {
    console.error("Direct plan change error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to change plan",
    };
  }
}

export async function createPaymentIntent(
  tier: "MONTHLY" | "YEARLY",
  planType: "BASIC" | "PRO"
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return { error: "User not found" };
    }

    // Check if user has an active subscription - if yes, update it directly
    if (user.paypalSubscriptionId) {
      return {
        hasPaymentMethod: true,
        message: "User has active subscription on file",
      };
    }

    const { SUBSCRIPTION_PLANS } = await import("@/constants");
    const planConfig = SUBSCRIPTION_PLANS[planType];
    const amount =
      tier === "MONTHLY" ? planConfig.monthlyPrice : planConfig.yearlyPrice;

    // Create a subscription plan
    const { planId } = await createPayPalSubscriptionPlan(
      amount,
      "USD",
      tier === "MONTHLY" ? "MONTH" : "YEAR",
      1
    );

    // Get base URL for return/cancel URLs
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/billing/payment/return?subscription_id={subscription_id}`;
    const cancelUrl = `${baseUrl}/billing/payment/cancel`;

    // Create PayPal subscription
    const { subscriptionId, approvalUrl } = await createPayPalSubscription(
      planId,
      returnUrl,
      cancelUrl,
      user.email,
      user.name
    );

    // Store subscription details in Redis for retrieval on return (24 hour TTL)
    await setCache(
      `paypal_subscription:${subscriptionId}`,
      {
        userId: session.user.id,
        tier,
        planType,
        amount,
        planId,
      },
      24 * 60 * 60 // 24 hours
    );

    return {
      success: true,
      subscriptionId,
      approvalUrl,
      amount,
      tier,
      planType,
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
  subscriptionId: string,
  tier?: "MONTHLY" | "YEARLY",
  planType?: "BASIC" | "PRO"
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    // If tier/plan not provided, retrieve from Redis cache
    let subscriptionTier = tier;
    let subscriptionPlanType = planType;

    if (!subscriptionTier || !subscriptionPlanType) {
      const subscriptionDetails = await getCache<{
        userId: string;
        tier: "MONTHLY" | "YEARLY";
        planType: "BASIC" | "PRO";
        amount: number;
        planId: string;
      }>(`paypal_subscription:${subscriptionId}`);

      if (!subscriptionDetails) {
        return {
          error: "Subscription details not found. Please contact support.",
        };
      }

      // Verify the subscription belongs to the current user
      if (subscriptionDetails.userId !== session.user.id) {
        return { error: "Subscription does not belong to current user" };
      }

      subscriptionTier = subscriptionDetails.tier;
      subscriptionPlanType = subscriptionDetails.planType;
    }

    // Verify subscription status with PayPal
    const subscription = await getPayPalSubscription(subscriptionId);

    if (
      subscription.status !== "ACTIVE" &&
      subscription.status !== "APPROVAL_PENDING"
    ) {
      return {
        error: `Subscription is not active. Status: ${subscription.status}`,
      };
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return { error: "User not found" };
    }

    // Update user subscription
    user.subscriptionTier = subscriptionTier;
    user.subscriptionPlan = subscriptionPlanType;
    user.paypalSubscriptionId = subscriptionId;
    user.searchesResetAt = new Date(
      Date.now() +
        (subscriptionTier === "YEARLY" ? 365 : 30) * 24 * 60 * 60 * 1000
    );
    user.searchesUsed = 0;
    // Mark that user has a payment method after first successful subscription
    user.hasPaymentMethod = true;
    await user.save();

    // Clean up Redis cache
    await deleteCache(`paypal_subscription:${subscriptionId}`);

    // Note: revalidatePath is called after redirect in the route handler

    return {
      success: true,
      subscriptionId,
      user: {
        subscriptionTier: user.subscriptionTier,
        subscriptionPlan: user.subscriptionPlan,
        searchesUsed: user.searchesUsed,
        searchesResetAt: user.searchesResetAt,
      },
    };
  } catch (error) {
    console.error("Subscription activation error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to activate subscription",
    };
  }
}

export async function downgradeToFree() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return { error: "User not found" };
    }

    // If user has an active PayPal subscription, suspend it
    if (user.paypalSubscriptionId) {
      try {
        const { suspendPayPalSubscription } = await import("@/lib/paypal");
        await suspendPayPalSubscription(user.paypalSubscriptionId);
      } catch (error) {
        console.error("Failed to suspend PayPal subscription:", error);
        // Continue with downgrade even if suspend fails
      }
    }

    // Update user to FREE plan
    user.subscriptionTier = "FREE";
    user.subscriptionPlan = undefined;
    user.paypalSubscriptionId = undefined;
    user.searchesResetAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days from now
    );
    // Don't reset searchesUsed - let them keep what they've used
    await user.save();

    // Revalidate relevant paths
    revalidatePath("/pricing");
    revalidatePath("/dashboard");
    revalidatePath("/billing");

    return {
      success: true,
      user: {
        subscriptionTier: user.subscriptionTier,
        subscriptionPlan: user.subscriptionPlan,
        searchesUsed: user.searchesUsed,
        searchesResetAt: user.searchesResetAt,
      },
    };
  } catch (error) {
    console.error("Downgrade to free error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to downgrade to free plan",
    };
  }
}

export async function updatePaymentMethod() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return { error: "User not found" };
    }

    if (!user.paypalSubscriptionId) {
      return {
        error:
          "No active subscription found. Please create a subscription first.",
      };
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/billing/payment/return?update_payment=true`;

    // Get the URL to update payment method
    const { approvalUrl } = await getPayPalSubscriptionUpdatePaymentUrl(
      user.paypalSubscriptionId,
      returnUrl
    );

    return {
      success: true,
      approvalUrl,
    };
  } catch (error) {
    console.error("Update payment method error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to get payment method update URL",
    };
  }
}
