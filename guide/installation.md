# Installation

HomeChat can be deployed in several ways depending on your infrastructure and requirements.

## Deployment Options

| Method | Best For | Complexity |
|--------|----------|------------|
| [Home Assistant Add-on](#home-assistant-add-on) | Home Assistant OS/Supervised users | Easy |
| [Docker Compose](#docker-compose) | Self-hosted Linux servers and LAN deployments | Medium |
| [Kamal](#kamal-deployment) | VPS/cloud production with HTTPS | Advanced |

## System Requirements

### Minimum
- 1 CPU core
- 512MB RAM
- 1GB disk space

### Recommended
- 2 CPU cores
- 1GB RAM
- 5GB disk space

HomeChat is optimized for low-power devices like Raspberry Pi 4.

## Home Assistant Add-on

The easiest way to run HomeChat alongside Home Assistant.

### Installation

1. Navigate to **Settings -> Add-ons -> Add-on Store**
2. Click the three dots menu -> **Repositories**
3. Add: `https://github.com/kebabmane/homechat-addon`
4. Find "HomeChat" in the add-on list and click **Install**
5. Start the add-on

### Configuration

The add-on exposes these core options:

```yaml
site_name: "HomeChat"
allow_signups: false
port: 3000
access_mode: "ingress"
ssl: false
certfile: "fullchain.pem"
keyfile: "privkey.pem"
log_level: "info"
enable_integrations: true
auto_create_api_token: false
home_assistant_integration: true
discovery_mode: "auto"
enable_nabu_casa: true
```

Use `ingress` for the Home Assistant sidebar experience. Use `direct_http` or `direct_ssl` only when you want HomeChat reachable directly on your LAN.

## Docker Compose

For standalone deployments on Linux servers, use the production Docker Compose file in the Rails repo.

### Quick Start

```bash
git clone https://github.com/kebabmane/homechat.git
cd homechat

# Create stable deployment secrets.
cp config/master.key .rails-master-key
openssl rand -hex 32 > .ar-primary-key
openssl rand -hex 32 > .ar-deterministic-key
openssl rand -hex 32 > .ar-salt
openssl rand -hex 32 > .api-token-pepper

cat > .env <<EOF
RAILS_MASTER_KEY=$(cat .rails-master-key)
AR_ENCRYPTION_PRIMARY_KEY=$(cat .ar-primary-key)
AR_ENCRYPTION_DETERMINISTIC_KEY=$(cat .ar-deterministic-key)
AR_ENCRYPTION_KEY_DERIVATION_SALT=$(cat .ar-salt)
API_TOKEN_PEPPER=$(cat .api-token-pepper)
RAILS_ALLOW_INSECURE_HTTP=true
EOF

docker compose -f docker-compose.prod.yml up -d --build
```

Visit `http://localhost:3000`. The first user to sign up automatically becomes an administrator.

::: warning Back Up Secrets
Back up `.env` with your Docker volume. `RAILS_MASTER_KEY`, `AR_ENCRYPTION_*`, and `API_TOKEN_PEPPER` must remain stable for the deployment.
:::

### Production Compose Shape

The current production container listens on port `80` internally and persists SQLite databases plus uploads in `/rails/storage`:

```yaml
services:
  web:
    image: ghcr.io/kebabmane/homechat:latest
    ports:
      - "3000:80"
    volumes:
      - homechat_storage:/rails/storage
    env_file: .env
    restart: unless-stopped

volumes:
  homechat_storage:
```

For more details, see the [Docker guide](/guide/docker).

## Kamal Deployment

For production cloud deployments with zero-downtime deploys.

### Prerequisites

- Ruby 4.0+ installed locally
- A VPS or cloud server (DigitalOcean, Hetzner, AWS, etc.)
- Docker installed on the server
- SSH access configured
- A domain pointing at the server

### Setup

1. Configure `config/deploy.yml`:

```yaml
service: homechat
image: kebabmane/homechat

servers:
  web:
    - your-server-ip

proxy:
  ssl: true
  host: chat.yourdomain.com

registry:
  server: ghcr.io
  username: kebabmane
  password:
    - KAMAL_REGISTRY_PASSWORD

env:
  secret:
    - RAILS_MASTER_KEY
```

2. Deploy:

```bash
bin/kamal setup    # First time only
bin/kamal deploy   # Subsequent deploys
```

[Detailed Kamal guide ->](/guide/kamal)

## Post-Installation

After installation, complete these steps:

### 1. Create Admin Account

Visit your HomeChat URL and sign up. The first user automatically becomes an administrator.

### 2. Configure Settings

Go to **Admin -> Settings** to configure:

- Site name and branding
- Signup options (open, approval required, disabled)
- API and webhook settings
- Home Assistant integration
- LiteLLM defaults for AI bots
- Firebase Cloud Messaging credentials for push notifications

### 3. Security Hardening

For production deployments, review the [Security Hardening Guide](/security/hardening).

## Troubleshooting

### Container Won't Start

Check logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

Common causes:

- Missing `RAILS_MASTER_KEY`
- Missing one of the `AR_ENCRYPTION_*` values
- Missing `API_TOKEN_PEPPER` when creating production API tokens
- Port `3000` already in use

### Database Errors

Ensure the Docker volume is writable and mounted at `/rails/storage`.

### Connection Refused

Verify the published port:

```bash
curl http://localhost:3000/up
```

::: tip Need Help?
Open an issue on [GitHub](https://github.com/kebabmane/homechat/issues) for additional support.
:::
