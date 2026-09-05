# DevEvent

pnpm monorepo: Next.js frontend + NestJS API + MinIO (S3) + MongoDB.

## Packages

| Package | Path | Role |
|---------|------|------|
| `@dev-event/frontend` | `frontend/` | Next.js 16 UI |
| `@dev-event/backend` | `backend/` | NestJS API |

## Prerequisites

- Node.js 20+
- pnpm 10+
- MongoDB and MinIO available locally or remotely

## Setup

```bash
pnpm install
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Point `DATABASE_URL` / MinIO vars at your MongoDB and MinIO instances, then start dev servers:

```bash
pnpm dev
# or separately:
pnpm dev:frontend
pnpm dev:backend
```

- Frontend: http://localhost:3001 (server actions call the api on `API_INTERNAL_URL`)
- API / Swagger (local backend only): http://localhost:3000/api

## Production (Railway)

Production runs on [Railway](https://railway.app) with two services built via Railpack:

| Service | Config | Domain |
|---------|--------|--------|
| `web` | `railway.toml` | https://devevent.adityatripathi.dev |
| `api` | `railway.api.toml` | internal / API subdomain |

1. Connect this repo to the Railway DevEvent project (web + api services).
2. Copy variables from `.env.example` into Railway.
3. Set `MONGODB_URI`, bucket credentials, and JWT secret from Railway plugins.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build frontend + backend |
| `pnpm lint` | Lint both packages |

## License

See [LICENSE](./frontend/LICENSE).
