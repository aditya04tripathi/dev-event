"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { changePlanDirectly, createPaymentIntent } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import { syncUserToRedux } from "@/store/actionWrappers";
import { useAppDispatch } from "@/store/hooks";

// Note: For external redirects (like PayPal), window.location.href is required
// as Next.js router only works for internal navigation

interface PayPalButtonProps {
  tier: "MONTHLY" | "YEARLY";
  planType: "BASIC" | "PRO";
  hasPaymentMethod?: boolean;
}

export function PayPalButton({
  tier,
  planType,
  hasPaymentMethod = false,
}: PayPalButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const prices = {
    MONTHLY: { BASIC: 19, PRO: 49 },
    YEARLY: { BASIC: 190, PRO: 490 },
  };

  const price = prices[tier][planType];

  const handlePayment = async () => {
    setLoading(true);
    try {
      // If user has payment method, change plan directly without PayPal redirect
      if (hasPaymentMethod) {
        const result = await changePlanDirectly(tier, planType);
        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.success && result.user) {
          // Update Redux store
          syncUserToRedux(dispatch, result.user);
          toast.success("Plan updated successfully!");
          router.refresh();
        }
        return;
      }

      // First time payment - redirect to PayPal
      const result = await createPaymentIntent(tier, planType);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Check if user now has payment method (shouldn't happen here, but handle edge case)
      if (result.hasPaymentMethod) {
        // Fallback to direct change
        const directResult = await changePlanDirectly(tier, planType);
        if (directResult.success && directResult.user) {
          syncUserToRedux(dispatch, directResult.user);
          toast.success("Plan updated successfully!");
          router.refresh();
        }
        return;
      }

      if (result.approvalUrl) {
        // Redirect to PayPal approval page using client-side navigation
        window.location.href = result.approvalUrl;
      } else {
        toast.error("Failed to get PayPal subscription approval URL");
      }
    } catch {
      toast.error("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (hasPaymentMethod) {
      return `Switch to ${planType === "BASIC" ? "Basic" : "Pro"} $${price}/${tier === "MONTHLY" ? "month" : "year"}`;
    }
    return `Subscribe $${price}/${tier === "MONTHLY" ? "month" : "year"}`;
  };

  return (
    <Button className="w-full" onClick={handlePayment} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        getButtonText()
      )}
    </Button>
  );
}
