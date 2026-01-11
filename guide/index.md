# Getting Started

Welcome to HomeChat! This guide will help you get up and running with your self-hosted chat server.

## What is HomeChat?

HomeChat is a lightweight, self-hosted chat application designed specifically for Home Assistant users. It provides:

- **Real-time messaging** with channels and direct messages
- **Bot integrations** for Home Assistant automations
- **Mobile apps** for iOS and Android
- **Security-first** design with 2FA, API tokens, and rate limiting

## Prerequisites

Before installing HomeChat, ensure you have:

- **Ruby 3.3+** (for local development)
- **Docker** (for containerized deployment)
- **SQLite 3** (included with most systems)

For Home Assistant users:
- Home Assistant 2024.1 or later
- Supervisor access (for add-on installation)

## Quick Start

The fastest way to get started depends on your setup:

### Home Assistant Add-on

If you're running Home Assistant OS or Supervised:

1. Add the HomeChat repository to your add-on store
2. Install the HomeChat add-on
3. Start the add-on and open the web UI

[Learn more →](/guide/home-assistant)

### Docker Compose

For standalone Docker deployment:

```bash
# Clone the repository
git clone https://github.com/rhysevans/homechat.git
cd homechat

# Start with Docker Compose
docker compose up -d
```

[Learn more →](/guide/docker)

### Kamal (Cloud Deployment)

For production cloud deployments with zero-downtime:

```bash
# Configure your server in config/deploy.yml
kamal setup
kamal deploy
```

[Learn more →](/guide/kamal)

## Next Steps

Once HomeChat is running:

1. **Create an admin account** - The first user automatically becomes admin
2. **Configure settings** - Set your site name, enable features
3. **Invite users** - Share the URL or enable public signups
4. **Set up bots** - Connect Home Assistant automations

<div class="tip custom-block" style="padding-top: 8px">

New to HomeChat? Start with the [Installation Guide](/guide/installation) for detailed setup instructions.

</div>
