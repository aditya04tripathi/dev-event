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

- Frontend: http://localhost:3001
- API / Swagger: http://localhost:3000/api
- MinIO API: http://127.0.0.1:49154
- MinIO Console: http://localhost:49155

## Docker

Local build (web + api + mongodb + minio):

```bash
pnpm docker:up
# Web:    http://localhost:49153
# API:    http://localhost:49152/api
# MinIO:  http://127.0.0.1:49154
# Console: http://localhost:49155
```

Production pull-only (VPS):

```bash
pnpm docker:prod:pull
pnpm docker:prod:up
```

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
