# Plugin Development Guide

This guide provides instructions for developing plugins and extensions for the WP Block to HTML library. Learn how to extend the library's functionality to support custom blocks, add new CSS frameworks, or create specialized transformers.

## Plugin Types

WP Block to HTML supports several types of plugins:

1. **Block Transformers**: Convert custom WordPress blocks to HTML
2. **CSS Framework Adapters**: Add support for additional CSS frameworks
3. **Framework Adapters**: Add support for other JavaScript frameworks
4. **Processing Middleware**: Modify blocks during the conversion process
5. **Utility Plugins**: Add additional utilities or helper functions

## Creating a Block Transformer Plugin

Block transformer plugins allow you to handle custom WordPress blocks or override the default handling of core blocks.

### Basic Structure

```javascript
// my-custom-blocks-plugin.js
import { createBlockHandler } from 'wp-block-to-html';

// Create a custom block transformer
export const customBlockHandler = createBlockHandler('my-plugin/custom-block', {
  transform(block, options) {
    const { attrs = {} } = block;
    const { title = '', content = '' } = attrs;
    
    // Generate HTML based on block attributes
    return `
      <div class="custom-block">
        <h3 class="custom-block-title">${title}</h3>
        <div class="custom-block-content">${content}</div>
      </div>
    `;
  }
});

// Create a collection of custom block handlers
export const customBlocks = {
  'my-plugin/custom-block': customBlockHandler,
  'my-plugin/another-block': createBlockHandler('my-plugin/another-block', {
    transform(block, options) {
      // Transformation logic
      return '<div>Another custom block</div>';
    }
  })
};
```

### Using the Plugin

```javascript
import { convertBlocks } from 'wp-block-to-html';
import { customBlocks } from './my-custom-blocks-plugin';

const html = convertBlocks(blocks, {
  blockTransformers: customBlocks
});
```

### Supporting CSS Frameworks

Your block transformer can adapt to different CSS frameworks:

```javascript
createBlockHandler('my-plugin/custom-block', {
  transform(block, options) {
    const { attrs = {} } = block;
    const { align = 'left', size = 'medium' } = attrs;
    
    // Adapt classes based on the CSS framework
    let alignClass = '';
    let sizeClass = '';
    
    if (options.cssFramework === 'tailwind') {
      alignClass = align === 'left' ? 'text-left' : 
                  align === 'center' ? 'text-center' : 'text-right';
      sizeClass = size === 'small' ? 'text-sm' : 
                 size === 'medium' ? 'text-base' : 'text-lg';
    } else if (options.cssFramework === 'bootstrap') {
      alignClass = align === 'left' ? 'text-start' : 
                  align === 'center' ? 'text-center' : 'text-end';
      sizeClass = size === 'small' ? 'small' : 
                 size === 'medium' ? '' : 'large';
    } else {
      // Default WordPress classes
      alignClass = align !== 'left' ? `has-text-align-${align}` : '';
      sizeClass = size !== 'medium' ? `has-${size}-font-size` : '';
    }
    
    return `<div class="${alignClass} ${sizeClass}">Custom block content</div>`;
  }
});
```

### Handling Nested Blocks

For blocks that contain inner blocks, use recursive conversion:

```javascript
createBlockHandler('my-plugin/container-block', {
  transform(block, options) {
    const { attrs = {}, innerBlocks = [] } = block;
    const { backgroundColor = '' } = attrs;
    
    // Convert inner blocks recursively
    let innerContent = '';
    
    if (innerBlocks.length > 0) {
      // Import the convertBlocks function when handling nested blocks
      const { convertBlocks } = require('wp-block-to-html');
      innerContent = convertBlocks(innerBlocks, options);
    }
    
    // Generate container with inner content
    return `
      <div class="custom-container" ${backgroundColor ? `style="background-color: ${backgroundColor};"` : ''}>
        ${innerContent}
      </div>
    `;
  }
});
```

