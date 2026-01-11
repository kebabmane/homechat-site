# Channels & Direct Messages

HomeChat provides flexible communication options for your household.

## Channels

Channels are shared spaces for group conversations.

### Channel Types

| Type | Visibility | Join Method |
|------|------------|-------------|
| **Public** | Visible to all | Anyone can join |
| **Private** | Hidden | Invite only |

### Creating Channels

1. Click the **+** button next to "Channels"
2. Enter a channel name (2-50 characters)
3. Optionally add a description
4. Choose public or private
5. Click **Create Channel**

### Channel Features

- **Descriptions** — Explain the channel's purpose
- **Member List** — See who's in the channel
- **Leave/Join** — Manage your memberships
- **Invite** — Add users to private channels

### Use Cases

| Channel | Purpose |
|---------|---------|
| `#home` | General family chat (default) |
| `#security` | Motion alerts, door notifications |
| `#automations` | Home Assistant bot messages |
| `#kitchen` | Appliance status, timers |
| `#garage` | Vehicle arrival/departure |

## Direct Messages

DMs are private one-on-one conversations.

### Starting a DM

1. Click the **+** button next to "Direct Messages"
2. Search for the user
3. Click their name to start chatting

Alternatively, click any username in the app to start a DM.

### DM Privacy

- Only visible to the two participants
- Not accessible to administrators
- Persist until deleted

## Messaging Features

### Mentions

Notify someone by typing `@username`:

```
Hey @john, did you see the doorbell alert?
```

Mentioned users receive a notification.

### File Attachments

Attach files to messages:

- **Images** — JPEG, PNG, GIF, WebP
- **Documents** — PDF, text files
- **Size limit** — 10MB per file

### Message Search

Find messages across all channels:

1. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
2. Type your search query
3. Filter by channel or user

## Real-time Features

### Presence

See who's online:
- 🟢 **Online** — Active in the last 5 minutes
- ⚫ **Offline** — Not recently active

### Typing Indicators

See when others are typing in the current channel.

### Instant Updates

Messages appear instantly via WebSocket — no refresh needed.
