#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# DevEvent Monorepo VPS Deployment Script
# Manages /root/ports.csv port assignment, pulls pre-built images, and deploys
# ==============================================================================

APP_NAME="dev-event"
BACKEND_APP_NAME="dev-event-backend"
PORTS_FILE="/root/ports.csv"
START_PORT=3000
COMPOSE_FILE="docker-compose.yml"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "=================================================="
echo "🚀 Deploying ${APP_NAME} & ${BACKEND_APP_NAME} (${IMAGE_TAG})"
echo "=================================================="

# Ensure script is executed as root (required for /root/ports.csv)
if [ "$(id -u)" -ne 0 ]; then
    echo "❌ Error: This script must be run as root (or with sudo) to access ${PORTS_FILE}." >&2
    exit 1
fi

# Ensure Docker and Docker Compose are installed
if ! command -v docker >/dev/null 2>&1; then
    echo "❌ Error: Docker is not installed. Install Docker first." >&2
    exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
    echo "❌ Error: Docker Compose (v2) plugin is not available." >&2
    exit 1
fi

# ------------------------------------------------------------------------------
# 1. Resolve or allocate ports in /root/ports.csv
# ------------------------------------------------------------------------------
mkdir -p "$(dirname "${PORTS_FILE}")"

if [ ! -f "${PORTS_FILE}" ]; then
    echo "Creating ${PORTS_FILE}..."
    touch "${PORTS_FILE}"
fi

allocate_port() {
    local target_app="$1"
    local initial_port="$2"
    local port_result=""

    if grep -E "^${target_app}," "${PORTS_FILE}" >/dev/null 2>&1; then
        port_result=$(grep -E "^${target_app}," "${PORTS_FILE}" | tail -n 1 | cut -d',' -f2 | tr -d '[:space:]')
        echo "ℹ️  Found existing port mapping for '${target_app}': Port ${port_result}" >&2
    else
        echo "🔍 Allocating next available port for '${target_app}' starting from ${initial_port}..." >&2
        local candidate=${initial_port}

        while true; do
            # 1. Check if candidate port is already in /root/ports.csv
            local port_in_csv
            port_in_csv=$(grep -E ",${candidate}$" "${PORTS_FILE}" || true)

            # 2. Check if candidate port is currently listening in the OS
            local port_in_use=""
            if command -v ss >/dev/null 2>&1; then
                port_in_use=$(ss -tulpn 2>/dev/null | grep -E ":${candidate}\b" || true)
            elif command -v netstat >/dev/null 2>&1; then
                port_in_use=$(netstat -tulpn 2>/dev/null | grep -E ":${candidate}\b" || true)
            elif command -v lsof >/dev/null 2>&1; then
                port_in_use=$(lsof -i ":${candidate}" || true)
            fi

            if [ -z "${port_in_csv}" ] && [ -z "${port_in_use}" ]; then
                port_result=${candidate}
                break
            fi

            candidate=$((candidate + 1))
        done

        # Append to /root/ports.csv in appname,port format
        echo "${target_app},${port_result}" >> "${PORTS_FILE}"
        echo "✅ Assigned port ${port_result} for '${target_app}' and recorded to ${PORTS_FILE}" >&2
    fi

    echo "${port_result}"
}

FRONTEND_PORT=$(allocate_port "${APP_NAME}" "${START_PORT}")
BACKEND_PORT=$(allocate_port "${BACKEND_APP_NAME}" "$((FRONTEND_PORT + 1))")

# ------------------------------------------------------------------------------
# 2. Configure .env file
# ------------------------------------------------------------------------------
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "⚠️  No .env found. Creating .env from .env.example..."
        cp .env.example .env
    else
        echo "Creating blank .env file..."
        touch .env
    fi
fi

# Helper to set or update env key=value
set_env_var() {
    local key="$1"
    local val="$2"
    if grep -q "^${key}=" .env; then
        sed -i "s|^${key}=.*|${key}=${val}|" .env
    else
        echo "${key}=${val}" >> .env
    fi
}