## Creating a CSS Framework Adapter

CSS framework adapters map WordPress block attributes to classes for a specific CSS framework.

### Basic Structure

```javascript
// my-framework-plugin.js
import { createCustomClassMap } from 'wp-block-to-html';

// Create a class map for a custom CSS framework
export const myFrameworkClassMap = {
  paragraph: {
    base: 'my-paragraph',
    alignLeft: 'my-align-left',
    alignCenter: 'my-align-center',
    alignRight: 'my-align-right',
    dropCap: 'my-drop-cap'
  },
  heading: {
    base: 'my-heading',
    level1: 'my-heading-1',
    level2: 'my-heading-2',
    level3: 'my-heading-3',
    level4: 'my-heading-4',
    level5: 'my-heading-5',
    level6: 'my-heading-6',
    alignLeft: 'my-align-left',
    alignCenter: 'my-align-center',
    alignRight: 'my-align-right'
  },
  // Define classes for other block types...
  image: {
    base: 'my-image',
    alignLeft: 'my-align-left',
    alignCenter: 'my-align-center',
    alignRight: 'my-align-right',
    alignWide: 'my-align-wide',
    alignFull: 'my-align-full',
    caption: 'my-caption'
  }
};

// Alternatively, extend an existing framework
export const extendedTailwindClassMap = (baseMap) => createCustomClassMap(
  baseMap,
  {
    paragraph: {
      base: 'text-gray-800 leading-relaxed',
      dropCap: 'first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left'
    },
    heading: {
      base: 'font-display',
      level1: 'text-5xl font-bold mb-6'
    }
  }
);
```

### Using the Plugin

```javascript
import { convertBlocks, getClassMap } from 'wp-block-to-html';
import { myFrameworkClassMap, extendedTailwindClassMap } from './my-framework-plugin';

// Use a completely custom framework
const htmlWithCustomFramework = convertBlocks(blocks, {
  classMap: myFrameworkClassMap
});

// Extend an existing framework
const tailwindClasses = getClassMap('tailwind');
const htmlWithExtendedFramework = convertBlocks(blocks, {
  classMap: extendedTailwindClassMap(tailwindClasses)
});
```

### Comprehensive Class Map

A comprehensive CSS framework adapter should cover all block types:

```javascript
const comprehensiveClassMap = {
  // Text blocks
  paragraph: { /* classes */ },
  heading: { /* classes */ },
  list: { /* classes */ },
  quote: { /* classes */ },
  
  // Media blocks
  image: { /* classes */ },
  gallery: { /* classes */ },
  audio: { /* classes */ },
  video: { /* classes */ },
  
  // Layout blocks
  group: { /* classes */ },
  columns: { /* classes */ },
  column: { /* classes */ },
  
  // Widget blocks
  button: { /* classes */ },
  table: { /* classes */ },
  
  // Common attributes
  common: {
    alignLeft: 'my-align-left',
    alignCenter: 'my-align-center',
    alignRight: 'my-align-right',
    alignWide: 'my-align-wide',
    alignFull: 'my-align-full'
  }
};
```

## Creating a Framework Adapter

Framework adapters convert WordPress blocks to components for specific JavaScript frameworks.

### Basic Structure

```javascript
// my-framework-adapter.js
import { convertBlocks } from 'wp-block-to-html';

// Utility to convert HTML string to your framework's component structure
function htmlToComponents(html) {
  // Implementation depends on your framework
  // This is a simplified example
  return {
    type: 'component',
    content: html
  };
}

// Convert blocks to components for your framework
export function convertBlocksToMyFramework(blocks, options = {}) {
  // First convert blocks to HTML
  const html = convertBlocks(blocks, options);
  
  // Then convert HTML to components
  return htmlToComponents(html);
}

// Custom component mapping
export function createComponentMap(customComponents = {}) {
  return {
    // Default components
    'core/paragraph': MyParagraphComponent,
    'core/heading': MyHeadingComponent,
    // Custom overrides
    ...customComponents
  };
}
```

