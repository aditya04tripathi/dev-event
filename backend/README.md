# Dev-Event Backend API

A robust event management backend powered by **NestJS**, **MongoDB**, and **Minio**.

## Overview

Dev-Event is a comprehensive backend solution for organizing and managing events. It features a secure role-based access control system, an encrypted booking and check-in mechanism, and a powerful analytics engine for organizers.

## Key Features

- **Advanced Auth & RBAC**: Multiple user roles (USER, ORGANIZER, ADMIN) with strictly enforced permissions.
- **Event Lifecycle**: Full CRUD for events with slug generation and media management.
- **Secure Bookings**: Encrypted QR code generation for ticket bookings.
- **Smart Check-in**: Integrated QR scanning support with duplicate check-in prevention.
- **Participant Management**: Tools for organizers to manage attendee lists and resend tickets.
- **Rich Analytics**: Event-specific performance tracking and organizational overview stats.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: MongoDB (via Mongoose)
- **Object Storage**: Minio (S3 Compatible)
- **API Documentation**: Swagger (OpenAPI 3.0)

## Setup and Installation

### Prerequisites

- [Bun](https://bun.sh/) installed.
- [Docker](https://www.docker.com/) for running MongoDB and Minio.

### Quick Start

1. **Clone the repo**:
   ```bash
   git clone <repo-url>
   cd backend
   ```
2. **Setup environment**:
   ```bash
   cp .env.example .env
   ```
3. **Launch services**:
   ```bash
   docker-compose up -d
   ```
4. **Install and Run**:
   ```bash
   bun install
   bun start:dev
   ```

## Configuration

Key environment variables in `.env`:

- `DATABASE_URL`: MongoDB connection string.
- `JWT_SECRET`: Secret key for authentication.
- `MINIO_*`: Configuration for object storage.

## Usage

Access the interactive API documentation at:
👉 [http://localhost:3000/api](http://localhost:3000/api)

## Documentation

- [Software Requirements Specification](./SRS.md)

## License

This project is licensed under the terms described in [LICENSE](./LICENSE).

Copyright (c) 2026 Aditya Tripathi
