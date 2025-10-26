import ContactForm from "@/components/contact-form";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CREATOR_INFO } from "@/lib/site-constants";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  LinkedinIcon,
  GithubIcon,
  ClockIcon,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact | DevEvent",
  description: "Get in touch with Aditya Tripathi",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      <div className="mb-8 sm:mb-10 md:mb-12">
        <h1 className="font-bold tracking-tight mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
          Have questions, suggestions, or want to collaborate? I&apos;d love to
          hear from you!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
        <div className="md:col-span-1 space-y-6 sm:space-y-8">
          <section>
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
              Contact
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <article className="flex items-start gap-3">
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    <MailIcon
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <h6 className="font-semibold">Email</h6>
                  </div>
                  <Link
                    href={`mailto:${CREATOR_INFO.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {CREATOR_INFO.email}
                  </Link>
                </div>
              </article>

              <article className="flex items-start gap-3">
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    <ClockIcon
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <h6 className="font-semibold">Response Time</h6>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Within 24-48 hours
                  </p>
                </div>
              </article>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
              Socials
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    href={CREATOR_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <LinkedinIcon className="size-5 text-primary" />
                    <div>
                      <h5 className="font-semibold">LinkedIn</h5>
                      <p className="text-xs text-muted-foreground">
                        Professional profile
                      </p>
                    </div>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80" align="start">
                  <div className="space-y-2">
                    <h6 className="font-semibold">Connect on LinkedIn</h6>
                    <p className="text-sm text-muted-foreground">
                      View my professional experience, skills, and connect with
                      me on LinkedIn.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    href={CREATOR_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <GithubIcon className="size-5 text-primary" />
                    <div>
                      <h5 className="font-semibold">GitHub</h5>
                      <p className="text-xs text-muted-foreground">
                        View my projects
                      </p>
                    </div>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80" align="start">
                  <div className="space-y-2">
                    <h6 className="font-semibold">Check Out My GitHub</h6>
                    <p className="text-sm text-muted-foreground">
                      Explore my open-source projects, contributions, and code
                      repositories.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </section>
        </div>

        <section className="md:col-span-2">
          <h3 className="font-bold tracking-tight mb-4 sm:mb-6 text-xl sm:text-2xl md:text-3xl">
            Send a Message
          </h3>
          <ContactForm />
        </section>
      </div>

      <Separator className="my-8 sm:my-10 md:my-12" />

      <section className="space-y-5 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
        <h2 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <h3 className="text-left">
                How quickly will I receive a response?
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                I typically respond to all inquiries within 24-48 hours during
                business days. For urgent matters, please indicate this in your
                message and I&apos;ll prioritize your request.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h3 className="text-left">
                Can I suggest features for DevEvent?
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Absolutely! I&apos;m always looking for ways to improve the
                platform. Use the contact form and select &quot;Feature
                Request&quot; as your reason for contacting. I review all
                suggestions and consider them for future updates.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <h3 className="text-left">
                Are you available for collaboration?
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Yes! I&apos;m open to collaboration opportunities, whether
                it&apos;s for projects, events, or partnerships. Reach out via
                the form or email to discuss your ideas. I&apos;m particularly
                interested in projects that involve full-stack development and
                modern web technologies.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <h3 className="text-left">How do I report a technical issue?</h3>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Please use the contact form and select &quot;Bug Report&quot; or
                &quot;Technical Support&quot;. Include as much detail as
                possible about the issue: what you were doing, what you expected
                to happen, what actually happened, and steps to reproduce it.
                Screenshots are helpful too!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              <h3 className="text-left">Do you offer freelance services?</h3>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                I&apos;m currently focused on my studies at Monash University,
                but I&apos;m open to discussing part-time opportunities that
                align with my schedule. Feel free to reach out with your project
                details and timeline.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>
              <h3 className="text-left">
                What&apos;s your tech stack expertise?
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                I specialize in modern web development with Next.js, React,
                TypeScript, and Node.js. I&apos;m experienced with MongoDB,
                Cloudinary for media management, and building responsive UIs
                with Tailwind CSS and shadcn/ui. Check out the{" "}
                <Link href="/about" className="underline hover:text-foreground">
                  About page
                </Link>{" "}
                for a complete list of my skills.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Separator className="my-8 sm:my-10 md:my-12" />

      <section className="space-y-5 sm:space-y-6">
        <h2 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl">
          What I Can Help With
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <article className="flex items-start gap-2">
            <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <h5 className="font-semibold">General Inquiries</h5>
              <p className="text-muted-foreground">
                Questions about DevEvent or my work
              </p>
            </div>
          </article>
          <article className="flex items-start gap-2">
            <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <h5 className="font-semibold">Technical Support</h5>
              <p className="text-muted-foreground">
                Help with platform issues or bugs
              </p>
            </div>
          </article>
          <article className="flex items-start gap-2">
            <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <h5 className="font-semibold">Collaboration Opportunities</h5>
              <p className="text-muted-foreground">
                Projects, partnerships, or joint ventures
              </p>
            </div>
          </article>
          <article className="flex items-start gap-2">
            <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <h5 className="font-semibold">Feature Requests</h5>
              <p className="text-muted-foreground">
                Suggestions for new features or improvements
              </p>
            </div>
          </article>
          <article className="flex items-start gap-2">
            <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <h5 className="font-semibold">Career Opportunities</h5>
              <p className="text-muted-foreground">
                Job offers or internship opportunities
              </p>
            </div>
          </article>
          <article className="flex items-start gap-2">
            <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <h5 className="font-semibold">Feedback</h5>
              <p className="text-muted-foreground">
                Share your thoughts and suggestions
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
