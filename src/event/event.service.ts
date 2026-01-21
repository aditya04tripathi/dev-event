import { Inject, Injectable, ConflictException, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Event } from './event.schema';
import { MinioService } from 'src/minio/minio.service';
import { CreateEventDto } from './dto/create-event.dto';
import * as fs from 'fs';
import * as path from 'path';

const events = [
	{
		slug: 'react-conf-2024',
		title: 'React Conf 2024',
		description:
			'Join us for the premier React conference featuring the latest updates, best practices, and networking opportunities with React experts.',
		overview:
			'React Conf 2024 brings together React developers, maintainers, and enthusiasts from around the world. Learn about React 19, Server Components, and the future of React development.',
		image: '/images/event1.png',
		venue: 'Moscone Center',
		location: 'San Francisco, CA',
		date: 'March 15, 2024',
		time: '9:00 AM',
		mode: 'offline',
		audience: 'React developers, Frontend engineers',
		agenda: [
			'Registration & Breakfast',
			'Keynote: The Future of React',
			'React Server Components Deep Dive',
			'Lunch Break',
			'Performance Optimization Workshop',
			'Panel Discussion',
			'Networking Session',
		],
		organizer: 'React Team & Meta',
		tags: ['React', 'Frontend', 'JavaScript', 'Web Development'],
	},
	{
		slug: 'nextjs-summit',
		title: 'Next.js Summit',
		description:
			'Explore the latest features in Next.js 15, including App Router, Server Actions, and advanced optimization techniques.',
		overview:
			'The Next.js Summit is a full-day conference dedicated to Next.js developers. Learn directly from the Vercel team and community experts about building production-ready applications.',
		image: '/images/event2.png',
		venue: 'Austin Convention Center',
		location: 'Austin, TX',
		date: 'April 22, 2024',
		time: '10:00 AM',
		mode: 'hybrid',
		audience: 'Next.js developers, Full-stack developers',
		agenda: [
			'Opening Remarks',
			"What's New in Next.js 15",
			'Building Scalable Applications',
			'Lunch & Networking',
			'Server Actions Workshop',
			'Deployment Best Practices',
			'Q&A Session',
		],
		organizer: 'Vercel',
		tags: ['Next.js', 'React', 'Full-stack', 'Vercel'],
	},
	{
		slug: 'javascript-world',
		title: 'JavaScript World Conference',
		description:
			'The largest JavaScript conference covering everything from vanilla JS to modern frameworks and tools.',
		overview:
			'JavaScript World Conference is a comprehensive event featuring talks on JavaScript fundamentals, modern frameworks, tooling, and the future of web development.',
		image: '/images/event3.png',
		venue: 'Javits Center',
		location: 'New York, NY',
		date: 'May 8, 2024',
		time: '8:30 AM',
		mode: 'offline',
		audience: 'JavaScript developers, Web developers, Software engineers',
		agenda: [
			'Registration',
			'Keynote: JavaScript in 2024',
			'Modern JavaScript Patterns',
			'Lunch Break',
			'Framework Wars: React vs Vue vs Svelte',
			'TypeScript Advanced Features',
			'Lightning Talks',
			'After Party',
		],
		organizer: 'JavaScript Foundation',
		tags: ['JavaScript', 'TypeScript', 'Web Development', 'Frontend'],
	},
	{
		slug: 'ai-hackathon-2024',
		title: 'AI Innovation Hackathon',
		description:
			'48-hour hackathon focused on building innovative AI-powered applications using the latest ML models and frameworks.',
		overview:
			'Join developers, data scientists, and AI enthusiasts for an intense 48-hour hackathon. Build, learn, and compete for amazing prizes while working with cutting-edge AI technologies.',
		image: '/images/event4.png',
		venue: 'Amazon HQ',
		location: 'Seattle, WA',
		date: 'June 14-16, 2024',
		time: '6:00 PM',
		mode: 'offline',
		audience: 'Developers, Data scientists, AI enthusiasts',
		agenda: [
			'Opening Ceremony & Team Formation',
			'Hacking Begins',
			'Continuous Hacking with Workshops',
			'Project Submissions',
			'Demos & Judging',
			'Awards Ceremony',
		],
		organizer: 'AI Developers Association',
		tags: ['AI', 'Machine Learning', 'Hackathon', 'Innovation'],
	},
	{
		slug: 'web3-developer-meetup',
		title: 'Web3 Developer Meetup',
		description:
			'Evening meetup for Web3 developers to discuss blockchain, smart contracts, and decentralized applications.',
		overview:
			'Connect with fellow Web3 developers in an informal setting. Share experiences, learn about new tools, and discuss the latest trends in blockchain development.',
		image: '/images/event5.png',
		venue: 'Blockchain Hub Miami',
		location: 'Miami, FL',
		date: 'July 20, 2024',
		time: '6:00 PM',
		mode: 'offline',
		audience:
			'Blockchain developers, Web3 enthusiasts, Smart contract developers',
		agenda: [
			'Networking & Refreshments',
			'Welcome & Introductions',
			'Lightning Talks on Web3 Projects',
			'Panel: The Future of DeFi',
			'Open Discussion & Networking',
		],
		organizer: 'Web3 Miami Community',
		tags: ['Web3', 'Blockchain', 'Ethereum', 'DeFi'],
	},
	{
		slug: 'fullstack-conference',
		title: 'Full Stack Conference',
		description:
			'Comprehensive conference covering both frontend and backend technologies for modern web development.',
		overview:
			'Full Stack Conference brings together developers to explore the complete spectrum of web development, from React and Vue on the frontend to Node.js, databases, and cloud deployment.',
		image: '/images/event6.png',
		venue: 'Colorado Convention Center',
		location: 'Denver, CO',
		date: 'August 12, 2024',
		time: '9:00 AM',
		mode: 'hybrid',
		audience: 'Full-stack developers, Software engineers, Tech leads',
		agenda: [
			'Registration & Coffee',
			'Keynote: Modern Full Stack Architecture',
			'Frontend Framework Comparison',
			'Lunch',
			'Backend APIs with Node.js',
			'Database Design Workshop',
			'Deployment & DevOps',
		],
		organizer: 'Full Stack Association',
		tags: ['Full-stack', 'Frontend', 'Backend', 'DevOps'],
	},
	{
		slug: 'devops-unleashed',
		title: 'DevOps Unleashed',
		description:
			'Learn advanced DevOps practices, CI/CD pipelines, containerization, and cloud-native development.',
		overview:
			'DevOps Unleashed is a hands-on conference featuring workshops and talks on modern DevOps practices, including Kubernetes, Docker, GitOps, and infrastructure as code.',
		image: '/images/event1.png',
		venue: 'Navy Pier',
		location: 'Chicago, IL',
		date: 'September 5, 2024',
		time: '8:00 AM',
		mode: 'offline',
		audience:
			'DevOps engineers, Site reliability engineers, System administrators',
		agenda: [
			'Registration',
			'Keynote: DevOps in 2024',
			'Kubernetes Workshop',
			'Lunch',
			'CI/CD Best Practices',
			'Infrastructure as Code with Terraform',
			'Monitoring & Observability',
			'Closing Remarks',
		],
		organizer: 'DevOps Institute',
		tags: ['DevOps', 'Kubernetes', 'Docker', 'CI/CD'],
	},
	{
		slug: 'mobile-dev-summit',
		title: 'Mobile Development Summit',
		description:
			'Explore iOS, Android, and cross-platform mobile development with React Native and Flutter.',
		overview:
			'Mobile Development Summit covers the latest trends in mobile app development, including native iOS and Android development, as well as cross-platform solutions.',
		image: '/images/event2.png',
		venue: 'LA Convention Center',
		location: 'Los Angeles, CA',
		date: 'October 18, 2024',
		time: '9:30 AM',
		mode: 'offline',
		audience: 'Mobile developers, iOS developers, Android developers',
		agenda: [
			'Welcome & Breakfast',
			'Keynote: Future of Mobile Development',
			'React Native vs Flutter',
			'Lunch Break',
			'iOS Development Workshop',
			'Android Jetpack Compose',
			'Panel: Mobile App Architecture',
		],
		organizer: 'Mobile Dev Community',
		tags: ['Mobile', 'React Native', 'Flutter', 'iOS', 'Android'],
	},
	{
		slug: 'cybersecurity-conference',
		title: 'Cybersecurity Conference',
		description:
			'Learn about the latest cybersecurity threats, defense strategies, and secure coding practices.',
		overview:
			'Cybersecurity Conference brings together security professionals, developers, and IT administrators to discuss current threats and best practices for securing applications and infrastructure.',
		image: '/images/event3.png',
		venue: 'Boston Convention & Exhibition Center',
		location: 'Boston, MA',
		date: 'November 2, 2024',
		time: '8:00 AM',
		mode: 'hybrid',
		audience: 'Security engineers, Developers, IT professionals',
		agenda: [
			'Registration',
			'Keynote: Cybersecurity Landscape 2024',
			'Web Application Security',
			'Lunch',
			'Cloud Security Best Practices',
			'Penetration Testing Workshop',
			'Zero Trust Architecture',
			'Networking Reception',
		],
		organizer: 'Cybersecurity Alliance',
		tags: ['Security', 'Cybersecurity', 'DevSecOps', 'Cloud Security'],
	},
	{
		slug: 'data-science-hackathon',
		title: 'Data Science Hackathon',
		description:
			'72-hour intensive hackathon focused on solving real-world problems using data science and machine learning.',
		overview:
			'Data Science Hackathon challenges participants to build innovative solutions using data analytics, machine learning, and visualization techniques. Work with real datasets and compete for prizes.',
		image: '/images/event4.png',
		venue: 'UC San Diego Campus',
		location: 'San Diego, CA',
		date: 'December 7-9, 2024',
		time: '10:00 AM',
		mode: 'offline',
		audience: 'Data scientists, ML engineers, Analysts, Students',
		agenda: [
			'Opening & Dataset Release',
			'Hacking Begins',
			'Continuous Hacking with Mentor Sessions',
			'Project Submissions',
			'Presentations',
			'Awards Ceremony',
		],
		organizer: 'Data Science Society',
		tags: ['Data Science', 'Machine Learning', 'Hackathon', 'Analytics'],
	},
	{
		slug: 'cloud-native-meetup',
		title: 'Cloud Native Meetup',
		description:
			'Evening meetup discussing cloud-native architectures, microservices, and serverless computing.',
		overview:
			'Join fellow cloud enthusiasts for an evening of learning and networking. Discuss cloud-native patterns, share experiences, and explore the latest tools in the cloud ecosystem.',
		image: '/images/event5.png',
		venue: 'Portland Tech Hub',
		location: 'Portland, OR',
		date: 'January 15, 2025',
		time: '6:30 PM',
		mode: 'offline',
		audience: 'Cloud architects, Backend developers, DevOps engineers',
		agenda: [
			'Networking & Pizza',
			'Introduction',
			'Talk: Building Microservices',
			'Talk: Serverless Best Practices',
			'Open Discussion',
			'Closing & More Networking',
		],
		organizer: 'Cloud Native Portland',
		tags: ['Cloud', 'Microservices', 'Serverless', 'AWS', 'Azure'],
	},
	{
		slug: 'frontend-masters',
		title: 'Frontend Masters Conference',
		description:
			'Advanced frontend development conference covering modern frameworks, design systems, and performance optimization.',
		overview:
			'Frontend Masters Conference is designed for experienced frontend developers looking to master advanced concepts in modern web development, including state management, testing, and design patterns.',
		image: '/images/event6.png',
		venue: 'Music City Center',
		location: 'Nashville, TN',
		date: 'February 28, 2025',
		time: '9:00 AM',
		mode: 'hybrid',
		audience: 'Senior frontend developers, Tech leads, UI engineers',
		agenda: [
			'Registration & Breakfast',
			'Keynote: Advanced React Patterns',
			'Design Systems at Scale',
			'Lunch',
			'Performance Optimization Workshop',
			'State Management Deep Dive',
			'Panel: The Future of Frontend',
		],
		organizer: 'Frontend Masters',
		tags: ['Frontend', 'React', 'Performance', 'Design Systems'],
	},
];

