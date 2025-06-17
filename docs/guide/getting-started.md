# Getting Started

:::info v1.0.0 STABLE RELEASE
🎉 **WP Block to HTML v1.0.0 is now available!** This stable release includes production-ready client-side hydration, comprehensive framework support, and performance optimizations achieving 947 blocks/ms processing speed.
:::

:::warning IMPORTANT: Accessing Block Content
**You cannot directly access raw block content from WordPress.**

To use WP Block to HTML with raw block data, you'll need to install a plugin to expose this content. We're developing an official plugin with proper security measures to safely expose this data.

In the meantime, you can use a plugin like [Post Raw Content](https://github.com/w1z2g3/wordpress-plugins/blob/master/post-raw-content.php) to access block data.

**Note:** You can still use this package without a plugin by working with the rendered HTML content that WordPress provides by default. The package will handle rendered HTML content automatically, as shown in the "Option 2" example below.

Stay tuned for our official plugin release!
:::

This guide will help you quickly integrate WP Block to HTML v1.0.0 into your project and convert WordPress content into clean, framework-compatible HTML with optional client-side hydration.

## Installation

Install the stable v1.0.0 release using your preferred package manager:

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

## Quick Start

### Step 1: Import the library

```javascript
import { convertBlocks } from 'wp-block-to-html';

// NEW in v1.0.0: Import hydration module for client-side hydration
import { HydrationManager } from 'wp-block-to-html/hydration';
```

### Step 2: Prepare your WordPress block data

```javascript
// WordPress Gutenberg block data
const blockData = {
  blocks: [
    {
      blockName: 'core/paragraph',
      attrs: { align: 'center' },
      innerContent: ['<p>Hello WordPress!</p>']
    },
    {
      blockName: 'core/heading',
      attrs: { level: 2 },
      innerContent: ['<h2>Welcome to Headless WordPress</h2>']
    }
  ]
};
```

### Step 3: Convert blocks to HTML

```javascript
// Convert to HTML with default settings
const html = convertBlocks(blockData);
console.log(html);
// Output:
// <p class="wp-block-paragraph has-text-align-center">Hello WordPress!</p>
// <h2 class="wp-block-heading">Welcome to Headless WordPress</h2>
```

### Step 4: Use the converted HTML in your application

```javascript
// React example
function MyComponent() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// Vanilla JavaScript
document.getElementById('content').innerHTML = html;
```

### Step 5: Add Client-Side Hydration (NEW in v1.0.0)

```javascript
// Initialize hydration manager with progressive loading
const hydrationManager = new HydrationManager({
  strategy: 'viewport', // viewport, interaction, idle, immediate
  rootSelector: '#content',
  throttle: 100
});

// Hydrate specific blocks when they become visible
await hydrationManager.hydrateBlock('core/gallery');

// Or hydrate all interactive blocks progressively
await hydrationManager.hydrateAll();
```

## Handling WordPress REST API Content

The WordPress REST API doesn't expose raw block data by default. You'll need a plugin to access this data:

### Option 1: Raw Block Data (Preferred)

```javascript
// IMPORTANT: You need to install a plugin like Post Raw Content to expose block data
// https://github.com/w1z2g3/wordpress-plugins/blob/master/post-raw-content.php
//
// Once installed, you can fetch the block data:

async function fetchPost() {
  const response = await fetch('https://example.com/wp-json/wp/v2/posts/1?_fields=id,title,content,blocks');
  const post = await response.json();
  
  if (post.blocks) {
    const html = convertBlocks(post.blocks, {
      cssFramework: 'tailwind',
      contentHandling: 'raw',
      hydration: {
        strategy: 'progressive',
        priorityBlocks: ['core/button', 'core/gallery']
      }
    });
    document.getElementById('content').innerHTML = html;
    
    // NEW in v1.0.0: Set up hydration for interactive blocks
    const hydrationManager = new HydrationManager({
      strategy: 'viewport',
      rootSelector: '#content'
    });
    await hydrationManager.hydrateAll();
  }
}
```

### Option 2: Rendered HTML Content (Always Available)

If block data isn't available, you can use the rendered HTML:

```javascript
async function fetchPost() {
  const response = await fetch('https://example.com/wp-json/wp/v2/posts/1?_fields=id,title,content');
  const post = await response.json();
  
  if (post.content && post.content.rendered) {
    // Option A: Use rendered content directly
    document.getElementById('content').innerHTML = post.content.rendered;
    
    // Option B: Pass rendered content through the library for processing
    const html = convertBlocks({
      rendered: post.content.rendered
    }, {
      contentHandling: 'rendered',
      cssFramework: 'tailwind',
      hydration: { strategy: 'idle' } // NEW in v1.0.0
    });
    document.getElementById('content').innerHTML = html;
  }
}
```

## Complete Example with Error Handling

Here's a complete example that handles both block data and rendered content with proper fallbacks and hydration:

```javascript
import { convertBlocks } from 'wp-block-to-html';
import { HydrationManager } from 'wp-block-to-html/hydration';

async function displayWordPressPost(postId) {
  try {
    // Fetch post data
    const response = await fetch(`https://example.com/wp-json/wp/v2/posts/${postId}?_fields=id,title,content,blocks`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
    }
    
    const post = await response.json();
    let content = '';
    let useHydration = false;
    
    // Process content based on what's available
    if (post.content) {
      console.log('Processing raw block data...');
      content = convertBlocks(post.content, {
        cssFramework: 'tailwind',
        contentHandling: 'raw',
        hydration: {
          strategy: 'progressive',
          priorityBlocks: ['core/button', 'core/gallery', 'core/video']
        }
      });
      useHydration = true;
    } else if (post.content && post.content.rendered) {
      console.log('Using rendered content...');
      content = post.content.rendered;
    } else {
      console.warn('No content found for this post');
      content = '<div class="error">No content available</div>';
    }
    
    // Display the content
    document.getElementById('post-title').textContent = post.title.rendered;
    document.getElementById('post-content').innerHTML = content;
    
    // NEW in v1.0.0: Set up client-side hydration if using raw blocks
    if (useHydration) {
      const hydrationManager = new HydrationManager({
        strategy: 'viewport',
        rootSelector: '#post-content',
        throttle: 100
      });
      
      // Hydrate interactive blocks progressively
      await hydrationManager.hydrateAll();
      console.log('✅ Client-side hydration complete');
    }
    
  } catch (error) {
    console.error('Error displaying post:', error);
    document.getElementById('post-content').innerHTML = 
      `<div class="error">Error loading content: ${error.message}</div>`;
  }
}

