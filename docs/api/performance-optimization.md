# Performance Optimization Guide

This guide provides strategies and best practices for optimizing performance when using WP Block to HTML, especially for large sites with substantial content.

## Understanding Performance Challenges

When working with headless WordPress sites, several performance challenges may arise:

1. **Large Content Sets**: Processing many blocks across multiple pages
2. **Complex Nested Structures**: Deeply nested blocks requiring recursive processing
3. **Media-Heavy Content**: Pages with numerous images, galleries, or embeds
4. **Server-Side Rendering**: Additional processing requirements for SSR applications
5. **Bundle Size**: Impact on application load time and performance

## Performance Metrics

When optimizing, focus on these key metrics:

- **Processing Time**: How long it takes to convert blocks to HTML
- **Memory Usage**: Peak memory consumption during conversion
- **Bundle Size**: Impact on application load time
- **Core Web Vitals**: LCP, CLS, and FID/INP metrics for end users
- **Server Response Time**: For server-rendered applications

## Bundle Size Optimization

### Selective Imports

Import only what you need to reduce bundle size:

```javascript
// ❌ Bad: Importing the entire library
import * as wpBlockToHtml from 'wp-block-to-html';

// ✅ Good: Import only what you need
import { convertBlocks } from 'wp-block-to-html/core';
import { paragraphBlockHandler } from 'wp-block-to-html/blocks/text';
import { imageBlockHandler } from 'wp-block-to-html/blocks/media';
```

### Dynamic Imports

For client-side applications, use dynamic imports to load transformers on demand:

```javascript
async function processContent(blocks) {
  const { convertBlocks } = await import('wp-block-to-html/core');
  
  // Analyze which block types are present
  const blockTypes = new Set(blocks.map(block => block.blockName));
  
  // Only import needed transformers
  const transformers = {};
  
  if (blockTypes.has('core/paragraph') || blockTypes.has('core/heading')) {
    const textHandlers = await import('wp-block-to-html/blocks/text');
    // Add relevant handlers to transformers object
  }
  
  if (blockTypes.has('core/image') || blockTypes.has('core/gallery')) {
    const mediaHandlers = await import('wp-block-to-html/blocks/media');
    // Add relevant handlers to transformers object
  }
  
  return convertBlocks(blocks, { blockTransformers: transformers });
}
```

### Tree-Shaking

Ensure your build setup is configured for effective tree-shaking:

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

## Processing Optimization

### Memoization

Use memoization to avoid reprocessing identical blocks:

```javascript
import memoize from 'lodash/memoize';

// Memoize the convertBlocks function based on input
const memoizedConvertBlocks = memoize(
  (blocks, options) => convertBlocks(blocks, options),
  (blocks, options) => {
    // Create a cache key based on the blocks and relevant options
    const blockIds = blocks.map(block => block.attrs?.id || block.blockName).join('|');
    const optionsKey = JSON.stringify({
      cssFramework: options.cssFramework,
      contentHandling: options.contentHandling
    });
    return `${blockIds}-${optionsKey}`;
  }
);

// Use the memoized function
const html = memoizedConvertBlocks(blocks, options);
```

### Batch Processing

For large content sets, process blocks in batches:

```javascript
async function processBatchedContent(allBlocks, options) {
  const BATCH_SIZE = 50;
  let result = '';
  
  // Process blocks in batches
  for (let i = 0; i < allBlocks.length; i += BATCH_SIZE) {
    const batch = allBlocks.slice(i, i + BATCH_SIZE);
    result += await convertBlocks(batch, options);
    
    // Allow event loop to process other tasks
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return result;
}
```

### Web Workers

Offload processing to Web Workers in client-side applications:

```javascript
// worker.js
import { convertBlocks } from 'wp-block-to-html';

self.addEventListener('message', (event) => {
  const { blocks, options } = event.data;
  const result = convertBlocks(blocks, options);
  self.postMessage(result);
});

// Main application
function processInWorker(blocks, options) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { type: 'module' });
    
    worker.onmessage = (event) => {
      resolve(event.data);
      worker.terminate();
    };
    
    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };
    
    worker.postMessage({ blocks, options });
  });
}
```

