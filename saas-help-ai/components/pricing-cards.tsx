"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUBSCRIPTION_TIERS } from "@/constants";
import { PayPalButton } from "./paypal-button";

export function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Free Tier */}
      <Card>
        <CardHeader>
          <CardTitle>Free</CardTitle>
          <div className="mt-2">
            <span className="text-3xl font-bold">$0</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {SUBSCRIPTION_TIERS.FREE.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <Button asChild className="w-full" variant="outline">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Monthly Tier */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly</CardTitle>
          <div className="mt-2">
            <span className="text-3xl font-bold">
              ${SUBSCRIPTION_TIERS.MONTHLY.price}
            </span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {SUBSCRIPTION_TIERS.MONTHLY.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <PayPalButton tier="MONTHLY" />
        </CardContent>
      </Card>

      {/* Yearly Tier */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Yearly</CardTitle>
            <Badge variant="default">Best Value</Badge>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">
              ${SUBSCRIPTION_TIERS.YEARLY.price}
            </span>
            <span className="text-muted-foreground">/year</span>
          </div>
          <p className="text-sm text-primary">Save 20%</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {SUBSCRIPTION_TIERS.YEARLY.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <PayPalButton tier="YEARLY" />
        </CardContent>
      </Card>

      {/* One-Time Tier */}
      <Card>
        <CardHeader>
          <CardTitle>One-Time</CardTitle>
          <div className="mt-2">
            <span className="text-3xl font-bold">
              ${SUBSCRIPTION_TIERS.ONE_OFF.price}
            </span>
            <span className="text-muted-foreground"> once</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {SUBSCRIPTION_TIERS.ONE_OFF.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <PayPalButton tier="ONE_OFF" />
        </CardContent>
      </Card>
    </div>
  );
}
