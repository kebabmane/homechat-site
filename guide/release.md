# Release Checklist

Use this checklist before publishing a coordinated HomeChat stack release.

## Versioning

- Run `scripts/version-check.sh` from the workspace root and confirm all alignment rules pass.
- Update component versions in their owning repositories.
- Update the compatibility matrix when any client, API, integration, add-on, bot, or docs version changes.
- Tag each released repository with the component version after CI passes.

## API Contract

- Update `homechat/api-contracts/openapi.yaml` before or alongside backend controller changes.
- Regenerate `homechat/api-contracts/openapi.json`.
- Regenerate mobile DTOs with `homechat/scripts/generate-mobile-dtos.sh`.
- Confirm generated Android and iOS DTOs have no drift after regeneration.
- Add or update controller response schema tests for changed endpoints.

## CI Gates

- Rails: tests, lint, security scans, API contract validation, and cross-repo mobile contract checks.
- iOS: repo-local build/test workflow plus Rails cross-repo contract checks.
- Android: unit tests, lint, debug build, and Firebase Test Lab instrumentation checks.
- macOS: Swift tests and local `.app` bundle build.
- Home Assistant integration: pytest.
- Home Assistant add-on: container build and GHCR publish workflow.
- Bot gem: RSpec and RuboCop.
- Docs site: VitePress build and GitHub Pages deployment.

## Release Order

1. Merge Rails API and OpenAPI contract changes.
2. Merge generated DTO and networking updates in iOS and Android.
3. Merge macOS compatibility changes when the desktop client is affected.
4. Merge Home Assistant integration and add-on updates.
5. Merge bot updates if public/plaintext automation contracts changed.
6. Merge docs updates last so published guidance matches the released stack.
7. Create tags and release notes for each changed repository.

## E2EE Disclosure

Release notes must keep E2EE limitations explicit:

- E2EE covers message content only; server-visible metadata remains visible.
- Web E2EE depends on trusted app delivery.
- Device identity is trust-on-first-use until out-of-band verification is added.
- Attachments are not E2EE in private/DM channels yet.
- Bots, webhooks, and Home Assistant automations are not E2EE participants.
