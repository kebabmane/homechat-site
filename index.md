---
layout: home

hero:
  name: HomeChat
  text: Self-hosted chat for Home Assistant
  tagline: Lightweight, secure, real-time messaging for your smart home
  image:
    src: /logo.svg
    alt: HomeChat
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/rhysevans/homechat

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
    title: Native Mobile Apps
    details: iOS and Android apps with push notifications via Firebase Cloud Messaging. PWA support for instant web installation.
  - icon: 🏠
    title: Home Assistant Native
    details: Purpose-built for Home Assistant users. Run as an add-on, integrate via webhooks, and control your smart home from chat.
  - icon: ⚡
    title: Lightweight & Fast
    details: Optimized for Raspberry Pi and low-power servers. SQLite database, Solid Cable for real-time, minimal resource usage.
---

## Why HomeChat?

HomeChat was built to solve a simple problem: **home automation needs a communication hub**.

Whether you want to receive alerts when someone's at the door, send commands to your devices, or just chat with family members about household tasks—HomeChat brings it all together in one self-hosted, privacy-respecting platform.

### Built for Home Assistant

Unlike generic chat applications, HomeChat is designed specifically for smart home enthusiasts:

- **Webhook bots** receive events from Home Assistant automations
- **API tokens** let your scripts post messages programmatically
- **AI bots** powered by LiteLLM can answer questions about your home
- **Mobile apps** keep you connected with push notifications

### Production Ready

HomeChat isn't a toy project. It's built with the same tools and practices used by professional Rails applications:

- **Rails 8** with Hotwire (Turbo + Stimulus)
- **SQLite** with Solid Queue and Solid Cable
- **Docker** and **Kamal** deployment options
- **Comprehensive security** hardening guide

<div class="tip custom-block" style="padding-top: 8px">

Ready to get started? Check out the [Installation Guide](/guide/installation) or dive into the [Features](/features/) to learn more.

</div>
