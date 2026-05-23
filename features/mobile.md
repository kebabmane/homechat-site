# Native Clients

HomeChat has native iOS, Android, and macOS clients that share the Rails API v1 contract, server discovery flow, and private-channel/direct-message E2EE model.

## iOS App

Built with SwiftUI and Apple system frameworks.

### Installation

1. App Store distribution is not published yet.
2. Build from source: [homechat-ios](https://github.com/kebabmane/homechat-ios)

### Features

- Native SwiftUI interface
- mDNS/Bonjour server discovery and manual server setup
- Sign in, sign up, 2FA, and pending-approval handling
- Channels, direct messages, media upload, and settings
- Private-channel and DM E2EE with X25519/Ed25519/AES-GCM
- TOFU certificate pinning
- Core Data offline cache and background sync helpers
- Biometric app lock
- Push/local notification coordination with generic server push content

### Requirements

- iOS 17.0+
- Xcode 15.0+
- Swift 5.0

## Android App

Built with Kotlin, Jetpack Compose, Room, Hilt, and Material 3.

### Installation

1. Google Play distribution is not published yet.
2. Build from source: [homechat-android](https://github.com/kebabmane/homechat-android)

### Features

- Material 3 Compose interface
- mDNS server discovery and manual URL setup
- Sign in, sign up, 2FA, pending approval, and registration-disabled handling
- Channel lists, direct messages, messaging, search, settings, and profile screens
- ActionCable-compatible realtime sync with reconnect and persistence helpers
- Private-channel and DM E2EE utilities with local key handling
- SQLCipher-backed local database support
- Firebase Cloud Messaging token registration and notification privacy settings
- API compatibility check against `/api/v1/server_info`

### Requirements

- Android Studio with Java 17
- Android SDK 31+ minimum, target SDK 36
- HomeChat API v1 server

## macOS App

Built with SwiftUI as a Swift Package executable.

### Installation

Build from source: [homechat-macos](https://github.com/kebabmane/homechat-macos)

```bash
swift run
```

To produce a local `.app` bundle:

```bash
./Scripts/build-app.sh
open .build/HomeChatMac.app
```

### Current Scope

- Server URL configuration with `/api/v1/server_info` check
- Username/password sign-in and 2FA verification
- Keychain persistence for server URL, username, API token, device keys, and channel keys
- Channel sidebar and message timeline
- Plaintext public-channel messaging
- Private-channel and DM E2EE using the shared X25519/Ed25519/AES-GCM protocol

Media upload, push notifications, and offline persistence are intentionally left for later parity work with the iOS client.

### Requirements

- macOS 14+
- Xcode command line tools with Swift 6+

## QR Code Setup

The easiest way to connect mobile apps is from the web app:

1. Sign in to HomeChat web.
2. Go to **Settings -> Mobile Setup**.
3. Scan the QR code from the native app, or copy the server URL manually.

### QR Code Contents

The QR code encodes:

```json
{
  "url": "https://chat.example.com",
  "mode": "local",
  "ws": "wss://chat.example.com/cable",
  "token": "setup_token"
}
```

## Push Notifications

Server push notifications are powered by Firebase Cloud Messaging (FCM). HomeChat keeps server-sent push content generic for privacy; detailed previews are generated locally by clients when available.

Receive notifications when:

- Someone mentions you
- You receive a direct message
- A configured channel message should alert you

### Server Configuration

In **Admin -> Settings -> Notifications**:

1. Create a Firebase project.
2. Download a service account JSON.
3. Enter:
   - Project ID
   - Client Email
   - Private Key
4. Enable push notifications.

The server advertises push support through `/api/v1/server_info` and `/api/v1/health` with `push_enabled`.

### Notification Privacy

- Server push payloads should stay generic, such as "New message".
- Private-channel and direct-message content may be E2EE and should not be sent through push providers as plaintext.
- Clients can suppress duplicate local and push alerts when WebSocket delivery is active.

## Offline Support

Native clients cache recent app state and sync after reconnect. Current offline depth differs by platform:

| Client | Current Offline Scope |
|--------|-----------------------|
| iOS | Core Data message/channel cache and background sync helpers |
| Android | Room cache, SQLCipher support, reconnect sync, cleanup workers |
| macOS | Online-first; offline persistence is planned |

## Troubleshooting

### Notifications Not Arriving

1. Check FCM is enabled and configured in server settings.
2. Verify the app has notification permissions.
3. Confirm the client registered a token with `/api/v1/fcm_token`.
4. Check `/api/v1/server_info` returns `"push_enabled": true`.

### Connection Issues

1. Verify the server URL is correct.
2. Use HTTPS for public or remote servers.
3. LAN HTTP is acceptable for local development and trusted private networks.
4. Check that `/api/v1/server_info` is reachable from the device.

### QR Code Not Scanning

1. Ensure good lighting.
2. Hold phone steady.
3. Try manual server URL entry instead.
