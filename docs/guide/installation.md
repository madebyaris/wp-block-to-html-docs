# Installation

This page covers installation options for WP Block to HTML.

## Package Installation

You can install the package using any of the following package managers:

::: code-group
```bash [npm]
npm install wp-block-to-html
```

```bash [yarn]
yarn add wp-block-to-html
```

```bash [pnpm]
pnpm add wp-block-to-html
```
:::

## CDN Installation

For direct use in the browser, you can include the library from a CDN:

```html
<script src="https://unpkg.com/wp-block-to-html/dist/index.js"></script>
<script>
  // The library is available under the global wpBlockToHtml
  const { convertBlocks } = wpBlockToHtml;
  
  // Use the library
  const html = convertBlocks(blockData);
</script>
```

## Optimized Bundle Installation

WP Block to HTML supports subpath imports for optimized bundle size. This allows you to import only the specific features you need, drastically reducing your bundle size.

Here are some examples:

```javascript
// Import only core functionality (2KB)
import { convertBlocks } from 'wp-block-to-html/core';

// Import specific CSS framework support
import { tailwindMapping } from 'wp-block-to-html/frameworks/tailwind';

// Import only specific block categories
import { paragraphBlockHandler } from 'wp-block-to-html/blocks/text';
import { imageBlockHandler } from 'wp-block-to-html/blocks/media';

// Import framework-specific functionality
import { convertBlocksToReact } from 'wp-block-to-html/react';
import { convertBlocksToVue } from 'wp-block-to-html/vue';
```

## Framework-Specific Installation

### React

If you're using React, you'll want to install React as a peer dependency:

```bash
npm install wp-block-to-html react react-dom
```

Then you can import the React-specific components:

```javascript
import { convertBlocksToReact } from 'wp-block-to-html/react';

// Create React components from WordPress blocks
const reactComponents = convertBlocksToReact(blockData);
```

### Vue

For Vue.js integration:

```bash
npm install wp-block-to-html vue
```

And import the Vue-specific functionality:

```javascript
import { convertBlocksToVue } from 'wp-block-to-html/vue';

// Create Vue components from WordPress blocks
const vueComponents = convertBlocksToVue(blockData);
```

## Verifying Installation

After installation, you can verify it works with a simple test:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// A simple test block
const testBlock = {
  blocks: [
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: ['<p>Test paragraph</p>']
    }
  ]
};

// Convert to HTML
const html = convertBlocks(testBlock);
console.log(html); // Should output: <p class="wp-block-paragraph">Test paragraph</p>
```

## Requirements

- **Node.js**: Version 12.x or higher
- **Browser Support**: Modern browsers (ES6 support)
- **Optional Dependencies**:
  - React 16.8+ (for React integration)
  - Vue 3.x+ (for Vue integration) 