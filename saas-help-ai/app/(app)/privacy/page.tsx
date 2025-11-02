import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Startup Validator",
  openGraph: {
    title: "Privacy Policy | Startup Validator",
    description: "Privacy Policy for Startup Validator",
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 py-8">
        <div className="container mx-auto flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Our privacy policy and data handling practices
              </p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-sm text-muted-foreground mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2>1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us,
                including:
              </p>
              <ul>
                <li>Account information (email, name, password)</li>
                <li>Startup ideas and validation requests</li>
                <li>Payment information (processed securely through PayPal)</li>
                <li>Usage data and analytics</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze usage patterns</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information. We may
                share your information only in the following circumstances:
              </p>
              <ul>
                <li>
                  With service providers who assist us in operating our platform
                </li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over
                the internet is 100% secure.
              </p>

              <h2>5. Data Retention</h2>
              <p>
                We retain your information for as long as your account is active
                or as needed to provide services. You may request deletion of
                your account and data at any time.
              </p>

              <h2>6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our platform and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>

              <h2>7. Third-Party Services</h2>
              <p>
                Our Service may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these third parties.
              </p>

              <h2>8. Children's Privacy</h2>
              <p>
                Our Service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13.
              </p>

              <h2>9. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of certain communications</li>
              </ul>

              <h2>10. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page.
              </p>

              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us through our support channels.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
