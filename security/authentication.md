# Authentication

HomeChat provides secure authentication with multiple protection layers.

## Password Authentication

### Password Hashing

HomeChat uses bcrypt for password hashing:

```ruby
# Passwords are hashed with bcrypt (cost factor 12)
has_secure_password
```

**Best Practices:**
- Require strong passwords (8+ characters)
- Use unique passwords for HomeChat
- Consider a password manager

### Password Requirements

| Requirement | Default |
|-------------|---------|
| Minimum length | 8 characters |
| Maximum length | 72 characters (bcrypt limit) |

### Password Reset

Forgot your password? Use the reset flow:

1. Click **Forgot Password** on login page
2. Enter your email address
3. Check email for reset link
4. Click link within 2 hours
5. Set new password

Reset tokens expire after 2 hours and are single-use.

## Two-Factor Authentication

HomeChat supports TOTP-based 2FA for enhanced security.

### Setting Up 2FA

1. Go to **Settings → Security**
2. Click **Enable Two-Factor Authentication**
3. Scan the QR code with your authenticator app:
   - Google Authenticator
   - Authy
   - 1Password
   - Microsoft Authenticator
4. Enter the 6-digit code to verify
5. **Save your backup codes securely**

### Using 2FA

After enabling 2FA:

1. Enter your username and password
2. Enter the 6-digit code from your authenticator app
3. Codes refresh every 30 seconds

### Backup Codes

When you enable 2FA, you receive one-time backup codes:

- 10 single-use codes provided
- Each code can only be used once
- Store in a secure location (password manager, safe)
- Use if you lose access to your authenticator

### Recovering 2FA

If you lose your authenticator:

1. Use a backup code to log in
2. Disable 2FA in settings
3. Re-enable with new authenticator

If you've lost backup codes too, contact an administrator to reset your account.

::: tip Admin Accounts
Admin accounts should always have 2FA enabled for maximum security.
:::

## Account Lockout

Failed login attempts trigger automatic lockout:

| Attempts | Action |
|----------|--------|
| 5 | Account locked for 30 minutes |
| 10 | Account locked for 2 hours |
| 15+ | Account locked for 24 hours |

### Lockout Protection

Lockout protects against:
- Brute force attacks
- Credential stuffing
- Password guessing

### Unlocking Accounts

**Self-service:**
- Wait for lockout period to expire
- Use password reset if needed

**Administrator:**
```ruby
# Find locked user
user = User.find_by(email: 'user@example.com')

# Check lockout status
user.locked_until  # => timestamp or nil

# Unlock manually
user.update!(
  locked_until: nil,
  failed_attempts: 0
)
```

## Session Management

### Session Security

Sessions are secured with:

- HttpOnly cookies (no JavaScript access)
- Secure flag (HTTPS only)
- SameSite attribute (CSRF protection)
- Encrypted session data

### Session Duration

| Setting | Value |
|---------|-------|
| Session timeout | 2 weeks (idle) |
| Remember me | 30 days |
| Absolute timeout | 30 days |

### Viewing Active Sessions

View your active sessions in **Settings → Security**:

- Device/browser information
- IP address
- Last activity
- Location (approximate)

### Revoking Sessions

To log out other sessions:

1. Go to **Settings → Security**
2. View active sessions
3. Click **Revoke** on any session
4. Or **Revoke All** to log out everywhere

## Signup and Approval

### Open Signup

By default, anyone can create an account:

```ruby
# In admin settings
allow_signups: true
```

### Approval Workflow

Enable approval for new accounts:

1. Go to **Admin → Settings → Security**
2. Enable **Require Signup Approval**
3. New users see "Pending Approval" after signup
4. Admins approve in **Admin → Users**

### Invitations

For private instances, disable signups and use invitations:

1. Disable open signups
2. Create user accounts manually in admin panel
3. Send credentials or reset links to users

## OAuth (Future)

OAuth integration is planned for future releases:

- Google
- GitHub
- OIDC providers

Follow the [roadmap](https://github.com/rhysevans/homechat) for updates.
