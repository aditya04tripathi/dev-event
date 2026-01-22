import {
  ClockIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import ContactForm from "@/components/forms/contact-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GridPattern } from "@/components/ui/grid-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";
import { CREATOR_INFO } from "@/lib/site-constants";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Aditya Tripathi. Have questions, suggestions, or want to collaborate? Reach out for general inquiries, technical support, or career opportunities.",
  keywords: [
    "contact",
    "get in touch",
    "developer contact",
    "collaboration",
    "support",
  ],
  openGraph: {
    title: "Contact | DevEvent",
    description:
      "Get in touch for questions, suggestions, or collaboration opportunities.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact | DevEvent",
      },
    ],
  },
};

const CONTACT_INFO = [
  {
    icon: MailIcon,
    label: "Email",
    value: CREATOR_INFO.email,
    href: `mailto:${CREATOR_INFO.email}` as string | undefined,
  },
  {
    icon: ClockIcon,
    label: "Response Time",
    value: "Within 24-48 hours",
    href: undefined as string | undefined,
  },
] as const;

const SOCIAL_LINKS = [
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    description: "Professional profile",
    href: CREATOR_INFO.linkedin,
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    description: "View my projects",
    href: CREATOR_INFO.github,
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "How quickly will I receive a response?",
    answer:
      "I typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please indicate this in your message and I'll prioritize your request.",
  },
  {
    question: "Can I suggest features for DevEvent?",
    answer:
      'Absolutely! I\'m always looking for ways to improve the platform. Use the contact form and select "Feature Request" as your reason for contacting. I review all suggestions and consider them for future updates.',
  },
  {
    question: "Are you available for collaboration?",
    answer:
      "Yes! I'm open to collaboration opportunities, whether it's for projects, events, or partnerships. Reach out via the form or email to discuss your ideas.",
  },
  {
    question: "How do I report a technical issue?",
    answer:
      'Please use the contact form and select "Bug Report" or "Technical Support". Include as much detail as possible about the issue: what you were doing, what you expected to happen, and steps to reproduce it.',
  },
] as const;

const HELP_TOPICS = [
  { title: "General Inquiries", description: "Questions about DevEvent" },
  { title: "Technical Support", description: "Help with platform issues" },
  { title: "Collaboration", description: "Projects and partnerships" },
  { title: "Feature Requests", description: "Suggestions for improvements" },
  { title: "Career Opportunities", description: "Job offers or internships" },
  { title: "Feedback", description: "Share your thoughts" },
] as const;

export default function ContactPage() {
  return (
    <div className="relative section-sm">
      <GridPattern
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
        )}
      />
      <div className="container-tight relative">
        {/* Header */}
        <BlurFade delay={0.05}>
          <header className="mb-12 text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-muted-foreground text-lg">
              Have questions, suggestions, or want to collaborate? I&apos;d love
              to hear from you.
            </p>
          </header>
        </BlurFade>

        <div className="flex flex-col gap-12">
          {/* Form */}
          <BlurFade delay={0.1}>
            <div className="w-full">
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
                <h2 className="text-xl font-semibold tracking-tight mb-6">
                  Send a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </BlurFade>

          {/* Info Cards */}
          <BlurFade delay={0.15}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Social links */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Connect
                </h2>
                <div className="space-y-2">
                  {SOCIAL_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 -mx-1 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <link.icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{link.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {link.description}
                        </p>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Help topics */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  I Can Help With
                </h2>
                <div className="space-y-3">
                  {HELP_TOPICS.map((topic) => (
                    <div key={topic.title} className="flex items-start gap-3">
                      <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{topic.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* FAQ Section */}
        <BlurFade delay={0.2}>
          <section className="mt-20 pt-12 border-t border-border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Find quick answers to common questions
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </BlurFade>
      </div>
    </div>
  );
}
