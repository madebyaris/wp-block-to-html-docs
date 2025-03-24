# Content Handling Modes

WP Block to HTML provides three different content handling modes to accommodate different scenarios when working with WordPress content.

## Overview of Content Handling Modes

When using the WordPress REST API, you can get content in two main formats:

1. **Raw Block Data**: The structured JSON representation of blocks (available in the `blocks` property when the WordPress site is configured to expose it)
2. **Rendered HTML**: The pre-rendered HTML (always available in the `content.rendered` property)

To handle these different content types, WP Block to HTML provides three content handling modes:

| Mode | Description | Use Case |
| ---- | ----------- | -------- |
| `raw` | Process raw block data for full control | When you need full control over styling and output |
| `rendered` | Use pre-rendered HTML as-is | When block data isn't available or you want to preserve exact WordPress rendering |
| `hybrid` | Combine pre-rendered HTML with framework-specific classes | When you want WordPress rendering with your framework's styling |

## Raw Mode (Default)

Raw mode processes the raw block data, giving you full control over the conversion process. This is the default mode.

```javascript
const options = {
  contentHandling: 'raw', // This is the default
  cssFramework: 'tailwind'
};

const html = convertBlocks(blockData, options);
```

**Advantages of Raw Mode:**
- Complete control over output HTML
- Ability to apply CSS framework classes consistently
- Better integration with framework components
- Customizable transformations

**Example:**

```javascript
// Input block data
const blockData = {
  blocks: [
    {
      blockName: 'core/paragraph',
      attrs: { align: 'center' },
      innerContent: ['<p>Hello WordPress!</p>']
    }
  ]
};

// Output with raw mode and Tailwind CSS
// <p class="text-center">Hello WordPress!</p>
```

## Rendered Mode

Rendered mode uses the pre-rendered HTML content from WordPress as-is, without processing the block structure.

```javascript
const options = {
  contentHandling: 'rendered'
};

const html = convertBlocks(blockData, options);
```

**Advantages of Rendered Mode:**
- Preserves exact WordPress rendering
- Faster processing (no transformation needed)
- Fallback when block data isn't available
- Maintains custom block styling from WordPress

**Example:**

```javascript
// Input block data with pre-rendered HTML
const blockData = {
  blocks: [
    {
      blockName: 'core/paragraph',
      attrs: { align: 'center' },
      innerContent: ['<p class="has-text-align-center">Hello WordPress!</p>']
    }
  ]
};

// Output with rendered mode
// <p class="has-text-align-center">Hello WordPress!</p>
```

## Hybrid Mode

Hybrid mode combines the pre-rendered HTML with your framework's classes, giving you WordPress rendering with your preferred styling.

```javascript
const options = {
  contentHandling: 'hybrid',
  cssFramework: 'tailwind'
};

const html = convertBlocks(blockData, options);
```

**Advantages of Hybrid Mode:**
- Preserves complex WordPress rendering
- Applies your CSS framework classes
- Good balance between WordPress fidelity and frontend styling
- Handles custom blocks gracefully

**Example:**

```javascript
// Input block data with pre-rendered HTML
const blockData = {
  blocks: [
    {
      blockName: 'core/paragraph',
      attrs: { align: 'center' },
      innerContent: ['<p class="has-text-align-center">Hello WordPress!</p>']
    }
  ]
};

// Output with hybrid mode and Tailwind CSS
// <p class="has-text-align-center text-center">Hello WordPress!</p>
```

## Which Mode Should You Use?

Here's a guide to help you choose the right content handling mode:

- Choose **Raw Mode** when:
  - You need complete control over the output HTML
  - You want consistent application of your CSS framework classes
  - You're creating a completely custom design

- Choose **Rendered Mode** when:
  - Block data isn't available from the WordPress API
  - You want to preserve the exact WordPress rendering
  - You're working with complex custom blocks

- Choose **Hybrid Mode** when:
  - You want WordPress rendering but with your CSS framework
  - You're working with a mix of standard and custom blocks
  - You need a balance between WordPress fidelity and frontend styling

## Using Content Handling Modes with the WordPress API

Here's a practical example of how to handle different WordPress API responses:

```javascript
async function fetchWordPressPost() {
  const response = await fetch('https://example.com/wp-json/wp/v2/posts/1?_fields=id,title,content,blocks');
  const post = await response.json();
  
  let htmlContent;
  
  // Check if blocks data is available
  if (post.blocks) {
    // Use raw or hybrid mode with block data
    htmlContent = convertBlocks(post.blocks, {
      cssFramework: 'tailwind',
      contentHandling: 'hybrid' // or 'raw'
    });
  } 
  // Fall back to rendered content if no blocks are available
  else if (post.content && post.content.rendered) {
    htmlContent = post.content.rendered;
  }
  
  return htmlContent;
}
```

This approach provides a flexible way to handle WordPress content in any scenario. 