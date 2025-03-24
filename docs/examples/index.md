# Basic Usage Examples

This page demonstrates basic usage examples for the WP Block to HTML converter library.

## Converting a Simple Block

Here's an example of converting a simple paragraph block:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress block data
const blockData = {
  blocks: [
    {
      blockName: 'core/paragraph',
      attrs: { align: 'center' },
      innerContent: ['<p>Hello WordPress!</p>']
    }
  ]
};

// Convert to HTML
const html = convertBlocks(blockData);
console.log(html);
// Output: <p class="wp-block-paragraph has-text-align-center">Hello WordPress!</p>
```

## Working with Multiple Blocks

Here's how to convert multiple blocks, including nested structures:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Multiple WordPress blocks
const blockData = {
  blocks: [
    {
      blockName: 'core/heading',
      attrs: { level: 2 },
      innerContent: ['<h2>Welcome to My Blog</h2>']
    },
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: ['<p>This is an example of converting multiple blocks.</p>']
    },
    {
      blockName: 'core/columns',
      attrs: {},
      innerContent: ['<div class="wp-block-columns">', null, null, '</div>'],
      innerBlocks: [
        {
          blockName: 'core/column',
          attrs: {},
          innerContent: ['<div class="wp-block-column">', null, '</div>'],
          innerBlocks: [
            {
              blockName: 'core/paragraph',
              attrs: {},
              innerContent: ['<p>Column 1 content</p>']
            }
          ]
        },
        {
          blockName: 'core/column',
          attrs: {},
          innerContent: ['<div class="wp-block-column">', null, '</div>'],
          innerBlocks: [
            {
              blockName: 'core/paragraph',
              attrs: {},
              innerContent: ['<p>Column 2 content</p>']
            }
          ]
        }
      ]
    }
  ]
};

// Convert to HTML
const html = convertBlocks(blockData);
console.log(html);
```

## Using Different CSS Frameworks

You can output HTML with classes from popular CSS frameworks:

::: code-group
```javascript [Default]
// Default HTML classes
const html = convertBlocks(blockData);
// <p class="wp-block-paragraph has-text-align-center">Hello WordPress!</p>
```

```javascript [Tailwind CSS]
// With Tailwind CSS classes
const tailwindHtml = convertBlocks(blockData, { 
  cssFramework: 'tailwind' 
});
// <p class="text-center">Hello WordPress!</p>
```

```javascript [Bootstrap]
// With Bootstrap classes
const bootstrapHtml = convertBlocks(blockData, { 
  cssFramework: 'bootstrap' 
});
// <p class="text-center">Hello WordPress!</p>
```

```javascript [Custom]
// With custom class mapping
const customHtml = convertBlocks(blockData, {
  cssFramework: 'custom',
  customClassMap: {
    'core/paragraph': {
      block: 'my-paragraph',
      align: {
        center: 'align-center'
      }
    }
  }
});
// <p class="my-paragraph align-center">Hello WordPress!</p>
```
:::

## Working with Content Handling Modes

The library supports different content handling modes:

```javascript
// Raw mode (default) - process raw block data
const rawHtml = convertBlocks(blockData, { 
  contentHandling: 'raw' 
});

// Rendered mode - use pre-rendered HTML as-is
const renderedHtml = convertBlocks(blockData, { 
  contentHandling: 'rendered' 
});

// Hybrid mode - combine rendered HTML with framework classes
const hybridHtml = convertBlocks(blockData, {
  contentHandling: 'hybrid',
  cssFramework: 'tailwind'
});
```

## Complete Configuration Example

Here's an example with a complete configuration:

```javascript
import { convertBlocks } from 'wp-block-to-html';

const html = convertBlocks(blockData, {
  // Output format (HTML by default)
  outputFormat: 'html',
  
  // CSS framework (Tailwind)
  cssFramework: 'tailwind',
  
  // Content handling mode
  contentHandling: 'hybrid',
  
  // Custom class mapping (extends/overrides Tailwind)
  customClassMap: {
    'core/paragraph': {
      block: 'prose text-gray-800',
      align: {
        center: 'text-center mx-auto',
        left: 'text-left',
        right: 'text-right'
      }
    }
  },
  
  // Server-side rendering options
  ssrOptions: {
    enabled: true,
    level: 'balanced',
    optimizeImages: true
  }
});
```

For more specific examples, check out the other pages in this section. 