# SSR Optimizations

WP Block to HTML includes specialized optimizations for server-side rendering (SSR) to improve performance metrics like Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Total Blocking Time (TBT).

## Introduction to SSR Optimizations

Server-side rendering (SSR) is a crucial technique for improving initial page load performance and search engine optimization. When rendering WordPress content on the server side, there are specific optimizations that can improve Core Web Vitals and overall user experience.

The `processBlocksForSSR` function in WP Block to HTML provides these optimizations with configurable levels of processing.

## Basic Usage

```javascript
import { processBlocksForSSR } from 'wp-block-to-html';

// WordPress block data
const blockData = {
  blocks: [/* blocks */]
};

// Basic usage with default optimizations
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    // Uses 'balanced' optimization level by default
  }
});
```

## Optimization Levels

WP Block to HTML offers three levels of SSR optimization to suit different needs:

### 1. Minimal Optimization

Basic optimizations with minimal processing. Good for simple content where performance is already satisfactory.

```javascript
const minimalOptimized = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    level: 'minimal'
  }
});
```

**What it does:**
- Whitespace reduction
- HTML comment removal (configurable)
- Typically results in 5-15% size reduction

### 2. Balanced Optimization (Default)

Good balance between performance improvements and feature preservation. This is the default level.

```javascript
const balancedOptimized = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    level: 'balanced'
  }
});
```

**What it does:**
- All minimal optimizations
- Client-side script removal (configurable)
- Image optimization with lazy loading (except first image for LCP)
- Inline event handler removal
- Typically results in 20-30% size reduction

### 3. Maximum Optimization

All optimizations enabled for maximum performance. Best for highly performance-critical applications.

```javascript
const maxOptimized = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    level: 'maximum',
    optimizeImages: true,
    stripClientScripts: true,
    inlineCriticalCSS: true
  }
});
```

**What it does:**
- All balanced optimizations
- Critical CSS inlining (when enabled)
- Preload hints for above-the-fold images
- Maximum HTML size reduction
- Typically results in 25-35% size reduction

## Configuration Options

You can customize the SSR optimization behavior with these options:

```javascript
const ssrOptions = {
  enabled: true,                // Enable/disable SSR optimizations
  level: 'balanced',            // 'minimal', 'balanced', or 'maximum'
  optimizeImages: true,         // Add lazy loading to images (except first)
  stripClientScripts: true,     // Remove client-side JavaScript
  preserveJsonLd: true,         // Keep JSON-LD structured data scripts
  inlineCriticalCSS: false,     // Inline critical CSS (maximum level only)
  preserveComments: false,      // Keep HTML comments
  preProcessHTML: (html, options) => {
    // Custom processing before standard optimizations
    return html;
  },
  postProcessHTML: (html, options) => {
    // Custom processing after standard optimizations
    return html;
  }
};
```

## Lazy Loading Media Elements

One of the key SSR optimizations is the automatic addition of lazy loading for media elements like images.

::: info
The first image detected in the content is intentionally not lazy-loaded to prevent impacting Largest Contentful Paint (LCP). All subsequent images get the `loading="lazy"` attribute.
:::

Example output:

```html
<!-- First image - not lazy loaded (for LCP) -->
<img src="hero.jpg" alt="Hero image" width="1200" height="600">

<!-- Subsequent images - lazy loaded -->
<img src="content1.jpg" alt="Content image 1" loading="lazy" width="800" height="400">
<img src="content2.jpg" alt="Content image 2" loading="lazy" width="800" height="400">
```

## Performance Benchmarks

Our benchmarks on real-world WordPress content show significant improvements:

| Metric                    | Without SSR Opt. | With Balanced Opt. | Improvement |
|---------------------------|-----------------|-------------------|-------------|
| HTML Size (typical post)  | 4,888 bytes     | 3,449 bytes       | 29% smaller |
| Scripts Count             | 2               | 0                 | 100% removed |
| Inline Event Handlers     | 3               | 0                 | 100% removed |
| Lazy-loaded Images        | 0               | 1                 | Added automatically |
| Processing Speed (500 blocks) | 0.8 blocks/ms | 0.7 blocks/ms    | Minimal overhead |

## Framework Integration

The SSR optimization module integrates seamlessly with popular frameworks:

### Next.js Integration

```javascript
// pages/[slug].js
export async function getServerSideProps({ params }) {
  const post = await fetchPostBySlug(params.slug);
  
  const optimizedHtml = processBlocksForSSR(post.blocks, {
    cssFramework: 'tailwind',
    ssrOptions: {
      enabled: true,
      level: 'balanced'
    }
  });
  
  return {
    props: {
      postData: post,
      optimizedContent: optimizedHtml
    }
  };
}
```

### Nuxt.js Integration

```javascript
// server/api/post/[id].js
export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const post = await fetchPostById(id);
  
  const optimizedHtml = processBlocksForSSR(post.blocks, {
    cssFramework: 'tailwind',
    ssrOptions: {
      enabled: true,
      level: 'balanced'
    }
  });
  
  return { 
    post, 
    optimizedContent 
  };
});
```

## Custom Processing

You can extend the SSR optimizations with custom pre- and post-processing functions:

```javascript
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    level: 'balanced',
    preProcessHTML: (html, options) => {
      // Add optimization timestamp for debugging
      return html + '<!-- Optimization started: ' + new Date().toISOString() + ' -->';
    },
    postProcessHTML: (html, options) => {
      // Add performance hints via HTTP headers
      if (typeof global.response !== 'undefined' && global.response.setHeader) {
        global.response.setHeader('X-SSR-Optimized', 'true');
      }
      return html;
    }
  }
});
```

These SSR optimizations can significantly improve your Core Web Vitals scores and overall user experience. 