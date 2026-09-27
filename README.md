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

| Service | Config file | Domain |
|---------|-------------|--------|
| `web` | `/frontend/railway.toml` | https://devevent.adityatripathi.dev |
| `api` | `/backend/railway.toml` | internal / API subdomain |

1. Connect this repo to the Railway DevEvent project (web + api services).
2. In each service’s Settings → Config as Code, set the config file path above (keep Root Directory `/`).
3. Copy variables from `.env.example` into Railway.
4. Set `MONGODB_URI`, bucket credentials, and JWT secret from Railway plugins.

## Production (VPS & Docker)

Deploy to a Linux VPS or home server (Fedora, Ubuntu, Debian) using pre-built multi-architecture containers and automated port allocation.

### Core Architecture

- **Build Off-Host**: GitHub Actions builds container images natively (`ubuntu-latest` for AMD64, `ubuntu-24.04-arm` for ARM64 without QEMU) and pushes to GHCR.
- **Deterministic Port Registry**: Host ports are registered deterministically in `/root/ports.csv` (`dev-event,<port>` and `dev-event-backend,<port>`).
- **Storage Safeguards**: Log size limits (`max-size: 10m`, `max-file: 3`) and automatic dangling image pruning (`docker image prune -f`) protect small root partitions.
- **Direct Cloudflare Tunnel**: Direct routing from `cloudflared` to local container ports with zero reverse proxy or SELinux friction.

### Deploying to VPS

1. Clone repo to the server:
   ```bash
   git clone git@github.com:aditya04tripathi/dev-event.git /opt/dev-event
   cd /opt/dev-event
   ```

2. Run the deployment script as root:
   ```bash
   sudo ./deploy.sh
   ```

3. The script will:
   - Check or allocate available ports in `/root/ports.csv`
   - Configure `.env` automatically with assigned ports and secure secrets
   - Pull pre-built images from GHCR
   - Launch `frontend`, `backend`, `mongo`, and `minio` services
   - Prune old dangling Docker image layers
   - Verify health of both frontend and backend
   - Output the exact Cloudflare Tunnel ingress block

4. Cloudflare Tunnel configuration (`/etc/cloudflared/config.yml`):
   ```yaml
   ingress:
     - hostname: devevent.adityatripathi.dev
       service: http://127.0.0.1:<APP_PORT>
     - hostname: api.devevent.adityatripathi.dev
       service: http://127.0.0.1:<BACKEND_PORT>
     - service: http_status:404
   ```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build frontend + backend |
| `pnpm lint` | Lint both packages |

## License

See [LICENSE](./frontend/LICENSE).

