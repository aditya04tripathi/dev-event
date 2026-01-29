# DevEvent

**The Hub for Every Dev Event**

## Overview

DevEvent is a comprehensive platform designed to connect developers with the events that matter to them. From hackathons and workshops to large-scale conferences and local meetups, DevEvent provides a central hub for discovery, registration, and management.

## Key Features

- **Event Discovery**: Filterable and searchable listings of developer events.
- **Detailed Information**: Rich event pages with location, schedule, and organizer details.
- **Seamless Booking**: One-click booking with instant email confirmation and QR code ticket generation.
- **Organizer Tools**: Create and manage events with image uploads and rich text descriptions.
- **Responsive Design**: A modern, dark-themed UI built for all devices.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Shadcn/ui (Radix Primitives)
- **Database**: MongoDB (Mongoose ODM)
- **Media**: Cloudinary
- **Validation**: Zod + React Hook Form
- **Linting/Formatting**: Biome

## Architecture Overview

The application follows a modular Next.js App Router structure:

- `app/`: Route handlers and page components (Server Components by default).
- `components/`: Reusable UI components (atoms, molecules, organisms).
- `lib/`: Utility functions, API clients, and constants.
- `types/`: TypeScript definitions and Zod schemas.
- `actions/`: Server Actions for form submissions and data mutations.

## Setup and Installation

### Prerequisites

- Node.js 18+
- npm, pnpm, or bun
- MongoDB instance
- Cloudinary account

### Local Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/aditya04tripathi/dev-event.git
    cd dev-event/frontend
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory (refer to `.env.example` if available). Required variables:

    ```env
    MONGODB_URI=mongodb+srv://...
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_API_KEY=...
    CLOUDINARY_API_SECRET=...
    EMAIL_HOST=...
    EMAIL_USER=...
    EMAIL_PASS=...
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

- **Browsing**: Visit the home page to see the latest events. Use the filter bar to narrow down by type or tag.
- **Booking**: Click on an event -> "Book Now". Enter details to receive a ticket via email.
- **Creating Events**: (Requires Organizer Access) Navigate to `/organizer/create` to submit a new event.

## Configuration

Configuration is primarily handled via environment variables (see Setup) and `site-constants.ts` in the `lib` directory for application-wide statics.

## Deployment

The application is designed to be deployed on platforms like **Vercel** or **Railway**.

- Ensure all environment variables are set in the deployment provider settings.
- Build command: `npm run build`
- Start command: `npm run start`

## Limitations and Assumptions

- The current version assumes a single "Organizer" role model for event creation (access control implementation pending).
- Email delivery depends on the configured SMTP provider's quotas and reliability.

## Documentation

- [Software Requirements Specification](./SRS.md) - Detailed breakdown of functional and non-functional requirements.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
