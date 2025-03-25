# Performance Optimization

This guide covers techniques and strategies for optimizing the performance of the WP Block to HTML library in your applications. We'll explore various approaches to improve rendering speed, reduce bundle size, and enhance the user experience.

## Understanding Performance Factors

When working with WordPress content, several factors can impact performance:

1. **Content Size**: Large posts with many blocks can slow down processing
2. **Block Complexity**: Complex blocks with nested structures require more processing
3. **JavaScript Bundle Size**: Including all block handlers increases your app's size
4. **CSS Framework Size**: Some CSS frameworks can add significant overhead
5. **Server-Side Rendering (SSR)**: Improper SSR implementation can impact performance

## Quick Performance Wins

### Enable Server-Side Rendering

One of the most effective optimizations is to enable server-side rendering (SSR):

```typescript
import { convertBlocks } from 'wp-block-to-html';

const html = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'balanced'
  }
});
```

This pre-renders the HTML on the server, reducing client-side processing.

### Use Content Caching

Cache converted content to avoid repeated conversions:

```typescript
import { convertBlocks } from 'wp-block-to-html';

// Simple in-memory cache
const contentCache = new Map();

function getConvertedContent(blockId, blocks) {
  // Check if we have this content in cache
  const cacheKey = `${blockId}-${JSON.stringify(blocks)}`;
  
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey);
  }
  
  // Convert blocks and store in cache
  const html = convertBlocks(blocks);
  contentCache.set(cacheKey, html);
  
  return html;
}
```

For more robust caching, consider using:
- Redis or Memcached for server environments
- LocalStorage or IndexedDB for client-side caching
- HTTP caching with proper cache headers

## Bundle Size Optimization

### Selective Block Handler Imports

Instead of importing the entire library, import only the block handlers you need:

```typescript
import { createConverter } from 'wp-block-to-html/core';
import paragraphHandler from 'wp-block-to-html/blocks/paragraph';
import headingHandler from 'wp-block-to-html/blocks/heading';
import imageHandler from 'wp-block-to-html/blocks/image';

// Create a custom converter with only the handlers you need
const converter = createConverter({
  blockHandlers: [
    paragraphHandler,
    headingHandler,
    imageHandler
  ]
});

// Use the custom converter
const html = converter.convertBlocks(blocks);
```

This approach can significantly reduce your bundle size.

### Tree-Shaking Friendly Imports

The library is designed to be tree-shaking friendly. When using modern bundlers like Webpack, Rollup, or esbuild, make sure you're using ES modules:

```typescript
// Better for tree-shaking
import { convertBlocks, registerBlockHandler } from 'wp-block-to-html';

// Not ideal for tree-shaking
const wpBlockToHtml = require('wp-block-to-html');
```

### CSS Framework Considerations

Different CSS frameworks have different sizes:

```typescript
import { convertBlocks } from 'wp-block-to-html';

// Minimal CSS output (just default WordPress classes)
const htmlMinimal = convertBlocks(blocks, {
  cssFramework: 'none'
});

// Tailwind (requires you to include Tailwind CSS separately)
const htmlTailwind = convertBlocks(blocks, {
  cssFramework: 'tailwind'
});

// Custom minimal framework
const htmlCustom = convertBlocks(blocks, {
  cssFramework: 'custom',
  customClassMap: {
    // Only include mappings for the blocks you actually use
    'core/paragraph': { block: 'p' },
    'core/heading': { block: 'h' }
  }
});
```

## Incremental Rendering

For large content sets, incremental rendering can significantly improve perceived performance:

```typescript
import { convertBlocks } from 'wp-block-to-html';

const html = convertBlocks(blocks, {
  incrementalOptions: {
    enabled: true,
    initialRenderCount: 5,  // Render first 5 blocks immediately
    batchSize: 3,           // Then render 3 blocks at a time
    delayBetweenBatches: 50 // Wait 50ms between batches
  }
});
```

This works especially well with React or Vue integrations:

