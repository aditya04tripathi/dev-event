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
- **Media**: MinIO (S3-compatible object storage)
- **Validation**: Zod + React Hook Form
- **Linting/Formatting**: Biome

## Architecture Overview

The application follows a modular Next.js App Router structure:

- `app/`: Route handlers and page components (Server Components by default).
- `components/`: Reusable UI components (atoms, molecules, organisms).
- `lib/`: Utility functions, API clients, and constants.
- `types/`: TypeScript definitions and Zod schemas.

## Setup and Installation

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for MinIO locally)
- MongoDB instance
- Backend API (`NEXT_PUBLIC_API_URL`) with MinIO configured

### Local Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/aditya04tripathi/dev-event.git
    cd dev-event
    ```

2.  **Install dependencies**

    ```bash
    pnpm install
    ```

3.  **Configure Environment**

    ```bash
    cp .env.example .env
    ```

    Required variables:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    NEXT_PUBLIC_MINIO_PUBLIC_URL=http://127.0.0.1:9000
    MINIO_ROOT_USER=admin
    MINIO_ROOT_PASSWORD=password123
    ```

4.  **Start MinIO (object storage)**

    ```bash
    docker compose up minio -d
    ```

    Console: [http://localhost:9001](http://localhost:9001) (admin / password123)

5.  **Run Development Server**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the application.

## Docker

Local build + MinIO:

```bash
pnpm docker:up
# http://localhost:49153
```

Production (pull GHCR image only — never build on the VPS):

```bash
pnpm docker:prod:pull
pnpm docker:prod:up
```

Image: `ghcr.io/aditya04tripathi/dev-event`

## Usage

- **Browsing**: Visit the home page to see the latest events. Use the filter bar to narrow down by type or tag.
- **Booking**: Click on an event -> "Book Now". Enter details to receive a ticket via email.
- **Creating Events**: (Requires Organizer Access) Navigate to `/dashboard/events/new` to submit a new event.

## Configuration

Configuration is primarily handled via environment variables (see `.env.example`) and `site-constants.ts` in the `lib` directory for application-wide statics.

## Documentation

- [Software Requirements Specification](./SRS.md) - Detailed breakdown of functional and non-functional requirements.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
