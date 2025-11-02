import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Startup Validator - AI-Powered Startup Idea Validation",
  description:
    "Validate your startup ideas with AI-powered analysis. Get detailed feedback, project plans, and actionable insights to bring your idea to life.",
  openGraph: {
    title: "Startup Validator - AI-Powered Startup Idea Validation",
    description: "Validate your startup ideas with AI-powered analysis",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Validator",
    description: "Validate your startup ideas with AI-powered analysis",
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container flex flex-col items-center justify-center gap-8 py-24 text-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Validate Your{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Startup Idea
              </span>{" "}
              with AI
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              Get instant AI-powered validation, detailed project plans, and
              actionable insights to turn your startup idea into reality.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/auth/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              5 free validations • No credit card required
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-24">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to validate and plan
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Comprehensive tools to analyze, plan, and execute your startup
                idea
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Zap className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>AI Validation</CardTitle>
                  <CardDescription>
                    Get instant AI-powered analysis of your startup idea with
                    detailed feedback on strengths, weaknesses, and market
                    potential
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Sparkles className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Project Planning</CardTitle>
                  <CardDescription>
                    Receive comprehensive project plans with phases, tasks,
                    timelines, and dependencies to guide your execution
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Visual Flowcharts</CardTitle>
                  <CardDescription>
                    Interactive flowcharts using xyflow to visualize your
                    project workflow and understand dependencies
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-bold">KB</span>
                  </div>
                  <CardTitle>KANBAN & SCRUM</CardTitle>
                  <CardDescription>
                    Toggle between KANBAN and SCRUM boards to manage all project
                    tasks with drag-and-drop functionality
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Sparkles className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Alternative Ideas</CardTitle>
                  <CardDescription>
                    Discover alternative startup ideas inspired by your concept
                    with AI-generated suggestions
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Subscription Tiers</CardTitle>
                  <CardDescription>
                    Flexible pricing with monthly, yearly, or one-time payment
                    options to fit your needs
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container py-24">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple Pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that works for you
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">5 AI validations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">Basic project plans</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">Flowchart visualization</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">50 validations/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">Advanced plans</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">KANBAN & SCRUM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Yearly</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$299</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                  <p className="text-sm text-primary">Save 20%</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">600 validations/year</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">All features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>One-Time</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$49</span>
                    <span className="text-muted-foreground"> once</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">Unlimited validations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">Lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">All features</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-24">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="flex flex-col items-center justify-center gap-6 py-12 text-center">
              <h2 className="text-3xl font-bold">
                Ready to validate your idea?
              </h2>
              <p className="max-w-[600px] text-muted-foreground">
                Join thousands of entrepreneurs who are using AI to validate and
                build their startup ideas
              </p>
              <Button asChild size="lg" className="text-lg">
                <Link href="/auth/signup">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
