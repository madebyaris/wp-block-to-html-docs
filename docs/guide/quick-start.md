# Quick Start Guide

This guide will help you quickly get started with WP Block to HTML, showing the simplest path to convert WordPress Gutenberg blocks to HTML in your project.

## Installation

Install the package using your preferred package manager:

```bash
# npm
npm install wp-block-to-html

# yarn
yarn add wp-block-to-html

# pnpm
pnpm add wp-block-to-html
```

## Basic Usage

The simplest way to use WP Block to HTML is to convert WordPress blocks to HTML:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress blocks (from the WordPress REST API)
const blocks = [
  {
    blockName: "core/paragraph",
    attrs: {},
    innerBlocks: [],
    innerHTML: "<p>Welcome to my blog post!</p>",
    innerContent: ["<p>Welcome to my blog post!</p>"]
  },
  {
    blockName: "core/heading",
    attrs: { level: 2 },
    innerBlocks: [],
    innerHTML: "<h2>Getting Started</h2>",
    innerContent: ["<h2>Getting Started</h2>"]
  },
  {
    blockName: "core/paragraph",
    attrs: {},
    innerBlocks: [],
    innerHTML: "<p>This is a simple example of WordPress blocks.</p>",
    innerContent: ["<p>This is a simple example of WordPress blocks.</p>"]
  }
];

// Convert blocks to HTML
const html = convertBlocks(blocks);

// Use the HTML in your application
document.getElementById('content').innerHTML = html;
```

## Fetching WordPress Content

Here's how to fetch content from the WordPress REST API and convert it:

```javascript
// Fetch a post from WordPress
const fetchPost = async (postId) => {
  try {
    const response = await fetch(`https://your-wordpress-site.com/wp-json/wp/v2/posts/${postId}?_fields=title,content,blocks`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    
    const post = await response.json();
    
    // Check if blocks are available
    if (post.blocks) {
      // Convert blocks to HTML
      const html = convertBlocks(post.blocks);
      return {
        title: post.title.rendered,
        content: html
      };
    } else if (post.content?.rendered) {
      // Fallback to pre-rendered content
      return {
        title: post.title.rendered,
        content: post.content.rendered
      };
    } else {
      throw new Error('No content available');
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

// Usage
try {
  const post = await fetchPost(123);
  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-content').innerHTML = post.content;
} catch (error) {
  document.getElementById('error-message').textContent = 'Failed to load post';
}
```

## Using CSS Frameworks

WP Block to HTML supports popular CSS frameworks. Here's how to use them:

### Tailwind CSS

```javascript
const html = convertBlocks(blocks, {
  cssFramework: 'tailwind'
});
```

### Bootstrap

```javascript
const html = convertBlocks(blocks, {
  cssFramework: 'bootstrap'
});
```

## Framework Integration

### React

For React applications, you can use the React integration:

```jsx
import React from 'react';
import { createReactComponent } from 'wp-block-to-html/react';

const WordPressContent = ({ blocks }) => {
  // If blocks are not available, show a message
  if (!blocks || blocks.length === 0) {
    return <p>No content available</p>;
  }
  
  // Create a React component from WordPress blocks
  const BlocksComponent = createReactComponent(blocks, {
    cssFramework: 'tailwind'
  });
  
  return <BlocksComponent />;
};

// Usage
const MyComponent = ({ postData }) => {
  return (
    <div className="post">
      <h1>{postData.title}</h1>
      <WordPressContent blocks={postData.blocks} />
    </div>
  );
};
```

### Vue

For Vue applications:

```javascript
import { createVueComponent } from 'wp-block-to-html/vue';

// In your Vue component
export default {
  props: {
    blocks: {
      type: Array,
      required: true
    }
  },
  computed: {
    blocksComponent() {
      return createVueComponent(this.blocks, {
        cssFramework: 'tailwind'
      });
    }
  },
  template: `
    <div class="post">
      <h1>{{ title }}</h1>
      <component :is="blocksComponent" />
    </div>
  `
};
```

## Complete Example

Here's a complete example of displaying WordPress posts with error handling and fallbacks:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Config
const API_URL = 'https://your-wordpress-site.com/wp-json/wp/v2';
const POSTS_CONTAINER = document.getElementById('posts');
const ERROR_CONTAINER = document.getElementById('error');
const LOADING_INDICATOR = document.getElementById('loading');

// Show loading indicator
LOADING_INDICATOR.style.display = 'block';

// Fetch posts
fetch(`${API_URL}/posts?_fields=id,title,excerpt,content,blocks&per_page=5`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  })
  .then(posts => {
    // Hide loading indicator
    LOADING_INDICATOR.style.display = 'none';
    
    if (!posts.length) {
      ERROR_CONTAINER.textContent = 'No posts found';
      ERROR_CONTAINER.style.display = 'block';
      return;
    }
    
    // Clear posts container
    POSTS_CONTAINER.innerHTML = '';
    
    // Process and display each post
    posts.forEach(post => {
      // Create post element
      const postElement = document.createElement('article');
      postElement.className = 'post';
      
      // Add title
      const titleElement = document.createElement('h2');
      titleElement.className = 'post-title';
      titleElement.innerHTML = post.title.rendered;
      postElement.appendChild(titleElement);
      
      // Add content
      const contentElement = document.createElement('div');
      contentElement.className = 'post-content';
      
      // Process content based on what's available
      let contentHtml = '';
      
      if (post.blocks) {
        // Convert blocks to HTML
        contentHtml = convertBlocks(post.blocks, {
          cssFramework: 'tailwind',
          contentHandling: 'html'
        });
      } else if (post.content?.rendered) {
        // Use pre-rendered content
        contentHtml = post.content.rendered;
      } else {
        contentHtml = '<p>No content available</p>';
      }
      
      contentElement.innerHTML = contentHtml;
      postElement.appendChild(contentElement);
      
      // Add post to container
      POSTS_CONTAINER.appendChild(postElement);
    });
  })
  .catch(error => {
    // Hide loading indicator
    LOADING_INDICATOR.style.display = 'none';
    
    // Show error message
    ERROR_CONTAINER.textContent = `Error: ${error.message}`;
    ERROR_CONTAINER.style.display = 'block';
    
    console.error('Error fetching posts:', error);
  });
```

## Next Steps

Now that you have a basic understanding of WP Block to HTML, you can explore:

- [CSS Framework Integration](/guide/css-frameworks) - Learn how to use CSS frameworks effectively
- [Framework Components](/guide/framework-components) - Integrate with React, Vue, and other frameworks
- [Server-Side Rendering](/guide/server-side-rendering) - Optimize for server rendering
- [Performance Optimization](/guide/performance) - Learn advanced optimization techniques
- [Custom Transformers](/guide/custom-transformers) - Create custom block transformers
- [Plugin System](/guide/plugins) - Extend functionality with plugins 