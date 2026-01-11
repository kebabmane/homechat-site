# Security Overview

HomeChat is designed with security as a core principle. Self-hosting ensures your data stays on your hardware.

## Security Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Data Ownership** | All data stored on your infrastructure |
| **Defense in Depth** | Multiple security layers |
| **Secure Defaults** | Security enabled out of the box |
| **Transparency** | Open source for auditing |

## Built-in Protections

### Authentication

- **BCrypt Password Hashing** — Industry-standard hashing with cost factor 12
- **Two-Factor Authentication** — TOTP-based 2FA support
- **Account Lockout** — Automatic lockout after failed attempts
- **Session Management** — Secure, HttpOnly cookies

### API Security

- **Token-Based Auth** — BCrypt-hashed API tokens
- **HMAC Webhooks** — SHA256 signature verification
- **Rate Limiting** — Rack::Attack protection
- **Scope Restrictions** — Tokens limited to specific actions

### Network Security

- **HTTPS Enforced** — TLS encryption for all traffic
- **Security Headers** — CSP, HSTS, X-Frame-Options
- **WebSocket Security** — Secure WSS connections
- **CORS Configuration** — Controlled cross-origin access

## Security Features

### For Users

- **Strong Password Requirements** — Minimum 8 characters
- **2FA Setup** — Authenticator app integration
- **Session Visibility** — View and revoke active sessions
- **Password Reset** — Secure email-based recovery

### For Administrators

- **Audit Logging** — Track security events
- **API Token Management** — Create, rotate, revoke tokens
- **User Lockout Control** — Manage locked accounts
- **Signup Approval** — Optional approval workflow

## Compliance Considerations

HomeChat supports common security requirements:

| Requirement | Support |
|-------------|---------|
| Encrypted at Rest | SQLite with optional encryption |
| Encrypted in Transit | TLS 1.2+ required |
| Access Logging | Audit log for all actions |
| Password Policy | Configurable requirements |
| MFA | TOTP-based 2FA |

## Security Updates

Stay informed about security updates:

1. Watch the [GitHub repository](https://github.com/rhysevans/homechat) for releases
2. Subscribe to security advisories
3. Run `bundle exec bundler-audit` before updates
4. Review changelog for security fixes

::: warning Keep Updated
Always run the latest HomeChat version. Security patches are released as soon as vulnerabilities are discovered and fixed.
:::

## Reporting Vulnerabilities

If you discover a security vulnerability:

1. **Do not** open a public GitHub issue
2. Email security details to the maintainers
3. Include steps to reproduce
4. Allow time for a fix before disclosure

## Further Reading

- [Production Hardening](/security/hardening) — Complete security checklist
- [Authentication](/security/authentication) — Auth methods and 2FA
- [API Token Security](/security/api-tokens) — Token best practices
