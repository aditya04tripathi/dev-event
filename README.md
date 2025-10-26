# 🎉 DevEvent

<div align="center">

![DevEvent Banner](public/og-image.png)

**The Hub for Every Dev Event You Can't Miss**

Discover hackathons, meetups, and conferences all in one place. Join amazing tech events and connect with the developer community.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://dev-event.up.railway.app) | [Report Bug](https://github.com/aditya04tripathi/dev-event/issues) | [Request Feature](https://github.com/aditya04tripathi/dev-event/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#-project-structure)
- [Database Models](#-database-models)
- [Actions](#-actions)
- [Key Features Explained](#-key-features-explained)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 Overview

**DevEvent** is a modern, full-stack event management platform designed specifically for the developer community. Whether you're looking for hackathons to compete in, meetups to network at, or conferences to learn from, DevEvent brings them all together in one beautiful, easy-to-use interface.

Built with Next.js 16, React 19, and the latest web technologies, DevEvent offers a seamless experience for both event organizers and attendees.

### Why DevEvent?

- 🔍 **Discover Events**: Browse through a curated list of developer events with advanced search and filtering
- 📅 **Never Miss Out**: Get instant booking confirmations with QR codes sent directly to your email
- 🎯 **Smart Recommendations**: Find similar events based on your interests
- 📱 **Responsive Design**: Perfect experience across all devices
- 🎨 **Beautiful UI**: Modern dark theme with smooth animations and transitions
- ⚡ **Lightning Fast**: Built with Next.js 16 for optimal performance

---

## ✨ Features

### For Event Attendees

- 🔎 **Advanced Search & Filters**: Search events by name, filter by mode (online/offline/hybrid), and tags
- 📖 **Detailed Event Pages**: View comprehensive information including agenda, location, time, and organizer details
- 🎫 **Easy Booking**: Book events with a simple form and receive instant confirmation
- 📧 **Email Confirmations**: Get booking confirmations with QR codes for easy check-in
- 🔗 **Similar Events**: Discover related events based on tags and categories
- ⭐ **Featured Events**: Highlighted events on the homepage
- 📄 **Pagination**: Browse through events efficiently with paginated results

### For Event Organizers

- ➕ **Create Events**: User-friendly form to create and publish events
- 🖼️ **Image Upload**: Upload event images via Cloudinary integration
- 📝 **Rich Details**: Add comprehensive event information including agenda items
- 🏷️ **Tagging System**: Categorize events with multiple tags
- 🌐 **Multiple Modes**: Support for online, offline, and hybrid events

### General Features

- 🌙 **Dark Mode**: Beautiful dark theme for comfortable viewing
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- ♿ **Accessible**: WCAG compliant with keyboard navigation support
- 📱 **Responsive**: Optimized for mobile, tablet, and desktop
- 🚀 **SEO Optimized**: Meta tags, Open Graph, and Twitter Cards
- 💫 **Smooth Animations**: GSAP-powered animations for enhanced UX
- 📞 **Contact Form**: Easy way to reach out with inquiries
- ℹ️ **Informational Pages**: About, Terms of Service, and Privacy Policy

---

## 🛠 Tech Stack

### Core Framework

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19.2](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling & UI

- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library
- **[GSAP](https://greensock.com/gsap/)** - Animation library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Backend & Database

- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB ODM
- **[Cloudinary](https://cloudinary.com/)** - Image hosting and optimization
- **[Nodemailer](https://nodemailer.com/)** - Email sending

### Form & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation integration

### Utilities

- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[QRCode](https://github.com/soldair/node-qrcode)** - QR code generation
- **[clsx](https://github.com/lukeed/clsx)** - Conditional className utility
- **[use-debounce](https://github.com/xnimorz/use-debounce)** - Debounce hook

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (recommended) / npm / yarn / bun
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary Account** (for image uploads)
- **Email Service** (for nodemailer - Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/aditya04tripathi/dev-event.git
   cd dev-event
   ```

2. **Install dependencies**

   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install

   # Or using yarn
   yarn install
   ```

### Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/dev-event

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=DevEvent <noreply@dev-event.com>

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Setting Up Services

**MongoDB Atlas:**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and add it to `MONGODB_URI`

**Cloudinary:**

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to the environment variables

**Email (Gmail example):**

1. Enable 2-Step Verification on your Google Account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in `EMAIL_PASSWORD`

### Running the Application

1. **Development Mode**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Build for Production**

   ```bash
   pnpm build
   ```

3. **Start Production Server**

   ```bash
   pnpm start
   ```

4. **Lint Code**
   ```bash
   pnpm lint
   ```

---

## 📁 Project Structure

```
dev-event/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── contact/                  # Contact form page
│   ├── events/                   # Events routes
│   │   ├── [slug]/              # Dynamic event details page
│   │   │   ├── page.tsx         # Event details
│   │   │   └── loading.tsx      # Loading state
│   │   ├── new/                 # Create new event
│   │   │   └── page.tsx
│   │   └── page.tsx             # Events listing page
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles
│   └── favicon.ico               # Site favicon
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...                  # 40+ reusable UI components
│   ├── book-event.tsx           # Event booking component
│   ├── contact-form.tsx         # Contact form
│   ├── event-card.tsx           # Event card component
│   ├── event-filters.tsx        # Filters (mode, tags)
│   ├── events-list.tsx          # Events grid/list
│   ├── events-list-skeleton.tsx # Loading skeleton
│   ├── featured-events.tsx      # Featured events section
│   ├── search-bar.tsx           # Search component
│   ├── similar-events.tsx       # Similar events recommendations
│   ├── pagination.tsx           # Pagination component
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   ├── DarkVeil.jsx             # Background animation
│   └── ElectricBorder.jsx       # Border animation
│
├── database/                     # Database models
│   ├── event.model.ts           # Event schema
│   ├── booking.model.ts         # Booking schema
│   └── contact.model.ts         # Contact schema
│
├── lib/                          # Utility functions
│   ├── actions/                 # Server actions
│   │   ├── event.action.ts     # Event CRUD operations
│   │   ├── booking.action.ts   # Booking operations
│   │   └── contact.action.ts   # Contact form handling
│   ├── mongodb.ts               # MongoDB connection
│   ├── constants.ts             # App constants
│   ├── site-constants.ts        # Site information
│   └── utils.ts                 # Utility functions
│
├── hooks/                        # Custom React hooks
│   └── use-mobile.ts            # Mobile detection hook
│
├── public/                       # Static assets
│   ├── icons/                   # SVG icons
│   ├── images/                  # Event images
│   └── og-image.png             # Open Graph image
│
├── .env.local                    # Environment variables (create this)
├── components.json               # shadcn/ui config
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🗄 Database Models

### Event Model

```typescript
{
  title: string;           // Event title (max 100 chars)
  slug: string;            // URL-friendly slug (auto-generated)
  description: string;     // Detailed description (max 1000 chars)
  overview: string;        // Short overview (max 500 chars)
  image: string;           // Cloudinary image URL
  venue: string;           // Venue name
  location: string;        // City/address
  date: string;            // Event date (ISO format)
  time: string;            // Event time (24-hour format)
  mode: "online" | "offline" | "hybrid";
  audience: string;        // Target audience
  agenda: string[];        // Array of agenda items
  organizer: string;       // Organizer name
  tags: string[];          // Event tags/categories
  createdAt: Date;
  updatedAt: Date;
}
```

**Features:**

- Automatic slug generation from title
- Date and time normalization
- Unique slug index for fast lookups
- Compound index on date and mode

### Booking Model

```typescript
{
  eventId: ObjectId; // Reference to Event
  name: string; // Attendee name
  email: string; // Attendee email (validated)
  createdAt: Date;
  updatedAt: Date;
}
```

**Features:**

- Email validation with regex
- Event existence validation
- Unique constraint on eventId + email (prevent duplicate bookings)
- Indexes for efficient queries

### Contact Model

```typescript
{
  name: string; // Contact name
  email: string; // Contact email (validated)
  reason: string; // Inquiry reason
  message: string; // Message content
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 Actions

### Event Actions (`lib/actions/event.action.ts`)

- `getAllEvents(params)` - Get paginated, filtered, and searched events
- `getEventBySlug(slug)` - Get single event details
- `getFeaturedEvents()` - Get featured events for homepage
- `getSimilarEvents(eventId, tags)` - Get related events
- `getAllTags()` - Get all unique event tags
- `createEvent(data)` - Create new event (with image upload)

### Booking Actions (`lib/actions/booking.action.ts`)

- `createBooking(data)` - Book an event
- `sendBookingEmail(booking, event)` - Send confirmation email with QR code
- `checkDuplicateBooking(eventId, email)` - Prevent duplicate bookings

### Contact Actions (`lib/actions/contact.action.ts`)

- `submitContact(data)` - Submit contact form
- `sendContactEmail(data)` - Send contact inquiry email

All actions include:

- ✅ Input validation with Zod schemas
- ✅ Error handling with descriptive messages
- ✅ Type safety with TypeScript
- ✅ Async/await patterns
- ✅ Database connection management

---

## 🎯 Key Features Explained

### 1. Search & Filtering System

The events page includes a powerful search and filtering system:

- **Search**: Real-time search with debouncing (searches title, description, overview)
- **Mode Filter**: Filter by online, offline, or hybrid events
- **Tag Filter**: Multi-select tag filtering
- **URL Sync**: All filters sync with URL params for shareable links
- **Pagination**: Efficient pagination with page numbers

**Implementation:**

- Uses URL search params for state management
- Server-side filtering for better performance
- Debounced search input to reduce API calls
- Skeleton loaders for better UX

### 2. Event Booking with QR Codes

When a user books an event:

1. Form validation with React Hook Form + Zod
2. Duplicate booking check
3. Booking saved to database
4. QR code generated with booking details
5. Email sent with:
   - Booking confirmation
   - Event details
   - QR code attachment
   - Calendar integration option

**Technologies:**

- Nodemailer for email sending
- QRCode library for QR generation
- MongoDB transactions for data integrity

### 3. Image Upload with Cloudinary

Event creation includes image upload:

1. User selects image file
2. File uploaded to Cloudinary
3. Optimized URL returned
4. URL saved in database
5. Automatic transformations applied

**Features:**

- Format conversion (WebP)
- Quality optimization
- Responsive images
- CDN delivery

### 4. Similar Events Recommendation

Uses a tag-based recommendation system:

1. Get tags from current event
2. Find events with matching tags
3. Sort by number of matching tags
4. Exclude current event
5. Limit to top results

**Algorithm:**

```typescript
// Simplified logic
const similarEvents = await Event.find({
  tags: { $in: currentEventTags },
  _id: { $ne: currentEventId },
})
  .limit(3)
  .sort({ createdAt: -1 });
```

### 5. SEO Optimization

Every page includes:

- Dynamic meta tags
- Open Graph tags for social sharing
- Twitter Card support
- Structured data (JSON-LD)
- Semantic HTML
- Sitemap generation
- Robots.txt

### 6. Responsive Design

Mobile-first approach with:

- Responsive grid layouts
- Touch-friendly interactions
- Optimized images
- Adaptive typography
- Hamburger menu on mobile
- Bottom navigation support

### 7. Performance Optimizations

- **Next.js 16 Features**:

  - Server Components by default
  - Streaming with Suspense
  - Image optimization
  - Font optimization
  - Code splitting

- **Custom Optimizations**:
  - Debounced search
  - Lazy loading
  - Skeleton loaders
  - Efficient database queries
  - Index optimization
  - CDN for static assets

---

## 🚢 Deployment

### Deploy to Railway

DevEvent is deployed on [Railway](https://railway.app). To deploy your own instance:

1. **Create Railway Account**

   - Sign up at [railway.app](https://railway.app)

2. **Create New Project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your forked repository

3. **Add Environment Variables**

   - Go to project settings
   - Add all variables from `.env.local`

4. **Configure Build**

   - Build command: `pnpm build`
   - Start command: `pnpm start`

5. **Deploy**
   - Railway will automatically deploy on push to main branch

### Deploy to Vercel

1. **Fork the Repository**

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your forked repository

3. **Configure Environment Variables**

   - Add all variables from `.env.local`

4. **Deploy**
   - Click "Deploy"
   - Vercel will handle the build and deployment

### Deploy to Other Platforms

The app can be deployed to any platform that supports Node.js:

- **Netlify**: Use netlify.toml config
- **AWS Amplify**: Connect your Git repository
- **DigitalOcean**: Use App Platform
- **Heroku**: Create Procfile and deploy

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**

   ```bash
   git clone https://github.com/aditya04tripathi/dev-event.git
   ```

2. **Create your Feature Branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your Changes**

   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly
- Ensure no linting errors

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🌐 Internationalization (i18n)
- 🧪 Test coverage
- ⚡ Performance optimizations

---

## 📄 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software as per the license terms.

---

## 📧 Contact

**Aditya Tripathi**

- Email: [adityatripathi.at04@gmail.com](mailto:adityatripathi.at04@gmail.com)
- LinkedIn: [Aditya Tripathi](https://www.linkedin.com/in/aditya-tripathi-887586379)
- GitHub: [@aditya04tripathi](https://github.com/aditya04tripathi)
- Portfolio: [dev-event.up.railway.app](https://dev-event.up.railway.app)

**Project Links:**

- Live Demo: [https://dev-event.up.railway.app](https://dev-event.up.railway.app)
- Repository: [https://github.com/aditya04tripathi/dev-event](https://github.com/aditya04tripathi/dev-event)
- Issues: [https://github.com/aditya04tripathi/dev-event/issues](https://github.com/aditya04tripathi/dev-event/issues)

---

## 🙏 Acknowledgments

- **[Next.js Team](https://nextjs.org/)** - For the amazing React framework
- **[Vercel](https://vercel.com/)** - For hosting and deployment solutions
- **[shadcn](https://twitter.com/shadcn)** - For the beautiful UI component library
- **[Radix UI](https://www.radix-ui.com/)** - For accessible component primitives
- **[Railway](https://railway.app/)** - For deployment and hosting
- **[MongoDB](https://www.mongodb.com/)** - For the powerful database
- **[Cloudinary](https://cloudinary.com/)** - For image hosting and optimization
- **Open Source Community** - For the amazing tools and libraries

---

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐ on GitHub!

<div align="center">

**Made with ❤️ by [Aditya Tripathi](https://github.com/aditya04tripathi)**

</div>