## Server-Side Rendering Optimization

### SSR Optimization Module

Use the built-in SSR optimization module:

```javascript
import { processBlocksForSSR, convertBlocks } from 'wp-block-to-html';

// Apply SSR optimizations
const optimizedBlocks = processBlocksForSSR(blocks, {
  optimizationLevel: 'maximum',
  lazyLoadMedia: true,
  prioritizeAboveTheFold: true
});

// Convert the optimized blocks
const html = convertBlocks(optimizedBlocks);
```

### Streaming SSR

For Next.js or other frameworks with streaming support:

```javascript
import { renderToNodeStream } from 'react-dom/server';
import { convertBlocksToReact } from 'wp-block-to-html/react';

// In your server rendering function
function handleRequest(req, res) {
  // Fetch blocks from WordPress API
  
  // Convert blocks to React components
  const reactComponents = convertBlocksToReact(blocks, {
    ssrOptions: {
      enabled: true,
      optimizationLevel: 'balanced'
    }
  });
  
  // Create a stream of the rendered output
  const stream = renderToNodeStream(reactComponents);
  
  // Set headers and pipe stream to response
  res.setHeader('Content-Type', 'text/html');
  stream.pipe(res);
}
```

### Caching

Implement caching for converted blocks:

```javascript
import { createClient } from 'redis';

const redis = createClient();
await redis.connect();

async function getConvertedContent(postId, options) {
  const cacheKey = `wp-block-html:${postId}:${JSON.stringify(options)}`;
  
  // Try to get from cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Fetch blocks from WordPress API
  const blocks = await fetchBlocksFromAPI(postId);
  
  // Convert blocks
  const html = convertBlocks(blocks, options);
  
  // Store in cache (expires in 1 hour)
  await redis.set(cacheKey, html, { EX: 3600 });
  
  return html;
}
```

## Media Optimization

### Lazy Loading

Enable lazy loading for media elements:

```javascript
import { convertBlocks } from 'wp-block-to-html';

const html = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    lazyLoadMedia: true,
    preserveFirstImage: true  // Don't lazy-load the first image (for LCP)
  }
});
```

### Image Size Attributes

Ensure images have explicit width and height attributes to prevent layout shifts:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Custom transformer for images
const imageBlockHandler = {
  transform(block, options) {
    const { attrs = {} } = block;
    const { url, alt = '', width, height } = attrs;
    
    return `
      <img 
        src="${url}" 
        alt="${alt}" 
        ${width ? `width="${width}"` : ''} 
        ${height ? `height="${height}"` : ''}
        loading="lazy"
      />
    `;
  }
};

const html = convertBlocks(blocks, {
  blockTransformers: {
    'core/image': imageBlockHandler
  }
});
```

### Responsive Images

Generate responsive images with the `srcset` attribute:

```javascript
function generateSrcSet(imageUrl) {
  // Extract base URL and extension
  const [base, ext] = imageUrl.split(/\.(?=[^.]+$)/);
  
  // Define widths for responsive images
  const widths = [320, 640, 960, 1280, 1920];
  
  // Generate srcset attribute
  return widths
    .map(width => `${base}-${width}w.${ext} ${width}w`)
    .join(', ');
}

const imageBlockHandler = {
  transform(block, options) {
    const { attrs = {} } = block;
    const { url, alt = '', width, height } = attrs;
    
    const srcset = generateSrcSet(url);
    
    return `
      <img 
        src="${url}" 
        srcset="${srcset}"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt="${alt}" 
        width="${width}" 
        height="${height}"
        loading="lazy"
      />
    `;
  }
};
```

## Framework-Specific Optimizations

### React

Optimize React components:

```jsx
import React, { memo, useMemo } from 'react';
import { convertBlocksToReact } from 'wp-block-to-html/react';

// Memoize expensive component
const MemoizedContent = memo(function Content({ blocks, options }) {
  // Use useMemo to prevent unnecessary reconversion
  const components = useMemo(() => 
    convertBlocksToReact(blocks, options),
    [blocks, options.cssFramework, options.contentHandling]
  );
  
  return <div className="content">{components}</div>;
});

