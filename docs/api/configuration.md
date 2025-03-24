# Configuration Options

This page documents all available configuration options for WP Block to HTML. These options allow you to customize how blocks are processed, which CSS framework to use, how content is handled, and more.

## Basic Configuration

The `convertBlocks` function accepts a configuration object as its second parameter:

```javascript
import { convertBlocks } from 'wp-block-to-html';

const html = convertBlocks(blocks, {
  // Configuration options
  outputFormat: 'html',
  cssFramework: 'tailwind',
  contentHandling: 'raw'
});
```

## Core Options

### outputFormat

Specifies the output format for the converted blocks.

- **Type**: `string`
- **Default**: `'html'`
- **Possible Values**: `'html'`, `'react'`, `'vue'`, `'angular'`, `'svelte'`
- **Description**: Determines the format of the returned content. For framework-specific output, use the dedicated framework functions instead.

```javascript
// HTML output
const html = convertBlocks(blocks, { outputFormat: 'html' });

// React output (not recommended, use convertBlocksToReact instead)
const reactElement = convertBlocks(blocks, { outputFormat: 'react' });
```

### cssFramework

Specifies which CSS framework's classes to use in the output.

- **Type**: `string`
- **Default**: `'none'`
- **Possible Values**: `'none'`, `'tailwind'`, `'bootstrap'`, `'custom'`
- **Description**: Determines which CSS framework's class names will be used in the output HTML.

```javascript
// Tailwind CSS classes
const tailwindHtml = convertBlocks(blocks, { cssFramework: 'tailwind' });

// Bootstrap classes
const bootstrapHtml = convertBlocks(blocks, { cssFramework: 'bootstrap' });
```

### contentHandling

Specifies how block content should be processed.

- **Type**: `string`
- **Default**: `'raw'`
- **Possible Values**: `'raw'`, `'rendered'`, `'hybrid'`
- **Description**: Controls how the library processes block content.
  - `'raw'`: Process raw block data for full control over the output
  - `'rendered'`: Use the rendered HTML content as-is
  - `'hybrid'`: Use the rendered HTML content but add framework-specific classes

```javascript
// Process raw block data (default)
const rawHtml = convertBlocks(blocks, { contentHandling: 'raw' });

// Use pre-rendered HTML
const renderedHtml = convertBlocks(blocks, { contentHandling: 'rendered' });

// Hybrid mode: pre-rendered HTML with framework classes
const hybridHtml = convertBlocks(blocks, { 
  contentHandling: 'hybrid',
  cssFramework: 'tailwind' 
});
```

### customClassMap

Provides custom CSS class mappings for blocks.

- **Type**: `object`
- **Default**: `{}`
- **Description**: Used to provide custom CSS class mappings. For `'custom'` CSS framework, this option is required.

```javascript
// Custom class mappings
const customClassMap = {
  'core/paragraph': {
    block: 'my-custom-paragraph',
    align: {
      center: 'my-custom-center',
      left: 'my-custom-left',
      right: 'my-custom-right'
    }
  },
  'core/heading': {
    block: 'my-custom-heading',
    level: {
      '1': 'my-custom-h1',
      '2': 'my-custom-h2',
      // ...
    }
  }
};

// Use custom class mappings
const customHtml = convertBlocks(blocks, {
  cssFramework: 'custom',
  customClassMap: customClassMap
});

// Extend Tailwind mappings
const extendedTailwindHtml = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  customClassMap: { 
    tailwind: {
      // Override or extend Tailwind mappings
      'core/paragraph': {
        block: 'my-4 px-4 text-gray-800'
      }
    }
  }
});
```

### blockTransformers

Provides custom transformers for specific block types.

- **Type**: `object`
- **Default**: `{}`
- **Description**: Custom transformation functions for specific block types. Allows overriding the default transformation for any block.

```javascript
// Custom transformer for core/paragraph
const blockTransformers = {
  'core/paragraph': {
    transform(block, options) {
      const { attrs, innerContent } = block;
      const classes = attrs?.className || '';
      return `<p class="custom-paragraph ${classes}">${innerContent.join('')}</p>`;
    }
  }
};

// Use custom transformers
const html = convertBlocks(blocks, {
  blockTransformers: blockTransformers
});
```

## Server-Side Rendering Options

The `ssrOptions` object provides options for optimizing content for server-side rendering:

### ssrOptions

- **Type**: `object` or `boolean`
- **Default**: `{ enabled: false }`
- **Description**: Options for server-side rendering optimizations.

```javascript
// Basic SSR options
const html = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'balanced',
    lazyLoadMedia: true
  }
});

// Shorthand for enabling SSR with defaults
const html = convertBlocks(blocks, {
  ssrOptions: true // Equivalent to { enabled: true }
});
```

### ssrOptions.enabled

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable or disable SSR optimizations.

### ssrOptions.optimizationLevel

- **Type**: `string`
- **Default**: `'balanced'`
- **Possible Values**: `'minimal'`, `'balanced'`, `'maximum'`
- **Description**: Controls the level of optimizations applied.
  - `'minimal'`: Basic optimizations with minimal processing
  - `'balanced'`: Good balance of optimizations and features
  - `'maximum'`: Maximum optimizations, potentially removing some features

