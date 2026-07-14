# Software Requirements Specification (SRS) for DevEvent

## 1. Introduction

### 1.1 Purpose

The purpose of the DevEvent system is to aggregate, manage, and facilitate booking for developer-centric events such as hackathons, meetups, and conferences. It serves as a central hub for developers to discover events and for organizers to reach their target audience.

### 1.2 Scope

The system encompasses a frontend web application built with Next.js 16 and a backend API. It supports user roles for event discovery and booking, as well as organizer roles for event management (creation, updating). Key features include event listing with filtering, detailed event pages, secure booking flows with QR code generation, and responsive design themes.

## 2. Overall Description

### 2.1 System Context

DevEvent operates as a standalone web application that interfaces with a MongoDB database for persistence, MinIO (S3-compatible) for media asset management, and SMTP services for transactional emails.

### 2.2 User Types

1.  **Guest/Participant**: Unauthenticated or authenticated users who browse, search, and book events.
2.  **Organizer**: Authenticated users with privileges to create, edit, and manage their own events.
3.  **Administrator**: (Implied) System maintainers with global oversight (scope limited for this iteration).

### 2.3 Operating Environment

- **Client**: Modern web browsers (Chrome, Firefox, Safari, Edge) on desktop, tablet, and mobile devices.
- **Server**: Node.js 18+ runtime.
- **Database**: MongoDB (v6.0+).
- **External Services**: MinIO / S3-compatible object storage (Media), Generalized SMTP (Email).

## 3. Functional Requirements

### 3.1 Event Discovery

**FR-1**: The system shall display a paginated list of upcoming events on the homepage.
**FR-2**: The system shall allow users to search for events by title or keyword.
**FR-3**: The system shall allow filtering of events by mode (Online, Offline) and tags.
**FR-4**: The system shall sort events by date (ascending) by default.

### 3.2 Event Details & Booking

**FR-5**: The system shall provide a dedicated detail page for each event, identified by a unique slug.
**FR-6**: The system shall display event metadata including title, date, location, organizer, and description on the detail page.
**FR-7**: The system shall allow users to book a ticket for an event by providing their name and email address.
**FR-8**: Upon successful booking, the system shall generate a unique QR code for the ticket.
**FR-9**: The system shall send a confirmation email containing the ticket details and QR code to the user.
**FR-10**: The system shall prevent duplicate bookings for the same event by the same email address.

### 3.3 Event Management (Organizer)

**FR-11**: The system shall allow authenticated organizers to create new events via a form.
**FR-12**: The system shall validate all required event fields (title, date, location, description, image) before submission.
**FR-13**: The system shall upload event cover images to MinIO (S3-compatible storage) and store the returned URL.
**FR-14**: The system shall generate a URL-friendly slug from the event title.

### 3.4 API

**FR-15**: The system shall expose RESTful endpoints for retrieving event lists and details.
**FR-16**: The system shall expose secure endpoints for event creation and booking management.
**FR-17**: The system shall return standard HTTP status codes (200, 201, 400, 404, 500) for all API operations.

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-1**: The application landing page shall respond (Time to First Byte) within 500ms under normal load.
**NFR-2**: Static assets and images shall be optimized for fast loading on mobile networks.

### 4.2 Security

**NFR-3**: All data in transit shall be encrypted via HTTPS.
**NFR-4**: API inputs shall be sanitized to prevent injection attacks.
**NFR-5**: Sensitive configuration (DB URIs, API keys) shall be stored in checking environment variables, never in code.

### 4.3 Reliability

**NFR-6**: The system shall handle database connection failures gracefully and return a 503 Service Unavailable status.
**NFR-7**: Email delivery failures shall be logged, but should not crash the main application process.

### 4.4 Usability

**NFR-8**: The interface shall be responsive, supporting viewports from 320px to 4k.
**NFR-9**: The system shall explicitly support a dark mode theme, consistent with the `globals.css` configuration.
**NFR-10**: The system shall adhere to WCAG 2.1 AA accessibility standards where possible.

## 5. System Constraints

**C-1**: The frontend framework must be Next.js 16 (App Router).
**C-2**: The UI styling must utilize Tailwind CSS v4.
**C-3**: The primary language must be TypeScript with strict mode enabled.
**C-4**: Deployment targets must support Node.js serverless or containerized environments (e.g., Vercel, Railway).

## 6. External Interface Requirements

### 6.1 API endpoints

- `GET /api/events`: List events with pagination/filtering.
- `GET /api/events/:slug`: Get event details.
- `POST /api/events`: Create a new event.
- `POST /api/bookings`: Create a booking.

### 6.2 Data Formats

- **Requests**: JSON (Content-Type: application/json) or FormData (for uploads).
- **Responses**: JSON standard envelope.

## 7. Assumptions and Dependencies

**A-1**: Users have a valid email address for receiving tickets.
**A-2**: The MongoDB instance supports transaction-like guarantees for booking integrity.
**D-1**: Availability of a MinIO (or S3-compatible) endpoint for image storage.

## 8. Acceptance Criteria

**AC-1**: A user can successfully browse events, view a detail page, book a ticket, and receive an email without errors.
**AC-2**: An organizer can create an event with an image, and it immediately appears in the public listing.
**AC-3**: The application builds successfully (`npm run build`) and passes all linting (`biome check`) checks.