set_env_var "APP_PORT" "${FRONTEND_PORT}"
set_env_var "BACKEND_PORT" "${BACKEND_PORT}"

# Generate secure random JWT_SECRET if unconfigured or default
CURRENT_JWT=$(grep "^JWT_SECRET=" .env | cut -d'=' -f2- || true)
if [ -z "${CURRENT_JWT}" ] || [ "${CURRENT_JWT}" = "your_jwt_secret_here" ]; then
    NEW_JWT=$(openssl rand -hex 32 2>/dev/null || date +%s%N | sha256sum | head -c 64)
    set_env_var "JWT_SECRET" "${NEW_JWT}"
fi

export APP_PORT="${FRONTEND_PORT}"
export BACKEND_PORT="${BACKEND_PORT}"
export IMAGE_TAG="${IMAGE_TAG}"

# ------------------------------------------------------------------------------
# 3. Pull and deploy pre-built containers
# ------------------------------------------------------------------------------
echo "📦 Pulling latest pre-built container images..."
docker compose -f "${COMPOSE_FILE}" pull frontend backend || {
    echo "⚠️  Note: If GHCR image is private, run: echo \$GHCR_TOKEN | docker login ghcr.io -u <username> --password-stdin"
}

echo "🚢 Launching services..."
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans

# ------------------------------------------------------------------------------
# 4. Storage cleanup (Crucial for constrained root partitions e.g. 15GB)
# ------------------------------------------------------------------------------
echo "🧹 Pruning unused dangling images to preserve disk space..."
docker image prune -f >/dev/null 2>&1 || true

# ------------------------------------------------------------------------------
# 5. Service verification
# ------------------------------------------------------------------------------
echo "⏳ Verifying backend health on http://127.0.0.1:${BACKEND_PORT}/health/liveness..."
BACKEND_HEALTHY=false
for i in {1..20}; do
    if curl -s -f "http://127.0.0.1:${BACKEND_PORT}/health/liveness" >/dev/null 2>&1; then
        BACKEND_HEALTHY=true
        break
    fi
    sleep 2
done

echo "⏳ Verifying frontend health on http://127.0.0.1:${FRONTEND_PORT}/api/health..."
FRONTEND_HEALTHY=false
for i in {1..20}; do
    if curl -s -f "http://127.0.0.1:${FRONTEND_PORT}/api/health" >/dev/null 2>&1 || \
       curl -s -f "http://127.0.0.1:${FRONTEND_PORT}/" >/dev/null 2>&1; then
        FRONTEND_HEALTHY=true
        break
    fi
    sleep 2
done

echo ""
echo "=================================================="
if [ "$FRONTEND_HEALTHY" = true ] && [ "$BACKEND_HEALTHY" = true ]; then
    echo "✅ DevEvent monorepo successfully deployed!"
else
    echo "⚠️  Services are running, but one or more healthchecks took longer than expected."
    echo "   Check container logs using: docker compose logs -f"
fi
echo "📍 Frontend Port: http://127.0.0.1:${FRONTEND_PORT}"
echo "📍 Backend API Port: http://127.0.0.1:${BACKEND_PORT}"
echo "📄 Port Registry: ${PORTS_FILE} contains:"
echo "   - ${APP_NAME},${FRONTEND_PORT}"
echo "   - ${BACKEND_APP_NAME},${BACKEND_PORT}"
echo ""
echo "☁️  Direct Cloudflare Tunnel configuration (/etc/cloudflared/config.yml):"
echo "   ingress:"
echo "     - hostname: devevent.adityatripathi.dev"
echo "       service: http://127.0.0.1:${FRONTEND_PORT}"
echo "     - hostname: api.devevent.adityatripathi.dev"
echo "       service: http://127.0.0.1:${BACKEND_PORT}"
echo "=================================================="
docker compose ps
