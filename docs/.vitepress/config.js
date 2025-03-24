import { defineConfig } from 'vitepress'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

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
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'author', content: 'Aris Setiawan' }],
    ['meta', { name: 'keywords', content: 'wordpress, gutenberg, blocks, headless, html, react, vue, nextjs, gatsby, tailwind, bootstrap' }],
    
    // Open Graph / Facebook
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'WP Block to HTML - Convert WordPress Blocks to HTML with Ease' }],
    ['meta', { property: 'og:description', content: 'A powerful utility for converting WordPress block data to framework-agnostic HTML or framework-specific components with advanced optimization features.' }],
    ['meta', { property: 'og:image', content: 'https://wp-block-to-html.madebyaris.com/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://wp-block-to-html.madebyaris.com/' }],
    
    // Twitter
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@arisberikut' }],
    ['meta', { name: 'twitter:creator', content: '@arisberikut' }],
    ['meta', { name: 'twitter:title', content: 'WP Block to HTML - Convert WordPress Blocks to HTML with Ease' }],
    ['meta', { name: 'twitter:description', content: 'A powerful utility for converting WordPress block data to framework-agnostic HTML or framework-specific components with advanced optimization features.' }],
    ['meta', { name: 'twitter:image', content: 'https://wp-block-to-html.madebyaris.com/twitter-card.png' }],
    
    // Favicon
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    
    // Canonical URL
    ['link', { rel: 'canonical', href: 'https://wp-block-to-html.madebyaris.com/' }],
  ],
  
  // Improve page title format
  titleTemplate: ':title | WP Block to HTML',
  
  // Manual sitemap generation instead of plugin
  transformHtml: (_, id, { pageData }) => {
    if (id === 'index.html') {
      // This is the main site URL
      return
    }
  },

  // Generate sitemap.xml after build
  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({ hostname: 'https://wp-block-to-html.madebyaris.com' })
    const links = []
    
    // Main pages
    links.push({ url: '/', lastmod: new Date(), changefreq: 'weekly', priority: 1.0 })
    links.push({ url: '/guide/', lastmod: new Date(), changefreq: 'weekly', priority: 0.9 })
    links.push({ url: '/api/', lastmod: new Date(), changefreq: 'weekly', priority: 0.9 })
    links.push({ url: '/examples/', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/frameworks/', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    
    // Guide pages
    links.push({ url: '/guide/getting-started', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/guide/installation', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/guide/quick-start', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/guide/content-handling-modes', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/guide/css-frameworks', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/guide/framework-components', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/guide/custom-transformers', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/guide/server-side-rendering', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/guide/performance', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/guide/plugins', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/guide/lazy-loading', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/guide/bundle-size', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/guide/migration-guide', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    
    // API pages
    links.push({ url: '/api/core-functions', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/api/configuration', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/api/developer', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/api/internal-architecture', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/api/plugin-development', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/api/contribution-guidelines', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/api/performance-optimization', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/api/testing-guide', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/api/blocks/text', lastmod: new Date(), changefreq: 'monthly', priority: 0.6 })
    links.push({ url: '/api/blocks/media', lastmod: new Date(), changefreq: 'monthly', priority: 0.6 })
    links.push({ url: '/api/blocks/layout', lastmod: new Date(), changefreq: 'monthly', priority: 0.6 })
    links.push({ url: '/api/typescript/interfaces', lastmod: new Date(), changefreq: 'monthly', priority: 0.6 })
    links.push({ url: '/api/typescript/types', lastmod: new Date(), changefreq: 'monthly', priority: 0.6 })
    
    // Framework pages
    links.push({ url: '/frameworks/react', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/frameworks/vue', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/frameworks/nextjs', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/frameworks/gatsby', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/frameworks/svelte', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    links.push({ url: '/frameworks/angular', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 })
    
    // Examples pages
    links.push({ url: '/examples/css-frameworks', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    links.push({ url: '/examples/advanced', lastmod: new Date(), changefreq: 'monthly', priority: 0.7 })
    
    // Create the stream
    const stream = Readable.from(links).pipe(sitemap)
    
    // Get the XML string
    const xml = await streamToPromise(stream)
    
    // Write to file
    const fs = require('fs')
    const path = require('path')
    
    fs.writeFileSync(
      path.resolve(outDir, 'sitemap.xml'),
      xml.toString()
    )
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