# Getting Started

This guide will help you quickly integrate WP Block to HTML into your project and convert WordPress content into clean, framework-compatible HTML.

## Installation

Choose your preferred package manager:

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

## Handling WordPress REST API Content

The WordPress REST API can deliver content in two ways:

### Option 1: Raw Block Data (Preferred)

When the WordPress site has the Gutenberg block editor enabled and configured to expose block data:

```javascript
// Enable raw block data in WordPress by adding this to your theme's functions.php:
// add_action('rest_api_init', function () {
//   register_rest_field('post', 'blocks', [
//     'get_callback' => function($post) {
//       return parse_blocks($post['content']['raw']);
//     }
//   ]);
// });

// Then fetch and process the blocks:
async function fetchPost() {
  const response = await fetch('https://example.com/wp-json/wp/v2/posts/1?_fields=id,title,content,blocks');
  const post = await response.json();
  
  if (post.content) {
    const html = convertBlocks(post.content, {
      cssFramework: 'tailwind',
      contentHandling: 'raw'
    });
    document.getElementById('content').innerHTML = html;
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
      cssFramework: 'tailwind'
    });
    document.getElementById('content').innerHTML = html;
  }
}
```

## Complete Example with Error Handling

Here's a complete example that handles both block data and rendered content with proper fallbacks:

```javascript
import { convertBlocks } from 'wp-block-to-html';

async function displayWordPressPost(postId) {
  try {
    // Fetch post data
    const response = await fetch(`https://example.com/wp-json/wp/v2/posts/${postId}?_fields=id,title,content,blocks`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
    }
    
    const post = await response.json();
    let content = '';
    
    // Process content based on what's available
    if (post.content) {
      console.log('Processing raw block data...');
      content = convertBlocks(post.content, {
        cssFramework: 'tailwind',
        contentHandling: 'raw'
      });
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
  cssFramework: 'tailwind' 
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

1. Verify your WordPress site has the right configuration in functions.php:

```php
// Add to your theme's functions.php
add_action('rest_api_init', function () {
  register_rest_field('post', 'blocks', [
    'get_callback' => function($post) {
      return parse_blocks($post['content']['raw']);
    }
  ]);
});
```

2. Check your API request includes the blocks field:

```javascript
// Include the blocks field in your request
fetch('https://example.com/wp-json/wp/v2/posts/1?_fields=id,title,content,blocks');
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