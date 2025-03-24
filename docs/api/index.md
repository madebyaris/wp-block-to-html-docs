# API Reference

Welcome to the WP Block to HTML API reference documentation. This section provides detailed information about the library's API, including core functions, configuration options, developer resources, and TypeScript definitions.

## Overview

WP Block to HTML is a JavaScript library that converts WordPress block data into clean HTML or framework-specific components. The library offers a flexible and extensible API that allows you to:

- Convert WordPress blocks to framework-agnostic HTML
- Customize the conversion process with various options
- Apply CSS framework-specific classes
- Create custom block transformers
- Optimize for server-side rendering
- Integrate with various JavaScript frameworks

## Core Functions

The [Core Functions](./core-functions) section documents the main functions that power WP Block to HTML:

- `convertBlocks()`: Convert WordPress blocks to HTML
- `processBlocksForSSR()`: Optimize blocks for server-side rendering
- `createBlockHandler()`: Create custom block transformers
- `getClassMap()`: Retrieve CSS framework class mappings
- `createCustomClassMap()`: Create custom class mappings

```javascript
import { convertBlocks } from 'wp-block-to-html';

const html = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  contentHandling: 'raw'
});
```

## Configuration Options

The [Configuration Options](./configuration) section details all the configuration options available when using the library, including:

- CSS framework selection
- Content handling modes
- Block transformer customization
- SSR optimization settings

```javascript
const options = {
  cssFramework: 'tailwind',
  contentHandling: 'raw',
  blockTransformers: customTransformers,
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'balanced',
    lazyLoadMedia: true
  }
};
```

## Developer Documentation

For developers looking to extend the library or contribute to its development:

- [Internal Architecture](./internal-architecture): Understand the library's architecture
- [Plugin Development](./plugin-development): Create plugins to extend the library
- [Contribution Guidelines](./contribution-guidelines): Guidelines for contributing
- [Performance Optimization](./performance-optimization): Optimize for large sites

## Block Handlers

Documentation for the various block handlers included in the library:

- [Text Blocks](./blocks/text): Paragraphs, headings, lists, quotes, etc.
- [Media Blocks](./blocks/media): Images, galleries, videos, etc.
- [Layout Blocks](./blocks/layout): Columns, groups, rows, etc.

```javascript
import { paragraphBlockHandler } from 'wp-block-to-html/blocks/text';
import { imageBlockHandler } from 'wp-block-to-html/blocks/media';

const customTransformers = {
  'core/paragraph': paragraphBlockHandler,
  'core/image': imageBlockHandler
};
```

## CSS Frameworks

Documentation for using different CSS frameworks:

- [Tailwind CSS](./frameworks/tailwind): Use Tailwind CSS classes
- [Bootstrap](./frameworks/bootstrap): Use Bootstrap classes
- [Custom Frameworks](./frameworks/custom): Create your own CSS framework adapter

```javascript
// Using Tailwind CSS
const html = convertBlocks(blocks, { cssFramework: 'tailwind' });

// Using Bootstrap
const html = convertBlocks(blocks, { cssFramework: 'bootstrap' });

// Using a custom framework
const html = convertBlocks(blocks, { classMap: customClassMap });
```

## TypeScript

TypeScript definitions for the library:

- [Interfaces](./typescript/interfaces): TypeScript interfaces
- [Types](./typescript/types): TypeScript types

```typescript
import { 
  WordPressBlock, 
  ConversionOptions, 
  BlockTransformer 
} from 'wp-block-to-html';

const blocks: WordPressBlock[] = [...];
const options: ConversionOptions = {...};
```

## Framework Integration

For framework-specific documentation, visit the [Frameworks section](/frameworks/).

## Examples

For practical examples, visit the [Examples section](/examples/).

## Need Help?

If you need additional help:
- Check out our [GitHub repository](https://github.com/yourusername/wp-block-to-html)
- [Open an issue](https://github.com/yourusername/wp-block-to-html/issues) if you encounter a bug
- Refer to our [Getting Started guide](/guide/) for basics 