### Using the Plugin

```javascript
import { convertBlocksToMyFramework, createComponentMap } from './my-framework-adapter';

// Custom component
function MyCustomHeading(props) {
  // Custom heading implementation
}

// Create a component map with overrides
const componentMap = createComponentMap({
  'core/heading': MyCustomHeading
});

// Convert blocks to components
const components = convertBlocksToMyFramework(blocks, {
  cssFramework: 'tailwind',
  components: componentMap
});

// Use the components in your app
function MyApp() {
  return (
    <div>
      {components}
    </div>
  );
}
```

## Creating Processing Middleware

Processing middleware allows you to intercept and modify blocks during the conversion process.

### Block Pre-Processor

```javascript
// my-preprocessing-plugin.js
export function analyticsPreProcessor(block) {
  // Add tracking attributes to links
  if (block.blockName === 'core/button' || block.blockName === 'core/image') {
    block.attrs = block.attrs || {};
    block.attrs.dataTracking = 'true';
    block.attrs.dataCategory = block.blockName.replace('core/', '');
  }
  
  // Process inner blocks recursively
  if (block.innerBlocks && block.innerBlocks.length > 0) {
    block.innerBlocks = block.innerBlocks.map(analyticsPreProcessor);
  }
  
  return block;
}
```

### Using the Middleware

```javascript
import { processBlocksForSSR, convertBlocks } from 'wp-block-to-html';
import { analyticsPreProcessor } from './my-preprocessing-plugin';

// Use with SSR processing
const optimizedBlocks = processBlocksForSSR(blocks, {
  preProcess: analyticsPreProcessor
});

// Or use directly
function processWithMiddleware(blocks) {
  const processedBlocks = Array.isArray(blocks) 
    ? blocks.map(analyticsPreProcessor)
    : analyticsPreProcessor(blocks);
    
  return convertBlocks(processedBlocks);
}

const html = processWithMiddleware(blocks);
```

## Creating Utility Plugins

Utility plugins provide additional functionality that extends the core library.

### Block Analysis Utility

```javascript
// block-analyzer-plugin.js
export function analyzeBlocks(blocks) {
  const blockTypes = new Set();
  const blockCount = {};
  let totalBlocks = 0;
  
  // Recursive function to analyze blocks
  function processBlock(block) {
    if (block.blockName) {
      blockTypes.add(block.blockName);
      blockCount[block.blockName] = (blockCount[block.blockName] || 0) + 1;
      totalBlocks++;
    }
    
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      block.innerBlocks.forEach(processBlock);
    }
  }
  
  // Process all blocks
  if (Array.isArray(blocks)) {
    blocks.forEach(processBlock);
  } else if (blocks) {
    processBlock(blocks);
  }
  
  return {
    uniqueBlockTypes: Array.from(blockTypes),
    blockCount,
    totalBlocks
  };
}
```

### Using the Utility

```javascript
import { analyzeBlocks } from './block-analyzer-plugin';

// Analyze blocks before conversion
const analysis = analyzeBlocks(blocks);
console.log(`Found ${analysis.totalBlocks} blocks of ${analysis.uniqueBlockTypes.length} different types`);
console.log('Block distribution:', analysis.blockCount);

// This could be used to conditionally load only required block handlers
const requiredBlockHandlers = {};
analysis.uniqueBlockTypes.forEach(blockType => {
  // Dynamically import only the required handlers
  if (blockType.startsWith('core/')) {
    const category = blockType.includes('image') || blockType.includes('gallery') 
      ? 'media' 
      : blockType.includes('paragraph') || blockType.includes('heading') 
        ? 'text' 
        : 'other';
    
    import(`wp-block-to-html/blocks/${category}/${blockType.replace('core/', '')}`).then(module => {
      requiredBlockHandlers[blockType] = module.default;
    });
  }
});
```

## Best Practices for Plugin Development

