# Home Assistant Integration

Connect HomeChat with Home Assistant for smart home notifications and automation.

## Overview

```
┌─────────────────┐    API/Webhooks    ┌─────────────────┐
│                 │ ←───────────────→  │                 │
│  Home Assistant │                    │    HomeChat     │
│                 │    Notifications   │  (Rails App)    │
│   Integration   │ ───────────────→   │                 │
└─────────────────┘                    └─────────────────┘
```

**Features:**
- Send HA notifications to HomeChat channels
- HomeChat messages trigger HA automations
- Bot commands for interactive control
- Rich message formatting with priorities

## Prerequisites

- Home Assistant running (Core, Supervised, or OS)
- HomeChat deployed (addon or Docker)
- Network connectivity between both systems
- Admin access to both systems

## Option 1: Home Assistant Add-on

The easiest setup for Home Assistant OS/Supervised users.

### Install the Add-on

1. Navigate to **Settings → Add-ons → Add-on Store**
2. Click ⋮ → **Repositories**
3. Add: `https://github.com/rhysevans/homechat-addon`
4. Find "HomeChat" and click **Install**

### Configure

```yaml
site_name: "My Home Chat"
allow_signups: true
port: 3000
enable_integrations: true
auto_create_api_token: true
home_assistant_integration: true
```

### Get API Token

Start the add-on and check the logs for the auto-generated API token.

## Option 2: Docker Alongside HA

For users running Home Assistant Core or preferring separate containers.

### Docker Compose

```yaml
version: '3.8'
services:
  homechat:
    image: ghcr.io/kebabmane/homechat:latest
    ports:
      - "3000:3000"
    environment:
      - RAILS_ENV=production
      - ENABLE_INTEGRATIONS=true
      - AUTO_CREATE_API_TOKEN=true
      - HOME_ASSISTANT_INTEGRATION=true
    volumes:
      - homechat_data:/data
      - homechat_storage:/app/storage
    restart: unless-stopped

volumes:
  homechat_data:
  homechat_storage:
```

## Install HA Integration

### 1. Copy Integration Files

```bash
# Download to your HA config directory
<ha_config>/custom_components/homechat/
```

### 2. Restart Home Assistant

### 3. Add Integration

1. Go to **Settings → Devices & Services**
2. Click **Add Integration**
3. Search for "HomeChat"
4. Enter connection details:
   - **Host**: `localhost` or HomeChat IP
   - **Port**: `3000`
   - **SSL**: `false` (for local)
   - **API Token**: From HomeChat admin or logs

## Usage Examples

### Basic Notification

```yaml
service: notify.homechat
data:
  message: "Doorbell pressed"
```

### With Channel Target

```yaml
service: notify.homechat
data:
  message: "Motion detected in living room"
  title: "Security Alert"
  target: "security"
  data:
    priority: "high"
```

### Automation Example

```yaml
automation:
  - alias: "Doorbell Notification"
    trigger:
      - platform: state
        entity_id: binary_sensor.doorbell
        to: "on"
    action:
      - service: notify.homechat
        data:
          message: "Someone is at the door!"
          target: "home"
```

### With Camera Snapshot

```yaml
automation:
  - alias: "Motion with Snapshot"
    trigger:
      - platform: state
        entity_id: binary_sensor.motion_front
        to: "on"
    action:
      - service: camera.snapshot
        target:
          entity_id: camera.front_door
        data:
          filename: /config/www/snapshot.jpg
      - service: notify.homechat
        data:
          message: "Motion detected at front door"
          data:
            image: "/local/snapshot.jpg"
```

## Webhook Bots

Create a webhook bot in HomeChat for two-way communication.

### Create Bot

1. Go to **Admin → Automations**
2. Click **New Bot**
3. Select "Webhook" type
4. Copy the webhook URL

### Trigger from HA

```yaml
rest_command:
  homechat_webhook:
    url: "http://homechat:3000/api/v1/webhooks/YOUR_WEBHOOK_ID"
    method: POST
    headers:
      Content-Type: application/json
      X-Hub-Signature-256: "sha256={{ webhook_signature }}"
    payload: '{"action": "send_message", "channel_id": 1, "content": "{{ message }}"}'
```

## Troubleshooting

### Connection Refused

- Verify HomeChat is running: `curl http://localhost:3000/up`
- Check network connectivity between HA and HomeChat
- Ensure the port is correct (default: 3000)

### Invalid Token

- Regenerate the API token in HomeChat admin
- Update the integration configuration

### Messages Not Appearing

- Check the target channel exists
- Verify the bot/token has permission to post
- Review HomeChat logs for errors
