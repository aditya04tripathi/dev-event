import { GithubIcon, LinkedinIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="mt-10 border-t bg-background">
			<div className="container mx-auto px-4 py-12 max-w-7xl">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="space-y-4">
						<h3 className="text-lg font-bold">DevEvent</h3>
						<p className="text-sm text-muted-foreground">
							Discover and join amazing tech events. Connect with developers,
							learn new skills, and grow your network.
						</p>
						<div className="flex gap-4">
							<Link
								href="https://github.com/aditya04tripathi"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<GithubIcon className="size-5" />
								<span className="sr-only">GitHub</span>
							</Link>
							<Link
								href="https://linkedin.com/in/aditya-tripathi-887586379"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<LinkedinIcon className="size-5" />
								<span className="sr-only">LinkedIn</span>
							</Link>
							<Link
								href="mailto:adityatripathi.at04@gmail.com"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<MailIcon className="size-5" />
								<span className="sr-only">Email</span>
							</Link>
						</div>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold">Events</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/events"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Browse Events
								</Link>
							</li>
							<li>
								<Link
									href="/events/new"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Create Event
								</Link>
							</li>
							<li>
								<Link
									href="/events?mode=online"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Online Events
								</Link>
							</li>
							<li>
								<Link
									href="/events?mode=offline"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									In-Person Events
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold">Company</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/contact"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold">Legal</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/privacy"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
					<p>© {currentYear} DevEvent. All rights reserved.</p>
					<p>Made with ❤️ by developers, for developers</p>
				</div>
			</div>
		</footer>
	);
}