### 1. Follow the Library's Architecture

Align your plugin with the library's modular architecture:

```javascript
// Good: Modular plugin with clear separation of concerns
export const myPlugin = {
  blockTransformers: {
    'my-plugin/block': { transform: /* ... */ }
  },
  cssClasses: {
    paragraph: { /* ... */ }
  },
  utilities: {
    analyzeContent: /* ... */
  }
};

// Bad: Monolithic plugin that mixes concerns
export function myMixedPlugin(blocks) {
  // Transforming blocks, applying classes, and analyzing in one function
  // This is hard to maintain and doesn't fit with the library's architecture
}
```

### 2. Handle Errors Gracefully

Ensure your plugin handles errors without breaking the conversion process:

```javascript
// Good: Error handling
createBlockHandler('my-plugin/custom-block', {
  transform(block, options) {
    try {
      // Transformation logic that might fail
      return '<div>Custom HTML</div>';
    } catch (error) {
      console.error('Error transforming block:', error);
      // Return a fallback
      return `<div class="error-fallback">Block content unavailable</div>`;
    }
  }
});
```

### 3. Optimize for Performance

Consider performance implications, especially for large content sets:

```javascript
// Good: Memoized transformer
import memoize from 'lodash/memoize';

const transformBlock = (block, options) => {
  // Expensive transformation logic
  return '<div>Transformed content</div>';
};

// Memoize the transform function based on block ID or content
const memoizedTransform = memoize(
  transformBlock, 
  (block, options) => block.attrs?.id || JSON.stringify(block)
);

export const efficientBlockHandler = createBlockHandler('my-plugin/custom-block', {
  transform: memoizedTransform
});
```

### 4. Document Your Plugin

Provide clear documentation for your plugin:

```javascript
/**
 * My Custom Block Transformer
 * 
 * Transforms 'my-plugin/custom-block' WordPress blocks to HTML.
 * 
 * @param {Object} block - The WordPress block to transform
 * @param {Object} options - Conversion options
 * @param {string} options.cssFramework - CSS framework to use
 * @returns {string} HTML representation of the block
 * 
 * @example
 * import { myCustomBlockHandler } from 'my-plugin';
 * import { convertBlocks } from 'wp-block-to-html';
 * 
 * const html = convertBlocks(blocks, {
 *   blockTransformers: {
 *     'my-plugin/custom-block': myCustomBlockHandler
 *   }
 * });
 */
export const myCustomBlockHandler = createBlockHandler('my-plugin/custom-block', {
  transform(block, options) {
    // Implementation
  }
});
```

### 5. Maintain TypeScript Support

If using TypeScript, provide proper type definitions:

```typescript
// my-plugin.d.ts
import { BlockTransformer, WordPressBlock, ConversionOptions } from 'wp-block-to-html';

export interface MyCustomBlockAttributes {
  title?: string;
  content?: string;
  layout?: 'default' | 'featured';
}

export interface MyCustomBlock extends WordPressBlock {
  blockName: 'my-plugin/custom-block';
  attrs: MyCustomBlockAttributes;
}

export const myCustomBlockHandler: BlockTransformer;
```

## Publishing Your Plugin

### As an npm Package

1. Create a new npm package:

```bash
mkdir wp-block-to-html-my-plugin
cd wp-block-to-html-my-plugin
npm init
```

2. Set up the package structure:

```
wp-block-to-html-my-plugin/
├── src/
│   ├── index.js          # Main entry point
│   ├── transformers.js   # Block transformers
│   └── css-framework.js  # CSS framework adapter
├── dist/                 # Compiled output
├── package.json
├── README.md
└── LICENSE
```

3. Configure `package.json`:

```json
{
  "name": "wp-block-to-html-my-plugin",
  "version": "1.0.0",
  "description": "Custom plugin for WP Block to HTML",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "wp-block-to-html": "^1.0.0"
  },
  "scripts": {
    "build": "rollup -c",
    "test": "jest"
  }
}
```

