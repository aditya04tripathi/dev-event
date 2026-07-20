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
- Docker (MinIO, MongoDB, and production deploy)

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

Production pull-only (VPS + Cloudflare Tunnel):

```bash
cp .env.production.example .env
pnpm docker:prod:pull
pnpm docker:prod:up
```

Cloudflare Tunnel (web only):

| Public URL | Local service |
|------------|---------------|
| https://devevent.adityatripathi.dev | http://127.0.0.1:49153 |

Images:

- `ghcr.io/aditya04tripathi/dev-event/web`
- `ghcr.io/aditya04tripathi/dev-event/api`

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build frontend + backend |
| `pnpm lint` | Lint both packages |
| `pnpm docker:build` | Build linux/amd64 images locally |
| `pnpm docker:up` / `docker:down` | Local compose |
| `pnpm docker:prod:*` | Pull-only prod compose |

## License

See [LICENSE](./frontend/LICENSE).
