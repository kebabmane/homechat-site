# Production Hardening

This guide covers security best practices for production HomeChat deployments.

## Production Checklist

### Server Security

- [ ] Non-root user for application
- [ ] Firewall configured (ufw/iptables)
- [ ] SSH key authentication only
- [ ] SSH password authentication disabled
- [ ] Automatic security updates enabled
- [ ] Unnecessary services disabled

### Application Security

- [ ] `RAILS_MASTER_KEY` secured and backed up
- [ ] HTTPS/SSL enabled with valid certificate
- [ ] Strong admin password set
- [ ] Sign-ups disabled after initial setup (if desired)
- [ ] API tokens rotated regularly

### Network Security

- [ ] HomeChat on private network or VPN
- [ ] Reverse proxy (nginx/Traefik) in front of app
- [ ] Rate limiting configured
- [ ] CORS properly configured for your domains

## HTTPS/SSL Configuration

### With Let's Encrypt (Kamal)

Kamal automatically handles SSL via Traefik:

```yaml
# config/deploy.yml
proxy:
  host: chat.example.com
  ssl: true  # Auto Let's Encrypt
```

### With Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name chat.example.com;

    ssl_certificate /etc/letsencrypt/live/chat.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chat.example.com/privkey.pem;

    # Strong SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Security Headers

HomeChat sets security headers in production:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking protection |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing prevention |
| `X-XSS-Protection` | `1; mode=block` | XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer control |

### Content Security Policy

Configure CSP for your deployment:

```ruby
# config/initializers/content_security_policy.rb
Rails.application.config.content_security_policy do |policy|
  policy.default_src :self
  policy.font_src    :self, :data
  policy.img_src     :self, :data, :blob
  policy.script_src  :self
  policy.style_src   :self, :unsafe_inline
  policy.connect_src :self, :wss
end
```

## Rate Limiting

HomeChat uses Rack::Attack for rate limiting:

### Default Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login attempts | 5 | 20 seconds |
| API requests | 300 | 5 minutes |
| Message creation | 60 | 1 minute |

### Configuration

Rate limiting is configured in `config/initializers/rack_attack.rb`:

```ruby
# Throttle login attempts
Rack::Attack.throttle('logins/ip', limit: 5, period: 20.seconds) do |req|
  req.ip if req.path == '/session' && req.post?
end

# Throttle API requests
Rack::Attack.throttle('api/ip', limit: 300, period: 5.minutes) do |req|
  req.ip if req.path.start_with?('/api/')
end
```

### Customizing Limits

For high-traffic deployments, adjust in environment config:

```ruby
# config/environments/production.rb
config.rack_attack_api_limit = 500
config.rack_attack_api_period = 5.minutes
```

## Secrets Management

### RAILS_MASTER_KEY

The master key encrypts all Rails credentials:

```bash
# Location
config/master.key

# NEVER commit to git (already in .gitignore)
# Back up securely
# Required for production deployment
```

**Backup the master key securely:**
- Password manager
- Encrypted cloud storage
- Hardware security module

### Environment Variables

For Docker/container deployments:

```yaml
environment:
  - RAILS_MASTER_KEY=your_key_here  # From config/master.key
  - SECRET_KEY_BASE=${SECRET_KEY_BASE}
```

::: danger Never Commit Secrets
Never commit secrets, keys, or passwords to version control.
:::

## Network Hardening

### Firewall Rules

**UFW (Ubuntu):**

```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable
```

### Docker Network Isolation

```yaml
services:
  homechat:
    networks:
      - frontend
      - backend

  # Internal services only on backend
  database:
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
```

## Audit Logging

HomeChat logs security-relevant events to the `audit_logs` table:

### Logged Events

| Action | Description |
|--------|-------------|
| `login` | Successful login |
| `login_failed` | Failed login attempt |
| `logout` | User logout |
| `password_change` | Password update |
| `2fa_enabled` | 2FA activation |
| `2fa_disabled` | 2FA deactivation |
| `api_token_created` | New API token |
| `api_token_revoked` | Token deactivation |
| `admin_action` | Admin panel actions |

### Viewing Logs

```ruby
# Recent security events
AuditLog.where(action: ['login', 'login_failed'])
        .order(created_at: :desc).limit(100)

# Failed logins by IP
AuditLog.where(action: 'login_failed')
        .group(:ip_address).count

# API token usage
AuditLog.where(action: 'api_request')
        .where('created_at > ?', 24.hours.ago)
```

### Log Retention

Consider implementing log rotation:

```ruby
# Clean logs older than 90 days
AuditLog.where('created_at < ?', 90.days.ago).delete_all
```

## Security Scanning

### Dependency Audit

```bash
# Check for vulnerable gems
bundle exec bundler-audit check --update

# Run before each deployment
```

### Static Analysis

```bash
# Security static analysis
bin/brakeman

# Check for common vulnerabilities
```

### Regular Updates

```bash
# Update dependencies
bundle update

# Check for security advisories
bundle exec bundler-audit
```

## Incident Response

### Signs of Compromise

- Unusual login patterns in audit logs
- API tokens used from unexpected IPs
- Spike in failed login attempts
- Unexpected admin actions

### Response Steps

1. **Contain** — Disable compromised accounts/tokens
2. **Investigate** — Review audit logs
3. **Eradicate** — Reset credentials, patch vulnerabilities
4. **Recover** — Restore from clean backup if needed
5. **Document** — Record incident and response

### Emergency Actions

```ruby
# Disable all API tokens
ApiToken.update_all(active: false)

# Lock all non-admin accounts
User.where.not(role: 'admin')
    .update_all(locked_until: 24.hours.from_now)

# Force all sessions to expire
# (requires session store configuration)
```

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Rails Security Guide](https://guides.rubyonrails.org/security.html)
- [Brakeman Documentation](https://brakemanscanner.org/)
- [bundler-audit](https://github.com/rubysec/bundler-audit)
