import { defineConfig } from 'vitepress'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import { sitemap } from 'vite-plugin-sitemap'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WP Block to HTML",
  description: "Convert WordPress blocks to framework-agnostic HTML or framework-specific components with advanced optimization features",
  base: '/',
  ignoreDeadLinks: true,
  lastUpdated: true,
  
  // SEO optimizations
  lang: 'en-US',
  head: [
    // Google Search Console verification
    ['meta', { name: 'google-site-verification', content: 'z22g2gK0FXnAQPKx2lZdwGzJ4VssZYWjZDON_oJTgss' }],
    
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'author', content: 'Aris Setiawan' }],
    ['meta', { name: 'keywords', content: 'wordpress, gutenberg, blocks, headless, html, react, vue, nextjs, gatsby, tailwind, bootstrap' }],
    
    // Open Graph / Facebook
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'WP Block to HTML - Convert WordPress Blocks to HTML with Ease' }],
    ['meta', { property: 'og:description', content: 'A powerful utility for converting WordPress block data to framework-agnostic HTML or framework-specific components with advanced optimization features.' }],
    ['meta', { property: 'og:image', content: 'https://docs-block.madebyaris.com/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://docs-block.madebyaris.com/' }],
    
    // Twitter
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@arisberikut' }],
    ['meta', { name: 'twitter:creator', content: '@arisberikut' }],
    ['meta', { name: 'twitter:title', content: 'WP Block to HTML - Convert WordPress Blocks to HTML with Ease' }],
    ['meta', { name: 'twitter:description', content: 'A powerful utility for converting WordPress block data to framework-agnostic HTML or framework-specific components with advanced optimization features.' }],
    ['meta', { name: 'twitter:image', content: 'https://docs-block.madebyaris.com/twitter-card.png' }],
    
    // Favicon
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    
    // Canonical URL
    ['link', { rel: 'canonical', href: 'https://docs-block.madebyaris.com/' }],
  ],
  
  // Improve page title format
  titleTemplate: ':title | WP Block to HTML',
  
  // Use sitemap plugin
  vite: {
    plugins: [
      sitemap({
        hostname: 'https://docs-block.madebyaris.com',
        lastmod: new Date(),
        changefreq: 'weekly',
        priority: 0.7,
        exclude: ['/404.html']
      })
    ]
  },
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Frameworks', link: '/frameworks/' },
      { 
        text: 'Hire Me',
        link: 'https://madebyaris.com/contact',
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Content Handling Modes', link: '/guide/content-handling-modes' },
            { text: 'CSS Frameworks', link: '/guide/css-frameworks' },
            { text: 'Framework Components', link: '/guide/framework-components' },
            { text: 'Block Transformers', link: '/guide/custom-transformers' }
          ]
        },
        {
          text: 'Advanced Features',
          items: [
            { text: 'Server-Side Rendering', link: '/guide/server-side-rendering' },
            { text: 'Performance Optimization', link: '/guide/performance' },
            { text: 'Plugins', link: '/guide/plugins' },
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
            { text: 'Configuration', link: '/api/configuration' }
          ]
        },
        {
          text: 'Developer Documentation',
          items: [
            { text: 'Developer Guide', link: '/api/developer' },
            { text: 'Internal Architecture', link: '/api/internal-architecture' },
            { text: 'Plugin Development', link: '/api/plugin-development' },
            { text: 'Contribution Guidelines', link: '/api/contribution-guidelines' },
            { text: 'Performance Optimization', link: '/api/performance-optimization' },
            { text: 'Testing Guide', link: '/api/testing-guide' }
          ]
        },
        {
          text: 'Block Handlers',
          collapsed: true,
          items: [
            { text: 'Text Blocks', link: '/api/blocks/text' },
            { text: 'Media Blocks', link: '/api/blocks/media' },
            { text: 'Layout Blocks', link: '/api/blocks/layout' }
          ]
        },
        {
          text: 'TypeScript',
          collapsed: true,
          items: [
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
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/arissetia/' },
      { icon: 'twitter', link: 'https://twitter.com/arisberikut' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 madebyaris.com'
    },
    
    // SEO-related theme config
    editLink: {
      pattern: 'https://github.com/madebyaris/wp-block-to-html-docs/edit/master/docs/:path',
      text: 'Improve this page'
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    }
  }
}) 