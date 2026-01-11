# Docker Deployment

Deploy HomeChat using Docker for quick setup and easy management.

## Quick Start

### Single Command

```bash
docker run -d \
  -p 3000:3000 \
  -v homechat_data:/data \
  -v homechat_storage:/app/storage \
  --name homechat \
  ghcr.io/kebabmane/homechat:latest
```

Visit `http://localhost:3000` — first user to sign up becomes admin.

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  homechat:
    image: ghcr.io/kebabmane/homechat:latest
    container_name: homechat
    ports:
      - "3000:3000"
    volumes:
      - homechat_data:/data
      - homechat_storage:/app/storage
    environment:
      - RAILS_ENV=production
    restart: unless-stopped

volumes:
  homechat_data:
  homechat_storage:
```

Start:
```bash
docker-compose up -d
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RAILS_ENV` | Environment mode | `production` |
| `SITE_NAME` | Application name | `HomeChat` |
| `ALLOW_SIGNUPS` | Allow new registrations | `true` |
| `ENABLE_INTEGRATIONS` | Enable API endpoints | `true` |
| `AUTO_CREATE_API_TOKEN` | Generate API token on start | `false` |
| `HOME_ASSISTANT_INTEGRATION` | Enable HA features | `false` |
| `LITELLM_HOST` | LiteLLM proxy URL | — |
| `LITELLM_API_KEY` | LiteLLM API key | — |
| `LOG_LEVEL` | Logging verbosity | `info` |

### Full Configuration Example

```yaml
services:
  homechat:
    image: ghcr.io/kebabmane/homechat:latest
    ports:
      - "3000:3000"
    volumes:
      - homechat_data:/data
      - homechat_storage:/app/storage
    environment:
      - RAILS_ENV=production
      - SITE_NAME=Family Chat
      - ALLOW_SIGNUPS=false
      - ENABLE_INTEGRATIONS=true
      - AUTO_CREATE_API_TOKEN=true
      - HOME_ASSISTANT_INTEGRATION=true
      - LITELLM_HOST=http://ollama:11434
      - LOG_LEVEL=info
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/up"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Volumes

HomeChat uses two volumes for persistent data:

| Volume | Container Path | Purpose |
|--------|----------------|---------|
| `homechat_data` | `/data` | Database, secrets, credentials |
| `homechat_storage` | `/app/storage` | File uploads, attachments |

### Data Directory Contents

```
/data/
├── production.sqlite3    # Main database
├── secret_key_base       # Encryption key
└── admin_credentials.json # Auto-generated admin (if enabled)
```

## Reverse Proxy Setup

### Traefik

```yaml
services:
  homechat:
    image: ghcr.io/kebabmane/homechat:latest
    volumes:
      - homechat_data:/data
      - homechat_storage:/app/storage
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.homechat.rule=Host(`chat.example.com`)"
      - "traefik.http.routers.homechat.entrypoints=websecure"
      - "traefik.http.routers.homechat.tls.certresolver=letsencrypt"
      - "traefik.http.services.homechat.loadbalancer.server.port=3000"
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

## With AI Bots (Ollama)

```yaml
version: '3.8'

services:
  homechat:
    image: ghcr.io/kebabmane/homechat:latest
    ports:
      - "3000:3000"
    volumes:
      - homechat_data:/data
      - homechat_storage:/app/storage
    environment:
      - RAILS_ENV=production
      - LITELLM_HOST=http://ollama:11434
    depends_on:
      - ollama
    restart: unless-stopped

  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

volumes:
  homechat_data:
  homechat_storage:
  ollama_data:
```

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
# Stop container (optional but recommended)
docker stop homechat

# Backup data volume
docker run --rm \
  -v homechat_data:/source:ro \
  -v $(pwd)/backup:/backup \
  ubuntu tar czf /backup/homechat-$(date +%Y%m%d).tar.gz -C /source .

# Restart
docker start homechat
```

### Update

```bash
# Pull latest image
docker pull ghcr.io/kebabmane/homechat:latest

# Recreate container
docker-compose up -d
```

## Health Checks

HomeChat exposes health endpoints:

| Endpoint | Purpose |
|----------|---------|
| `/up` | Basic liveness check |
| `/api/v1/health` | API health with status |

```bash
curl http://localhost:3000/up
# => OK

curl http://localhost:3000/api/v1/health
# => {"status":"ok","timestamp":"..."}
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs homechat

# Common issues:
# - Port already in use: change port mapping
# - Volume permissions: ensure Docker can write
# - Missing environment variables
```

### WebSocket Connection Failed

- Ensure port 3000 is accessible
- Check firewall rules
- If using proxy, verify WebSocket headers are passed
