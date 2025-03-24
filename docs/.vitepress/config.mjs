import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WP Block to HTML",
  description: "Convert WordPress blocks to framework-agnostic HTML",
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
          text: 'Advanced Features',
          items: [
            { text: 'SSR Optimizations', link: '/guide/ssr-optimizations' },
            { text: 'Lazy Loading Media', link: '/guide/lazy-loading' },
            { text: 'Bundle Size Optimization', link: '/guide/bundle-size' }
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
            { text: 'TypeScript Reference', link: '/api/typescript' }
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
      { icon: 'github', link: 'https://github.com/yourusername/wp-block-to-html' }
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