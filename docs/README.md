---
layout: home
title: WP Block to HTML
features:
  - title: Framework Agnostic
    details: Works with any frontend framework or vanilla JavaScript. Convert WordPress blocks to clean, semantic HTML.
  - title: CSS Framework Support
    details: Seamlessly integrates with Tailwind CSS, Bootstrap, or use your own custom class mapping.
  - title: Performance Optimized
    details: Built for speed with server-side rendering optimizations, lazy loading, and modular imports.
hero:
  name: WP Block to HTML
  text: WordPress Block Converter for Headless Sites
  tagline: Transform WordPress block data into clean, semantic HTML with framework-specific class support
  image:
    src: /logo.svg
    alt: WP Block to HTML logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/madebyaris/wp-block-to-html
---

# Transform WordPress Blocks into HTML

WP Block to HTML is a lightweight, flexible library that converts WordPress block data (Gutenberg blocks) into clean, semantic HTML. It's perfect for headless WordPress setups and works with any frontend framework.

## Key Features

- **Block-to-HTML Conversion**: Transform WordPress block data into clean, semantic HTML
- **CSS Framework Integration**: Built-in support for Tailwind CSS and Bootstrap
- **Framework Flexibility**: Use with React, Vue, or any other JavaScript framework
- **SSR Optimizations**: Improve Core Web Vitals with server-side rendering optimizations
- **TypeScript Support**: Fully typed API for better developer experience
- **Tree-shakable**: Import only what you need to keep bundle size small

## Quick Example

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress block data (from REST API)
const block = {
  blockName: 'core/paragraph',
  attrs: {
    align: 'center',
    fontSize: 'large',
  },
  innerContent: ['<p class="has-text-align-center has-large-font-size">Hello World!</p>']
};

// Convert to HTML with Tailwind CSS classes
const html = convertBlocks(block, { 
  cssFramework: 'tailwind'
});

// Result: <p class="text-center text-xl">Hello World!</p>
```

## Why WP Block to HTML?

- **Headless WordPress**: Perfect for Next.js, Nuxt, or any other framework working with headless WordPress
- **Control Over Output**: Fine-grained control over the HTML structure and CSS classes
- **Performance**: Optimized for server-side rendering and Core Web Vitals
- **Flexibility**: Use your preferred CSS framework or customize the output

## Browser Support

Supports all modern browsers, including:

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- IE 11 with appropriate polyfills

## License

MIT Licensed. Free to use in personal and commercial projects. 