import { readFileSync } from "node:fs";

export const events = [
	{
		slug: "react-conf-2024",
		title: "React Conf 2024",
		description:
			"Join us for the premier React conference featuring the latest updates, best practices, and networking opportunities with React experts.",
		overview:
			"React Conf 2024 brings together React developers, maintainers, and enthusiasts from around the world. Learn about React 19, Server Components, and the future of React development.",
		image: "/images/event1.png",
		venue: "Moscone Center",
		location: "San Francisco, CA",
		date: "March 15, 2024",
		time: "9:00 AM",
		mode: "offline",
		audience: "React developers, Frontend engineers",
		agenda: [
			"Registration & Breakfast",
			"Keynote: The Future of React",
			"React Server Components Deep Dive",
			"Lunch Break",
			"Performance Optimization Workshop",
			"Panel Discussion",
			"Networking Session",
		],
		organizer: "React Team & Meta",
		tags: ["React", "Frontend", "JavaScript", "Web Development"],
	},
	{
		slug: "nextjs-summit",
		title: "Next.js Summit",
		description:
			"Explore the latest features in Next.js 15, including App Router, Server Actions, and advanced optimization techniques.",
		overview:
			"The Next.js Summit is a full-day conference dedicated to Next.js developers. Learn directly from the Vercel team and community experts about building production-ready applications.",
		image: "/images/event2.png",
		venue: "Austin Convention Center",
		location: "Austin, TX",
		date: "April 22, 2024",
		time: "10:00 AM",
		mode: "hybrid",
		audience: "Next.js developers, Full-stack developers",
		agenda: [
			"Opening Remarks",
			"What's New in Next.js 15",
			"Building Scalable Applications",
			"Lunch & Networking",
			"Server Actions Workshop",
			"Deployment Best Practices",
			"Q&A Session",
		],
		organizer: "Vercel",
		tags: ["Next.js", "React", "Full-stack", "Vercel"],
	},
	{
		slug: "javascript-world",
		title: "JavaScript World Conference",
		description:
			"The largest JavaScript conference covering everything from vanilla JS to modern frameworks and tools.",
		overview:
			"JavaScript World Conference is a comprehensive event featuring talks on JavaScript fundamentals, modern frameworks, tooling, and the future of web development.",
		image: "/images/event3.png",
		venue: "Javits Center",
		location: "New York, NY",
		date: "May 8, 2024",
		time: "8:30 AM",
		mode: "offline",
		audience: "JavaScript developers, Web developers, Software engineers",
		agenda: [
			"Registration",
			"Keynote: JavaScript in 2024",
			"Modern JavaScript Patterns",
			"Lunch Break",
			"Framework Wars: React vs Vue vs Svelte",
			"TypeScript Advanced Features",
			"Lightning Talks",
			"After Party",
		],
		organizer: "JavaScript Foundation",
		tags: ["JavaScript", "TypeScript", "Web Development", "Frontend"],
	},
	{
		slug: "ai-hackathon-2024",
		title: "AI Innovation Hackathon",
		description:
			"48-hour hackathon focused on building innovative AI-powered applications using the latest ML models and frameworks.",
		overview:
			"Join developers, data scientists, and AI enthusiasts for an intense 48-hour hackathon. Build, learn, and compete for amazing prizes while working with cutting-edge AI technologies.",
		image: "/images/event4.png",
		venue: "Amazon HQ",
		location: "Seattle, WA",
		date: "June 14-16, 2024",
		time: "6:00 PM",
		mode: "offline",
		audience: "Developers, Data scientists, AI enthusiasts",
		agenda: [
			"Opening Ceremony & Team Formation",
			"Hacking Begins",
			"Continuous Hacking with Workshops",
			"Project Submissions",
			"Demos & Judging",
			"Awards Ceremony",
		],
		organizer: "AI Developers Association",
		tags: ["AI", "Machine Learning", "Hackathon", "Innovation"],
	},
	{
		slug: "web3-developer-meetup",
		title: "Web3 Developer Meetup",
		description:
			"Evening meetup for Web3 developers to discuss blockchain, smart contracts, and decentralized applications.",
		overview:
			"Connect with fellow Web3 developers in an informal setting. Share experiences, learn about new tools, and discuss the latest trends in blockchain development.",
		image: "/images/event5.png",
		venue: "Blockchain Hub Miami",
		location: "Miami, FL",
		date: "July 20, 2024",
		time: "6:00 PM",
		mode: "offline",
		audience:
			"Blockchain developers, Web3 enthusiasts, Smart contract developers",
		agenda: [
			"Networking & Refreshments",
			"Welcome & Introductions",
			"Lightning Talks on Web3 Projects",
			"Panel: The Future of DeFi",
			"Open Discussion & Networking",
		],
		organizer: "Web3 Miami Community",
		tags: ["Web3", "Blockchain", "Ethereum", "DeFi"],
	},
	{
		slug: "fullstack-conference",
		title: "Full Stack Conference",
		description:
			"Comprehensive conference covering both frontend and backend technologies for modern web development.",
		overview:
			"Full Stack Conference brings together developers to explore the complete spectrum of web development, from React and Vue on the frontend to Node.js, databases, and cloud deployment.",
		image: "/images/event6.png",
		venue: "Colorado Convention Center",
		location: "Denver, CO",
		date: "August 12, 2024",
		time: "9:00 AM",
		mode: "hybrid",
		audience: "Full-stack developers, Software engineers, Tech leads",
		agenda: [
			"Registration & Coffee",
			"Keynote: Modern Full Stack Architecture",
			"Frontend Framework Comparison",
			"Lunch",
			"Backend APIs with Node.js",
			"Database Design Workshop",
			"Deployment & DevOps",
		],
		organizer: "Full Stack Association",
		tags: ["Full-stack", "Frontend", "Backend", "DevOps"],
	},
	{
		slug: "devops-unleashed",
		title: "DevOps Unleashed",
		description:
			"Learn advanced DevOps practices, CI/CD pipelines, containerization, and cloud-native development.",
		overview:
			"DevOps Unleashed is a hands-on conference featuring workshops and talks on modern DevOps practices, including Kubernetes, Docker, GitOps, and infrastructure as code.",
		image: "/images/event1.png",
		venue: "Navy Pier",
		location: "Chicago, IL",
		date: "September 5, 2024",
		time: "8:00 AM",
		mode: "offline",
		audience:
			"DevOps engineers, Site reliability engineers, System administrators",
		agenda: [
			"Registration",
			"Keynote: DevOps in 2024",
			"Kubernetes Workshop",
			"Lunch",
			"CI/CD Best Practices",
			"Infrastructure as Code with Terraform",
			"Monitoring & Observability",
			"Closing Remarks",
		],
		organizer: "DevOps Institute",
		tags: ["DevOps", "Kubernetes", "Docker", "CI/CD"],
	},
	{
		slug: "mobile-dev-summit",
		title: "Mobile Development Summit",
		description:
			"Explore iOS, Android, and cross-platform mobile development with React Native and Flutter.",
		overview:
			"Mobile Development Summit covers the latest trends in mobile app development, including native iOS and Android development, as well as cross-platform solutions.",
		image: "/images/event2.png",
		venue: "LA Convention Center",
		location: "Los Angeles, CA",
		date: "October 18, 2024",
		time: "9:30 AM",
		mode: "offline",
		audience: "Mobile developers, iOS developers, Android developers",
		agenda: [
			"Welcome & Breakfast",
			"Keynote: Future of Mobile Development",
			"React Native vs Flutter",
			"Lunch Break",
			"iOS Development Workshop",
			"Android Jetpack Compose",
			"Panel: Mobile App Architecture",
		],
		organizer: "Mobile Dev Community",
		tags: ["Mobile", "React Native", "Flutter", "iOS", "Android"],
	},
	{
		slug: "cybersecurity-conference",
		title: "Cybersecurity Conference",
		description:
			"Learn about the latest cybersecurity threats, defense strategies, and secure coding practices.",
		overview:
			"Cybersecurity Conference brings together security professionals, developers, and IT administrators to discuss current threats and best practices for securing applications and infrastructure.",
		image: "/images/event3.png",
		venue: "Boston Convention & Exhibition Center",
		location: "Boston, MA",
		date: "November 2, 2024",
		time: "8:00 AM",
		mode: "hybrid",
		audience: "Security engineers, Developers, IT professionals",
		agenda: [
			"Registration",
			"Keynote: Cybersecurity Landscape 2024",
			"Web Application Security",
			"Lunch",
			"Cloud Security Best Practices",
			"Penetration Testing Workshop",
			"Zero Trust Architecture",
			"Networking Reception",
		],
		organizer: "Cybersecurity Alliance",
		tags: ["Security", "Cybersecurity", "DevSecOps", "Cloud Security"],
	},
	{
		slug: "data-science-hackathon",
		title: "Data Science Hackathon",
		description:
			"72-hour intensive hackathon focused on solving real-world problems using data science and machine learning.",
		overview:
			"Data Science Hackathon challenges participants to build innovative solutions using data analytics, machine learning, and visualization techniques. Work with real datasets and compete for prizes.",
		image: "/images/event4.png",
		venue: "UC San Diego Campus",
		location: "San Diego, CA",
		date: "December 7-9, 2024",
		time: "10:00 AM",
		mode: "offline",
		audience: "Data scientists, ML engineers, Analysts, Students",
		agenda: [
			"Opening & Dataset Release",
			"Hacking Begins",
			"Continuous Hacking with Mentor Sessions",
			"Project Submissions",
			"Presentations",
			"Awards Ceremony",
		],
		organizer: "Data Science Society",
		tags: ["Data Science", "Machine Learning", "Hackathon", "Analytics"],
	},
	{
		slug: "cloud-native-meetup",
		title: "Cloud Native Meetup",
		description:
			"Evening meetup discussing cloud-native architectures, microservices, and serverless computing.",
		overview:
			"Join fellow cloud enthusiasts for an evening of learning and networking. Discuss cloud-native patterns, share experiences, and explore the latest tools in the cloud ecosystem.",
		image: "/images/event5.png",
		venue: "Portland Tech Hub",
		location: "Portland, OR",
		date: "January 15, 2025",
		time: "6:30 PM",
		mode: "offline",
		audience: "Cloud architects, Backend developers, DevOps engineers",
		agenda: [
			"Networking & Pizza",
			"Introduction",
			"Talk: Building Microservices",
			"Talk: Serverless Best Practices",
			"Open Discussion",
			"Closing & More Networking",
		],
		organizer: "Cloud Native Portland",
		tags: ["Cloud", "Microservices", "Serverless", "AWS", "Azure"],
	},
	{
		slug: "frontend-masters",
		title: "Frontend Masters Conference",
		description:
			"Advanced frontend development conference covering modern frameworks, design systems, and performance optimization.",
		overview:
			"Frontend Masters Conference is designed for experienced frontend developers looking to master advanced concepts in modern web development, including state management, testing, and design patterns.",
		image: "/images/event6.png",
		venue: "Music City Center",
		location: "Nashville, TN",
		date: "February 28, 2025",
		time: "9:00 AM",
		mode: "hybrid",
		audience: "Senior frontend developers, Tech leads, UI engineers",
		agenda: [
			"Registration & Breakfast",
			"Keynote: Advanced React Patterns",
			"Design Systems at Scale",
			"Lunch",
			"Performance Optimization Workshop",
			"State Management Deep Dive",
			"Panel: The Future of Frontend",
		],
		organizer: "Frontend Masters",
		tags: ["Frontend", "React", "Performance", "Design Systems"],
	},
];

for (const event of events) {
	const image = readFileSync(
		`/Users/aditya/Programming/webDev/dev-event/public/${event.image}`,
	);
	const formData = new FormData();
	formData.append("slug", event.slug);
	formData.append("title", event.title);
	formData.append("description", event.description);
	formData.append("overview", event.overview);
	formData.append("image", new File([image], event.image));
	formData.append("venue", event.venue);
	formData.append("location", event.location);
	formData.append("date", event.date);
	formData.append("time", event.time);
	formData.append("mode", event.mode);
	formData.append("audience", event.audience);
	formData.append("agenda", JSON.stringify(event.agenda));
	formData.append("organizer", event.organizer);
	formData.append("tags", JSON.stringify(event.tags));

	fetch("http://localhost:3000/api/events", {
		method: "POST",
		body: formData,
	});
}
