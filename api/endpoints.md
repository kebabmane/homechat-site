# REST API Endpoints

Complete reference for the current HomeChat API v1 routes.

All authenticated endpoints require:

```http
Authorization: Bearer <token>
```

## Discovery & Health

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/v1/health` | No | Basic API health, API version, minimum client version, push support |
| `GET` | `/api/v1/server_info` | No | Server name, mode, capabilities, WebSocket path, E2EE flags, registration status |
| `GET` | `/api/v1/metrics/health` | No | Lightweight metrics health check |
| `GET` | `/api/v1/metrics` | Admin | Detailed JSON or Prometheus metrics |

### Health Response

```json
{
  "status": "ok",
  "timestamp": "2026-05-23T10:30:00Z",
  "version": "1.0.0",
  "api_version": "1.0.0",
  "min_client_version": "1.0.0",
  "service": "HomeChat",
  "push_enabled": true
}
```

### Server Info Response

```json
{
  "server_name": "HomeChat on home-server",
  "version": "1.0.1",
  "mode": "local",
  "capabilities": ["chat", "api", "webhooks", "realtime"],
  "websocket_path": "/cable",
  "push_enabled": true,
  "api_version": "1.0.0",
  "min_client_version": "1.0.0",
  "e2ee_enabled": true,
  "e2ee_required_private_dm": true,
  "min_e2ee_version": "1",
  "registration_enabled": true
}
```

## Authentication

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/v1/signin` | Sign in with username/password |
| `POST` | `/api/v1/signin/verify_2fa` | Complete 2FA sign-in |
| `POST` | `/api/v1/signup` | Create an account when registration is enabled |
| `DELETE` | `/api/v1/signout` | Revoke the current session |
| `POST` | `/api/v1/auth/refresh` | Refresh an API session token |
| `GET` | `/api/v1/auth/sessions` | List current user's sessions |
| `DELETE` | `/api/v1/auth/sessions/:id` | Revoke a session |

## Current User

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v1/me` | Current user profile |
| `PATCH` | `/api/v1/me` | Update profile |
| `POST` | `/api/v1/me/change_password` | Change password |
| `DELETE` | `/api/v1/me/avatar` | Remove avatar |

## Two-Factor Authentication

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v1/2fa/status` | Current 2FA status |
| `POST` | `/api/v1/2fa/setup` | Start TOTP setup |
| `POST` | `/api/v1/2fa/verify` | Verify and enable TOTP |
| `POST` | `/api/v1/2fa/disable` | Disable TOTP |
| `GET` | `/api/v1/2fa/backup_codes` | Get backup codes |
| `POST` | `/api/v1/2fa/regenerate_backup_codes` | Regenerate backup codes |

## Channels

### List Channels

```http
GET /api/v1/channels
Authorization: Bearer <token>
```

Returns public channels and private channels accessible to the current user. Direct message channels are listed separately under `/api/v1/dm/channels`.

### Create Channel

```http
POST /api/v1/channels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "announcements",
  "description": "Important announcements",
  "channel_type": "public"
}
```

Use `channel_type: "private"` for invite-only channels. The creator is automatically added as a member.