```typescript
import { createReactComponent } from 'wp-block-to-html/react';

const ContentComponent = createReactComponent(blocks, {
  incrementalOptions: {
    enabled: true,
    initialRenderCount: 5,
    batchSize: 3
  }
});
```

## Advanced SSR Optimizations

### Critical Path Rendering

Render only the visible content during SSR and defer the rest:

```typescript
import { convertBlocks } from 'wp-block-to-html';

// On the server (Node.js)
const html = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    criticalPathOnly: true, // Only render above-the-fold content
    deferNonCritical: true  // Add loading mechanism for the rest
  }
});
```

### Hybrid SSR + Client Hydration

```typescript
// Server-side code (Node.js)
import { convertBlocks } from 'wp-block-to-html';

function renderPage(blocks) {
  const html = convertBlocks(blocks, {
    ssrOptions: {
      enabled: true,
      optimizationLevel: 'maximum',
      lazyLoadMedia: true
    }
  });
  
  // Generate full page with the converted HTML
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>My WordPress Content</title>
      </head>
      <body>
        <div id="content">${html}</div>
        <script>
          // Pass blocks data to client for hydration
          window.__INITIAL_BLOCKS__ = ${JSON.stringify(blocks)};
        </script>
        <script src="/hydration.js"></script>
      </body>
    </html>
  `;
}

// Client-side hydration code (hydration.js)
import { hydrate } from 'wp-block-to-html/hydration';

document.addEventListener('DOMContentLoaded', () => {
  // Hydrate the static HTML with interactivity
  hydrate(window.__INITIAL_BLOCKS__, document.getElementById('content'));
});
```

## Performance Profiling

### Built-in Performance Metrics

The library includes built-in performance tracking:

```typescript
import { convertBlocks } from 'wp-block-to-html';

const { html, metrics } = convertBlocks(blocks, {
  debug: {
    enabled: true,
    trackPerformance: true
  },
  returnMetrics: true // Return performance metrics
});

console.log('Total conversion time:', metrics.totalTime, 'ms');
console.log('Blocks processed:', metrics.blockCount);
console.log('Average time per block:', metrics.averageBlockTime, 'ms');
console.log('Slowest block:', metrics.slowestBlock.blockName);
console.log('Slowest block time:', metrics.slowestBlock.time, 'ms');
```

### Custom Performance Monitoring

You can add your own performance tracking:

```typescript
import { convertBlocks } from 'wp-block-to-html';

// Custom performance measuring
function measurePerformance(blocks) {
  const start = performance.now();
  
  const html = convertBlocks(blocks);
  
  const end = performance.now();
  const totalTime = end - start;
  
  console.log(`Converted ${blocks.length} blocks in ${totalTime.toFixed(2)}ms`);
  console.log(`Average: ${(totalTime / blocks.length).toFixed(2)}ms per block`);
  
  return html;
}
```

## Lazy Loading Techniques

### Media Lazy Loading

Automatically add `loading="lazy"` to images and iframes:

```typescript
import { convertBlocks } from 'wp-block-to-html';

const html = convertBlocks(blocks, {
  ssrOptions: {
    lazyLoadMedia: true
  }
});
```

### Custom Lazy Loading with Intersection Observer

For more advanced lazy loading:

```typescript
import { convertBlocks } from 'wp-block-to-html';

// First, convert the blocks to HTML
const html = convertBlocks(blocks);

// Then apply lazy loading with Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
  const contentElement = document.getElementById('content');
  contentElement.innerHTML = html;
  
  // Set up Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // For images
        if (element.tagName === 'IMG' && element.dataset.src) {
          element.src = element.dataset.src;
          element.removeAttribute('data-src');
        }
        
        // For iframes
        if (element.tagName === 'IFRAME' && element.dataset.src) {
          element.src = element.dataset.src;
          element.removeAttribute('data-src');
        }
        
        // Stop observing this element
        observer.unobserve(element);
      }
    });
  });
  
  // Find all lazy-loadable elements
  contentElement.querySelectorAll('img[data-src], iframe[data-src]').forEach(element => {
    observer.observe(element);
  });
});
```

## Memory Management

### Handling Large Posts

For very large posts (hundreds of blocks), memory usage can become a concern:

```typescript
import { convertBlocks } from 'wp-block-to-html';

