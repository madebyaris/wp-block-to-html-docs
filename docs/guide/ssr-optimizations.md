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
- Preconnect hints for external resources (if enabled)
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
- Duplicate style removal (if enabled)
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
- Above-the-fold content prioritization
- Critical path optimizations
- Maximum HTML size reduction
- Typically results in 25-35% size reduction

## Configuration Options

You can customize the SSR optimization behavior with these options:

```javascript
const ssrOptions = {
  enabled: true,                   // Enable/disable SSR optimizations
  level: 'balanced',               // 'minimal', 'balanced', or 'maximum'
  optimizeImages: true,            // Add width/height for CLS prevention
  stripClientScripts: true,        // Remove client-side JavaScript
  stripComments: true,             // Remove HTML comments
  inlineCriticalCSS: false,        // Inline critical CSS (maximum level)
  lazyLoadMedia: true,             // Add lazy loading to media elements
  preserveFirstImage: true,        // Skip lazy-loading for first image (for LCP)
  optimizationDepth: 'full',       // Nesting depth for optimizations
  prioritizeAboveTheFold: false,   // Optimize above-the-fold content
  criticalPathOnly: false,         // Only render critical path content
  deferNonCritical: false,         // Defer loading of non-critical content
  preconnect: false,               // Add preconnect for external resources
  removeDuplicateStyles: false,    // Deduplicate inline styles
  minifyOutput: false,             // Minify final HTML output
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

## Media Optimization Features

### Lazy Loading Media

One of the key SSR optimizations is the automatic addition of lazy loading for media elements like images and iframes. This is controlled by the `lazyLoadMedia` option.

```javascript
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    lazyLoadMedia: true,
    preserveFirstImage: true
  }
});
```

When enabled, all media elements (except the first image if `preserveFirstImage` is true) will get the `loading="lazy"` attribute:

```html
<!-- First image - not lazy loaded (for LCP) -->
<img src="hero.jpg" alt="Hero image" width="1200" height="600" fetchpriority="high">

<!-- Subsequent images - lazy loaded -->
<img src="content1.jpg" alt="Content image 1" loading="lazy" width="800" height="400">
<img src="content2.jpg" alt="Content image 2" loading="lazy" width="800" height="400">

<!-- Iframes are also lazy loaded -->
<iframe src="https://www.youtube.com/embed/video" loading="lazy"></iframe>
```

### First Image Preservation

The `preserveFirstImage` option (enabled by default) ensures that the first image isn't lazy-loaded, as this could negatively impact Largest Contentful Paint (LCP). The first image also gets the `fetchpriority="high"` attribute to further improve LCP.

## Optimization Depth Control

The `optimizationDepth` option allows you to control how deeply nested blocks receive optimizations:

```javascript
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    optimizationDepth: 'medium' // Options: 'shallow', 'medium', 'full'
  }
});
```

- **shallow**: Only applies optimizations to top-level blocks
- **medium**: Applies optimizations to top-level and second-level blocks
- **full** (default): Applies optimizations to all blocks at all nesting levels

This is especially useful for complex layouts where you might only want to optimize the main content blocks.

## Above-the-Fold Optimizations

The library provides several options for prioritizing content that appears in the initial viewport ("above the fold"):

### prioritizeAboveTheFold

```javascript
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    level: 'maximum',
    prioritizeAboveTheFold: true
  }
});
```

When enabled, the library:
1. Identifies content likely to be above the fold
2. Adds special priority classes to these elements
3. Inserts a small script to optimize rendering of these elements
4. Uses the CSS `content-visibility` property to optimize rendering

### criticalPathOnly

```javascript
const criticalHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    level: 'maximum',
    criticalPathOnly: true
  }
});
```

When enabled, the library only renders content that's likely to be above the fold (approximately the first ~800px or content before `</header>`). This creates a minimal initial HTML payload focused exclusively on what the user sees first.

### deferNonCritical

```javascript
const deferredHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    level: 'maximum',
    deferNonCritical: true
  }
});
```

When enabled, the library:
1. Separates content into critical (above-the-fold) and non-critical sections
2. Initially hides the non-critical content
3. Inserts a script to load the non-critical content shortly after page load
4. Results in faster initial rendering while still delivering complete content

## External Resource Optimization

### preconnect

```javascript
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    preconnect: true
  }
});
```

When enabled, the library:
1. Analyzes your content for external resources (images, scripts, etc.)
2. Identifies unique external domains
3. Adds `<link rel="preconnect">` tags to the document head
4. Speeds up subsequent requests to these domains

Example output:
```html
<head>
  <!-- Other head elements -->
  <link rel="preconnect" href="https://example.com" crossorigin>
  <link rel="preconnect" href="https://cdn.example.org" crossorigin>
