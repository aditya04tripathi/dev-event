import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { PricingCards } from "@/components/pricing-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the perfect plan for your startup validation needs",
  openGraph: {
    title: "Pricing | Startup Validator",
    description: "Choose the perfect plan for your startup validation needs",
  },
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container flex-1 py-12">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Simple Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that works best for you
            </p>
          </div>

          {/* Pricing Cards */}
          <PricingCards />

          {/* Features Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Comparison</CardTitle>
              <CardDescription>
                Compare features across all plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-semibold">
                        Feature
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        Free
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        Monthly
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        Yearly
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        One-Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3">AI Validations</td>
                      <td className="px-4 py-3 text-center">5</td>
                      <td className="px-4 py-3 text-center">50/month</td>
                      <td className="px-4 py-3 text-center">600/year</td>
                      <td className="px-4 py-3 text-center">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">Project Plans</td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">Flowcharts</td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">KANBAN & SCRUM Boards</td>
                      <td className="px-4 py-3 text-center">-</td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">Alternative Ideas</td>
                      <td className="px-4 py-3 text-center">-</td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Priority Support</td>
                      <td className="px-4 py-3 text-center">-</td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