// Usage
function Post({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <MemoizedContent blocks={post.blocks} options={{ cssFramework: 'tailwind' }} />
    </article>
  );
}
```

### Vue

Optimize Vue components:

```vue
<template>
  <div class="content">
    <component 
      v-for="(component, index) in components" 
      :key="index" 
      :is="component.type" 
      v-bind="component.props" 
    />
  </div>
</template>

<script>
import { convertBlocksToVue } from 'wp-block-to-html/vue';

export default {
  props: {
    blocks: Array,
    options: Object
  },
  computed: {
    // Memoize the conversion
    components() {
      return convertBlocksToVue(this.blocks, this.options);
    }
  }
}
</script>
```

## Advanced Techniques

### Code Splitting

Split your application by content types:

```javascript
// Dynamic import based on content type
async function loadContentProcessor(contentType) {
  switch (contentType) {
    case 'blog':
      return import('./processors/blog-processor');
    case 'product':
      return import('./processors/product-processor');
    case 'page':
      return import('./processors/page-processor');
    default:
      return import('./processors/default-processor');
  }
}

// Usage
async function processContent(contentType, blocks) {
  const processor = await loadContentProcessor(contentType);
  return processor.convert(blocks);
}
```

### Analysis and Optimization

Analyze your content to optimize transformer selection:

```javascript
function analyzeContent(blocks) {
  const stats = {
    totalBlocks: 0,
    blockTypes: {},
    nestingDepth: 0,
    mediaCount: 0
  };
  
  function traverseBlocks(blockList, depth = 0) {
    for (const block of blockList) {
      stats.totalBlocks++;
      stats.blockTypes[block.blockName] = (stats.blockTypes[block.blockName] || 0) + 1;
      stats.nestingDepth = Math.max(stats.nestingDepth, depth);
      
      // Count media blocks
      if (['core/image', 'core/gallery', 'core/video'].includes(block.blockName)) {
        stats.mediaCount++;
      }
      
      // Process inner blocks
      if (block.innerBlocks && block.innerBlocks.length > 0) {
        traverseBlocks(block.innerBlocks, depth + 1);
      }
    }
  }
  
  traverseBlocks(blocks);
  return stats;
}

// Use analysis to determine optimization strategy
function determineOptimizationStrategy(blocks) {
  const analysis = analyzeContent(blocks);
  
  if (analysis.totalBlocks > 100) {
    return 'batch-processing';
  } else if (analysis.mediaCount > 20) {
    return 'media-optimization';
  } else if (analysis.nestingDepth > 5) {
    return 'recursive-optimization';
  } else {
    return 'standard';
  }
}
```

### Pre-processing Content

Pre-process content to optimize before conversion:

```javascript
function preprocessBlocks(blocks) {
  return blocks.map(block => {
    // Clone to avoid mutating original
    const processedBlock = { ...block };
    
    // Optimize image blocks
    if (block.blockName === 'core/image') {
      processedBlock.attrs = { ...block.attrs };
      
      // Add loading attribute if missing
      if (!processedBlock.attrs.loading) {
        processedBlock.attrs.loading = 'lazy';
      }
      
      // Ensure width and height are present
      if (!processedBlock.attrs.width || !processedBlock.attrs.height) {
        // In real implementation, you might fetch image dimensions
        processedBlock.attrs.width = processedBlock.attrs.width || 800;
        processedBlock.attrs.height = processedBlock.attrs.height || 600;
      }
    }
    
    // Process inner blocks recursively
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      processedBlock.innerBlocks = preprocessBlocks(block.innerBlocks);
    }
    
    return processedBlock;
  });
}

