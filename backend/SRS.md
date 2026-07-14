# Software Requirements Specification (SRS) - Dev-Event Backend

## 1. Introduction

### 1.1 Purpose

The purpose of this document is to specify the functional and non-functional requirements for the Dev-Event Backend API. This system serves as the core engine for an event management platform, handling everything from user authentication to event logistics and analytics.

### 1.2 Scope

The scope of this system includes:

- User authentication and role-based access control.
- Event lifecycle management (Creation, Updates, Deletion).
- Ticket booking and QR-based check-in systems.
- Media handling (Minio integration).
- Real-time and historical analytics for event organizers.

## 2. Overall Description

### 2.1 System Context

Dev-Event is a web-based event management system. The backend is a RESTful API built with NestJS, using MongoDB for data persistence and Minio for object storage.

### 2.2 User Types

1. **Registered User (USER)**: Can browse events and book tickets.
2. **Organizer (ORGANIZER)**: Can create events, manage participants, and view analytics for their events.
3. **Administrator (ADMIN)**: Full access to system resources and user management.

### 2.3 Operating Environment

- **Node Runtime**: Bun / Node.js
- **Framework**: NestJS
- **Database**: MongoDB
- **Object Storage**: Minio (S3 compatible)

## 3. Functional Requirements

### 3.1 User Authentication & Profile

- **FR1.1**: The system shall allow users to register with a specified role (USER, ORGANIZER).
- **FR1.2**: The system shall authenticate users using JWT (JSON Web Tokens).
- **FR1.3**: The system shall enforce unique usernames and emails.

### 3.2 Event Management

- **FR2.1**: Organizers shall be able to create events with details including title, date, venue, and agenda.
- **FR2.2**: The system shall support image uploads for event banners using Minio.
- **FR2.3**: Organizers shall be able to update or delete only the events they own.
- **FR2.4**: The system shall generate SEO-friendly slugs for events automatically.

### 3.3 Booking & Check-in

- **FR3.1**: Users shall be able to book tickets for public events.
- **FR3.2**: The system shall generate an encrypted QR code for each booking.
- **FR3.3**: Organizers shall be able to check in attendees by scanning/uploading QR code data.
- **FR3.4**: The system shall prevent duplicate check-ins for the same booking.

### 3.4 Organizer Operations

- **FR4.1**: Organizers shall be able to list all participants for their events.
- **FR4.2**: Organizers shall be able to resend QR code tickets to participants.
- **FR4.3**: Organizers shall be able to remove participants from their events.

### 3.4 Analytics

- **FR5.1**: The system shall provide an overview of total events, bookings, and check-ins for organizers.
- **FR5.2**: The system shall provide event-specific statistics, including booking trends over the last 7 days.

## 4. Non-Functional Requirements

### 4.1 Security

- **NFR1.1**: Passwords shall be hashed using Argon2 before storage.
- **NFR1.2**: Sensitive data within QR codes shall be encrypted.
- **NFR1.3**: The system shall enforce Role-Based Access Control (RBAC) on all protected endpoints.

### 4.2 Performance

- **NFR2.1**: API responses for critical paths (Login, Booking) shall be under 500ms.
- **NFR2.2**: Image retrieval shall use presigned URLs for direct client access to object storage.

### 4.3 Scalability

- **NFR3.1**: The system shall use modular architecture (NestJS modules) to allow independent scaling of features.

## 5. System Constraints

- **C1**: The system must run within a Dockerized environment.
- **C2**: Database integrity must be maintained via Mongoose schemas.

## 6. External Interface Requirements

- **6.1 API**: REST API documented via Swagger (OpenAPI).
- **6.2 Storage**: Minio/S3 for binary assets.

## 7. Assumptions and Dependencies

- **D1**: Reliable connection to a MongoDB instance.
- **D2**: Minio server availability for image handling.

## 8. Acceptance Criteria

- **AC1**: All API endpoints pass automated integration tests.
- **AC2**: Image uploads are successfully persisted and retrievable via presigned URLs.
- **AC3**: Roles are strictly enforced (e.g., USER cannot delete events).
