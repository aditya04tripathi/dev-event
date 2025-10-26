import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service | DevEvent",
  description: "Terms of Service for DevEvent platform",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-bold tracking-tight mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Last updated: October 26, 2025
        </p>
      </div>

      <div className="space-y-5 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Agreement to Terms
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          By accessing or using DevEvent, you agree to be bound by these Terms
          of Service and all applicable laws and regulations. If you do not
          agree with any of these terms, you are prohibited from using or
          accessing this site.
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Use License
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          Permission is granted to temporarily access the materials on DevEvent
          for personal, non-commercial transitory viewing only. This is the
          grant of a license, not a transfer of title, and under this license
          you may not:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>Attempt to decompile or reverse engineer any software</li>
          <li>Remove any copyright or proprietary notations</li>
          <li>Transfer the materials to another person</li>
        </ul>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          User Accounts
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          When you create an account with us, you must provide accurate and
          complete information. You are responsible for:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
          <li>Maintaining the security of your account</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized access</li>
        </ul>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Event Creation and Management
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          When creating events on DevEvent, you agree to:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
          <li>Provide accurate and truthful event information</li>
          <li>Ensure you have the right to host and promote the event</li>
          <li>Not use the platform for fraudulent or misleading events</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Be responsible for the content of your event listings</li>
        </ul>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          User Content
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          You retain ownership of any content you post on DevEvent. However, by
          posting content, you grant us a worldwide, non-exclusive, royalty-free
          license to use, reproduce, and display such content in connection with
          the service.
        </p>
        <p className="mt-4 text-sm sm:text-base leading-relaxed">
          You warrant that:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
          <li>You own or have the necessary rights to the content</li>
          <li>The content does not violate any third-party rights</li>
          <li>The content does not contain malicious code or viruses</li>
        </ul>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Prohibited Activities
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          You agree not to:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
          <li>Use the service for any illegal purpose</li>
          <li>Spam, phish, or send unsolicited communications</li>
          <li>Impersonate any person or entity</li>
          <li>Interfere with or disrupt the service</li>
          <li>Attempt to gain unauthorized access to any systems</li>
          <li>Scrape or harvest user data</li>
          <li>Post offensive, harmful, or inappropriate content</li>
        </ul>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Intellectual Property
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          The service and its original content (excluding user-generated
          content), features, and functionality are owned by DevEvent and are
          protected by international copyright, trademark, and other
          intellectual property laws.
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Disclaimer
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          The materials on DevEvent are provided on an &apos;as is&apos; basis.
          DevEvent makes no warranties, expressed or implied, and hereby
          disclaims all other warranties including, without limitation, implied
          warranties or conditions of merchantability, fitness for a particular
          purpose, or non-infringement of intellectual property.
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Limitations of Liability
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          In no event shall DevEvent or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or
          due to business interruption) arising out of the use or inability to
          use the materials on DevEvent.
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Termination
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          We may terminate or suspend your account and bar access to the service
          immediately, without prior notice or liability, under our sole
          discretion, for any reason whatsoever, including but not limited to a
          breach of the Terms.
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Changes to Terms
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          We reserve the right to modify or replace these Terms at any time. We
          will provide notice of any significant changes by posting the new
          Terms on this page and updating the &quot;Last updated&quot; date.
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Contact Information
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          If you have any questions about these Terms, please contact us:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
          <li>By email: legal@devevent.com</li>
          <li>By visiting our contact page</li>
        </ul>
      </div>
    </div>
  );
}