// Use pre-processed blocks
const optimizedBlocks = preprocessBlocks(blocks);
const html = convertBlocks(optimizedBlocks, options);
```

## Case Study: Optimizing a Large Website

### Scenario

A large content site with 10,000+ pages, each containing an average of 50-100 blocks, including:
- Text blocks (paragraphs, headings, lists)
- Media blocks (images, galleries, videos)
- Layout blocks (columns, groups)
- Dynamic blocks (latest posts, embeds)

### Optimization Strategy

1. **Content Analysis**: Analyze block usage across the site
   ```javascript
   const blockUsageMap = await analyzeAllContent();
   console.log('Most used blocks:', blockUsageMap);
   ```

2. **Selective Loading**: Create a customized build with only necessary transformers
   ```javascript
   // Include only frequently used blocks
   const commonTransformers = {};
   for (const [blockName, count] of Object.entries(blockUsageMap)) {
     if (count > 100) { // Block appears in at least 100 pages
       commonTransformers[blockName] = getTransformerForBlock(blockName);
     }
   }
   ```

3. **SSR Optimization**: Apply server-side optimizations
   ```javascript
   // Enable all optimizations for SSR
   const ssrOptions = {
     enabled: true,
     optimizationLevel: 'maximum',
     lazyLoadMedia: true,
     prioritizeAboveTheFold: true,
     preserveFirstImage: true,
     optimizationDepth: 3
   };
   ```

4. **Caching Strategy**: Implement multi-level caching
   ```javascript
   // Cache levels:
   // 1. Block conversion cache (Redis)
   // 2. Page-level cache (CDN)
   // 3. Component-level cache (In-memory)
   
   async function getPageContent(pageId) {
     // Check Redis cache first
     const cached = await redisClient.get(`page:${pageId}`);
     if (cached) return cached;
     
     // Fetch blocks from WordPress
     const blocks = await fetchBlocksFromAPI(pageId);
     
     // Convert blocks with all optimizations
     const html = convertBlocks(
       processBlocksForSSR(blocks, ssrOptions),
       { blockTransformers: commonTransformers }
     );
     
     // Store in cache (expires in 1 hour)
     await redisClient.set(`page:${pageId}`, html, { EX: 3600 });
     
     return html;
   }
   ```

5. **Incremental Static Regeneration** (for Next.js sites)
   ```javascript
   // In Next.js pages
   export async function getStaticProps({ params }) {
     const pageId = params.id;
     const html = await getPageContent(pageId);
     
     return {
       props: { html },
       // Regenerate page after 1 hour
       revalidate: 3600
     };
   }
   
   export async function getStaticPaths() {
     // Only pre-render the most popular pages
     const popularPages = await getPopularPages(100);
     
     return {
       paths: popularPages.map(page => ({ params: { id: page.id } })),
       fallback: 'blocking' // Generate other pages on demand
     };
   }
   ```

6. **Resource Monitoring** to identify performance bottlenecks
   ```javascript
   // Add performance monitoring
   function monitorPerformance(pageId, startTime) {
     const duration = Date.now() - startTime;
     metrics.recordProcessingTime(pageId, duration);
     
     if (duration > 500) {
       logger.warn(`Slow page processing for ${pageId}: ${duration}ms`);
     }
   }
   ```

### Results

- **90% reduction** in bundle size through selective imports
- **70% improvement** in page load times
- **50% reduction** in server processing time
- Improved Core Web Vitals scores across all metrics

## Performance Testing Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse): Analyze page performance
- [WebPageTest](https://www.webpagetest.org/): Comprehensive performance testing
- [Node.js Profiler](https://nodejs.org/en/docs/guides/simple-profiling/): Profile server-side processing
- [React Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html): Profile React component rendering
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools): Analyze runtime performance

## Conclusion

Optimizing WP Block to HTML for large sites requires a multi-faceted approach:

1. **Bundle Optimization**: Use selective imports and tree-shaking
2. **Processing Efficiency**: Apply memoization, batching, and workers
3. **SSR Optimization**: Utilize built-in optimization features
4. **Caching Strategy**: Implement multi-level caching
5. **Media Handling**: Optimize images and enable lazy loading
6. **Framework Optimizations**: Use framework-specific performance features
7. **Content Analysis**: Understand and adapt to your content patterns

By applying these techniques, you can achieve excellent performance even with large and complex WordPress content. 