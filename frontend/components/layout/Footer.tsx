import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

const FOOTER_SECTIONS = {
  discover: {
    title: "Discover",
    links: [
      { href: "/events", label: "Browse Events" },
      { href: "/events?mode=online", label: "Online Events" },
      { href: "/organizers", label: "Organizers" },
    ],
  },
  organize: {
    title: "Organize",
    links: [
      { href: "/auth/signup?role=organizer", label: "Host an Event" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/contact", label: "Support" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
};

const SOCIAL_LINKS = [
  {
    href: "https://github.com/aditya04tripathi",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/aditya-tripathi-887586379",
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com",
    icon: Twitter,
    label: "Twitter",
  },
  {
    href: "mailto:adityatripathi.at04@gmail.com",
    icon: Mail,
    label: "Email",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-wide py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary shadow-sm">
                <span className="text-sm font-bold text-primary-foreground">
                  D
                </span>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                DevEvent
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              The platform for discovering and organizing developer events.
              Connect, learn, and grow.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {Object.entries(FOOTER_SECTIONS).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} DevEvent. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ♥ by{" "}
            <Link
              href="https://github.com/aditya04tripathi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              Aditya Tripathi
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
