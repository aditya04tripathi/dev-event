import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SITE_INFO } from "@/lib/site-constants";

export const metadata = {
  title: "Privacy Policy | DevEvent",
  description: "Privacy Policy for DevEvent platform",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-bold tracking-tight mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Last updated: October 26, 2025
        </p>
      </div>

      <div className="space-y-5 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Introduction
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          Welcome to DevEvent. We respect your privacy and are committed to
          protecting your personal data. This privacy policy will inform you
          about how we look after your personal data when you visit our website
          and tell you about your privacy rights.
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Information We Collect
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          We may collect, use, store and transfer different kinds of personal
          data about you:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
          <li>
            <strong>Identity Data:</strong> includes name, username or similar
            identifier
          </li>
          <li>
            <strong>Contact Data:</strong> includes email address
          </li>
          <li>
            <strong>Technical Data:</strong> includes internet protocol (IP)
            address, browser type and version
          </li>
          <li>
            <strong>Usage Data:</strong> includes information about how you use
            our website and services
          </li>
          <li>
            <strong>Event Data:</strong> includes events you create, attend, or
            bookmark
          </li>
        </ul>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          How We Use Your Information
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          We use your information to:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
          <li>Provide and maintain our service</li>
          <li>Process your event registrations and bookings</li>
          <li>Send you event updates and notifications</li>
          <li>Improve our website and services</li>
          <li>Detect and prevent fraud and abuse</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Data Security
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          We have put in place appropriate security measures to prevent your
          personal data from being accidentally lost, used or accessed in an
          unauthorized way, altered or disclosed. We use industry-standard
          encryption and secure servers to protect your data.
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">Cookies</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          We use cookies and similar tracking technologies to track activity on
          our service and hold certain information. You can instruct your
          browser to refuse all cookies or to indicate when a cookie is being
          sent.
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Third-Party Services
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          We may employ third-party companies and services for:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
          <li>Image hosting and CDN (Cloudinary)</li>
          <li>Database services (MongoDB)</li>
          <li>Analytics and performance monitoring</li>
        </ul>
        <p className="mt-4 text-sm sm:text-base leading-relaxed">
          These third parties have access to your personal data only to perform
          these tasks on our behalf and are obligated not to disclose or use it
          for any other purpose.
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Your Rights
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          You have the right to:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
          <li>Request access to your personal data</li>
          <li>Request correction of your personal data</li>
          <li>Request erasure of your personal data</li>
          <li>Object to processing of your personal data</li>
          <li>Request restriction of processing your personal data</li>
          <li>Request transfer of your personal data</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Contact Us
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          If you have any questions about this Privacy Policy, please contact
          us:
        </p>
        <ul className="space-y-2 text-sm sm:text-base">
          <li>By email: {SITE_INFO.privacyEmail}</li>
          <li>By visiting our contact page</li>
        </ul>
      </div>
    </div>
  );
}
