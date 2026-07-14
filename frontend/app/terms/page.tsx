import { SITE_INFO } from "@/lib/site-constants";
import { BlurFade } from "@/components/ui/blur-fade";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for DevEvent platform. Read our terms and conditions, user agreements, and platform guidelines before using our services.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "legal",
    "platform rules",
  ],
  openGraph: {
    title: "Terms of Service | DevEvent",
    description: "Read our terms and conditions before using DevEvent.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Terms of Service | DevEvent",
      },
    ],
  },
};

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: October 26, 2025
            </p>
          </header>
        </BlurFade>

        <BlurFade delay={0.1}>
          <div className="prose">
            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using DevEvent, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you
              do not agree with any of these terms, you are prohibited from
              using or accessing this site.
            </p>

            <h2>Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on
              DevEvent for personal, non-commercial transitory viewing only.
              This is the grant of a license, not a transfer of title, and under
              this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person</li>
            </ul>

            <h2>User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and
              complete information. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>

            <h2>Event Creation and Management</h2>
            <p>When creating events on DevEvent, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful event information</li>
              <li>Ensure you have the right to host and promote the event</li>
              <li>Not use the platform for fraudulent or misleading events</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Be responsible for the content of your event listings</li>
            </ul>

            <h2>User Content</h2>
            <p>
              You retain ownership of any content you post on DevEvent. However,
              by posting content, you grant us a worldwide, non-exclusive,
              royalty-free license to use, reproduce, and display such content
              in connection with the service.
            </p>
            <p>You warrant that:</p>
            <ul>
              <li>You own or have the necessary rights to the content</li>
              <li>The content does not violate any third-party rights</li>
              <li>The content does not contain malicious code or viruses</li>
            </ul>

            <h2>Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any illegal purpose</li>
              <li>Spam, phish, or send unsolicited communications</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the service</li>
              <li>Attempt to gain unauthorized access to any systems</li>
              <li>Scrape or harvest user data</li>
              <li>Post offensive, harmful, or inappropriate content</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              The service and its original content (excluding user-generated
              content), features, and functionality are owned by DevEvent and
              are protected by international copyright, trademark, and other
              intellectual property laws.
            </p>

            <h2>Disclaimer</h2>
            <p>
              The materials on DevEvent are provided on an &apos;as is&apos;
              basis. DevEvent makes no warranties, expressed or implied, and
              hereby disclaims all other warranties including, without
              limitation, implied warranties or conditions of merchantability,
              fitness for a particular purpose, or non-infringement of
              intellectual property.
            </p>

            <h2>Limitations of Liability</h2>
            <p>
              In no event shall DevEvent or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on DevEvent.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever, including but not
              limited to a breach of the Terms.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time.
              We will provide notice of any significant changes by posting the
              new Terms on this page and updating the &quot;Last updated&quot;
              date.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul>
              <li>By email: {SITE_INFO.legalEmail}</li>
              <li>By visiting our contact page</li>
            </ul>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