### ssrOptions.lazyLoadMedia

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Automatically adds lazy loading attributes to media elements (except the first one for LCP optimization).

### ssrOptions.stripClientScripts

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Removes client-side scripts that shouldn't execute during SSR.

### ssrOptions.inlineCriticalCSS

- **Type**: `boolean`
- **Default**: `false`
- **Description**: When true, attempts to inline critical CSS styles.

### ssrOptions.preProcessHTML

- **Type**: `function(html: string, options: object) => string`
- **Default**: `undefined`
- **Description**: Custom function to pre-process HTML before standard optimizations.

### ssrOptions.postProcessHTML

- **Type**: `function(html: string, options: object) => string`
- **Default**: `undefined`
- **Description**: Custom function to post-process HTML after standard optimizations.

```javascript
// Advanced SSR options
const html = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'maximum',
    lazyLoadMedia: true,
    stripClientScripts: true,
    inlineCriticalCSS: true,
    preProcessHTML: (html, options) => {
      // Custom pre-processing
      return html.replace(/specific-pattern/g, 'replacement');
    },
    postProcessHTML: (html, options) => {
      // Custom post-processing
      return html + '<!-- Server rendered -->';
    }
  }
});
```

## Incremental Rendering Options

The `incrementalOptions` object provides options for incremental rendering of large content sets:

### incrementalOptions

- **Type**: `object`
- **Default**: `{ enabled: false }`
- **Description**: Options for incremental client-side rendering of large content.

```javascript
// Basic incremental rendering
const html = convertBlocks(blocks, {
  incrementalOptions: {
    enabled: true,
    initialRenderCount: 10,
    batchSize: 5,
    batchDelay: 50
  }
});
```

### incrementalOptions.enabled

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable or disable incremental rendering.

### incrementalOptions.initialRenderCount

- **Type**: `number`
- **Default**: `10`
- **Description**: Number of blocks to render in the initial pass.

### incrementalOptions.batchSize

- **Type**: `number`
- **Default**: `5`
- **Description**: Number of blocks to render in each subsequent batch.

### incrementalOptions.batchDelay

- **Type**: `number`
- **Default**: `50`
- **Description**: Delay in milliseconds between batch rendering.

### incrementalOptions.useIntersectionObserver

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Use IntersectionObserver to lazy-load blocks when they come into view.

### incrementalOptions.containerSelector

- **Type**: `string`
- **Default**: `undefined`
- **Description**: DOM selector for the container where content should be rendered.

### incrementalOptions.renderCallback

- **Type**: `function(content: string, options: object) => void`
- **Default**: `undefined`
- **Description**: Custom callback for rendering incremental content.

## Debug Options

### debug

- **Type**: `boolean`
- **Default**: `false`
- **Description**: When true, outputs detailed debug information during the conversion process.

```javascript
// Enable debugging
const html = convertBlocks(blocks, {
  debug: true
});
```

### verboseOutput

- **Type**: `boolean`
- **Default**: `false`
- **Description**: When true, includes additional comments and information in the output HTML.

```javascript
// Enable verbose output
const html = convertBlocks(blocks, {
  verboseOutput: true
});
```

## TypeScript Interface

If you're using TypeScript, here's the full interface for the configuration options:

```typescript
interface ConversionOptions {
  // Core options
  outputFormat?: 'html' | 'react' | 'vue' | 'angular' | 'svelte';
  cssFramework?: 'none' | 'tailwind' | 'bootstrap' | 'custom';
  contentHandling?: 'raw' | 'rendered' | 'hybrid';
  customClassMap?: Record<string, any>;
  blockTransformers?: Record<string, BlockTransformer>;
  
  // SSR options
  ssrOptions?: boolean | {
    enabled?: boolean;
    optimizationLevel?: 'minimal' | 'balanced' | 'maximum';
    lazyLoadMedia?: boolean;
    stripClientScripts?: boolean;
    inlineCriticalCSS?: boolean;
    preProcessHTML?: (html: string, options: object) => string;
    postProcessHTML?: (html: string, options: object) => string;
  };
  
  // Incremental rendering options
  incrementalOptions?: {
    enabled?: boolean;
    initialRenderCount?: number;
    batchSize?: number;
    batchDelay?: number;
    useIntersectionObserver?: boolean;
    containerSelector?: string;
    renderCallback?: (content: string, options: object) => void;
  };
  
  // Debug options
  debug?: boolean;
  verboseOutput?: boolean;
}

interface BlockTransformer {
  transform(block: WordPressBlock, options: ConversionOptions): string;
  cssMapping?: Record<string, any>;
}

interface WordPressBlock {
  blockName: string;
  attrs?: Record<string, any>;
  innerBlocks?: WordPressBlock[];
  innerContent?: string[];
}
```

## Next Steps

- Learn about [Core Functions](/api/core-functions) to understand the available API methods
- Explore [Block Handlers](/api/blocks/text) to see how specific blocks are handled
- Check out [Framework Integrations](/frameworks/) for framework-specific usage 