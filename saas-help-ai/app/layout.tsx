import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Startup Validator - AI-Powered Startup Idea Validation",
    template: "%s | Startup Validator",
  },
  description:
    "Validate your startup ideas with AI-powered analysis. Get detailed feedback, project plans, and actionable insights to bring your idea to life.",
  keywords: [
    "startup",
    "validation",
    "AI",
    "business ideas",
    "entrepreneurship",
  ],
  authors: [{ name: "Startup Validator" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Startup Validator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Validator - AI-Powered Startup Idea Validation",
    description: "Validate your startup ideas with AI-powered analysis",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased container mx-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
