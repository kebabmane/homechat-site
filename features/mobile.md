# Mobile Apps

HomeChat offers native mobile apps for iOS and Android with push notifications.

## iOS App

Built with Swift for optimal performance.

### Installation

1. Download from the App Store (coming soon)
2. Or build from source: [homechat-ios](https://github.com/rhysevans/homechat-ios)

### Features

- Native SwiftUI interface
- Push notifications via APNs
- Background refresh
- QR code server setup
- Biometric authentication

### Connecting to Server

1. Open the HomeChat iOS app
2. Tap **Add Server**
3. Scan the QR code from your web dashboard
4. Or enter server URL manually

## Android App

Built with Kotlin for modern Android.

### Installation

1. Download from Google Play (coming soon)
2. Or build from source: [homechat-android](https://github.com/rhysevans/homechat-android)

### Features

- Material Design 3 interface
- Push notifications via FCM
- Background message sync
- QR code server setup
- Biometric authentication

### Connecting to Server

1. Open the HomeChat Android app
2. Tap **Add Server**
3. Scan the QR code from your web dashboard
4. Or enter server URL manually

## QR Code Setup

The easiest way to connect mobile apps.

### Generate QR Code

1. Sign in to HomeChat web
2. Go to **Settings → Mobile Setup**
3. A QR code appears with your server info

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

### Expiration

Setup QR codes expire after **10 minutes** for security. Refresh the page to generate a new one.

## Push Notifications

Receive notifications when:
- Someone mentions you
- You receive a direct message
- (Configurable) New messages in channels

### Server Configuration

Push notifications require Firebase Cloud Messaging (FCM).

In **Admin → Settings → Notifications**:

1. Create a Firebase project
2. Download the service account JSON
3. Enter the credentials:
   - Project ID
   - Client Email
   - Private Key
4. Enable push notifications

### Notification Privacy

- Notification content is sent through FCM
- Consider using generic notifications ("New message") for privacy
- All data is encrypted in transit

## Offline Support

### Cached Content

Mobile apps cache:
- Recent messages
- Channel list
- User profiles

### Sync on Reconnect

When connectivity returns:
1. App syncs new messages
2. Pending messages are sent
3. Read status is updated

## Troubleshooting

### Notifications Not Arriving

1. Check FCM is configured in server settings
2. Verify the app has notification permissions
3. Check the FCM token is registered

### Connection Issues

1. Verify the server URL is correct
2. Check SSL certificate validity
3. Ensure port 443 (or custom port) is accessible

### QR Code Not Scanning

1. Ensure good lighting
2. Hold phone steady
3. Try manual entry instead
