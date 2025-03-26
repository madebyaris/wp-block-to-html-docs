# Basic Usage Examples

:::warning IMPORTANT: Accessing Block Content
**You cannot directly access raw block content from WordPress.**

To use WP Block to HTML with raw block data, you'll need to install a plugin to expose this content. We're developing an official plugin with proper security measures to safely expose this data.

In the meantime, you can use a plugin like [Post Raw Content](https://github.com/w1z2g3/wordpress-plugins/blob/master/post-raw-content.php) to access block data.

**Note:** You can still use this package without a plugin by working with the rendered HTML content that WordPress provides by default. The package will handle rendered HTML content automatically, as shown in the example below.

Stay tuned for our official plugin release!
:::

This page demonstrates basic usage examples for the WP Block to HTML converter library.

## Fetching Block Data from WordPress

### With a Plugin (Raw Block Data)

Here's how to fetch and use block data with the [Post Raw Content](https://github.com/w1z2g3/wordpress-plugins/blob/master/post-raw-content.php) plugin:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Fetch post data with blocks from WordPress
async function fetchAndConvertPost(postId) {
  try {
    // Make sure to request the 'blocks' field that the plugin exposes
    const response = await fetch(`https://your-wp-site.com/wp-json/wp/v2/posts/${postId}?_fields=id,title,content,blocks`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }
    
    const post = await response.json();
    
    // Check if blocks data is available (requires Post Raw Content plugin)
    if (!post.blocks) {
      console.error('Block data not available. Make sure the Post Raw Content plugin is installed and activated.');
      return;
    }
    
    // Convert blocks to HTML
    const html = convertBlocks(post.blocks, {
      cssFramework: 'tailwind' // or your preferred framework
    });
    
    // Use the converted HTML in your application
    document.getElementById('post-content').innerHTML = html;
    
  } catch (error) {
    console.error('Error fetching or converting post:', error);
  }
}

// Usage
fetchAndConvertPost(123);
```

### Without a Plugin (Rendered HTML Content)

You can use the package with the default rendered HTML content that WordPress provides:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Fetch post data with rendered content from WordPress
async function fetchAndProcessRenderedContent(postId) {
  try {
    // Standard WordPress REST API request
    const response = await fetch(`https://your-wp-site.com/wp-json/wp/v2/posts/${postId}?_fields=id,title,content`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }
    
    const post = await response.json();
    
    if (!post.content || !post.content.rendered) {
      console.error('No rendered content available for this post');
      return;
    }
    
    // Process the rendered HTML with the package
    const processedHtml = convertBlocks({
      rendered: post.content.rendered
    }, {
      contentHandling: 'rendered',
      cssFramework: 'tailwind' // or your preferred framework
    });
    
    // Use the processed HTML in your application
    document.getElementById('post-content').innerHTML = processedHtml;
    
  } catch (error) {
    console.error('Error fetching or processing post:', error);
  }
}

// Usage
fetchAndProcessRenderedContent(123);
```

## Converting a Simple Block

Here's an example of converting a simple paragraph block:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress block data
const blockData = {
  blocks: [
    {
      blockName: 'core/paragraph',
      attrs: { align: 'center' },
      innerContent: ['<p>Hello WordPress!</p>']
    }
  ]
};

// Convert to HTML
const html = convertBlocks(blockData);
console.log(html);
// Output: <p class="wp-block-paragraph has-text-align-center">Hello WordPress!</p>
```

## Working with Multiple Blocks

Here's how to convert multiple blocks, including nested structures:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Multiple WordPress blocks
const blockData = {
  blocks: [
    {
      blockName: 'core/heading',
      attrs: { level: 2 },
      innerContent: ['<h2>Welcome to My Blog</h2>']
    },
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: ['<p>This is an example of converting multiple blocks.</p>']
    },
    {
      blockName: 'core/columns',
      attrs: {},
      innerContent: ['<div class="wp-block-columns">', null, null, '</div>'],
      innerBlocks: [
        {
          blockName: 'core/column',
          attrs: {},
          innerContent: ['<div class="wp-block-column">', null, '</div>'],
          innerBlocks: [
            {
              blockName: 'core/paragraph',
              attrs: {},
              innerContent: ['<p>Column 1 content</p>']
            }
          ]
        },
        {
          blockName: 'core/column',
          attrs: {},
          innerContent: ['<div class="wp-block-column">', null, '</div>'],
          innerBlocks: [
            {
              blockName: 'core/paragraph',
              attrs: {},
              innerContent: ['<p>Column 2 content</p>']
            }
          ]
        }
      ]
    }
  ]
};

// Convert to HTML
const html = convertBlocks(blockData);
console.log(html);
```

## Using Different CSS Frameworks

You can output HTML with classes from popular CSS frameworks:

::: code-group
```javascript [Default]
// Default HTML classes
const html = convertBlocks(blockData);
// <p class="wp-block-paragraph has-text-align-center">Hello WordPress!</p>
```

```javascript [Tailwind CSS]
// With Tailwind CSS classes
const tailwindHtml = convertBlocks(blockData, { 
  cssFramework: 'tailwind' 
});
// <p class="text-center">Hello WordPress!</p>
```

```javascript [Bootstrap]
// With Bootstrap classes
const bootstrapHtml = convertBlocks(blockData, { 
  cssFramework: 'bootstrap' 
});
// <p class="text-center">Hello WordPress!</p>
```

```javascript [Custom]
// With custom class mapping
const customHtml = convertBlocks(blockData, {
  cssFramework: 'custom',
  customClassMap: {
    'core/paragraph': {
      block: 'my-paragraph',
      align: {
        center: 'align-center'
      }
    }
  }
});
// <p class="my-paragraph align-center">Hello WordPress!</p>
```
:::

## Working with Content Handling Modes

The library supports different content handling modes:

```javascript
// Raw mode (default) - process raw block data
const rawHtml = convertBlocks(blockData, { 
  contentHandling: 'raw' 
});

// Rendered mode - use pre-rendered HTML as-is
const renderedHtml = convertBlocks(blockData, { 
  contentHandling: 'rendered' 
});

// Hybrid mode - combine rendered HTML with framework classes
const hybridHtml = convertBlocks(blockData, {
  contentHandling: 'hybrid',
  cssFramework: 'tailwind'
});
```

## Complete Configuration Example

Here's an example with a complete configuration:

```javascript
import { convertBlocks } from 'wp-block-to-html';

const html = convertBlocks(blockData, {
  // Output format (HTML by default)
  outputFormat: 'html',
  
  // CSS framework (Tailwind)
  cssFramework: 'tailwind',
  
  // Content handling mode
  contentHandling: 'hybrid',
  
  // Custom class mapping (extends/overrides Tailwind)
  customClassMap: {
    'core/paragraph': {
      block: 'prose text-gray-800',
      align: {
        center: 'text-center mx-auto',
        left: 'text-left',
        right: 'text-right'
      }
    }
  },
  
  // Server-side rendering options
  ssrOptions: {
    enabled: true,
    level: 'balanced',
    optimizeImages: true
  }
});
```

For more specific examples, check out the other pages in this section. 