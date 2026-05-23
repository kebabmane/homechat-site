# Webhooks

Webhooks allow external services to send messages to HomeChat channels.

## Overview

Webhooks are one-way: external services POST data to HomeChat. Each webhook has a unique URL and secret for signature verification.

```
POST /api/v1/webhooks/{webhook_id}
```

## Creating a Webhook

### Via Admin Panel

1. Go to **Admin → Bots**
2. Click **New Bot**
3. Select **Webhook** as the type
4. Enter a name and description
5. Click **Create**
6. Copy the webhook URL and secret from the bot details page

### Webhook Details

After creation, you receive:

| Field | Description |
|-------|-------------|
| Webhook URL | `https://chat.example.com/api/v1/webhooks/abc123` |
| Secret | Used for HMAC signature verification |

## Sending Webhook Requests

### Basic Signed Request

Webhook signatures are required. Unsigned requests are rejected.

```bash
WEBHOOK_URL="https://chat.example.com/api/v1/webhooks/abc123"
WEBHOOK_SECRET="your_webhook_secret"
PAYLOAD='{"action":"send_message","message":"Hello from webhook!","room_id":"home-assistant"}'
SIGNATURE=$(printf '%s' "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | cut -d' ' -f2)

curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d "$PAYLOAD"
```

### Payload Format

```json
{
  "action": "send_message",
  "room_id": "home-assistant",
  "message": "Hello from webhook!",
  "title": "Optional title"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `action` | Yes | Action to perform (`send_message`) |
| `message` | Yes | Message content |
| `room_id` | No | Target channel name. Missing values use `home-assistant` |
| `title` | No | Title prepended to the message |

## Signature Verification

Webhooks must include an HMAC-SHA256 signature.

### Signing Requests

Calculate the signature using your webhook secret:

```ruby
# Ruby
require 'openssl'

secret = "your_webhook_secret"
payload = '{"action":"send_message","message":"Hello!"}'

signature = OpenSSL::HMAC.hexdigest("SHA256", secret, payload)
# => "abc123..."
```

```python
# Python
import hmac
import hashlib

secret = b"your_webhook_secret"
payload = b'{"action":"send_message","message":"Hello!"}'

signature = hmac.new(secret, payload, hashlib.sha256).hexdigest()
```

```javascript
// Node.js
const crypto = require('crypto');

const secret = 'your_webhook_secret';
const payload = '{"action":"send_message","message":"Hello!"}';

const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');
```

### Including the Signature

Add the signature to the request header:

```bash
curl -X POST https://chat.example.com/api/v1/webhooks/abc123 \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=abc123..." \
  -d '{"action": "send_message", "message": "Hello!"}'
```

### Verification Process

HomeChat verifies webhooks by:

1. Extracting the signature from the `X-Hub-Signature-256` or `X-Signature-256` header
2. Computing HMAC-SHA256 of the raw request body
3. Comparing signatures using constant-time comparison
4. Rejecting requests with missing or invalid signatures

## Integration Examples

### GitHub Webhooks

Configure GitHub to send notifications to HomeChat only if you want the raw GitHub payload posted or you place a small signer/formatter in front of HomeChat:

1. Go to repo **Settings → Webhooks**
2. Add webhook URL from HomeChat
3. Set content type to `application/json`
4. Enter the webhook secret
5. Select events (push, PR, issues, etc.)

GitHub sends payloads like:

```json
{
  "action": "opened",
  "pull_request": {
    "title": "Add new feature",
    "user": { "login": "developer" }
  }
}
```

::: tip Format Upstream
HomeChat's webhook endpoint accepts generic signed JSON. For polished GitHub messages, transform the provider payload into HomeChat's `send_message` shape before forwarding it.
:::

### Home Assistant

Send notifications from Home Assistant automations:

```yaml
# configuration.yaml
rest_command:
  homechat_notify:
    url: "https://chat.example.com/api/v1/webhooks/abc123"
    method: POST
    headers:
      Content-Type: application/json
      X-Hub-Signature-256: >-
        sha256={{ (states.input_text.webhook_body.state |
                   hmac('your_secret', 'sha256')) }}
    payload: '{"action":"send_message","room_id":"home-assistant","message":"{{ message }}"}'
```

**Automation example:**

```yaml
automation:
  - alias: "Notify door opened"
    trigger:
      - platform: state
        entity_id: binary_sensor.front_door
        to: "on"
    action:
      - service: rest_command.homechat_notify
        data:
          message: "Front door opened!"
```

### Alertmanager

Prometheus Alertmanager does not sign webhook payloads by itself. Use a small relay that signs and forwards the Alertmanager payload to HomeChat.

```yaml
# alertmanager.yml
receivers:
  - name: 'homechat'
    webhook_configs:
      - url: 'https://relay.example.com/homechat-alertmanager'
        send_resolved: true
```

### Generic Webhook

Any service that can make HTTP POST requests:

```bash
#!/bin/bash
# notify.sh - Send notification to HomeChat

WEBHOOK_URL="https://chat.example.com/api/v1/webhooks/abc123"
SECRET="your_webhook_secret"
MESSAGE="$1"

PAYLOAD="{\"action\":\"send_message\",\"room_id\":\"home-assistant\",\"message\":\"$MESSAGE\"}"
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | cut -d' ' -f2)

curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d "$PAYLOAD"
```

## Error Responses

### 401 Unauthorized

Invalid webhook ID, inactive bot, or invalid/missing signature:

```json
{
  "error": "Invalid webhook signature"
}
```

### 404 Not Found

Unknown route:

```json
{
  "error": "Not found"
}
```

### 403 Forbidden

Bot/webhook attempted to post plaintext into an E2EE-enforced private or direct channel:

```json
{
  "code": "e2ee_bot_posting_forbidden"
}
```

## Rate Limiting

Webhooks are rate limited to prevent abuse:

| Limit | Value |
|-------|-------|
| Per webhook | 60 requests/minute |
| Per IP | 300 requests/5 minutes |

Exceeding limits returns `429 Too Many Requests`.

## Webhook Management

### Disabling a Webhook

1. Go to **Admin → Bots**
2. Find the webhook
3. Toggle **Active** to off

Disabled webhooks return `401 Unauthorized` as an invalid or inactive webhook.

### Rotating Secrets

If a webhook secret is compromised:

1. Go to **Admin → Bots**
2. Click the webhook
3. Click **Regenerate Secret**
4. Update the secret in your integration
5. Old secret is immediately invalidated

### Deleting a Webhook

1. Go to **Admin → Bots**
2. Click the webhook
3. Click **Delete**
4. Confirm deletion

::: warning Immediate Effect
Deletion is immediate. All requests to the webhook URL will fail.
:::
