import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CREATOR_INFO,
  EDUCATION,
  PROJECTS,
  SKILLS,
  WORK_EXPERIENCE,
} from "@/lib/site-constants";
import {
  GraduationCapIcon,
  BriefcaseIcon,
  CodeIcon,
  MailIcon,
  LinkedinIcon,
  GithubIcon,
  MapPinIcon,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "Learn about Aditya Tripathi, the developer behind DevEvent. Full-stack developer specializing in Next.js, React, TypeScript, and MongoDB.",
  keywords: [
    "Aditya Tripathi",
    "developer",
    "full-stack developer",
    "Next.js developer",
    "React developer",
    "portfolio",
  ],
  openGraph: {
    title: "About Aditya Tripathi | DevEvent",
    description:
      "Learn about the developer behind DevEvent. Full-stack developer specializing in modern web technologies.",
    type: "profile",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Aditya Tripathi | DevEvent",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      <div className="mb-8 sm:mb-10 md:mb-12">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start">
          <Avatar className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48">
            <AvatarImage
              src={
                "https://res.cloudinary.com/dpaqsdcky/image/upload/v1761473970/pfp_cw1znb.jpg"
              }
            />
            <AvatarFallback>
              {CREATOR_INFO.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left">
            <div>
              <h1 className="font-bold tracking-tight mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                {CREATOR_INFO.name}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
                {CREATOR_INFO.title}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPinIcon className="size-4" />
                <span>{CREATOR_INFO.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="size-4" />
                <Link
                  href={`mailto:${CREATOR_INFO.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {CREATOR_INFO.email}
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                href={CREATOR_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <LinkedinIcon className="size-4 mr-2" />
                  LinkedIn
                </Button>
              </Link>
              <Link
                href={CREATOR_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <GithubIcon className="size-4 mr-2" />
                  GitHub
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto">
                  <MailIcon className="size-4 mr-2" />
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8 sm:my-10 md:my-12" />

      <section className="space-y-5 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
        <h2 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl">
          About Me
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
          <p>{CREATOR_INFO.bio}</p>
          <p>
            My journey into software development is driven by curiosity and a
            passion for building solutions that make a difference. Coming from a
            diverse background in customer service and operations, I bring a
            unique perspective focused on user experience and practical
            problem-solving.
          </p>
          <p>
            DevEvent is my portfolio project that showcases my skills in
            full-stack web development. Built with modern technologies like
            Next.js, TypeScript, MongoDB, and Cloudinary, it demonstrates my
            ability to create production-ready applications with features like
            authentication, database management, real-time search, and cloud
            integration.
          </p>
          <p>
            I&apos;m currently seeking opportunities to grow as a software
            engineer while continuing my studies at Monash University. I believe
            in continuous learning, writing clean code, and building
            applications that solve real problems.
          </p>
        </div>
      </section>

      <Separator className="my-8 sm:my-10 md:my-12" />

      <section className="space-y-5 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
        <h2 className="font-bold tracking-tight flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl">
          <GraduationCapIcon className="size-5 sm:size-6" />
          Education
        </h2>
        {EDUCATION.map((edu, index) => (
          <article key={index} className="space-y-2">
            <h3 className="font-semibold text-base sm:text-lg">{edu.degree}</h3>
            <h4 className="text-muted-foreground text-sm sm:text-base">
              {edu.institution}
            </h4>
            <div className="flex flex-wrap gap-2 items-center text-xs sm:text-sm text-muted-foreground">
              <span>{edu.location}</span>
              <span>•</span>
              <span>{edu.period}</span>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                {edu.status}
              </Badge>
            </div>
          </article>
        ))}
      </section>

      <Separator className="my-8 sm:my-10 md:my-12" />

      <section className="space-y-5 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
        <h2 className="font-bold tracking-tight flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl">
          <CodeIcon className="size-5 sm:size-6" />
          Technical Skills
        </h2>
        <div className="space-y-5 sm:space-y-6">
          <article>
            <h3 className="font-semibold mb-3 text-base sm:text-lg">
              Development
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {SKILLS.technical.map((skill) => (
                <Badge
                  key={skill}
                  variant="default"
                  className="text-xs sm:text-sm"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </article>
          <article>
            <h3 className="font-semibold mb-3 text-base sm:text-lg">
              Professional Skills
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {SKILLS.soft.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="text-xs sm:text-sm"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </article>
        </div>
      </section>

      <Separator className="my-8 sm:my-10 md:my-12" />

      <section className="space-y-5 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
        <h2 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl">
          Featured Project
        </h2>
        {PROJECTS.map((project, index) => (
          <article key={index} className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-base sm:text-lg">
                {project.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {project.description}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-xs sm:text-sm"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-2 text-sm sm:text-base">
                Key Features
              </h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs sm:text-sm">
                <li>Full-stack event management with CRUD operations</li>
                <li>Real-time search and filtering with pagination</li>
                <li>Image upload and CDN integration with Cloudinary</li>
                <li>Responsive design with Tailwind CSS and shadcn/ui</li>
                <li>Server actions and API routes for data handling</li>
                <li>MongoDB database with Mongoose ODM</li>
              </ul>
            </div>
          </article>
        ))}
      </section>

      <Separator className="my-8 sm:my-10 md:my-12" />

      <section className="space-y-5 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
        <h2 className="font-bold tracking-tight flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl">
          <BriefcaseIcon className="size-5 sm:size-6" />
          Work Experience
        </h2>
        <div className="space-y-5 sm:space-y-6">
          {[...WORK_EXPERIENCE]
            .sort((a, b) => {
              const getEndDate = (period: string) => {
                const parts = period.split(" - ");
                const endPart = parts.length > 1 ? parts[1] : parts[0];

                if (endPart.toLowerCase().includes("present")) {
                  return new Date();
                }

                return new Date(endPart);
              };

              return (
                getEndDate(b.period).getTime() - getEndDate(a.period).getTime()
              );
            })
            .map((job, index) => (
              <article key={index} className="space-y-2">
                <h3 className="font-semibold text-base sm:text-lg">
                  {job.role}
                </h3>
                <h4 className="text-muted-foreground text-sm sm:text-base">
                  {job.company}
                </h4>
                <div className="flex flex-wrap gap-2 items-center text-xs sm:text-sm text-muted-foreground">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.period}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </article>
            ))}
        </div>
      </section>

      <Separator className="my-8 sm:my-10 md:my-12" />

      <section className="text-center space-y-5 sm:space-y-6 py-6 sm:py-8">
        <div>
          <h2 className="font-bold tracking-tight mb-2 text-2xl sm:text-3xl md:text-4xl">
            Let&apos;s Work Together
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-4">
            I&apos;m actively seeking software engineering opportunities and
            open to collaborations. Whether you have a project in mind, need
            help with development, or just want to connect, feel free to reach
            out!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <Link href="/contact" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              <MailIcon className="size-4 mr-2" />
              Contact Me
            </Button>
          </Link>
          <Link href="/events" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Events
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