@Injectable()
export class EventService {
	constructor(
		@Inject(Event.name) private eventModel: Model<Event>,
		private readonly minioService: MinioService,
	) {}

	private logger = new Logger(EventService.name);

	async seedEvents() {
		const imagesPath =
			'/Users/aditya/Programming/dev-event/frontend/public/images';
		const defaultOrganizerId = '69714fe831eb86e039c4fbae';

		this.logger.log('Starting seeding process...');

		for (const eventData of events) {
			try {
				const imageName = eventData.image.split('/').pop() || 'default.png';
				const imageFilePath = path.join(imagesPath, imageName);
				let minioImageName = '';

				if (fs.existsSync(imageFilePath)) {
					const buffer = fs.readFileSync(imageFilePath);
					const mimetype = imageName.endsWith('.png')
						? 'image/png'
						: 'image/jpeg';
					minioImageName = await this.minioService.uploadBuffer(
						buffer,
						imageName,
						mimetype,
					);
					this.logger.log(
						`Uploaded ${imageName} to Minio as ${minioImageName}`,
					);
				} else {
					this.logger.warn(`Image file not found: ${imageFilePath}`);
				}

				await this.eventModel.create({
					...eventData,
					image: minioImageName, // Store the KEY, not the presigned URL
					organizerId: defaultOrganizerId,
				});
				this.logger.log(`Created event: ${eventData.title}`);
			} catch (error) {
				this.logger.error(
					`Failed to seed event ${eventData.title}: ${error.message}`,
				);
			}
		}

		this.logger.log('Events seeding completed');
		return { msg: 'Events seeded successfully' };
	}

