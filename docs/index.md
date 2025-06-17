---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "WP Block to HTML"
  text: "Convert WordPress Blocks to HTML with Ease"
  tagline: "🎉 v1.0.0 STABLE RELEASE NOW AVAILABLE! A powerful utility for converting WordPress block data to framework-agnostic HTML with client-side hydration support."
  image:
    src: /logo.svg
    alt: WP Block to HTML
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: View Examples
      link: /examples/
    - theme: alt
      text: Hire Me
      link: https://madebyaris.com/contact

features:
  - icon: 🚀
    title: High Performance
    details: Optimized for both client and server-side rendering with minimal overhead. Achieve 947 blocks/ms processing speed with built-in SSR optimizations.
  
  - icon: 🔄
    title: Framework Agnostic
    details: Convert WordPress blocks to pure HTML or integrate with React, Vue, Svelte, Angular, or any other JavaScript framework.
  
  - icon: 💧
    title: Client-Side Hydration
    details: NEW in v1.0.0! Progressive hydration with viewport-based, interaction-based, and idle strategies for optimal performance.
  
  - icon: 🧩
    title: CSS Framework Integration
    details: Seamless integration with Tailwind CSS, Bootstrap, or create custom class mappings for your preferred styling approach.
  
  - icon: 📱
    title: Built for Modern Web
    details: Support for lazy loading, responsive images, and optimized output for better performance across all devices.
  
  - icon: ⚙️
    title: Highly Customizable
    details: Extensible architecture that allows for custom block transformers, CSS class mappings, and rendering options.
  
  - icon: 🔌
    title: Plugin System
    details: Extend functionality with plugins that add support for custom block types, frameworks, or specialized features.

  - icon: 🏆
    title: Production Ready
    details: v1.0.0 stable release with comprehensive testing, full TypeScript support, and 100% WordPress core block coverage.
---

## 🎉 v1.0.0 Stable Release Available

WP Block to HTML v1.0.0 is now live on NPM! Install it today and start building faster headless WordPress applications.

```bash
npm install wp-block-to-html
```

## What is WP Block to HTML?

WP Block to HTML is a production-ready JavaScript library that converts WordPress block data into clean, framework-agnostic HTML. It bridges the gap between WordPress as a content management system and modern frontend applications built with frameworks like React, Vue, Next.js, or any other technology.

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress blocks data
const blocks = [
  {
    blockName: 'core/paragraph',
    attrs: { content: 'Hello World', align: 'center' },
    innerBlocks: []
  }
];

// Convert to HTML
const html = convertBlocks(blocks);
console.log(html); // <p class="has-text-align-center">Hello World</p>
```

## New in v1.0.0: Client-Side Hydration

The first stable release introduces powerful client-side hydration capabilities for SSR scenarios:

```javascript
import { HydrationManager } from 'wp-block-to-html/hydration';

// Progressive hydration with multiple strategies
const hydrationManager = new HydrationManager({
  strategy: 'viewport', // viewport, interaction, idle, immediate
  rootSelector: '#app'
});

// Hydrate specific blocks
await hydrationManager.hydrateBlock('block-id-123');

// Batch hydration
await hydrationManager.hydrateAll();
```

## Key Features

### Framework Integration

Easily integrate with popular JavaScript frameworks:

```javascript
// React Integration
import { createReactComponent } from 'wp-block-to-html/react';
const BlockComponent = createReactComponent(blocks, {
  cssFramework: 'tailwind',
  hydration: { strategy: 'viewport' }
});

// Vue Integration
import { createVueComponent } from 'wp-block-to-html/vue';
const BlockComponent = createVueComponent(blocks, {
  cssFramework: 'bootstrap',
  hydration: { strategy: 'interaction' }
});
```

### CSS Framework Support

Generate HTML with classes from your preferred CSS framework:

```javascript
// Using Tailwind CSS
const html = convertBlocks(blocks, {
  cssFramework: 'tailwind'
});

