import type { Metadata } from "next";
import { Inter, Martian_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/providers";

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

const martianMono = Martian_Mono({
	variable: "--font-mono",
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
				className={`dark ${inter.variable} ${martianMono.variable} antialiased bg-background text-foreground`}
			>
				<Providers>
					<main className="min-h-screen flex flex-col">{children}</main>
				</Providers>
			</body>
		</html>
	);
}
