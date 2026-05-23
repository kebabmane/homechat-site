# Compatibility Matrix

HomeChat uses the Rails API version as the primary compatibility contract. Clients should check `/api/v1/server_info` on launch and compare the server `api_version` against the API major version they support.

## Current Versions

| Component | Version | Repository |
|-----------|---------|------------|
| Rails API | 1.0.1 | [kebabmane/homechat](https://github.com/kebabmane/homechat) |
| API contract | 1.0.0 | [kebabmane/homechat](https://github.com/kebabmane/homechat/tree/main/api-contracts) |
| iOS app | 1.0.1 | [kebabmane/homechat-ios](https://github.com/kebabmane/homechat-ios) |
| Android app | 1.0.1 | [kebabmane/homechat-android](https://github.com/kebabmane/homechat-android) |
| macOS app | 0.1.0 | [kebabmane/homechat-macos](https://github.com/kebabmane/homechat-macos) |
| Home Assistant integration | 1.2.2 | [kebabmane/homechat-integration](https://github.com/kebabmane/homechat-integration) |
| Home Assistant add-on | 1.0.27 | [kebabmane/homechat-addon](https://github.com/kebabmane/homechat-addon) |
| Bot gem | 0.1.0 | [kebabmane/homechat-bot](https://github.com/kebabmane/homechat-bot) |
| Docs site | 1.0.0 | [kebabmane/homechat-site](https://github.com/kebabmane/homechat-site) |

## Compatibility Rules

- iOS app 1.0.x requires Rails API >= 1.0.0.
- Android app 1.0.x requires Rails API >= 1.0.0.
- macOS app 0.1.x targets Rails API 1.0.x while it catches up to mobile parity.
- Home Assistant integration 1.2.x requires Rails API >= 1.0.0.
- Home Assistant add-on should track the integration closely; patch-level drift is acceptable.
- Bot gem 0.1.x is internal automation tooling and should use public/plaintext automation channels unless it becomes a full E2EE client.

## API Version Negotiation

The Rails API exposes version data from both `GET /api/v1/server_info` and `GET /api/v1/health`:

```json
{
  "api_version": "1.0.0",
  "min_client_version": "1.0.0",
  "capabilities": ["chat", "api", "webhooks", "realtime"]
}
```

Clients should:

1. Query `server_info` during startup or sign-in.
2. Treat a missing `api_version` field as compatible for older servers.
3. Treat network errors during the check as non-blocking.
4. Show an update alert when the server API major version differs from the client-supported API major version.
5. Use `capabilities` and E2EE capability fields to gate feature availability.

## Breaking Change Policy

- Patch releases (`x.x.X`) must remain backward-compatible.
- Minor releases (`x.X.x`) may add endpoints or fields while old clients continue to work.
- Major releases (`X.x.x`) may remove or change endpoints and require coordinated client updates.
- Breaking API changes must update the OpenAPI contract, generated client DTOs, compatibility matrix, and migration notes in the same release.