### Channel Actions

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/v1/channels/:id/join` | Join an accessible public channel |
| `DELETE` | `/api/v1/channels/:id/leave` | Leave a channel |
| `GET` | `/api/v1/channels/:id/members` | List channel members |
| `POST` | `/api/v1/channels/:id/mark_as_read` | Mark channel messages read |

## Messages

### List Messages

```http
GET /api/v1/messages?channel_id=<channel_id>&limit=50
Authorization: Bearer <token>
```

If `channel_id` is omitted, the endpoint returns messages from channels accessible to the current user.

### Create Message by Room Name

Useful for API integrations and Home Assistant-style room targets:

```http
POST /api/v1/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hello world!",
  "room_id": "general"
}
```

If `room_id` is missing, HomeChat falls back to a default channel such as `home`, `general`, or `home-assistant`.

### Create Message by Channel ID

```http
POST /api/v1/channels/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hello world!"
}
```

For private channels and direct messages, clients must send the E2EE metadata required by the server:

```json
{
  "message": {
    "content": "[encrypted]",
    "content_encoding": "e2ee",
    "encrypted_content": "base64...",
    "content_hmac": "base64...",
    "sender_key_fingerprint": "fingerprint",
    "device_id": "device-id",
    "e2ee_version": "1"
  }
}
```

### Delete Message

```http
DELETE /api/v1/messages/:id
Authorization: Bearer <token>
```

Users can delete their own messages. Admins can delete any message.

## Direct Messages

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v1/dm/channels` | List current user's DM conversations |
| `POST` | `/api/v1/dm/start` | Start or fetch a DM channel by username |
| `POST` | `/api/v1/users/:id/messages` | Send a DM to a user ID |

### Start DM

```http
POST /api/v1/dm/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "jane"
}
```

### Send DM

```http
POST /api/v1/users/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hello!"
}
```

Direct messages are E2EE-enforced. Current first-party clients send encrypted payloads and sender device metadata.

## File Attachments

### Upload Media

```http
POST /api/v1/channels/:id/media
Authorization: Bearer <token>
Content-Type: multipart/form-data

caption=Photo from the kitchen
files[]=@/path/to/image.jpg
```

Attachments are disabled for E2EE-enforced private channels and direct messages until encrypted file support lands.

## Search

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v1/search?q=<query>` | Search users, channels, and plaintext messages |
| `GET` | `/api/v1/users/search?q=<query>` | Search users only |

Search requires at least two characters. Encrypted message content is not server-searchable.

## Push Notifications

| Method | Path | Purpose |
|--------|------|---------|
| `PUT` | `/api/v1/fcm_token` | Register or update the current user's FCM token |
| `DELETE` | `/api/v1/fcm_token` | Remove the current user's FCM token |

```http
PUT /api/v1/fcm_token
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "fcm-token"
}
```

## Bots

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v1/bots` | List bots |
| `POST` | `/api/v1/bots` | Create a bot |
| `GET` | `/api/v1/bots/:id` | Show a bot |
| `PATCH` | `/api/v1/bots/:id` | Update a bot |
| `DELETE` | `/api/v1/bots/:id` | Delete a bot |
| `GET` | `/api/v1/bots/:id/status` | Bot status |
| `POST` | `/api/v1/bots/:id/activate` | Activate bot |
| `POST` | `/api/v1/bots/:id/deactivate` | Deactivate bot |

Webhook delivery uses `/api/v1/webhooks/:webhook_id`; see [Webhooks](/api/webhooks).

## E2EE Key Management

| Method | Path | Purpose |
|--------|------|---------|
| `PUT` | `/api/v1/me/hmac_key` | Store wrapped HMAC key metadata |
| `GET` | `/api/v1/me/hmac_key` | Fetch current user's wrapped HMAC key |
| `PUT` | `/api/v1/me/e2ee_key` | Publish this device's E2EE public key bundle |
| `GET` | `/api/v1/users/:id/e2ee_key` | Fetch a user's E2EE device keys |
| `GET` | `/api/v1/channels/:id/e2ee_keys` | Fetch channel member E2EE keys |
| `POST` | `/api/v1/channels/:id/key_shares` | Submit encrypted channel key shares |
| `GET` | `/api/v1/channels/:id/key_shares/me` | Fetch current user's key share |
| `POST` | `/api/v1/channels/:id/rotate_key` | Rotate a channel key |
| `GET` | `/api/v1/channels/:id/key_rotation_status` | Check key rotation status |
| `POST` | `/api/v1/channels/:id/acknowledge_rotation` | Acknowledge key rotation |

## Pagination

Message list responses include pagination data:

```json
{
  "messages": [],
  "has_more": true,
  "oldest_id": 51
}
```

| Parameter | Description |
|-----------|-------------|
| `limit` | Items per page, default `50`, max `100` |