// Process large content in chunks
function processLargeContent(blocks) {
  const CHUNK_SIZE = 50; // Process 50 blocks at a time
  const results = [];
  
  // Process blocks in chunks
  for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
    const chunk = blocks.slice(i, i + CHUNK_SIZE);
    const chunkHtml = convertBlocks(chunk);
    results.push(chunkHtml);
    
    // Optional: Add a small delay to avoid blocking the main thread
    if (i + CHUNK_SIZE < blocks.length) {
      yield new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return results.join('');
}

// Example usage with async/await
async function renderLargePost(blocks) {
  const contentElement = document.getElementById('content');
  contentElement.innerHTML = 'Loading...';
  
  const html = await processLargeContent(blocks);
  contentElement.innerHTML = html;
}
```

### Memory Leaks Prevention

When using the library in long-running applications:

```typescript
import { convertBlocks, clearCache } from 'wp-block-to-html';

// After processing many posts, clear internal caches
function processMultiplePosts(posts) {
  posts.forEach(post => {
    const html = convertBlocks(post.blocks);
    // Use the HTML...
  });
  
  // Clear caches to free memory
  clearCache();
}

// For single-page applications, clear cache when navigating away
window.addEventListener('routechange', () => {
  clearCache();
});
```

## Mobile Optimization

For mobile-specific optimizations:

```typescript
import { convertBlocks } from 'wp-block-to-html';

function isLowEndDevice() {
  // Check for low-end device indicators
  const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
  const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores
  
  return memory <= 2 || cores <= 2;
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Apply optimizations based on device
const html = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    optimizationLevel: isLowEndDevice() ? 'maximum' : 'balanced',
    lazyLoadMedia: isMobileDevice() // Always lazy load on mobile
  },
  incrementalOptions: {
    enabled: isLowEndDevice(),
    initialRenderCount: 3,
    batchSize: 2
  }
});
```

## Framework-Specific Optimizations

### React Optimization

```typescript
import { createReactComponent } from 'wp-block-to-html/react';
import React, { Suspense } from 'react';

// Create a memoized component
const BlockContent = createReactComponent(blocks, {
  memo: true, // Enable React.memo
  optimizeDOMUpdates: true
});

// Use with React Suspense for better loading experience
function Post() {
  return (
    <div className="post">
      <Suspense fallback={<div>Loading content...</div>}>
        <BlockContent />
      </Suspense>
    </div>
  );
}
```

### Vue Optimization

```typescript
import { createVueComponent } from 'wp-block-to-html/vue';

// Create a Vue component with optimizations
const BlockContent = createVueComponent(blocks, {
  optimizeDOMUpdates: true,
  deferHydration: true
});

// Use in Vue template
// <block-content v-if="isReady" />
```

## Working with WordPress REST API

When fetching content from the WordPress REST API:

```typescript
import { convertBlocks } from 'wp-block-to-html';

