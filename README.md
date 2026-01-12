# DevEvent

**The Hub for Every Dev Event You Can't Miss**

Discover hackathons, meetups, and conferences all in one place. Join amazing tech events and connect with the developer community.

## Overview

DevEvent is a modern, full-stack event management platform designed specifically for the developer community. Built with Next.js 16, React 19, and TypeScript, DevEvent provides a seamless experience for discovering, booking, and managing developer-focused events.

The platform enables event organizers to create and publish events, while attendees can discover events through advanced search and filtering, book tickets, and receive QR code confirmations for easy check-in.

## Key Features

- **Event Discovery**: Browse events with pagination, search, and filtering by mode (online/offline/hybrid) and tags
- **Event Booking**: Simple booking process with email confirmations and QR code generation
- **QR Code Check-In**: Encrypted QR codes for secure event check-in validation
- **Event Management**: Create events with image uploads via Cloudinary integration
- **REST API**: Complete API endpoints for mobile application integration
- **Contact Forms**: Submit inquiries with automated email notifications
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Dark Mode**: Beautiful dark theme support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: MongoDB with Mongoose ODM
- **Image Hosting**: Cloudinary
- **Email**: Nodemailer (SMTP)
- **QR Codes**: QRCode library with AES-256-CBC encryption
- **Form Management**: React Hook Form with Zod validation
- **Animations**: GSAP

## Architecture Overview

DevEvent follows a server-client architecture:

- **Frontend**: Next.js App Router with Server Components and Client Components
- **Backend**: Next.js API Routes and Server Actions
- **Data Layer**: MongoDB with Mongoose schemas and validation
- **External Services**: Cloudinary (images), SMTP (email), MongoDB Atlas (database)

The application uses a hybrid approach:

- Server Actions for direct database operations (legacy, being migrated)
- REST API endpoints for mobile app integration and future client-server separation
- Server Components for initial page rendering
- Client Components for interactive features

### API Endpoints

- `GET /api/events` - List events with pagination and filters
- `GET /api/events/[id]` - Get event details by ID or slug
- `POST /api/events/[id]/book` - Create event booking
- `POST /api/events/[id]/checkin` - Validate QR code check-in
- `POST /api/events/create` - Create new event
- `POST /api/auth/login` - Authentication (placeholder)
- `GET /api/user/profile` - User profile (placeholder)
- `GET /api/user/events` - User events (placeholder)

## Setup and Installation

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended), npm, yarn, or bun
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- SMTP email service (Gmail, SendGrid, or compatible)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/aditya04tripathi/dev-event.git
cd dev-event
```

2. Install dependencies:

```bash
pnpm install
```

3. Create `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dev-event

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# QR Code Encryption (optional, has default)
QR_SALT=your-secret-salt

# Site URL (for API client)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Creating Events

1. Navigate to `/events/new`
2. Fill in event details (title, description, image, venue, date, time, etc.)
3. Add tags and agenda items
4. Submit to create the event

### Booking Events

1. Browse events on `/events`
2. Click on an event to view details
3. Fill in booking form (name and email)
4. Receive email confirmation with QR code

### API Usage

The API endpoints can be consumed by mobile applications or external services:

```bash
# Get events with filters
GET /api/events?page=1&limit=9&search=react&mode=online&tags=javascript,frontend

# Get single event
GET /api/events/react-conf-2024

# Book event
POST /api/events/react-conf-2024/book
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com"
}

# Check-in with QR code
POST /api/events/react-conf-2024/checkin
Content-Type: application/json
{
  "qrData": "encrypted-qr-code-data"
}
```

## Configuration

### Environment Variables

- `MONGODB_URI`: MongoDB connection string (required)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name (required for event creation)
- `CLOUDINARY_API_KEY`: Cloudinary API key (required for event creation)
- `CLOUDINARY_API_SECRET`: Cloudinary API secret (required for event creation)
- `EMAIL_USER`: SMTP email address (required for email notifications)
- `EMAIL_PASS`: SMTP email password/app password (required for email notifications)
- `QR_SALT`: Encryption salt for QR codes (optional, has default)
- `NEXT_PUBLIC_API_URL`: Base URL for API client (optional, auto-detected)
- `VERCEL_URL`: Vercel deployment URL (auto-set in Vercel)

### Database Models

- **Event**: Title, slug, description, image, venue, location, date, time, mode, tags, agenda, organizer
- **Booking**: Event reference, attendee name, email, timestamps
- **Contact**: Name, email, reason, subject, message, status

## Deployment

DevEvent can be deployed to any Node.js-compatible hosting platform:

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push

### Railway

1. Create new project on Railway
2. Connect GitHub repository
3. Add MongoDB service
4. Configure environment variables
5. Deploy

### Other Platforms

The application can be deployed to any platform supporting:

- Node.js 18+
- Serverless functions (for API routes)
- Environment variable configuration

## Limitations and Assumptions

- Email delivery depends on SMTP service availability and configuration
- Image uploads require Cloudinary account and valid credentials
- QR code decryption requires the same encryption salt on scanning devices
- Database connection pooling optimized for serverless environments
- Authentication endpoints are placeholders and require future implementation
- User profile endpoints are placeholders and require future implementation

## Documentation

- [Software Requirements Specification](./SRS.md) - Complete system requirements and specifications

## License

This project is licensed under the terms described in [LICENSE](./LICENSE).

## Contact

**Aditya Tripathi**

- Email: [adityatripathi.at04@gmail.com](mailto:adityatripathi.at04@gmail.com)
- LinkedIn: [Aditya Tripathi](https://www.linkedin.com/in/aditya-tripathi-887586379)
- GitHub: [@aditya04tripathi](https://github.com/aditya04tripathi)

**Project Links**

- Live Demo: [https://dev-event.up.railway.app](https://dev-event.up.railway.app)
- Repository: [https://github.com/aditya04tripathi/dev-event](https://github.com/aditya04tripathi/dev-event)
