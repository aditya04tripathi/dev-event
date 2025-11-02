import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions for Startup Validator",
  openGraph: {
    title: "Terms and Conditions | Startup Validator",
    description: "Terms and Conditions for Startup Validator",
  },
};

export default function TermsPage() {
  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 py-8">
        <div className="container mx-auto flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Terms and Conditions
              </h1>
              <p className="text-muted-foreground">
                Terms of service and usage agreement
              </p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-sm text-muted-foreground mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Startup Validator ("the Service"), you
                accept and agree to be bound by the terms and provision of this
                agreement.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                Startup Validator is an AI-powered platform that provides
                startup idea validation, project planning, and business
                insights. We offer various subscription plans with different
                features and usage limits.
              </p>

              <h2>3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials. You agree to notify us immediately of any
                unauthorized use of your account.
              </p>

              <h2>4. Subscription and Payment</h2>
              <p>
                Subscriptions are billed on a monthly or yearly basis. Payments
                are processed through PayPal. All fees are non-refundable unless
                required by law or as stated in our refund policy.
              </p>

              <h2>5. Usage Limits</h2>
              <p>
                Free accounts include 5 validations. Paid plans have specific
                limits as outlined in our pricing page. Usage is tracked and
                enforced per subscription period.
              </p>

              <h2>6. Intellectual Property</h2>
              <p>
                All content, features, and functionality of the Service are
                owned by Startup Validator and are protected by international
                copyright, trademark, and other intellectual property laws.
              </p>

              <h2>7. User Content</h2>
              <p>
                You retain ownership of any content you submit. By submitting
                content, you grant us a license to use, modify, and display such
                content for the purpose of providing the Service.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                Startup Validator provides AI-generated suggestions and insights
                for informational purposes only. We do not guarantee the
                accuracy, completeness, or usefulness of any information
                provided. You use the Service at your own risk.
              </p>

              <h2>9. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without
                prior notice, for conduct that we believe violates these Terms
                or is harmful to other users, us, or third parties.
              </p>

              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Your
                continued use of the Service after any changes constitutes
                acceptance of the new terms.
              </p>

              <h2>11. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us
                through our support channels.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
