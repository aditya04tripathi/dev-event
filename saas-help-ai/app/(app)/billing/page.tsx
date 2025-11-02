import type { Metadata } from "next";
import { auth } from "@/auth";
import { BillingSettings } from "@/components/billing-settings";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const metadata: Metadata = {
  title: "Billing Settings",
  description: "Manage your subscription and billing",
};

export default async function BillingPage() {
  const session = await auth();
  await connectDB();
  const user = await User.findById(session?.user?.id).lean();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 py-8">
        <div className="container mx-auto flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
              <p className="text-muted-foreground">
                Manage your subscription and billing
              </p>
            </div>
          </div>

          <BillingSettings
            user={{
              subscriptionTier: user.subscriptionTier,
              paypalSubscriptionId: user.paypalSubscriptionId,
            }}
          />
        </div>
      </main>
    </div>
  );
}
