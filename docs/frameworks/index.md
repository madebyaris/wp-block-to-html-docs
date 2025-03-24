# Framework Integration Guides

WP Block to HTML provides seamless integration with popular JavaScript frameworks, allowing you to convert WordPress blocks to framework-specific components.

## Available Framework Integrations

WP Block to HTML currently supports the following frameworks:

- **React**: Convert blocks to React components
- **Vue**: Convert blocks to Vue components
- **Next.js**: Server-side rendering with Next.js
- **Gatsby**: Static site generation with Gatsby
- **SvelteKit**: Integration with SvelteKit
- **Angular**: Integration with Angular applications

## Why Use Framework Integration?

While the core library converts blocks to HTML strings, using the framework-specific integrations offers several advantages:

1. **Native Components**: Get actual framework components instead of HTML strings
2. **Event Handling**: Properly handle events within your framework's paradigm
3. **Hydration**: Better hydration support for SSR applications
4. **TypeScript Support**: Full type definitions for framework-specific APIs

## Basic Usage Example

Here's a simple example of using WP Block to HTML with React:

```javascript
import { convertBlocksToReact } from 'wp-block-to-html/react';

function WordPressContent({ blocks }) {
  // Convert WordPress blocks to React components
  const components = convertBlocksToReact(blocks, {
    cssFramework: 'tailwind'
  });
  
  return (
    <div className="wp-content">
      {components}
    </div>
  );
}
```

## Getting Started

Choose your framework from the sidebar to see detailed integration guides, examples, and best practices for that specific framework.

Each guide covers:

- Installation and setup
- Basic usage patterns
- Advanced customization
- Server-side rendering (where applicable)
- Performance optimization tips
- Practical examples

## Compatibility Matrix

| Framework | Version Support | SSR Support | Component Mapping |
|-----------|----------------|-------------|-------------------|
| React     | 16.8+          | ✅          | ✅                |
| Vue       | 3.x+           | ✅          | ✅                |
| Next.js   | 12+            | ✅          | ✅                |
| Gatsby    | 4+             | ✅          | ✅                |
| SvelteKit | 1.0+           | ✅          | ✅                |
| Angular   | 13+            | ✅          | ✅                | 