import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WP Block to HTML v1.0.0",
  description: "Convert WordPress blocks to framework-agnostic HTML with client-side hydration - v1.0.0 stable release",
  base: '/',
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Frameworks', link: '/frameworks/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Content Handling Modes', link: '/guide/content-handling-modes' },
            { text: 'Block Transformers', link: '/guide/custom-transformers' },
            { text: 'CSS Framework Integration', link: '/guide/css-frameworks' }
          ]
        },
        {
          text: 'v1.0.0 Features',
          items: [
            { text: '🆕 Client-Side Hydration', link: '/guide/hydration' },
            { text: 'Framework Components', link: '/guide/framework-components' },
            { text: 'Server-Side Rendering', link: '/guide/server-side-rendering' },
            { text: 'Performance Optimization', link: '/guide/performance' }
          ]
        },
        {
          text: 'Advanced Features',
          items: [
            { text: 'SSR Optimizations', link: '/guide/ssr-optimizations' },
            { text: 'Lazy Loading Media', link: '/guide/lazy-loading' },
            { text: 'Bundle Size Optimization', link: '/guide/bundle-size' },
            { text: 'Plugin System', link: '/guide/plugins' }
          ]
        },
        {
          text: 'Migration Guides',
          items: [
            { text: 'WordPress to Headless', link: '/guide/migration-guide' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Core Functions', link: '/api/core-functions' },
            { text: 'Configuration Options', link: '/api/configuration' }
          ]
        },
        {
          text: 'Developer Documentation',
          items: [
            { text: 'Developer Overview', link: '/api/developer' },
            { text: 'Internal Architecture', link: '/api/internal-architecture' },
            { text: 'Plugin Development', link: '/api/plugin-development' },
            { text: 'Contribution Guidelines', link: '/api/contribution-guidelines' },
            { text: 'Performance Optimization', link: '/api/performance-optimization' },
            { text: 'Testing Guide', link: '/api/testing-guide' }
          ]
        },
        {
          text: 'Block Handlers',
          items: [
            { text: 'Text Blocks', link: '/api/blocks/text' },
            { text: 'Media Blocks', link: '/api/blocks/media' },
            { text: 'Layout Blocks', link: '/api/blocks/layout' }
          ]
        },
        {
          text: 'TypeScript',
          items: [
            { text: 'TypeScript Reference', link: '/api/typescript' },
            { text: 'Interfaces', link: '/api/typescript/interfaces' },
            { text: 'Types', link: '/api/typescript/types' }
          ]
        }
      ],
      '/frameworks/': [
        {
          text: 'Framework Integration',
          items: [
            { text: 'Overview', link: '/frameworks/' },
            { text: 'React', link: '/frameworks/react' },
            { text: 'Vue', link: '/frameworks/vue' },
            { text: 'Next.js', link: '/frameworks/nextjs' },
            { text: 'Gatsby', link: '/frameworks/gatsby' },
            { text: 'Svelte', link: '/frameworks/svelte' },
            { text: 'Angular', link: '/frameworks/angular' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Basic Examples', link: '/examples/' },
            { text: 'CSS Framework Examples', link: '/examples/css-frameworks' },
            { text: 'Advanced Examples', link: '/examples/advanced' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/madebyaris/wp-block-to-html' },
      { icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20.1 13.2c.1-.1.1-.2.1-.4 0-.2 0-.3-.1-.4l-2.4-4.1c-.1-.1-.2-.2-.4-.2s-.3.1-.4.2l-2.4 4.1c-.1.1-.1.2-.1.4s0 .3.1.4l2.4 4.1c.1.1.2.2.4.2s.3-.1.4-.2l2.4-4.1zm-8.1 0c.1-.1.1-.2.1-.4 0-.2 0-.3-.1-.4L9.6 8.3c-.1-.1-.2-.2-.4-.2s-.3.1-.4.2L6.4 12.4c-.1.1-.1.2-.1.4s0 .3.1.4l2.4 4.1c.1.1.2.2.4.2s.3-.1.4-.2L12 13.2z"/></svg>' }, link: 'https://www.npmjs.com/package/wp-block-to-html' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present'
    }
  }
}) 