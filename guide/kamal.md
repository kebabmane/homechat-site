# Kamal Deployment

Deploy HomeChat to any cloud provider with zero-downtime deployments using [Kamal](https://kamal-deploy.org).

## What is Kamal?

Kamal is a modern deployment tool built by the Rails team that provides:

- **Zero-downtime deployments** — Users never see downtime
- **SSL automation** — Automatic Let's Encrypt certificates
- **Health checks** — Ensures containers are healthy before switching traffic
- **Simple configuration** — One YAML file for all settings

## Prerequisites

### Local Requirements
- Ruby 3.3+ installed locally
- Docker installed and running
- SSH access to your target servers

### Server Requirements
- Ubuntu 20.04+ or Debian 11+
- Docker installed on target servers
- SSH key-based authentication configured
- Domain name pointing to your server

## Quick Setup

### 1. Prepare Your Server

```bash
# Connect to your server
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Create deploy user (recommended)
useradd -m -s /bin/bash deploy
usermod -aG docker deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
```

### 2. Configure Kamal

```bash
# Clone the repository
git clone https://github.com/rhysevans/homechat.git
cd homechat

# Edit the deployment configuration
nano config/deploy.yml
```

Update `config/deploy.yml`:

```yaml
servers:
  web:
    - YOUR_SERVER_IP

proxy:
  host: chat.yourdomain.com

registry:
  server: ghcr.io
  username: your-username
```

### 3. Set Up Secrets

```bash
# Set registry password (GitHub PAT for GHCR)
export KAMAL_REGISTRY_PASSWORD="your_github_token"
```

### 4. Deploy

```bash
# Initial setup and deploy
bin/kamal setup

# Subsequent deployments
bin/kamal deploy
```

## Cloud Provider Examples

### DigitalOcean

1. Create a Droplet (Ubuntu 22.04, $6/month works fine)
2. Add your SSH key
3. Note the IP address
4. Configure `deploy.yml` with the IP

### Hetzner

1. Create a CX11 or CX21 server
2. Choose Ubuntu 22.04
3. Add your SSH key
4. Configure `deploy.yml`

### AWS EC2

```yaml
servers:
  web:
    - ec2-xxx-xxx-xxx-xxx.compute-1.amazonaws.com

ssh:
  user: ubuntu
```

## SSL Configuration

Kamal automatically provisions SSL certificates via Let's Encrypt:

```yaml
proxy:
  host: chat.example.com
  ssl: true
```

Ensure your domain points to the server before deploying.

## Operations

### View Logs

```bash
bin/kamal logs
```

### Access Console

```bash
bin/kamal console
```

### Rollback

```bash
bin/kamal rollback
```

### Environment Variables

```bash
# Add a secret
bin/kamal env push LITELLM_API_KEY=your-key

# List current env
bin/kamal env
```

## Health Checks

Kamal checks `/up` before switching traffic:

```yaml
healthcheck:
  path: /up
  port: 3000
  interval: 10s
```

## Troubleshooting

### SSH Connection Issues

```bash
# Test SSH connection
ssh deploy@your-server-ip

# Debug Kamal
bin/kamal deploy -v
```

### Container Won't Start

```bash
# Check logs on server
bin/kamal logs --since 30m
```

### SSL Certificate Issues

- Verify DNS is propagated: `dig chat.example.com`
- Check server is reachable on port 443
- Review Let's Encrypt rate limits
