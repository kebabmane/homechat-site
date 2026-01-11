# Installation

HomeChat can be deployed in several ways depending on your infrastructure and requirements.

## Deployment Options

| Method | Best For | Complexity |
|--------|----------|------------|
| [Home Assistant Add-on](#home-assistant-add-on) | HA users, simplest setup | ⭐ Easy |
| [Docker Compose](#docker-compose) | Self-hosted servers | ⭐⭐ Medium |
| [Kamal](#kamal-deployment) | Cloud/VPS production | ⭐⭐⭐ Advanced |

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

1. Navigate to **Settings → Add-ons → Add-on Store**
2. Click the three dots menu → **Repositories**
3. Add: `https://github.com/rhysevans/homechat-addon`
4. Find "HomeChat" in the add-on list and click **Install**
5. Start the add-on

### Configuration

The add-on exposes these options:

```yaml
ssl: false
certfile: fullchain.pem
keyfile: privkey.pem
```

For external access, configure SSL through your Home Assistant proxy.

## Docker Compose

For standalone deployments on any Linux server.

### Quick Start

```bash
# Clone repository
git clone https://github.com/rhysevans/homechat.git
cd homechat

# Copy environment template
cp .env.example .env

# Edit configuration
nano .env

# Start services
docker compose up -d
```

### Environment Variables

Key configuration options in `.env`:

```bash
# Application
RAILS_ENV=production
SECRET_KEY_BASE=your-secret-key-here

# Database (SQLite by default)
DATABASE_URL=sqlite3:storage/production.sqlite3

# Optional: Push notifications
FCM_PROJECT_ID=your-firebase-project
FCM_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
FCM_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

### Docker Compose File

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./storage:/app/storage
    environment:
      - RAILS_ENV=production
      - SECRET_KEY_BASE=${SECRET_KEY_BASE}
    restart: unless-stopped
```

## Kamal Deployment

For production cloud deployments with zero-downtime deploys.

### Prerequisites

- A VPS or cloud server (DigitalOcean, Hetzner, AWS, etc.)
- Docker installed on the server
- SSH access configured

### Setup

1. Configure `config/deploy.yml`:

```yaml
service: homechat
image: your-registry/homechat

servers:
  web:
    hosts:
      - your-server-ip

registry:
  username: your-username
  password:
    - KAMAL_REGISTRY_PASSWORD

env:
  secret:
    - RAILS_MASTER_KEY
    - SECRET_KEY_BASE
```

2. Deploy:

```bash
kamal setup    # First time only
kamal deploy   # Subsequent deploys
```

[Detailed Kamal guide →](/guide/kamal)

## Post-Installation

After installation, complete these steps:

### 1. Create Admin Account

Visit your HomeChat URL and sign up. The first user automatically becomes an administrator.

### 2. Configure Settings

Go to **Admin → Settings** to configure:

- Site name and branding
- Signup options (open, approval required, disabled)
- API and webhook settings
- Push notification credentials

### 3. Security Hardening

For production deployments, review the [Security Hardening Guide](/security/hardening).

## Troubleshooting

### Container won't start

Check logs:
```bash
docker compose logs -f
```

### Database errors

Ensure the storage directory is writable:
```bash
chmod -R 755 storage/
```

### Connection refused

Verify the port is open:
```bash
curl http://localhost:3000/up
```

::: tip Need Help?
Open an issue on [GitHub](https://github.com/rhysevans/homechat/issues) for additional support.
:::
