# HomeChat Documentation Site

Static documentation site for HomeChat, built with VitePress.

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
cd homechat-site
npm install
```

### Local Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build

```bash
npm run build
```

Output in `.vitepress/dist/`

### Preview Build

```bash
npm run preview
```

## Deployment

### Static Hosting (S3, Netlify, Vercel)

1. Build the site:
   ```bash
   npm run build
   ```

2. Deploy the `.vitepress/dist/` directory

### S3 Deployment

```bash
aws s3 sync .vitepress/dist/ s3://your-bucket-name --delete
```

### CloudFront Invalidation

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

## Structure

```
homechat-site/
├── .vitepress/
│   ├── config.mts      # Site configuration
│   └── theme/
│       ├── index.ts    # Theme setup
│       └── custom.css  # Custom styles
├── public/
│   └── logo.svg        # Site logo
├── index.md            # Homepage
├── guide/              # Getting started & deployment
├── features/           # Feature documentation
├── security/           # Security documentation
└── api/                # API reference
```

## Content

### Adding Pages

1. Create a `.md` file in the appropriate directory
2. Add frontmatter if needed:
   ```yaml
   ---
   title: Page Title
   description: Page description
   ---
   ```
3. Add to sidebar in `.vitepress/config.mts` if needed

### Markdown Features

VitePress supports:

- GitHub-flavored markdown
- Code syntax highlighting
- Custom containers (`::: tip`, `::: warning`, `::: danger`)
- Tables
- Table of contents (`[[toc]]`)

### Custom Containers

```md
::: tip
Helpful tip here
:::

::: warning
Warning message
:::

::: danger
Critical warning
:::

::: info
Informational note
:::
```

## Customization

### Theme Colors

Edit `.vitepress/theme/custom.css`:

```css
:root {
  --vp-c-brand-1: #2563eb;  /* Primary */
  --vp-c-brand-2: #3b82f6;  /* Hover */
  --vp-c-brand-3: #60a5fa;  /* Active */
}
```

### Logo

Replace `public/logo.svg` with your logo.

### Navigation

Edit `nav` in `.vitepress/config.mts`:

```typescript
nav: [
  { text: 'Guide', link: '/guide/' },
  { text: 'Features', link: '/features/' },
  // Add more...
]
```

### Sidebar

Edit `sidebar` in `.vitepress/config.mts`:

```typescript
sidebar: {
  '/guide/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/guide/' },
        // Add more...
      ]
    }
  ]
}
```

## License

MIT
