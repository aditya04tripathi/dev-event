import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import DarkVeil from "@/components/DarkVeil";
import Footer from "@/components/Footer";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DevEvent - The Hub for Every Dev Event",
    template: "%s | DevEvent",
  },
  description:
    "The hub for every developer event you must not miss! Discover hackathons, meetups, and conferences all in one place.",
  keywords: [
    "developer events",
    "tech events",
    "hackathons",
    "meetups",
    "conferences",
    "coding events",
    "developer community",
  ],
  authors: [{ name: "Aditya Tripathi" }],
  creator: "Aditya Tripathi",
  metadataBase: new URL("https://dev-event.up.railway.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DevEvent",
    title: "DevEvent - The Hub for Every Dev Event",
    description:
      "Discover hackathons, meetups, and conferences all in one place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevEvent - The Hub for Every Dev Event",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevEvent - The Hub for Every Dev Event",
    description:
      "Discover hackathons, meetups, and conferences all in one place.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`dark ${schibstedGrotesk.variable} ${martianMono.variable} antialiased`}
      >
        <div className="w-full h-screen left-0 fixed top-0 inset-0 -z-1!">
          <DarkVeil />
        </div>

        <Navbar />

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
