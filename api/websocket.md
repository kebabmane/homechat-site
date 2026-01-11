# WebSocket API

HomeChat uses ActionCable for real-time communication over WebSockets.

## Connection

### WebSocket URL

```
wss://chat.example.com/cable
```

For development:
```
ws://localhost:3000/cable
```

### Authentication

Include your API token as a query parameter:

```
wss://chat.example.com/cable?token=hc_abc12345_xxx...
```

## Channels

HomeChat provides several ActionCable channels:

| Channel | Purpose |
|---------|---------|
| `ChatChannel` | New messages in channels |
| `PresenceChannel` | User online/offline status |
| `TypingChannel` | Typing indicators |

## JavaScript Client

### Setup with ActionCable

```javascript
import { createConsumer } from "@rails/actioncable"

// Create consumer with authentication
const consumer = createConsumer(
  `wss://chat.example.com/cable?token=${apiToken}`
)
```

### Subscribe to Chat Messages

```javascript
const chatSubscription = consumer.subscriptions.create(
  { channel: "ChatChannel", channel_id: 1 },
  {
    connected() {
      console.log("Connected to ChatChannel")
    },

    disconnected() {
      console.log("Disconnected from ChatChannel")
    },

    received(data) {
      // Handle incoming message
      console.log("New message:", data)
      // data = { message: {...}, user: {...}, channel_id: 1 }
    }
  }
)
```

### Subscribe to Presence

```javascript
const presenceSubscription = consumer.subscriptions.create(
  { channel: "PresenceChannel" },
  {
    received(data) {
      // Handle presence update
      if (data.type === "user_online") {
        console.log(`${data.username} is online`)
      } else if (data.type === "user_offline") {
        console.log(`${data.username} went offline`)
      }
    }
  }
)
```

### Subscribe to Typing Indicators

```javascript
const typingSubscription = consumer.subscriptions.create(
  { channel: "TypingChannel", channel_id: 1 },
  {
    received(data) {
      if (data.type === "typing_start") {
        showTypingIndicator(data.username)
      } else if (data.type === "typing_stop") {
        hideTypingIndicator(data.username)
      }
    },

    // Send typing status
    startTyping() {
      this.perform("typing", { typing: true })
    },

    stopTyping() {
      this.perform("typing", { typing: false })
    }
  }
)
```

### Unsubscribe

```javascript
// Unsubscribe from a specific channel
chatSubscription.unsubscribe()

// Disconnect entirely
consumer.disconnect()
```

## Swift Client (iOS)

### Using ActionCableClient

```swift
import ActionCableClient

class ChatService {
    let client: ActionCableClient
    var chatChannel: Channel?

    init(serverURL: URL, token: String) {
        var urlComponents = URLComponents(url: serverURL, resolvingAgainstBaseURL: false)!
        urlComponents.queryItems = [URLQueryItem(name: "token", value: token)]

        client = ActionCableClient(url: urlComponents.url!)
        client.connect()
    }

    func subscribeToChannel(id: Int) {
        chatChannel = client.create(
            "ChatChannel",
            identifier: ["channel_id": id]
        )

        chatChannel?.onReceive = { data, error in
            if let messageData = data as? [String: Any] {
                // Handle incoming message
                print("Received: \(messageData)")
            }
        }

        chatChannel?.subscribe()
    }
}
```

## Kotlin Client (Android)

### Using ActionCable Kotlin

```kotlin
import com.vinted.actioncable.client.kotlin.*

class ChatService(serverUrl: String, token: String) {
    private val uri = URI("$serverUrl/cable?token=$token")
    private val consumer = Consumer(uri)

    fun subscribeToChannel(channelId: Int) {
        val channel = Channel("ChatChannel", mapOf("channel_id" to channelId))

        val subscription = consumer.subscriptions.create(channel)

        subscription.onReceived = { data ->
            // Handle incoming message
            println("Received: $data")
        }

        subscription.onConnected = {
            println("Connected to channel $channelId")
        }

        consumer.connect()
    }
}
```

## Message Formats

### ChatChannel Messages

**New message received:**

```json
{
  "type": "message",
  "message": {
    "id": 123,
    "content": "Hello everyone!",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "user": {
    "id": 1,
    "username": "johndoe",
    "avatar_initials": "J"
  },
  "channel_id": 1
}
```

**Message deleted:**

```json
{
  "type": "message_deleted",
  "message_id": 123,
  "channel_id": 1
}
```

### PresenceChannel Messages

**User came online:**

```json
{
  "type": "user_online",
  "user_id": 1,
  "username": "johndoe"
}
```

**User went offline:**

```json
{
  "type": "user_offline",
  "user_id": 1,
  "username": "johndoe",
  "last_seen_at": "2024-01-15T10:35:00Z"
}
```

### TypingChannel Messages

**User started typing:**

```json
{
  "type": "typing_start",
  "user_id": 1,
  "username": "johndoe",
  "channel_id": 1
}
```

**User stopped typing:**

```json
{
  "type": "typing_stop",
  "user_id": 1,
  "username": "johndoe",
  "channel_id": 1
}
```

## Sending Actions

Some channels support sending actions back to the server:

### Send Typing Status

```javascript
typingSubscription.perform("typing", { typing: true })
```

### Mark Messages Read

```javascript
chatSubscription.perform("mark_read", { up_to_message_id: 123 })
```

## Connection Management

### Handling Disconnects

```javascript
consumer.subscriptions.create("ChatChannel", {
  disconnected() {
    // Show "reconnecting" UI
    showReconnectingBanner()
  },

  connected() {
    // Hide banner, refresh data
    hideReconnectingBanner()
    refreshMessages()
  }
})
```

### Manual Reconnection

```javascript
// Disconnect
consumer.disconnect()

// Reconnect
consumer.connect()
```

### Connection States

| State | Description |
|-------|-------------|
| `pending` | Connection not yet attempted |
| `connected` | WebSocket connected |
| `disconnected` | WebSocket disconnected |

## Error Handling

### Authentication Errors

If the token is invalid:

```json
{
  "type": "disconnect",
  "reason": "unauthorized",
  "reconnect": false
}
```

### Subscription Rejected

If you try to subscribe to a channel you don't have access to:

```javascript
subscription.onRejected = () => {
  console.log("Subscription rejected - no access")
}
```

## Best Practices

### Reconnection Strategy

```javascript
let reconnectAttempts = 0
const maxReconnectAttempts = 10
const reconnectDelay = (attempt) => Math.min(1000 * Math.pow(2, attempt), 30000)

consumer.disconnected(() => {
  if (reconnectAttempts < maxReconnectAttempts) {
    setTimeout(() => {
      reconnectAttempts++
      consumer.connect()
    }, reconnectDelay(reconnectAttempts))
  }
})

consumer.connected(() => {
  reconnectAttempts = 0
})
```

### Memory Management

```javascript
// Clean up subscriptions when leaving a view
componentWillUnmount() {
  this.chatSubscription?.unsubscribe()
  this.presenceSubscription?.unsubscribe()
}
```

### Mobile Considerations

- Disconnect WebSocket when app backgrounds
- Reconnect when app foregrounds
- Use push notifications for background message delivery
- Handle network transitions gracefully