4. Publish to npm:

```bash
npm publish
```

### Usage as npm Package

```javascript
import { convertBlocks } from 'wp-block-to-html';
import { customBlocks, myFrameworkClassMap } from 'wp-block-to-html-my-plugin';

const html = convertBlocks(blocks, {
  blockTransformers: customBlocks,
  classMap: myFrameworkClassMap
});
```

## Examples

### WooCommerce Blocks Plugin

```javascript
// woocommerce-blocks-plugin.js
import { createBlockHandler } from 'wp-block-to-html';

// Product block handler
export const productBlockHandler = createBlockHandler('woocommerce/product', {
  transform(block, options) {
    const { attrs = {} } = block;
    const { 
      id = 0, 
      productId = 0, 
      showImage = true, 
      showTitle = true, 
      showPrice = true, 
      showRating = false 
    } = attrs;
    
    // In a real implementation, you might fetch product data
    // Here we'll just create a structure based on the attributes
    
    let className = 'product';
    if (options.cssFramework === 'tailwind') {
      className = 'flex flex-col border rounded-lg overflow-hidden';
    } else if (options.cssFramework === 'bootstrap') {
      className = 'card product';
    }
    
    return `
      <div class="${className}" data-product-id="${id || productId}">
        ${showImage ? '<div class="product-image"><img src="placeholder.jpg" alt="Product" /></div>' : ''}
        <div class="product-details">
          ${showTitle ? '<h3 class="product-title">Product Title</h3>' : ''}
          ${showPrice ? '<div class="product-price">$99.99</div>' : ''}
          ${showRating ? '<div class="product-rating">★★★★☆ (4.0)</div>' : ''}
          <button class="add-to-cart-button">Add to Cart</button>
        </div>
      </div>
    `;
  }
});

// Product grid block handler
export const productsBlockHandler = createBlockHandler('woocommerce/products', {
  transform(block, options) {
    const { attrs = {}, innerBlocks = [] } = block;
    const { columns = 3 } = attrs;
    
    let wrapperClass = 'products-grid';
    let columnClass = 'product-column';
    
    if (options.cssFramework === 'tailwind') {
      wrapperClass = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-' + columns + ' gap-4';
      columnClass = '';
    } else if (options.cssFramework === 'bootstrap') {
      wrapperClass = 'row row-cols-1 row-cols-md-2 row-cols-lg-' + columns + ' g-4';
      columnClass = 'col';
    }
    
    let productsHTML = '';
    
    if (innerBlocks.length > 0) {
      // Import the convertBlocks function
      const { convertBlocks } = require('wp-block-to-html');
      
      productsHTML = innerBlocks.map(block => {
        // Wrap each product in a column div if needed
        const productHTML = convertBlocks(block, options);
        return columnClass 
          ? `<div class="${columnClass}">${productHTML}</div>` 
          : productHTML;
      }).join('');
    } else {
      // Placeholder for empty product grid
      productsHTML = '<div class="no-products">No products found</div>';
    }
    
    return `
      <div class="${wrapperClass}">
        ${productsHTML}
      </div>
    `;
  }
});

// Export all WooCommerce block handlers
export const wooCommerceBlocks = {
  'woocommerce/product': productBlockHandler,
  'woocommerce/products': productsBlockHandler,
  // Add more handlers for other WooCommerce blocks
};
```

### Custom Gutenberg Blocks Plugin

