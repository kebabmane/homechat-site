# API Overview

HomeChat provides a RESTful API for integration with mobile apps, bots, and external services.

## Base URL

```
https://your-homechat-instance.com/api/v1
```

All API endpoints are prefixed with `/api/v1`.

## Authentication Methods

| Method | Use Case | Header |
|--------|----------|--------|
| **Bearer Token** | API integrations | `Authorization: Bearer <token>` |
| **X-API-Key** | Alternative header | `X-API-Key: <token>` |
| **Session** | Web app (automatic) | Cookie-based |

```bash
# Bearer token (preferred)
curl -H "Authorization: Bearer hc_abc12345_xxx..." \
  https://chat.example.com/api/v1/channels

# X-API-Key alternative
curl -H "X-API-Key: hc_abc12345_xxx..." \
  https://chat.example.com/api/v1/channels
```

## Response Format

All responses return JSON:

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "error": "Error message describing the issue"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request — Invalid parameters |
| `401` | Unauthorized — Invalid or missing token |
| `403` | Forbidden — Insufficient permissions |
| `404` | Not Found — Resource doesn't exist |
| `422` | Unprocessable Entity — Validation failed |
| `429` | Too Many Requests — Rate limited |
| `500` | Internal Server Error |

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 300 requests | 5 minutes |
| Login | 5 attempts | 20 seconds |
| Signup | 3 attempts | 1 hour |
| Messages | 30 messages | 1 minute |

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 295
```

## Quick Examples

### List Channels

```bash
curl -X GET https://chat.example.com/api/v1/channels \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Send a Message

```bash
curl -X POST https://chat.example.com/api/v1/channels/1/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello from the API!"}'
```

### Health Check

```bash
curl https://chat.example.com/api/v1/health
```

```json
{ "status": "ok" }
```

## API Sections

| Section | Description |
|---------|-------------|
| [Authentication](/api/authentication) | Sign in, sign up, tokens |
| [Endpoints](/api/endpoints) | Full REST API reference |
| [Webhooks](/api/webhooks) | Incoming webhook integration |
| [WebSocket](/api/websocket) | Real-time ActionCable API |

## SDKs & Libraries

### Official

- **iOS SDK** — Built into the [iOS app](https://github.com/rhysevans/homechat-ios)
- **Android SDK** — Built into the [Android app](https://github.com/rhysevans/homechat-android)

### Community

Contributions welcome! Create libraries for your language and submit a PR.

### Example: Python

```python
import requests

class HomeChatClient:
    def __init__(self, base_url, token):
        self.base_url = base_url.rstrip('/')
        self.headers = {"Authorization": f"Bearer {token}"}

    def get_channels(self):
        r = requests.get(f"{self.base_url}/api/v1/channels",
                         headers=self.headers)
        return r.json()

    def send_message(self, channel_id, content):
        r = requests.post(
            f"{self.base_url}/api/v1/channels/{channel_id}/messages",
            headers=self.headers,
            json={"content": content}
        )
        return r.json()

# Usage
client = HomeChatClient("https://chat.example.com", "hc_xxx...")
client.send_message(1, "Hello from Python!")
```
