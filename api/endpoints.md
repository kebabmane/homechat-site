# REST API Endpoints

Complete reference for HomeChat REST API endpoints.

## Channels

### List Channels

Get all channels the user has access to.

```http
GET /api/v1/channels
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "channels": [
    {
      "id": 1,
      "name": "general",
      "description": "General discussion",
      "type": "public",
      "member_count": 10,
      "online_member_count": 3,
      "last_message": {
        "id": 100,
        "content": "Hello!",
        "created_at": "2024-01-15T10:30:00Z",
        "user": {
          "id": 1,
          "username": "johndoe"
        }
      },
      "unread_count": 0,
      "is_member": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Channel

```http
GET /api/v1/channels/:id
Authorization: Bearer <token>
```

### Create Channel

```http
POST /api/v1/channels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "announcements",
  "description": "Important announcements",
  "private": false
}
```

### Join Channel

```http
POST /api/v1/channels/:id/join
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Successfully joined channel"
}
```

### Leave Channel

```http
DELETE /api/v1/channels/:id/leave
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Successfully left channel"
}
```

### Get Channel Members

```http
GET /api/v1/channels/:id/members
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "members": [
    {
      "id": 1,
      "username": "johndoe",
      "is_online": true,
      "status": "Available",
      "last_seen_at": "2024-01-15T10:30:00Z",
      "avatar_url": null,
      "avatar_initials": "J",
      "avatar_color_index": 3
    }
  ]
}
```

## Messages

### List Messages

Get messages from a channel with pagination.

```http
GET /api/v1/messages?channel=<channel_name>&limit=50&before=<message_id>
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `channel` | Yes | Channel name |
| `limit` | No | Max messages (default: 50) |
| `before` | No | Get messages before this ID |

**Response (200):**

```json
{
  "messages": [
    {
      "id": 1,
      "content": "Hello world!",
      "created_at": "2024-01-15T10:30:00Z",
      "user": {
        "id": 1,
        "username": "johndoe"
      },
      "channel_id": 1,
      "files": []
    }
  ]
}
```

### Create Message

Send a message to a channel.

```http
POST /api/v1/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hello world!",
  "room": "general"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": {
    "id": 101,
    "content": "Hello world!",
    "created_at": "2024-01-15T10:35:00Z"
  }
}
```

### Create Message (Channel Endpoint)

Alternative endpoint using channel ID.

```http
POST /api/v1/channels/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello world!"
}
```

### Send Direct Message

Send a private message to a user.

```http
POST /api/v1/users/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Private message content"
}
```

## Users

### Get Current User

```http
GET /api/v1/me
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "id": 1,
  "username": "johndoe",
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Search Users

```http
GET /api/v1/users/search?q=<query>
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "users": [
    {
      "id": 1,
      "username": "johndoe",
      "is_online": true
    }
  ]
}
```

### Get User Profile

```http
GET /api/v1/users/:id
Authorization: Bearer <token>
```

## Search

### Global Search

Search across users, channels, and messages.

```http
GET /api/v1/search?q=<query>
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `q` | Yes | Search query (min 2 chars) |

**Response (200):**

```json
{
  "users": [
    {
      "id": 1,
      "username": "johndoe",
      "is_online": true,
      "avatar_initials": "J"
    }
  ],
  "channels": [
    {
      "id": 1,
      "name": "general",
      "type": "public",
      "is_member": true
    }
  ],
  "messages": [
    {
      "id": 50,
      "content": "Message containing query...",
      "created_at": "2024-01-15T10:00:00Z",
      "user": { "id": 1, "username": "johndoe" },
      "channel": { "id": 1, "name": "general" }
    }
  ],
  "totalResults": 10
}
```

## Health & Metrics

### Health Check

No authentication required.

```http
GET /api/v1/health
```

**Response (200):**

```json
{
  "status": "ok"
}
```

### Basic Metrics

No authentication required.

```http
GET /api/v1/metrics/health
```

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "Homechat",
  "environment": "production"
}
```

### Detailed Metrics

Admin authentication required.

```http
GET /api/v1/metrics
Authorization: Bearer <admin-token>
```

**Response (200):**

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "application": {
    "name": "Homechat",
    "environment": "production",
    "ruby_version": "3.3.0",
    "rails_version": "8.0.2"
  },
  "users": {
    "total": 100,
    "admins": 2,
    "online": 15
  },
  "channels": {
    "total": 20,
    "active_today": 10
  },
  "messages": {
    "total": 5000,
    "today": 150
  }
}
```

**Prometheus Format:**

```http
GET /api/v1/metrics
Accept: text/plain
Authorization: Bearer <admin-token>
```

Returns metrics in Prometheus exposition format for monitoring systems.

## Direct Messages

### List DM Conversations

```http
GET /api/v1/direct_messages
Authorization: Bearer <token>
```

### Get DM Conversation

```http
GET /api/v1/direct_messages/:user_id
Authorization: Bearer <token>
```

### Send Direct Message

```http
POST /api/v1/direct_messages/:user_id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello!"
}
```

## File Attachments

### Upload File

```http
POST /api/v1/channels/:id/messages
Authorization: Bearer <token>
Content-Type: multipart/form-data

content=Message with file
files[]=@/path/to/image.jpg
```

### Supported File Types

| Type | Extensions | Max Size |
|------|------------|----------|
| Images | jpg, png, gif, webp | 10MB |
| Documents | pdf, txt | 10MB |

## Pagination

Endpoints that return lists support cursor-based pagination:

```http
GET /api/v1/messages?channel=general&limit=50&before=100
```

| Parameter | Description |
|-----------|-------------|
| `limit` | Items per page (default: 50, max: 100) |
| `before` | Get items before this ID |
| `after` | Get items after this ID |

**Response includes pagination info:**

```json
{
  "messages": [...],
  "has_more": true,
  "oldest_id": 51
}
```