	private async mapEventImage(event: any) {
		if (event.image && !event.image.startsWith('http')) {
			event.image = await this.minioService.getPresignedUrl(event.image);
		}
		return event;
	}

	async getAllEvents({
		page = 1,
		limit = 9,
		sort,
		search,
		tags,
		mode,
		organizerId,
	}: {
		page?: number | string;
		limit?: number | string;
		sort?: 'asc' | 'desc';
		search?: string;
		tags?: string[] | string;
		mode?: 'online' | 'offline' | 'hybrid';
		organizerId?: string;
	}) {
		const pageNum = Math.max(1, Number(page) || 1);
		const limitNum = Math.max(1, Number(limit) || 9);
		const query: Record<string, any> = {};

		if (organizerId) {
			query.organizerId = organizerId;
		}

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
				{ location: { $regex: search, $options: 'i' } },
				{ organizer: { $regex: search, $options: 'i' } },
			];
		}

		if (tags) {
			const tagArray = Array.isArray(tags)
				? tags
				: tags.split(',').filter(Boolean);
			if (tagArray.length > 0) {
				query.tags = { $in: tagArray };
			}
		}

		if (mode) {
			query.mode = mode;
		}

		const skip = (pageNum - 1) * limitNum;
		const totalEvents = await this.eventModel.countDocuments(query);

		const sortOption = sort === 'desc' ? { date: -1 } : { date: 1 };

		let events = await this.eventModel
			.find(query)
			.sort(sortOption as any)
			.skip(skip)
			.limit(limitNum)
			.lean();

		events = await Promise.all(events.map((e) => this.mapEventImage(e)));

		const totalPages = Math.ceil(totalEvents / limitNum);

		return {
			events,
			totalEvents,
			totalPages,
			currentPage: pageNum,
			nextPage: pageNum < totalPages ? pageNum + 1 : null,
			prevPage: pageNum > 1 ? pageNum - 1 : null,
		};
	}

	async getEventsByUser(
		userId: string,
		{
			page = 1,
			limit = 9,
		}: {
			page?: number | string;
			limit?: number | string;
		},
	) {
		this.logger.log('getEventsByUser', userId);

		const pageNum = Math.max(1, Number(page) || 1);
		const limitNum = Math.max(1, Number(limit) || 9);
		const query: Record<string, any> = { organizerId: userId };

		const skip = (pageNum - 1) * limitNum;
		const totalEvents = await this.eventModel.countDocuments(query);

		this.logger.log(totalEvents);

		let events = await this.eventModel
			.find(query)
			.sort({ date: 1 })
			.skip(skip)
			.limit(limitNum)
			.lean();

		events = await Promise.all(events.map((e) => this.mapEventImage(e)));

		const totalPages = Math.ceil(totalEvents / limitNum);

		return {
			events,
			totalEvents,
			totalPages,
			currentPage: pageNum,
			nextPage: pageNum < totalPages ? pageNum + 1 : null,
			prevPage: pageNum > 1 ? pageNum - 1 : null,
		};
	}

	async createEvent(
		createEventDto: CreateEventDto,
		file: Express.Multer.File,
		userId: string,
	) {
		let imageUrl = '';
		if (file) {
			imageUrl = await this.minioService.uploadFile(file);
		}

		let tags = createEventDto.tags;
		if (typeof tags === 'string') {
			try {
				tags = JSON.parse(tags);
			} catch {
				// ignore parsing error
			}
		}

		let agenda = createEventDto.agenda;
		if (typeof agenda === 'string') {
			try {
				agenda = JSON.parse(agenda);
			} catch {
				// ignore parsing error
			}
		}

		const existingEvent = await this.eventModel.findOne({
			slug: createEventDto.slug,
		});
		if (existingEvent) {
			throw new ConflictException('An event with this slug already exists');
		}

		const event = new this.eventModel({
			...createEventDto,
			image: imageUrl,
			tags,
			agenda,
			organizerId: userId,
		});

		return await event.save();
	}

	async getEventById(id: string) {
		const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
		const query = isObjectId
			? { $or: [{ _id: id }, { slug: id }] }
			: { slug: id };

		const event = await this.eventModel
			.findOne(query)
			.lean()
			.populate('organizerId');
		if (!event) return null;

		return await this.mapEventImage(event);
	}

	async updateEvent(
		eventId: string,
		userId: string,
		updateEventDto: any,
		file?: Express.Multer.File,
	) {
		const event = await this.eventModel.findOne({
			$or: [{ _id: eventId }, { slug: eventId }],
		});

		if (!event) {
			throw new ConflictException('Event not found');
		}

		if (event.organizerId?.toString() !== userId) {
			throw new ConflictException(
				'You do not have permission to update this event',
			);
		}

		const updateData: any = { ...updateEventDto };

		if (file) {
			const imageUrl = await this.minioService.uploadFile(file);
			updateData.image = imageUrl;
		}

		if (updateEventDto.tags && typeof updateEventDto.tags === 'string') {
			try {
				updateData.tags = JSON.parse(updateEventDto.tags);
			} catch {
				// ignore parsing error
			}
		}

		if (updateEventDto.agenda && typeof updateEventDto.agenda === 'string') {
			try {
				updateData.agenda = JSON.parse(updateEventDto.agenda);
			} catch {
				// ignore parsing error
			}
		}

		if (updateEventDto.slug && updateEventDto.slug !== event.slug) {
			const existingEvent = await this.eventModel.findOne({
				slug: updateEventDto.slug,
			});
			if (existingEvent) {
				throw new ConflictException('An event with this slug already exists');
			}
		}

		const updatedEvent = await this.eventModel
			.findByIdAndUpdate(event._id, updateData, { new: true })
			.lean();

		return await this.mapEventImage(updatedEvent);
	}

	async deleteEvent(eventId: string, userId: string) {
		const event = await this.eventModel.findOne({
			$or: [{ _id: eventId }, { slug: eventId }],
		});

		if (!event) {
			throw new ConflictException('Event not found');
		}

		if (event.organizerId?.toString() !== userId) {
			throw new ConflictException(
				'You do not have permission to delete this event',
			);
		}

		await this.eventModel.findByIdAndDelete(event._id);

		return { message: 'Event deleted successfully' };
	}
}