// Usage
displayWordPressPost(123);
```

## CSS Framework Integration

You can output HTML with classes from popular CSS frameworks:

```javascript
// With Tailwind CSS
const tailwindHtml = convertBlocks(blockData, { 
  cssFramework: 'tailwind',
  hydration: { strategy: 'viewport' } // NEW in v1.0.0
});
console.log(tailwindHtml);
// Output:
// <p class="text-center">Hello WordPress!</p>
// <h2 class="text-2xl font-bold">Welcome to Headless WordPress</h2>

// With Bootstrap
const bootstrapHtml = convertBlocks(blockData, { 
  cssFramework: 'bootstrap' 
});
console.log(bootstrapHtml);
// Output:
// <p class="text-center">Hello WordPress!</p>
// <h2 class="h2">Welcome to Headless WordPress</h2>
```

## Custom Configuration

For more control, you can provide a complete configuration object:

```javascript
const html = convertBlocks(blockData, {
  // Output format (default: 'html')
  outputFormat: 'html', // 'html' | 'react' | 'vue' | 'angular' | 'svelte'
  
  // CSS framework (default: 'none')
  cssFramework: 'tailwind', // 'none' | 'tailwind' | 'bootstrap' | 'custom'
  
  // Content handling (default: 'raw')
  contentHandling: 'raw', // 'raw' | 'rendered' | 'hybrid'
  
  // Server-side rendering optimizations
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'balanced', // 'minimal' | 'balanced' | 'maximum'
    lazyLoadMedia: true
  }
});
```

## Troubleshooting Common Issues

### Issue: Blocks Not Converting Correctly

If your blocks aren't converting as expected:

```javascript
// Enable debugging to see detailed information
const html = convertBlocks(blockData, {
  debug: true
});
```

### Issue: WordPress API Not Returning Block Data

If you're not getting block data from the WordPress API:

1. Make sure you've installed a plugin to expose raw block content. We recommend:
   - [Post Raw Content](https://github.com/w1z2g3/wordpress-plugins/blob/master/post-raw-content.php) (temporary solution)
   - Our official plugin (coming soon)

2. Check that the plugin is properly installed and activated.

3. Verify that your API request includes the necessary fields:
   ```javascript
   // Make sure to request the blocks field
   const response = await fetch('https://example.com/wp-json/wp/v2/posts/1?_fields=id,title,content,blocks');
   ```

### Issue: Poor Performance with Large Content

If you experience performance issues with large content sets:

```javascript
// Use incremental rendering for large content
const html = convertBlocks(largeBlockData, {
  incrementalOptions: {
    enabled: true,
    initialRenderCount: 10,
    batchSize: 5
  }
});
```

## Browser Compatibility

WP Block to HTML works in all modern browsers (Chrome, Firefox, Safari, Edge) and Node.js environments. For IE11 support, you'll need appropriate polyfills.

## Next Steps

Now that you understand the basics, explore these topics:

- [Content Handling Modes](/guide/content-handling-modes) - Choose between raw, rendered, or hybrid content processing
- [CSS Framework Integration](/guide/css-frameworks) - Customize output for your preferred CSS framework
- [SSR Optimizations](/guide/ssr-optimizations) - Optimize for server-side rendering performance
- [Bundle Size Optimization](/guide/bundle-size) - Reduce bundle size with modular imports
- [Lazy Loading Media](/guide/lazy-loading) - Improve performance with lazy-loaded images and videos 