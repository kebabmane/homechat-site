# Progressive Web App

HomeChat can be installed as a PWA directly from your browser.

## What is a PWA?

A Progressive Web App provides an app-like experience:
- Install directly from browser
- Works offline (limited)
- Appears in app launcher
- No app store required

## Installation

### iOS Safari

1. Open HomeChat in Safari
2. Tap the **Share** button
3. Select **Add to Home Screen**
4. Tap **Add**

### Android Chrome

1. Open HomeChat in Chrome
2. Tap the **menu** (⋮)
3. Select **Install app** or **Add to Home Screen**
4. Tap **Install**

### Desktop Chrome/Edge

1. Open HomeChat
2. Click the **install icon** in the address bar
3. Click **Install**

## PWA Features

### Standalone Mode

When installed, HomeChat:
- Opens in its own window
- Hides browser UI
- Shows in taskbar/dock

### Offline Support

Basic offline functionality:
- View cached messages
- Queue messages for sending
- Show offline indicator

Full features require internet connection.

### Push Notifications

PWA supports web push notifications:
- Requires HTTPS
- User must grant permission
- Works in background

## Admin Configuration

Customize PWA settings in **Admin → Settings → PWA**:

| Setting | Description | Default |
|---------|-------------|---------|
| Enable PWA | Allow installation | `true` |
| Short Name | Home screen label | `HomeChat` |
| Theme Color | Toolbar color | `#2563eb` |
| Background Color | Splash screen | `#ffffff` |
| Display Mode | App appearance | `standalone` |

### Display Modes

| Mode | Description |
|------|-------------|
| `standalone` | App-like, no browser UI |
| `minimal-ui` | Minimal browser controls |
| `fullscreen` | Full screen, no UI |
| `browser` | Normal browser tab |

## Custom Icons

Replace default icons:

```
/public/icon.png   # 512x512 PNG
/public/icon.svg   # SVG for high-res
```

Icons should be square with transparent background.

## Service Worker

HomeChat uses a service worker for:
- Caching static assets
- Offline page fallback
- Background sync (future)

### Cache Strategy

- **App Shell** — Cached for offline use
- **API Responses** — Network-first, cache fallback
- **Images** — Cache-first with network update

## Limitations

PWA vs Native Apps:

| Feature | PWA | Native |
|---------|-----|--------|
| Push Notifications | ✅ (with limits) | ✅ |
| Background Sync | Limited | ✅ |
| Offline Messages | View only | Full sync |
| Biometric Auth | ❌ | ✅ |
| QR Scanner | ❌ | ✅ |

::: tip When to Use PWA
PWA is great for:
- Quick access from desktop
- Users who prefer not to install apps
- Secondary devices

For the best mobile experience, use the native apps.
:::

## Troubleshooting

### Install Button Not Showing

- Ensure HTTPS is enabled
- Check the manifest is valid
- Clear browser cache

### Notifications Not Working

- Grant notification permission
- Check browser notification settings
- Verify HTTPS is enabled

### PWA Not Updating

Clear the service worker cache:
1. Open DevTools → Application
2. Click **Service Workers**
3. Click **Unregister**
4. Refresh the page
