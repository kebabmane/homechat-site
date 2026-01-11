# API Authentication

HomeChat supports multiple authentication methods for different use cases.

## Authentication Methods

| Method | Use Case | Persistence |
|--------|----------|-------------|
| **API Token** | Bots, scripts, integrations | Long-lived |
| **Session Token** | Mobile apps | User session |
| **Cookie** | Web browser | Automatic |

## API Token Authentication

Best for: Bots, automation scripts, integrations.

### Obtaining a Token

See [API Token Security](/security/api-tokens) for creating tokens via the admin panel.

### Using the Token

```bash
# Authorization header (preferred)
curl -H "Authorization: Bearer hc_abc12345_xxx..." \
  https://chat.example.com/api/v1/channels

# X-API-Key header (alternative)
curl -H "X-API-Key: hc_abc12345_xxx..." \
  https://chat.example.com/api/v1/channels
```

### Token Format

```
hc_xxxxxxxx_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
└── prefix ──┘ └────── random secret ────────┘
```

## Session Authentication

Best for: Mobile apps and custom clients.

### Sign In

```http
POST /api/v1/signin
Content-Type: application/json

{
  "username": "johndoe",
  "password": "your-password"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "johndoe",
    "role": "user"
  },
  "token": "session-token-here"
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

### Two-Factor Authentication

If the user has 2FA enabled, you'll receive:

```json
{
  "success": false,
  "requires_2fa": true,
  "message": "Two-factor authentication required"
}
```

Submit the 2FA code:

```http
POST /api/v1/signin
Content-Type: application/json

{
  "username": "johndoe",
  "password": "your-password",
  "otp_code": "123456"
}
```

### Sign Up

```http
POST /api/v1/signup
Content-Type: application/json

{
  "username": "newuser",
  "password": "secure-password",
  "password_confirmation": "secure-password"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "user": {
    "id": 2,
    "username": "newuser",
    "role": "user"
  },
  "token": "session-token-here"
}
```

**Error Response (422):**

```json
{
  "success": false,
  "errors": [
    "Password is too short (minimum 8 characters)",
    "Username has already been taken"
  ]
}
```

::: info Signup Approval
If signup approval is enabled, new accounts require admin approval before the token is active.
:::

### Sign Out

```http
DELETE /api/v1/signout
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

## Using Session Tokens

After signing in, use the returned token for subsequent requests:

```bash
# Sign in
TOKEN=$(curl -s -X POST https://chat.example.com/api/v1/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"secret"}' | jq -r '.token')

# Use token
curl https://chat.example.com/api/v1/channels \
  -H "Authorization: Bearer $TOKEN"
```

## Mobile App Flow

Recommended authentication flow for mobile apps:

```
1. User enters credentials
   ↓
2. POST /api/v1/signin
   ↓
3. If requires_2fa: true
   → Show 2FA input
   → POST /api/v1/signin with otp_code
   ↓
4. Store token securely (Keychain/Keystore)
   ↓
5. Use token for all API requests
   ↓
6. Handle 401 → redirect to login
```

### Token Storage

| Platform | Recommendation |
|----------|----------------|
| iOS | Keychain Services |
| Android | EncryptedSharedPreferences |
| Web | HttpOnly cookie (automatic) |

::: danger Never Store in Plain Text
Never store tokens in UserDefaults, SharedPreferences, or localStorage.
:::

## QR Code Authentication

Mobile apps can authenticate via QR code scanned from the web dashboard.

### QR Code Contents

```json
{
  "url": "https://chat.example.com",
  "mode": "local",
  "ws": "wss://chat.example.com/cable",
  "token": "setup_token"
}
```

### Flow

1. User signs in to web dashboard
2. Goes to **Settings → Mobile Setup**
3. QR code displays with temporary setup token
4. Mobile app scans QR code
5. App extracts server URL and setup token
6. App exchanges setup token for session token
7. Setup token expires after 10 minutes

## Error Handling

### 401 Unauthorized

Token is invalid, expired, or missing:

```json
{
  "error": "Invalid or expired token"
}
```

**Actions:**
- Check token is included in header
- Verify token format is correct
- Token may have been revoked
- Session may have expired → re-authenticate

### 403 Forbidden

Token is valid but lacks permission:

```json
{
  "error": "You don't have permission to perform this action"
}
```

**Actions:**
- Check if endpoint requires admin role
- Verify user has access to the resource

### 429 Too Many Requests

Rate limited:

```json
{
  "error": "Rate limit exceeded. Try again in 60 seconds."
}
```

**Actions:**
- Implement exponential backoff
- Check `Retry-After` header
- Reduce request frequency