```javascript
// custom-gutenberg-blocks-plugin.js
import { createBlockHandler } from 'wp-block-to-html';

// Testimonial block handler
export const testimonialBlockHandler = createBlockHandler('acme/testimonial', {
  transform(block, options) {
    const { attrs = {} } = block;
    const { 
      author = '', 
      role = '', 
      company = '', 
      quote = '', 
      rating = 5, 
      image = null 
    } = attrs;
    
    let wrapperClass = 'testimonial';
    let quoteClass = 'testimonial-quote';
    let authorClass = 'testimonial-author';
    let metaClass = 'testimonial-meta';
    
    if (options.cssFramework === 'tailwind') {
      wrapperClass = 'bg-white p-6 rounded-lg shadow-md my-4';
      quoteClass = 'text-gray-700 italic mb-4 text-lg';
      authorClass = 'font-bold text-gray-900';
      metaClass = 'text-gray-600 text-sm';
    } else if (options.cssFramework === 'bootstrap') {
      wrapperClass = 'card my-3';
      quoteClass = 'card-body font-italic';
      authorClass = 'font-weight-bold';
      metaClass = 'text-muted small';
    }
    
    // Generate stars for rating
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    
    return `
      <div class="${wrapperClass}">
        <blockquote class="${quoteClass}">${quote}</blockquote>
        <div class="${metaClass}">
          ${image ? `<img src="${image.url}" alt="${author}" class="testimonial-image" width="60" height="60" />` : ''}
          <cite class="${authorClass}">${author}</cite>
          ${role || company ? `<span>${role}${company ? ` at ${company}` : ''}</span>` : ''}
          <div class="testimonial-rating">${stars}</div>
        </div>
      </div>
    `;
  }
});

// Team member block handler
export const teamMemberBlockHandler = createBlockHandler('acme/team-member', {
  transform(block, options) {
    const { attrs = {} } = block;
    const { 
      name = '', 
      position = '', 
      bio = '', 
      image = null, 
      socialLinks = [] 
    } = attrs;
    
    let wrapperClass = 'team-member';
    let imageClass = 'team-member-image';
    let nameClass = 'team-member-name';
    let positionClass = 'team-member-position';
    let bioClass = 'team-member-bio';
    let socialsClass = 'team-member-socials';
    
    if (options.cssFramework === 'tailwind') {
      wrapperClass = 'bg-white rounded-lg overflow-hidden shadow-md';
      imageClass = 'w-full h-64 object-cover object-center';
      nameClass = 'text-xl font-bold mt-4 px-4';
      positionClass = 'text-gray-600 px-4';
      bioClass = 'text-gray-700 p-4';
      socialsClass = 'flex space-x-4 p-4 border-t';
    } else if (options.cssFramework === 'bootstrap') {
      wrapperClass = 'card';
      imageClass = 'card-img-top';
      nameClass = 'card-title mt-3 px-3';
      positionClass = 'text-muted px-3';
      bioClass = 'card-body';
      socialsClass = 'd-flex justify-content-around p-3 border-top';
    }
    
    // Generate social links
    const socialLinksHTML = Array.isArray(socialLinks) && socialLinks.length > 0
      ? socialLinks.map(link => `
          <a href="${link.url}" class="social-link ${link.platform}" target="_blank" rel="noopener">
            ${link.icon || link.platform}
          </a>
        `).join('')
      : '';
    
    return `
      <div class="${wrapperClass}">
        ${image ? `<img src="${image.url}" alt="${name}" class="${imageClass}" width="${image.width}" height="${image.height}" />` : ''}
        <h3 class="${nameClass}">${name}</h3>
        <p class="${positionClass}">${position}</p>
        <div class="${bioClass}">${bio}</div>
        ${socialLinksHTML ? `<div class="${socialsClass}">${socialLinksHTML}</div>` : ''}
      </div>
    `;
  }
});

// Export all custom block handlers
export const customGutenbergBlocks = {
  'acme/testimonial': testimonialBlockHandler,
  'acme/team-member': teamMemberBlockHandler,
  // Add more handlers for other custom blocks
};
```

## Conclusion

Creating plugins for WP Block to HTML allows you to extend its capabilities to handle custom WordPress blocks, integrate with additional CSS frameworks, or add specialized functionality. By following the patterns and best practices outlined in this guide, you can create plugins that seamlessly integrate with the library's architecture while maintaining performance and reliability. 