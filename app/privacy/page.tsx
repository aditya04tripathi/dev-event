import { SITE_INFO } from "@/lib/site-constants";
import { BlurFade } from "@/components/ui/blur-fade";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for DevEvent platform. Learn how we collect, use, and protect your personal data. Your privacy and data security are our priorities.",
  keywords: [
    "privacy policy",
    "data protection",
    "privacy",
    "GDPR",
    "data security",
  ],
  openGraph: {
    title: "Privacy Policy | DevEvent",
    description: "Learn how we protect your personal data and privacy.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy | DevEvent",
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <div className="relative section">
      <GridPattern
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 opacity-20 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />
      <div className="relative container-tight">
        <BlurFade delay={0.05}>
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: October 26, 2025
            </p>
          </header>
        </BlurFade>

        <BlurFade delay={0.1}>
          <div className="prose">
            <h2>Introduction</h2>
            <p>
              Welcome to DevEvent. We respect your privacy and are committed to
              protecting your personal data. This privacy policy will inform you
              about how we look after your personal data when you visit our
              website and tell you about your privacy rights.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of
              personal data about you:
            </p>
            <ul>
              <li>
                <strong>Identity Data:</strong> includes name, username or
                similar identifier
              </li>
              <li>
                <strong>Contact Data:</strong> includes email address
              </li>
              <li>
                <strong>Technical Data:</strong> includes internet protocol (IP)
                address, browser type and version
              </li>
              <li>
                <strong>Usage Data:</strong> includes information about how you
                use our website and services
              </li>
              <li>
                <strong>Event Data:</strong> includes events you create, attend,
                or bookmark
              </li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and maintain our service</li>
              <li>Process your event registrations and bookings</li>
              <li>Send you event updates and notifications</li>
              <li>Improve our website and services</li>
              <li>Detect and prevent fraud and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed. We use industry-standard
              encryption and secure servers to protect your data.
            </p>

            <h2>Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our service and hold certain information. You can instruct your
              browser to refuse all cookies or to indicate when a cookie is
              being sent.
            </p>

            <h2>Third-Party Services</h2>
            <p>We may employ third-party companies and services for:</p>
            <ul>
              <li>Image hosting and CDN (Cloudinary)</li>
              <li>Database services (MongoDB)</li>
              <li>Analytics and performance monitoring</li>
            </ul>
            <p>
              These third parties have access to your personal data only to
              perform these tasks on our behalf and are obligated not to
              disclose or use it for any other purpose.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <ul>
              <li>By email: {SITE_INFO.privacyEmail}</li>
              <li>By visiting our contact page</li>
            </ul>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
