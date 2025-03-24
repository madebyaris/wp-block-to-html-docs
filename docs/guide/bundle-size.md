# Bundle Size Optimization

WP Block to HTML is designed with bundle size optimization in mind, allowing you to include only the features you need in your application.

## Modular Architecture

The library is built with a modular architecture that enables tree-shaking and selective imports:

```
wp-block-to-html/
├── core/            # Core functionality (~2KB)
├── blocks/          # Block handlers by category
│   ├── text/        # Text block handlers
│   ├── media/       # Media block handlers
│   ├── layout/      # Layout block handlers
│   └── widget/      # Widget block handlers
├── frameworks/      # CSS framework integrations
│   ├── tailwind/    # Tailwind CSS class mappings
│   └── bootstrap/   # Bootstrap class mappings
└── react/           # React-specific functionality
└── vue/             # Vue-specific functionality
```

## Subpath Imports

WP Block to HTML supports subpath imports, allowing you to import only the specific modules you need:

```javascript
// Only import core functionality (2KB)
import { convertBlocks } from 'wp-block-to-html/core';

// Only import specific block handlers
import { paragraphBlockHandler } from 'wp-block-to-html/blocks/text';
import { imageBlockHandler } from 'wp-block-to-html/blocks/media';

// Only import specific CSS framework
import { tailwindMapping } from 'wp-block-to-html/frameworks/tailwind';
```

## Bundle Size Comparison

Here's how different import strategies affect your bundle size:

| Import Strategy | Bundle Size (gzipped) | Reduction |
|-----------------|------------------------|-----------|
| Full library | 42KB | 0% |
| Core functionality | 2KB | 95% |
| Core + Text blocks | 5KB | 88% |
| Core + React + Tailwind | 12KB | 71% |

## Optimized Import Strategies

### Minimal Setup

For applications that only need to convert basic text blocks with default styling:

```javascript
import { convertBlocks } from 'wp-block-to-html/core';
import { paragraphBlockHandler, headingBlockHandler } from 'wp-block-to-html/blocks/text';

const html = convertBlocks(blockData, {
  blockTransformers: {
    'core/paragraph': paragraphBlockHandler,
    'core/heading': headingBlockHandler
  }
});
```

### CSS Framework Only

If you only need CSS framework class mapping:

```javascript
import { convertBlocks } from 'wp-block-to-html/core';
import { tailwindMapping } from 'wp-block-to-html/frameworks/tailwind';

const html = convertBlocks(blockData, {
  cssFramework: 'custom',
  customClassMap: tailwindMapping
});
```

### Block Category Optimization

Import all handlers for a specific category:

```javascript
import { convertBlocks } from 'wp-block-to-html/core';
import * as textBlocks from 'wp-block-to-html/blocks/text';
import * as mediaBlocks from 'wp-block-to-html/blocks/media';

// Create a transformer map from the imported block handlers
const blockTransformers = {
  ...Object.entries(textBlocks).reduce((acc, [key, handler]) => {
    if (key.endsWith('BlockHandler')) {
      const blockType = key.replace('BlockHandler', '');
      acc[`core/${blockType}`] = handler;
    }
    return acc;
  }, {}),
  ...Object.entries(mediaBlocks).reduce((acc, [key, handler]) => {
    if (key.endsWith('BlockHandler')) {
      const blockType = key.replace('BlockHandler', '');
      acc[`core/${blockType}`] = handler;
    }
    return acc;
  }, {})
};

const html = convertBlocks(blockData, { blockTransformers });
```

## Dynamic Imports

For applications where different pages may need different block handlers, consider using dynamic imports:

```javascript
async function convertPostContent(blockData) {
  // Always load core functionality
  const { convertBlocks } = await import('wp-block-to-html/core');
  
  // Determine which blocks are in the content
  const blockTypes = new Set(blockData.map(block => block.blockName));
  
  // Load only the necessary block handlers
  const blockTransformers = {};
  
  if (blockTypes.has('core/paragraph') || blockTypes.has('core/heading')) {
    const textBlocks = await import('wp-block-to-html/blocks/text');
    if (blockTypes.has('core/paragraph')) {
      blockTransformers['core/paragraph'] = textBlocks.paragraphBlockHandler;
    }
    if (blockTypes.has('core/heading')) {
      blockTransformers['core/heading'] = textBlocks.headingBlockHandler;
    }
  }
  
  if (blockTypes.has('core/image') || blockTypes.has('core/gallery')) {
    const mediaBlocks = await import('wp-block-to-html/blocks/media');
    if (blockTypes.has('core/image')) {
      blockTransformers['core/image'] = mediaBlocks.imageBlockHandler;
    }
    if (blockTypes.has('core/gallery')) {
      blockTransformers['core/gallery'] = mediaBlocks.galleryBlockHandler;
    }
  }
  
  return convertBlocks(blockData, { blockTransformers });
}
```

## Building Optimized Bundles

When using bundlers like webpack, Rollup, or esbuild, ensure your configuration is set up to take advantage of tree-shaking:

### Webpack

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: true
  }
};
```

### Rollup

```javascript
// rollup.config.js
export default {
  plugins: [
    // Your plugins here
  ],
  treeshake: {
    moduleSideEffects: false
  }
};
```

### Next.js

Next.js supports tree-shaking by default. Just use the subpath imports as shown above.

## Measuring Bundle Impact

To measure the impact of WP Block to HTML on your bundle size, you can use tools like:

- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Rollup Plugin Visualizer](https://github.com/btd/rollup-plugin-visualizer)
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

## Conclusion

By leveraging the modular architecture and subpath imports of WP Block to HTML, you can significantly reduce your application's bundle size while still benefiting from the library's powerful features. 