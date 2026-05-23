# Docker Deployment

Deploy HomeChat using Docker for standalone servers, local networks, and small team deployments.

## Quick Start

The production image runs Rails on port `80` inside the container and stores SQLite databases plus uploads in `/rails/storage`.

Create a `.env` file with stable secrets:

```bash
RAILS_MASTER_KEY=replace-with-your-rails-master-key
AR_ENCRYPTION_PRIMARY_KEY=replace-with-64-hex-chars
AR_ENCRYPTION_DETERMINISTIC_KEY=replace-with-64-hex-chars
AR_ENCRYPTION_KEY_DERIVATION_SALT=replace-with-64-hex-chars
API_TOKEN_PEPPER=replace-with-a-long-random-value
RAILS_ALLOW_INSECURE_HTTP=true
```

Generate the three `AR_ENCRYPTION_*` values with `openssl rand -hex 32`. Keep these values backed up; changing them can make encrypted settings and data unreadable.

### Docker Run

```bash
docker run -d \
  -p 3000:80 \
  -v homechat_storage:/rails/storage \
  --env-file .env \
  --name homechat \
  ghcr.io/kebabmane/homechat:latest
```

Visit `http://localhost:3000` — the first user to sign up becomes admin.

### Docker Compose

```yaml
services:
  homechat:
    image: ghcr.io/kebabmane/homechat:latest
    container_name: homechat
    ports:
      - "3000:80"
    volumes:
      - homechat_storage:/rails/storage
    environment:
      - RAILS_ENV=production
      - RAILS_MASTER_KEY=${RAILS_MASTER_KEY}
      - RAILS_LOG_TO_STDOUT=1
      - RAILS_SERVE_STATIC_FILES=true
      - RAILS_ALLOW_INSECURE_HTTP=${RAILS_ALLOW_INSECURE_HTTP:-true}
      - SOLID_QUEUE_IN_PUMA=true
      - AR_ENCRYPTION_PRIMARY_KEY=${AR_ENCRYPTION_PRIMARY_KEY}
      - AR_ENCRYPTION_DETERMINISTIC_KEY=${AR_ENCRYPTION_DETERMINISTIC_KEY}
      - AR_ENCRYPTION_KEY_DERIVATION_SALT=${AR_ENCRYPTION_KEY_DERIVATION_SALT}
      - API_TOKEN_PEPPER=${API_TOKEN_PEPPER}
      - DISCOVERY_MODE=${DISCOVERY_MODE:-cloud}
      - FCM_PROJECT_ID=${FCM_PROJECT_ID:-}
      - FCM_SERVICE_ACCOUNT_JSON=${FCM_SERVICE_ACCOUNT_JSON:-}
      - LOGRAGE_ENABLED=true
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:80/up"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  homechat_storage:
```

Start:

```bash
docker compose up -d
```

The Rails repo also includes `docker-compose.prod.yml`, which is the canonical production Compose file.

## Configuration

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `RAILS_MASTER_KEY` | Rails credentials key for this deployment |
| `AR_ENCRYPTION_PRIMARY_KEY` | Active Record encryption primary key, 64 hex chars |
| `AR_ENCRYPTION_DETERMINISTIC_KEY` | Active Record deterministic encryption key, 64 hex chars |
| `AR_ENCRYPTION_KEY_DERIVATION_SALT` | Active Record encryption salt, 64 hex chars |
| `API_TOKEN_PEPPER` | Pepper used when hashing API tokens |

### Common Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RAILS_ALLOW_INSECURE_HTTP` | Allow plain HTTP for LAN deployments | `true` in the provided compose file |
| `DISCOVERY_MODE` | Server discovery mode (`local` or `cloud`) | `cloud` |
| `FCM_PROJECT_ID` | Firebase project ID for push notifications | unset |
| `FCM_SERVICE_ACCOUNT_JSON` | Firebase service account JSON for FCM HTTP v1 | unset |
| `RAILS_LOG_LEVEL` | Rails log level | `info` |
| `LOGRAGE_ENABLED` | Structured JSON production logs | `true` |

Application settings such as site name, signup policy, Home Assistant integration, LiteLLM host, and FCM credentials can also be managed from **Admin -> Settings** after the first admin account is created.

## Volumes

HomeChat uses one persistent volume in the production container:

| Volume | Container Path | Purpose |
|--------|----------------|---------|
| `homechat_storage` | `/rails/storage` | SQLite databases, Active Storage uploads, and generated runtime files |

### Storage Contents

```text
/rails/storage/
├── production.sqlite3
├── production_cache.sqlite3
├── production_queue.sqlite3
├── production_cable.sqlite3
└── active_storage/
```

Back up the Docker volume and the secret values from `.env` together.

## Reverse Proxy Setup

### Traefik

```yaml
services:
  homechat:
    image: ghcr.io/kebabmane/homechat:latest
    volumes:
      - homechat_storage:/rails/storage
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.homechat.rule=Host(`chat.example.com`)"
      - "traefik.http.routers.homechat.entrypoints=websecure"
      - "traefik.http.routers.homechat.tls.certresolver=letsencrypt"
      - "traefik.http.services.homechat.loadbalancer.server.port=80"
```

### Nginx

```nginx
upstream homechat {
    server 127.0.0.1:3000;
}

server {
    listen 443 ssl http2;
    server_name chat.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://homechat;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

::: warning WebSocket Support Required
The `Upgrade` headers are required for real-time messaging to work.
:::

## With AI Bots

AI bots use a LiteLLM-compatible endpoint configured in **Admin -> Settings -> AI**. For an Ollama sidecar:

```yaml
services:
  homechat:
    image: ghcr.io/kebabmane/homechat:latest
    ports:
      - "3000:80"
    volumes:
      - homechat_storage:/rails/storage
    env_file: .env
    depends_on:
      - ollama
    restart: unless-stopped

  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

volumes:
  homechat_storage:
  ollama_data:
```

Set the LiteLLM or Ollama-compatible host from the admin settings page after the server is running.

## Operations

### View Logs

```bash
docker logs -f homechat
```

### Access Console

```bash
docker exec -it homechat bin/rails console
```

### Backup

```bash
docker stop homechat

docker run --rm \
  -v homechat_storage:/source:ro \
  -v "$(pwd)/backup:/backup" \
  ubuntu tar czf /backup/homechat-storage-$(date +%Y%m%d).tar.gz -C /source .

docker start homechat
```

### Update

```bash
docker pull ghcr.io/kebabmane/homechat:latest
docker compose up -d
```

## Health Checks

HomeChat exposes health endpoints:

| Endpoint | Purpose |
|----------|---------|
| `/up` | Rails liveness check |
| `/api/v1/health` | API health, version, and push capability |

```bash
curl http://localhost:3000/up
curl http://localhost:3000/api/v1/health
```

## Troubleshooting

### Container Won't Start

```bash
docker logs homechat
```

Common issues:

- Port already in use: change the host port mapping, for example `"3001:80"`.
- Missing `RAILS_MASTER_KEY` or `AR_ENCRYPTION_*` values.
- Volume permissions: ensure Docker can write to the named volume.
- API token creation failing in production: set `API_TOKEN_PEPPER`.

### WebSocket Connection Failed

- Ensure the host port is reachable.
- Check firewall rules.
- If using a proxy, verify WebSocket upgrade headers are passed.