// Efficient data fetching and processing
async function fetchAndRenderPost(postId) {
  try {
    // Only request the fields we need
    const response = await fetch(`https://mysite.com/wp-json/wp/v2/posts/${postId}?_fields=id,title,blocks`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    
    const post = await response.json();
    
    // Begin processing immediately as data arrives
    const html = convertBlocks(post.content, {
      ssrOptions: {
        enabled: true,
        optimizationLevel: 'balanced'
      }
    });
    
    // Update the DOM
    document.getElementById('post-title').textContent = post.title.rendered;
    document.getElementById('post-content').innerHTML = html;
  } catch (error) {
    console.error('Error rendering post:', error);
    document.getElementById('post-content').innerHTML = '<p>Error loading content</p>';
  }
}
```

## Performance with Custom Block Handlers

When writing custom block handlers, optimize for performance:

```typescript
import { BlockTransformer } from 'wp-block-to-html';

// Inefficient handler
const slowHandler: BlockTransformer = {
  blockName: 'my-plugin/complex-block',
  transform: (block, options) => {
    // ❌ Performing complex operations for every block
    const items = block.attrs.items || [];
    let html = '<div class="complex-block">';
    
    // Slow nested loops
    items.forEach(item => {
      html += '<div class="item">';
      (item.subitems || []).forEach(subitem => {
        html += `<div class="subitem">${subitem.text}</div>`;
      });
      html += '</div>';
    });
    
    html += '</div>';
    return html;
  }
};

// Optimized handler
const fastHandler: BlockTransformer = {
  blockName: 'my-plugin/complex-block',
  transform: (block, options) => {
    // ✅ Retrieve data once, outside any loops
    const items = block.attrs.items || [];
    
    // Use array joining for better string concatenation performance
    const itemsHtml = items.map(item => {
      const subitemsHtml = (item.subitems || [])
        .map(subitem => `<div class="subitem">${subitem.text}</div>`)
        .join('');
        
      return `<div class="item">${subitemsHtml}</div>`;
    }).join('');
    
    // Single string concatenation
    return `<div class="complex-block">${itemsHtml}</div>`;
  }
};
```

## Browser Rendering Optimization

### Reducing Layout Thrashing

When dynamically inserting converted HTML:

```typescript
// Bad approach - causes multiple reflows
function renderContentBad(blocks) {
  const container = document.getElementById('content');
  container.innerHTML = ''; // One reflow
  
  blocks.forEach(block => {
    const blockHtml = convertBlocks([block]);
    container.innerHTML += blockHtml; // Reflow for each block
  });
}

// Better approach - single reflow
function renderContentGood(blocks) {
  const html = convertBlocks(blocks); // Process all blocks at once
  document.getElementById('content').innerHTML = html; // Single reflow
}

// Best approach - DocumentFragment
function renderContentBest(blocks) {
  const fragment = document.createDocumentFragment();
  const tempDiv = document.createElement('div');
  
  const html = convertBlocks(blocks);
  tempDiv.innerHTML = html;
  
  // Move nodes to fragment
  while (tempDiv.firstChild) {
    fragment.appendChild(tempDiv.firstChild);
  }
  
  // Single DOM update
  const container = document.getElementById('content');
  container.innerHTML = '';
  container.appendChild(fragment);
}
```

### Animations and Transitions

Adding smooth loading animations:

```typescript
import { convertBlocks } from 'wp-block-to-html';

function renderWithAnimation(blocks) {
  const contentElement = document.getElementById('content');
  
  // First, convert all blocks
  const html = convertBlocks(blocks);
  
  // Create a temporary container
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Add animation classes to each top-level element
  Array.from(tempDiv.children).forEach((element, index) => {
    element.classList.add('fade-in');
    element.style.animationDelay = `${index * 50}ms`;
  });
  
  // Replace content
  contentElement.innerHTML = tempDiv.innerHTML;
}

// Add the corresponding CSS
/*
.fade-in {
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
*/
```

## Performance Best Practices Summary

1. **Use Server-Side Rendering** whenever possible
2. **Implement proper caching** at various levels
3. **Import only the block handlers you need**
4. **Enable incremental rendering** for large content
5. **Choose CSS frameworks carefully** considering performance trade-offs
6. **Lazy load media** to improve initial load time
7. **Monitor performance** with built-in metrics
8. **Optimize custom block handlers** for speed
9. **Process large content in chunks** to avoid memory issues
10. **Use framework-specific optimizations** when working with React or Vue

## Next Steps

- Learn about [Server-Side Rendering](/guide/server-side-rendering) in depth
- Explore [CSS Framework Integration](/guide/css-frameworks) for optimal CSS usage
- Check out [Plugin Development](/guide/plugins) for extending the library
- Read about [TypeScript Interfaces](/api/typescript/interfaces) for type-safe optimizations 