</head>
```

## CSS and HTML Optimization

### removeDuplicateStyles

```javascript
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    removeDuplicateStyles: true
  }
});
```

When enabled, the library:
1. Identifies duplicate or similar style blocks in the HTML
2. Combines these into a single style block
3. Places the combined styles at the beginning of the document
4. Reduces page size and improves CSS parsing performance

### minifyOutput

```javascript
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    minifyOutput: true
  }
});
```

When enabled, the library applies HTML minification to the final output:
1. Removes unnecessary whitespace
2. Collapses spaces between tags
3. Optimizes attribute formatting
4. Removes comments (if not already removed)
5. Typically reduces HTML size by an additional 10-25%

## Performance Benchmarks

Our benchmarks on real-world WordPress content show significant improvements:

| Metric                    | Without SSR Opt. | With Balanced Opt. | With Maximum Opt. |
|---------------------------|-----------------|-------------------|------------------|
| HTML Size (typical post)  | 4,888 bytes     | 3,449 bytes       | 2,933 bytes     |
| Scripts Count             | 2               | 0                 | 0                |
| Inline Event Handlers     | 3               | 0                 | 0                |
| Lazy-loaded Images        | 0               | 4                 | 4                |
| Initial Render Time       | 245ms           | 187ms             | 143ms           |
| Processing Overhead       | 0ms             | +15ms             | +32ms           |

## Framework Integration

The SSR optimization module integrates seamlessly with popular frameworks:

### Next.js Integration

```javascript
// pages/[slug].js
import { processBlocksForSSR } from 'wp-block-to-html';

export async function getServerSideProps({ params }) {
  // Fetch blocks from WordPress API
  const response = await fetch(`https://example.com/wp-json/wp/v2/posts?slug=${params.slug}`);
  const posts = await response.json();
  const post = posts[0];
  
  // Get block data from post content
  const blockData = { blocks: post.content };
  
  // Process with SSR optimizations
  const optimizedHtml = processBlocksForSSR(blockData, {
    ssrOptions: {
      enabled: true,
      level: 'maximum',
      preconnect: true,
      minifyOutput: true
    }
  });
  
  return {
    props: {
      post,
      optimizedHtml
    }
  };
}

export default function Post({ post, optimizedHtml }) {
  return (
    <div className="post-container">
      <h1>{post.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: optimizedHtml }} />
    </div>
  );
}
```

### Express.js Integration

```javascript
import express from 'express';
import { processBlocksForSSR } from 'wp-block-to-html';

const app = express();

app.get('/posts/:slug', async (req, res) => {
  // Fetch blocks from WordPress API
  const response = await fetch(`https://example.com/wp-json/wp/v2/posts?slug=${req.params.slug}`);
  const posts = await response.json();
  const post = posts[0];
  
  // Get block data
  const blockData = { blocks: post.content };
  
  // Process with SSR optimizations
  const optimizedHtml = processBlocksForSSR(blockData, {
    ssrOptions: {
      enabled: true,
      level: 'balanced',
      lazyLoadMedia: true,
      removeDuplicateStyles: true
    }
  });
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${post.title.rendered}</title>
      </head>
      <body>
        <h1>${post.title.rendered}</h1>
        <div class="content">${optimizedHtml}</div>
      </body>
    </html>
  `);
});

app.listen(3000);
```

## Best Practices

For optimal SSR performance:

1. **Start with balanced optimization** and benchmark before using maximum level
2. **Enable `preconnect`** if your content contains resources from external domains
3. **Always keep `preserveFirstImage` enabled** to maintain good LCP scores 
4. **Use `minifyOutput` in production** but not during development for debugging
5. **Consider `optimizationDepth: 'medium'`** for very complex nested layouts
6. **Test with real devices** to measure the actual impact on performance metrics

## Combining with Hydration

For the best of both worlds, combine SSR optimizations with client-side hydration:

```javascript
// Server-side
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    level: 'balanced',
    prepareForHydration: true, // Add data attributes for hydration
  }
});

// Client-side
import { hydrate } from 'wp-block-to-html/hydration';

// Hydrate the SSR content when the page loads
document.addEventListener('DOMContentLoaded', () => {
  hydrate(document.querySelector('.content'), window.__BLOCK_DATA__);
});
``` 