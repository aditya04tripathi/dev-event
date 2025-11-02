import { Download, FileText } from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Invoices",
  description: "View and download your invoices",
};

export default async function InvoicesPage() {
  // TODO: Fetch invoices from payment provider (PayPal)
  // const session = await auth();
  // For now, show empty state
  const invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: "paid" | "pending" | "failed";
    description: string;
  }> = [];

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 py-8">
        <div className="container mx-auto flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
              <p className="text-muted-foreground">
                View and download your payment invoices
              </p>
            </div>
          </div>

          {invoices.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Invoices</CardTitle>
                <CardDescription>
                  Your invoices will appear here once you make a payment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No invoices available yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {invoice.description}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {new Date(invoice.date).toLocaleDateString()} • $
                          {invoice.amount}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : invoice.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
