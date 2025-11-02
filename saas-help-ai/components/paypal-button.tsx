"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createPaymentIntent } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_TIERS } from "@/constants";
import type { SubscriptionTier } from "@/types";

interface PayPalButtonProps {
  tier: Exclude<SubscriptionTier, "FREE">;
}

export function PayPalButton({ tier }: PayPalButtonProps) {
  const [loading, setLoading] = useState(false);
  const tierConfig = SUBSCRIPTION_TIERS[tier];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const result = await createPaymentIntent(tier);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.approvalUrl) {
        // Redirect to PayPal approval page
        window.location.href = result.approvalUrl;
      } else {
        toast.error("Failed to get PayPal approval URL");
      }
    } catch {
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (tier === "ONE_OFF") {
      return `Buy for $${tierConfig.price}`;
    }
    return tier === "MONTHLY"
      ? `Subscribe $${tierConfig.price}/month`
      : `Subscribe $${tierConfig.price}/year`;
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