// Using Bootstrap
const html = convertBlocks(blocks, {
  cssFramework: 'bootstrap'
});

// Using custom class mappings
const html = convertBlocks(blocks, {
  cssFramework: 'custom',
  customClassMap
});
```

### Server-Side Rendering Optimizations

Optimize your content for better performance metrics:

```javascript
// Apply SSR optimizations
const html = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'maximum',
    lazyLoadMedia: true
  },
  hydration: {
    strategy: 'progressive',
    priorityBlocks: ['core/button', 'core/gallery']
  }
});
```

## Why Use WP Block to HTML?

- **Production Ready**: v1.0.0 stable release with comprehensive testing and validation
- **First-Class Hydration**: Only WordPress block converter with client-side hydration support
- **Headless WordPress**: Build modern frontends while using WordPress as a CMS
- **High Performance**: 947 blocks/ms processing speed with 99% bundle size reduction
- **Flexibility**: Use any frontend technology while leveraging WordPress block editor
- **Developer Experience**: Clean, typed API with comprehensive documentation
- **SEO**: Improve Core Web Vitals and search engine rankings with optimized output
- **TypeScript Support**: Full TypeScript support with interfaces and type definitions

## Performance Metrics

- **Processing Speed**: 947 blocks/ms (99.5% faster than target)
- **Bundle Size**: 99% reduction through modular architecture
- **Test Coverage**: 77 comprehensive tests passing
- **Framework Support**: React, Vue, Angular, Svelte ready
- **Block Coverage**: 100% WordPress core blocks supported

## Documentation Highlights

- [Getting Started Guide](/guide/getting-started) - Quick integration steps
- [Client-Side Hydration](/guide/hydration) - NEW! Progressive hydration strategies
- [CSS Framework Integration](/guide/css-frameworks) - Using Tailwind, Bootstrap, or custom classes
- [Framework Components](/guide/framework-components) - Integration with React, Vue, and more
- [Server-Side Rendering](/guide/server-side-rendering) - Performance optimization with SSR
- [Performance Optimization](/guide/performance) - Techniques for optimal rendering speed
- [Plugin Development](/guide/plugins) - Extend the library with custom functionality
- [TypeScript Support](/api/typescript/interfaces) - Comprehensive type definitions

## Installation & Quick Start

```bash
# Install the stable release
npm install wp-block-to-html

# Or using yarn
yarn add wp-block-to-html

# Or using pnpm
pnpm add wp-block-to-html
```

## Community and Support

- [GitHub Repository](https://github.com/madebyaris/wp-block-to-html)
- [NPM Package](https://www.npmjs.com/package/wp-block-to-html)
- [Report Issues](https://github.com/madebyaris/wp-block-to-html/issues)
- [Contribute](https://github.com/madebyaris/wp-block-to-html/blob/main/CONTRIBUTING.md)

## From the Creator

<div class="creator-message" style="background-color: #f9f9f9; border-left: 4px solid #3eaf7c; padding: 16px; margin: 24px 0; border-radius: 0 4px 4px 0;">
  <p style="margin-top: 0;">
    🎉 Thank you for checking out WP Block to HTML v1.0.0! This stable release represents a major milestone - we're now the first WordPress block converter with client-side hydration support.
  </p>
  <p>
    The v1.0.0 release includes production-ready hydration strategies, comprehensive framework support, and performance optimizations that achieve 947 blocks/ms processing speed.
  </p>
  <p>
    If you need custom WordPress development, frontend optimization, or headless CMS integration for your project, I'm available for hire.
  </p>
  <p style="margin-bottom: 0;">
    <a href="https://madebyaris.com/contact" style="display: inline-block; background-color: #3eaf7c; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500;">Hire Me for Your Project</a>
  </p>
  <p style="margin-top: 12px; font-style: italic; color: #666;">
    — Aris Setiawan, Creator of WP Block to HTML
  </p>
</div>

## License

WP Block to HTML is licensed under the [MIT License](https://github.com/madebyaris/wp-block-to-html/blob/main/LICENSE).