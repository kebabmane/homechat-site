# Features Overview

HomeChat is a full-featured chat application built specifically for smart home enthusiasts.

## Core Features

### Real-time Messaging

- **Channels** — Public and private group conversations
- **Direct Messages** — One-on-one private chats
- **Mentions** — `@username` notifications
- **File Attachments** — Images, documents, and more
- **Message Search** — Find messages across all channels

### User Management

- **Role-based Access** — Admin and user roles
- **Two-Factor Authentication** — TOTP-based 2FA
- **Account Lockout** — Protection against brute force
- **Approval Workflow** — Optional signup approval

### Mobile & PWA

- **Native iOS App** — Swift-based with push notifications
- **Native Android App** — Kotlin-based with FCM
- **Progressive Web App** — Install directly from browser
- **QR Code Setup** — Easy mobile app configuration

## Integration Features

### Bot System

HomeChat supports three types of bots:

| Type | Use Case | How It Works |
|------|----------|--------------|
| **Webhook** | Receive external events | HTTP POST to unique URL |
| **API** | Custom integrations | REST API with token auth |
| **AI** | Conversational assistants | LiteLLM-powered responses |

### Home Assistant

- **Native Add-on** — Install directly in HA
- **Notification Service** — Send alerts to channels
- **Webhook Integration** — Trigger automations from chat
- **mDNS Discovery** — Auto-discovery on local network

### API Access

- **REST API** — Full CRUD operations
- **WebSocket** — Real-time message streaming
- **Token Authentication** — Secure API access
- **Webhook Signatures** — HMAC-SHA256 verification

## Technical Features

### Performance

- **SQLite Database** — No external dependencies
- **Solid Cable** — Redis-free WebSocket support
- **Asset Pipeline** — Propshaft with Importmap
- **Low Memory** — Runs on 512MB RAM

### Security

- **BCrypt Tokens** — Hashed API tokens
- **Rate Limiting** — Rack::Attack protection
- **CSP Headers** — Content Security Policy
- **Secure Cookies** — HttpOnly, Secure flags

### Deployment

- **Docker** — Single-container deployment
- **Kamal** — Zero-downtime deploys
- **Home Assistant** — Add-on support
- **Raspberry Pi** — ARM64 compatible

## Feature Comparison

| Feature | HomeChat | Slack | Discord |
|---------|----------|-------|---------|
| Self-hosted | ✅ | ❌ | ❌ |
| HA Integration | ✅ | ❌ | ❌ |
| Free | ✅ | Freemium | Freemium |
| SQLite | ✅ | ❌ | ❌ |
| AI Bots | ✅ | ✅ | ✅ |
| 2FA | ✅ | ✅ | ✅ |
| Mobile Apps | ✅ | ✅ | ✅ |

<div class="tip custom-block" style="padding-top: 8px">

Explore specific features in the sidebar or dive into the [Security](/security/) and [API](/api/) documentation.

</div>
