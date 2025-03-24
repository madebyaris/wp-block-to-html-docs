# Custom Block Transformers

WP Block to HTML provides a flexible API for creating custom block transformers to handle special cases or extend support for custom blocks.

## Introduction to Block Transformers

Block transformers are functions that convert WordPress block data into HTML. The library includes default transformers for all WordPress core blocks, but you can create custom transformers for:

1. **Custom Blocks**: Handle blocks from plugins or custom WordPress implementations
2. **Special Styling**: Apply custom styling or structure to specific blocks
3. **Extended Functionality**: Add additional features like analytics tracking or special attributes

## Creating a Custom Block Transformer

The `createBlockHandler` function makes it easy to create custom block transformers:

```javascript
import { createBlockHandler, convertBlocks } from 'wp-block-to-html';

const customParagraphHandler = createBlockHandler('core/paragraph', {
  transform(block, options) {
    const { attrs = {}, innerContent = [] } = block;
    const { align = '', fontSize = '', dropCap = false } = attrs;
    
    // Extract text content from the paragraph
    const content = innerContent[0].replace(/<\/?p[^>]*>/g, '');
    
    // Apply custom styling based on attributes
    let className = '';
    if (align) {
      className += options.cssFramework === 'tailwind' 
        ? `text-${align} ` 
        : `has-text-align-${align} `;
    }
    
    if (fontSize) {
      className += options.cssFramework === 'tailwind'
        ? `text-${fontSize} `
        : `has-${fontSize}-font-size `;
    }
    
    if (dropCap) {
      className += options.cssFramework === 'tailwind'
        ? 'first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 '
        : 'has-drop-cap ';
    }
    
    return `<p class="${className.trim()}">${content}</p>`;
  }
});

// Use the custom transformer
const html = convertBlocks(blockData, {
  blockTransformers: {
    'core/paragraph': customParagraphHandler
  }
});
```

## Block Transformer Interface

A block transformer must implement the `transform` method:

```typescript
interface BlockTransformer {
  transform(block: WordPressBlock, options: ConversionOptions): string;
}
```

- `block`: The WordPress block object to transform
- `options`: The configuration options for the conversion
- Returns: HTML string representing the transformed block

## Overriding Default Transformers

You can override the default transformers for core blocks by providing your own in the `blockTransformers` option:

```javascript
import { convertBlocks } from 'wp-block-to-html';

const html = convertBlocks(blockData, {
  blockTransformers: {
    'core/heading': {
      transform(block, options) {
        const { attrs = {} } = block;
        const { level = 2, content = '', align = '' } = attrs;
        
        // Custom implementation for headings
        return `<h${level} class="custom-heading ${align ? `align-${align}` : ''}">${content}</h${level}>`;
      }
    }
  }
});
```

## Handling Custom WordPress Blocks

For blocks from plugins or custom implementations:

```javascript
import { createBlockHandler, convertBlocks } from 'wp-block-to-html';

// Handler for a custom testimonial block
const testimonialBlockHandler = createBlockHandler('acme/testimonial', {
  transform(block, options) {
    const { attrs = {}, innerBlocks = [] } = block;
    const { author = '', role = '', rating = 5 } = attrs;
    
    // Process the content from inner blocks
    let testimonialContent = '';
    if (innerBlocks.length > 0) {
      testimonialContent = innerBlocks.map(innerBlock => 
        convertBlocks(innerBlock, options)
      ).join('');
    }
    
    // Generate stars for rating
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    
    // Return custom HTML structure
    return `
      <div class="testimonial">
        <div class="testimonial-content">${testimonialContent}</div>
        <div class="testimonial-meta">
          <div class="testimonial-author">${author}</div>
          <div class="testimonial-role">${role}</div>
          <div class="testimonial-rating">${stars}</div>
        </div>
      </div>
    `;
  }
});

// Use the custom block handler
const html = convertBlocks(blockData, {
  blockTransformers: {
    'acme/testimonial': testimonialBlockHandler
  }
});
```

## Accessing CSS Framework Options

Block transformers have access to the current CSS framework and custom class mappings:

```javascript
createBlockHandler('core/button', {
  transform(block, options) {
    const { attrs = {}, innerContent = [] } = block;
    const { url = '#', text = '', style = {} } = attrs;
    
    // Get appropriate button classes based on CSS framework
    let className = '';
    
    if (options.cssFramework === 'tailwind') {
      className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
    } else if (options.cssFramework === 'bootstrap') {
      className = 'btn btn-primary';
    } else {
      className = 'wp-block-button__link';
    }
    
    // Apply custom style
    const styleAttr = style.color 
      ? `style="background-color:${style.color.background};color:${style.color.text}"` 
      : '';
    
    return `<a href="${url}" class="${className}" ${styleAttr}>${text}</a>`;
  }
});
```

## Common Use Cases

### Adding Data Attributes

```javascript
createBlockHandler('core/image', {
  transform(block, options) {
    const { attrs = {} } = block;
    const { url, alt = '', id, width, height } = attrs;
    
    // Add data attributes for lazy loading, lightbox, etc.
    return `
      <img 
        src="${url}" 
        alt="${alt}" 
        width="${width}" 
        height="${height}"
        data-id="${id}"
        data-lightbox="gallery"
        data-caption="${alt}"
      />
    `;
  }
});
```

### Adding Analytics Tracking

```javascript
createBlockHandler('core/button', {
  transform(block, options) {
    const { attrs = {} } = block;
    const { url = '#', text = '' } = attrs;
    
    // Add analytics tracking attributes
    return `
      <a 
        href="${url}" 
        class="button" 
        data-tracking="true"
        data-event-category="Button"
        data-event-action="Click"
        data-event-label="${text}"
      >
        ${text}
      </a>
    `;
  }
});
```

### Supporting Third-Party Blocks

```javascript
// Support for a WooCommerce product block
createBlockHandler('woocommerce/product', {
  transform(block, options) {
    const { attrs = {} } = block;
    const { id, showPrice = true, showTitle = true, showImage = true } = attrs;
    
    // In a real implementation, you might fetch product data
    // or use data already available in the block
    
    return `
      <div class="product" data-product-id="${id}">
        ${showImage ? '<div class="product-image"><!-- Image HTML --></div>' : ''}
        ${showTitle ? '<h3 class="product-title">Product Title</h3>' : ''}
        ${showPrice ? '<div class="product-price">$99.99</div>' : ''}
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `;
  }
});
```

## Best Practices

When creating custom block transformers:

1. **Respect Content Handling Mode**: Check `options.contentHandling` to decide how to process content
2. **Framework Compatibility**: Adapt your output based on `options.cssFramework`
3. **Handle Nested Blocks**: Use `convertBlocks` recursively for inner blocks
4. **Sanitize Content**: Ensure your output HTML is properly sanitized
5. **Preserve Accessibility**: Maintain important accessibility attributes
6. **Consider SSR**: If using server-side rendering, maintain compatibility with optimizations 