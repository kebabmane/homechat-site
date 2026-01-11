# Bot Integrations

HomeChat supports multiple bot types for automation and integration.

## Bot Types

| Type | Description | Best For |
|------|-------------|----------|
| **Webhook** | Receives HTTP POST requests | External service notifications |
| **API** | Uses REST API with tokens | Custom scripts, integrations |
| **AI** | LLM-powered conversational | Q&A, assistants |

## Webhook Bots

Webhook bots receive events from external services.

### Creating a Webhook Bot

1. Go to **Admin → Automations**
2. Click **New Bot**
3. Select "Webhook" as the type
4. Enter a name and description
5. Click **Create**
6. Copy the webhook URL

### Webhook URL Format

```
POST /api/v1/webhooks/{webhook_id}
```

### Payload Format

```json
{
  "action": "send_message",
  "channel_id": 1,
  "content": "Hello from webhook!"
}
```

### Authentication

Webhooks use HMAC-SHA256 signature verification:

```http
POST /api/v1/webhooks/abc123
Content-Type: application/json
X-Hub-Signature-256: sha256={signature}

{"action": "send_message", ...}
```

Calculate the signature:

```ruby
signature = OpenSSL::HMAC.hexdigest(
  "SHA256",
  webhook_secret,
  request_body
)
```

### Example: GitHub Webhook

Configure GitHub to send notifications to HomeChat:

1. Go to repo **Settings → Webhooks**
2. Add webhook URL from HomeChat
3. Set content type to `application/json`
4. Enter the webhook secret
5. Select events to receive

## API Bots

API bots use standard REST API with token authentication.

### Creating an API Token

1. Go to **Admin → Automations → API Tokens**
2. Enter a descriptive name
3. Click **Create Token**
4. Copy the token immediately (shown once)

### Using the Token

```bash
curl -X POST https://chat.example.com/api/v1/channels/1/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello from API!"}'
```

### Example: Python Script

```python
import requests

API_TOKEN = "your_token_here"
BASE_URL = "https://chat.example.com/api/v1"

def send_message(channel_id, content):
    response = requests.post(
        f"{BASE_URL}/channels/{channel_id}/messages",
        headers={"Authorization": f"Bearer {API_TOKEN}"},
        json={"content": content}
    )
    return response.json()

send_message(1, "Temperature is 72°F")
```

## AI Bots

AI bots use LLMs to respond to messages.

### Prerequisites

- LiteLLM proxy server running
- API key configured in HomeChat settings

### Creating an AI Bot

1. Go to **Admin → Automations**
2. Click **New AI Bot**
3. Configure:
   - **Name** — Bot's display name
   - **Instructions** — System prompt
   - **Model** — LLM model to use
4. Click **Create**
5. Activate the bot

### System Prompt Example

```
You are a helpful home assistant bot. You can answer questions about:
- Home automation routines
- Device status and controls
- Weather and scheduling

Be concise and friendly. If you don't know something, say so.
```

### Triggering AI Bots

AI bots respond when:
- Mentioned with `@botname`
- Sent a direct message

### LiteLLM Configuration

In **Admin → Settings → AI**:

```
LiteLLM Host: http://localhost:4000
API Key: sk-your-key
Default Model: gpt-4
```

## Bot Permissions

Bots can only:
- Send messages to channels they're added to
- Respond to mentions and DMs
- Access public channel messages

Bots cannot:
- Access private channels (unless explicitly added)
- Modify user accounts
- Change server settings
