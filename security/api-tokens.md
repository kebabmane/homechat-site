# API Token Security

API tokens enable secure programmatic access to HomeChat.

## Token Architecture

API tokens use a secure design that balances usability with security:

```
Token format: hc_xxxxxxxx_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
              └── prefix ──┘ └────── random secret ────────┘
```

| Component | Storage | Purpose |
|-----------|---------|---------|
| Full token | Shown once | User authentication |
| Prefix (8 chars) | Plaintext | Token identification |
| Digest | bcrypt hash | Verification |

### Security Properties

- **One-time display** — Full token shown only at creation
- **Hashed storage** — Only bcrypt digest stored in database
- **Prefix identification** — Identify tokens without exposing secrets
- **Revocable** — Instantly deactivate compromised tokens

## Creating Tokens

### Via Admin Panel

1. Go to **Admin → Automations → API Tokens**
2. Enter a descriptive name
3. Click **Create Token**
4. **Copy the token immediately** (shown only once)

### Via Rails Console

```ruby
# Create token for admin user
token = ApiToken.create!(
  name: 'home-assistant',
  user: User.admin.first
)

# Display the raw token (only available now)
puts token.raw_token
# => hc_abc12345_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Using Tokens

### HTTP Header Authentication

```bash
curl -X POST https://chat.example.com/api/v1/channels/1/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello from API!"}'
```

### In Integrations

**Home Assistant:**
```yaml
# configuration.yaml
notify:
  - platform: rest
    name: homechat
    resource: https://chat.example.com/api/v1/channels/1/messages
    headers:
      Authorization: "Bearer YOUR_TOKEN"
```

**Python Script:**
```python
import requests

API_TOKEN = "hc_abc12345_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
BASE_URL = "https://chat.example.com/api/v1"

def send_message(channel_id, content):
    response = requests.post(
        f"{BASE_URL}/channels/{channel_id}/messages",
        headers={"Authorization": f"Bearer {API_TOKEN}"},
        json={"content": content}
    )
    return response.json()
```

## Token Management

### Best Practices

| Practice | Why |
|----------|-----|
| Unique tokens per integration | Easier revocation, better audit trail |
| Descriptive names | Know what each token is for |
| Regular rotation | Limits exposure time if compromised |
| Monitor usage | Detect suspicious activity |

### Naming Conventions

Use descriptive names that identify the purpose:

```
home-assistant-notifications
github-webhook
temperature-sensor-script
backup-automation
```

### Monitoring Usage

Track token activity in the admin panel:

- `last_used_at` — Last API request timestamp
- Request count (if audit logging enabled)
- IP addresses used

```ruby
# Find tokens unused in 30 days
ApiToken.where('last_used_at < ?', 30.days.ago)
        .or(ApiToken.where(last_used_at: nil))
```

## Token Rotation

Rotate tokens periodically (recommended: every 90 days).

### Rotation Process

```ruby
# 1. Create new token
new_token = ApiToken.create!(
  name: 'home-assistant-v2',
  user: User.admin.first
)
puts new_token.raw_token  # Configure in your integration

# 2. Test new token works

# 3. Deactivate old token
old_token = ApiToken.find_by(name: 'home-assistant')
old_token.update!(active: false)
```

### Zero-Downtime Rotation

1. Create new token with new name
2. Update integration to use new token
3. Verify new token works
4. Deactivate old token
5. Delete old token after grace period

## Revoking Tokens

### When to Revoke

Immediately revoke tokens when:

- Integration is decommissioned
- Token may be compromised
- Staff member leaves
- Suspicious activity detected

### How to Revoke

**Via Admin Panel:**
1. Go to **Admin → Automations → API Tokens**
2. Find the token by name/prefix
3. Click **Revoke**

**Via Console:**
```ruby
# Find by name
token = ApiToken.find_by(name: 'compromised-token')
token.update!(active: false)

# Or delete entirely
token.destroy
```

### Emergency: Revoke All Tokens

```ruby
# Deactivate all tokens
ApiToken.update_all(active: false)

# Users will need to create new tokens
```

## Security Considerations

### Storage

::: danger Never Store Tokens in Code
Never commit API tokens to version control. Use environment variables or secrets management.
:::

```bash
# Good: Environment variable
export HOMECHAT_TOKEN="hc_abc12345_xxx..."

# Bad: Hardcoded in script
API_TOKEN = "hc_abc12345_xxx..."  # DON'T DO THIS
```

### Transmission

- Always use HTTPS
- Never include tokens in URLs
- Use Authorization header

### Scope Limitation

Tokens inherit the permissions of the associated user:

| User Role | Token Capabilities |
|-----------|-------------------|
| Admin | Full API access |
| User | Standard API access |

::: tip Principle of Least Privilege
Create dedicated service users with minimal permissions for automation tokens.
:::

## Troubleshooting

### Token Not Working

1. **Check token is active:**
   ```ruby
   ApiToken.find_by(prefix: 'abc12345')&.active?
   ```

2. **Verify exact token value** — No extra spaces or newlines

3. **Check Authorization header format:**
   ```
   Authorization: Bearer hc_abc12345_xxx...
   ```

4. **Confirm HTTPS** — Tokens rejected over HTTP

### Token Appears Invalid

If you receive "Invalid token" errors:

- Token may have been revoked
- Token format may be malformed
- User associated with token may be locked
