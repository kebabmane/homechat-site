import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'HomeChat',
  description: 'Self-hosted chat for Home Assistant',

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }]
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Features', link: '/features/' },
      { text: 'Security', link: '/security/' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        },
        {
          text: 'Deployment',
          items: [
            { text: 'Docker', link: '/guide/docker' },
            { text: 'Kamal', link: '/guide/kamal' },
            { text: 'Home Assistant', link: '/guide/home-assistant' }
          ]
        }
      ],
      '/features/': [
        {
          text: 'Features',
          items: [
            { text: 'Overview', link: '/features/' },
            { text: 'Channels & DMs', link: '/features/channels' },
            { text: 'Bot Integrations', link: '/features/bots' },
            { text: 'Mobile Apps', link: '/features/mobile' },
            { text: 'PWA Support', link: '/features/pwa' }
          ]
        }
      ],
      '/security/': [
        {
          text: 'Security',
          items: [
            { text: 'Overview', link: '/security/' },
            { text: 'Hardening Guide', link: '/security/hardening' },
            { text: 'Authentication', link: '/security/authentication' },
            { text: 'API Tokens', link: '/security/api-tokens' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'REST Endpoints', link: '/api/endpoints' },
            { text: 'Webhooks', link: '/api/webhooks' },
            { text: 'WebSocket', link: '/api/websocket' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/rhysevans/homechat' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present HomeChat'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/rhysevans/homechat/edit/main/homechat-site/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
