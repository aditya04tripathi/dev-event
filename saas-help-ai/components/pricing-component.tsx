"use client";

import { AlertTriangle, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { downgradeToFree } from "@/actions/payment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { syncUserToRedux } from "@/store/actionWrappers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBillingPeriod } from "@/store/slices/paymentSlice";
import { PayPalButton } from "./paypal-button";

interface PricingComponentProps {
  currentPlan?: string;
  onHomePage?: boolean;
  hasPaymentMethod?: boolean;
}

export function PricingComponent({
  currentPlan = "FREE",
  onHomePage = false,
  hasPaymentMethod = false,
}: PricingComponentProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isMonthly = useAppSelector(
    (state) => (state.payment as { isMonthly: boolean }).isMonthly,
  );
  const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<{
    tier: "MONTHLY" | "YEARLY";
    planType: "BASIC" | "PRO";
  } | null>(null);
  const [confirmedPlan, setConfirmedPlan] = useState<{
    tier: "MONTHLY" | "YEARLY";
    planType: "BASIC" | "PRO";
  } | null>(null);
  const [pendingDowngradeToFree, setPendingDowngradeToFree] = useState(false);

  // Determine if switching to a plan would be a downgrade
  const isDowngrade = (targetPlan: "BASIC" | "PRO" | "FREE"): boolean => {
    const planHierarchy = { FREE: 0, BASIC: 1, PRO: 2 };
    const currentLevel =
      planHierarchy[currentPlan as keyof typeof planHierarchy] ?? 0;
    const targetLevel = planHierarchy[targetPlan] ?? 0;
    return targetLevel < currentLevel;
  };

  const handlePlanClick = (
    tier: "MONTHLY" | "YEARLY",
    planType: "BASIC" | "PRO",
  ) => {
    // Only show warning if it's a downgrade and user has an active paid plan
    if (isDowngrade(planType) && currentPlan !== "FREE") {
      setPendingPlan({ tier, planType });
      setDowngradeDialogOpen(true);
    } else {
      // Proceed directly for upgrades or new subscriptions
      setConfirmedPlan({ tier, planType });
    }
  };

  const handleDowngradeToFreeClick = () => {
    // Show warning if user has an active paid plan
    if (
      currentPlan !== "FREE" &&
      (currentPlan === "BASIC" || currentPlan === "PRO")
    ) {
      setPendingDowngradeToFree(true);
      setDowngradeDialogOpen(true);
    }
  };

  const handleDowngradeConfirm = async () => {
    if (pendingDowngradeToFree) {
      // Handle downgrade to FREE - call server action
      setDowngradeDialogOpen(false);
      setPendingDowngradeToFree(false);

      try {
        const result = await downgradeToFree();
        if (result.error) {
          toast.error(result.error);
        } else if (result.success && result.user) {
          // Update Redux store
          syncUserToRedux(dispatch, result.user);
          toast.success("Successfully downgraded to Free plan");
          // Refresh the page to show updated plan
          router.refresh();
        }
      } catch {
        toast.error("Failed to downgrade to free plan");
      }
    } else if (pendingPlan) {
      setConfirmedPlan(pendingPlan);
      setDowngradeDialogOpen(false);
      setPendingPlan(null);
    }
  };

  const handleDowngradeCancel = () => {
    setDowngradeDialogOpen(false);
    setPendingPlan(null);
    setPendingDowngradeToFree(false);
  };

  // Reset confirmed plan when billing period changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to reset when isMonthly changes
  useEffect(() => {
    setConfirmedPlan(null);
  }, [isMonthly]);

  const monthlyPrices = {
    FREE: 0,
    BASIC: 19,
    PRO: 49,
  };

  const yearlyPrices = {
    FREE: 0,
    BASIC: 190, // ~17% savings (19 * 10 months)
    PRO: 490, // ~17% savings (49 * 10 months = 490)
  };

  const features = {
    FREE: [
      "5 AI validations",
      "Basic project plans",
      "Flowchart visualization",
    ],
    BASIC: [
      "50 AI validations/month",
      "Advanced project plans",
      "KANBAN & SCRUM boards",
      "Email support",
    ],
    PRO: [
      "Unlimited AI validations",
      "Advanced project plans",
      "KANBAN & SCRUM boards",
      "Priority support",
      "AI plan improvements",
      "Export capabilities",
    ],
  };

  return (
    <>
      <AlertDialog
        open={downgradeDialogOpen}
        onOpenChange={setDowngradeDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Plan Downgrade
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 pt-2">
              <p>
                You are about to downgrade your subscription plan. This is a{" "}
                <strong>destructive action</strong> that will:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Immediately reduce your validation credits</li>
                <li>Limit access to premium features</li>
                <li>
                  {pendingDowngradeToFree
                    ? `Cancel your ${currentPlan} subscription and switch to Free plan`
                    : pendingPlan?.planType === "BASIC"
                      ? "Change your plan from Pro to Basic"
                      : "Change your plan to a lower tier"}
                </li>
                {pendingDowngradeToFree && (
                  <li>Your subscription will be cancelled immediately</li>
                )}
              </ul>
              <p className="pt-2 font-medium">
                Are you sure you want to proceed with this downgrade?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDowngradeCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDowngradeConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Downgrade Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <section className="py-16 md:py-32">
        <div className="container mx-auto">
          <div className="mx-auto w-full space-y-6 text-center">
            <h1 className="text-center text-4xl font-semibold lg:text-5xl">
              Pricing that Scales with You
            </h1>
            <p className="text-muted-foreground">
              Choose the perfect plan for your startup validation needs. Switch
              between monthly and yearly billing.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <Label
                htmlFor="billing-toggle"
                className={!isMonthly ? "text-muted-foreground" : ""}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={!isMonthly}
                onCheckedChange={(checked) =>
                  dispatch(setBillingPeriod(!checked))
                }
              />
              <Label
                htmlFor="billing-toggle"
                className={isMonthly ? "text-muted-foreground" : ""}
              >
                Yearly
              </Label>
              {!isMonthly && (
                <span className="text-sm text-primary font-medium">
                  Save 17%
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
            {/* Free Plan */}
            <Card
              className={`flex flex-col ${currentPlan === "FREE" && !onHomePage ? "ring-2 ring-primary border-primary" : ""}`}
            >
              <CardHeader>
                {currentPlan === "FREE" && !onHomePage && (
                  <Badge variant="default" className="mb-2 w-fit bg-primary">
                    Current Plan
                  </Badge>
                )}
                <CardTitle className="font-medium">Free</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  ${monthlyPrices.FREE} / {isMonthly ? "mo" : "yr"}
                </span>
                <CardDescription className="text-sm">
                  Perfect for getting started
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 flex grow">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {features.FREE.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              {!onHomePage && (
                <CardFooter className="mt-auto">
                  {currentPlan === "FREE" ? (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/auth/signup">Get Started</Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleDowngradeToFreeClick}
                    >
                      {isDowngrade("FREE") && currentPlan !== "FREE"
                        ? "Downgrade to Free"
                        : "Switch to Free Plan"}
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>

            {/* Basic Plan */}
            <Card
              className={`relative flex flex-col ${currentPlan === "BASIC" && !onHomePage ? "ring-2 ring-primary border-primary" : ""}`}
            >
              <span className="bg-linear-to-r from-primary to-primary/80 absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-white/20">
                Popular
              </span>

              <CardHeader>
                {currentPlan === "BASIC" && !onHomePage && (
                  <Badge variant="default" className="mb-2 w-fit bg-primary">
                    Current Plan
                  </Badge>
                )}
                <CardTitle className="font-medium">Basic</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  ${isMonthly ? monthlyPrices.BASIC : yearlyPrices.BASIC} /{" "}
                  {isMonthly ? "mo" : "yr"}
                </span>
                <CardDescription className="text-sm">
                  For growing startups
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 flex grow">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {features.BASIC.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              {!onHomePage && (
                <CardFooter>
                  {confirmedPlan?.planType === "BASIC" &&
                  confirmedPlan?.tier === (isMonthly ? "MONTHLY" : "YEARLY") ? (
                    <PayPalButton
                      tier={confirmedPlan.tier}
                      planType="BASIC"
                      hasPaymentMethod={hasPaymentMethod}
                      key={`${confirmedPlan.tier}-${confirmedPlan.planType}-${Date.now()}`}
                    />
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() =>
                        handlePlanClick(
                          isMonthly ? "MONTHLY" : "YEARLY",
                          "BASIC",
                        )
                      }
                    >
                      {currentPlan === "BASIC"
                        ? "Current Plan"
                        : isDowngrade("BASIC") && currentPlan !== "FREE"
                          ? "Downgrade to Basic"
                          : `Subscribe $${isMonthly ? monthlyPrices.BASIC : yearlyPrices.BASIC}/${isMonthly ? "mo" : "yr"}`}
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>

            {/* Pro Plan */}
            <Card
              className={`flex flex-col ${currentPlan === "PRO" ? "ring-2 ring-primary border-primary" : ""}`}
            >
              <CardHeader>
                {currentPlan === "PRO" && (
                  <Badge variant="default" className="mb-2 w-fit bg-primary">
                    Current Plan
                  </Badge>
                )}
                <CardTitle className="font-medium">Pro</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  ${isMonthly ? monthlyPrices.PRO : yearlyPrices.PRO} /{" "}
                  {isMonthly ? "mo" : "yr"}
                </span>
                <CardDescription className="text-sm">
                  For serious entrepreneurs
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 flex grow">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {features.PRO.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              {!onHomePage && (
                <CardFooter>
                  {confirmedPlan?.planType === "PRO" &&
                  confirmedPlan?.tier === (isMonthly ? "MONTHLY" : "YEARLY") ? (
                    <PayPalButton
                      tier={confirmedPlan.tier}
                      planType="PRO"
                      hasPaymentMethod={hasPaymentMethod}
                      key={`${confirmedPlan.tier}-${confirmedPlan.planType}-${Date.now()}`}
                    />
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() =>
                        handlePlanClick(isMonthly ? "MONTHLY" : "YEARLY", "PRO")
                      }
                    >
                      {currentPlan === "PRO"
                        ? "Current Plan"
                        : `Subscribe $${isMonthly ? monthlyPrices.PRO : yearlyPrices.PRO}/${isMonthly ? "mo" : "yr"}`}
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
