---
layout: home

hero:
  name: HomeChat
  text: Self-hosted chat for households and teams
  tagline: Offline-first, secure, real-time messaging for your home network and automations
  image:
    src: /logo.svg
    alt: HomeChat
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/kebabmane/homechat

features:
  - icon: 💬
    title: Real-time Messaging
    details: Channels, direct messages, and mentions with WebSocket-powered live updates. Built on Rails 8 with Hotwire for a snappy, responsive experience.
  - icon: 🤖
    title: Bot Integrations
    details: Webhook, API, and AI-powered bots for Home Assistant automation. Receive alerts, send commands, and integrate with any service.
  - icon: 🔒
    title: Self-Hosted & Secure
    details: Your data stays on your hardware. Two-factor authentication, bcrypt-hashed API tokens, rate limiting, and security headers built-in.
  - icon: 📱
    title: Native Clients
    details: iOS, Android, and macOS clients share the same API contract, E2EE model, and server discovery flow.
  - icon: 🏠
    title: Home Assistant Ready
    details: Run as an add-on, integrate via webhooks, and bring smart home notifications into the same private chat system.
  - icon: ⚡
    title: Lightweight & Fast
    details: Optimized for Raspberry Pi and low-power servers. SQLite database, Solid Cable for real-time, minimal resource usage.
---

## Why HomeChat?

HomeChat was built to solve a simple problem: **private homes and small teams need a communication hub that works on their own network**.

Whether you want to chat with family, coordinate household tasks, receive alerts when someone's at the door, or send commands to devices, HomeChat brings it together in one self-hosted, privacy-respecting platform.

### Built for Local Automation

Unlike generic chat applications, HomeChat is designed for local-first communication and smart home workflows:

- **Webhook bots** receive events from Home Assistant automations
- **API tokens** let your scripts post messages programmatically
- **AI bots** powered by LiteLLM can answer questions about your home
- **Mobile apps** keep you connected with push notifications

### Release Ready

HomeChat is split into focused repositories with CI, API contract checks, and an explicit version compatibility policy:

- **Rails 8** backend with Hotwire, SQLite, Solid Queue, and Solid Cable
- **OpenAPI contract** for backend-to-client compatibility
- **Native clients** for iOS, Android, and macOS
- **Home Assistant packaging** through the integration and supervised add-on
- **Release matrix** covering API, clients, add-on, bot, and docs versions

<div class="tip custom-block" style="padding-top: 8px">

Ready to get started? Check out the [Installation Guide](/guide/installation), or review the [Compatibility Matrix](/guide/compatibility) before upgrading an existing stack.

</div>
