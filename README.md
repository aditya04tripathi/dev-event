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
- Docker (local Mongo + MinIO)

## Setup

```bash
pnpm install
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Start infra (Mongo + MinIO):

```bash
docker compose up mongodb minio -d
```

Dev servers:

```bash
pnpm dev
# or separately:
pnpm dev:frontend
pnpm dev:backend
```

- Frontend: http://localhost:3001 (server actions call the api on `API_INTERNAL_URL`)
- API / Swagger (local backend only): http://localhost:3000/api
- Docker web UI: http://localhost:49153

## Docker

Only **web** port `49153` is published. API, MongoDB, and MinIO are internal; the Next.js server calls them via `API_INTERNAL_URL` and `MINIO_INTERNAL_URL`. Media is served at `/api/storage/*`.

Local full stack:

```bash
pnpm docker:up
# Web: http://localhost:49153
```

## Production (Railway)

Production runs on [Railway](https://railway.app) with two services:

| Service | Config | Domain |
|---------|--------|--------|
| `web` | `railway.toml` + `Dockerfile.web` | https://devevent.adityatripathi.dev |
| `api` | `railway.api.toml` + `Dockerfile.api` | internal / API subdomain |

1. Connect this repo to the Railway DevEvent project (web + api services).
2. Copy variables from `.env.example` into Railway.
3. Set `MONGODB_URI`, bucket credentials, and JWT secret from Railway plugins.
4. For observability, set `ENABLE_TRACING`, `OTEL_SERVICE_NAME`, and `OTEL_EXPORTER_OTLP_ENDPOINT` on both web and api.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build frontend + backend |
| `pnpm lint` | Lint both packages |
| `pnpm docker:build` | Build web and api images locally |
| `pnpm docker:up` / `docker:down` | Local compose |

## License

See [LICENSE](./frontend/LICENSE).
