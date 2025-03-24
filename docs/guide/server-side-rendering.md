# Server-Side Rendering

Server-Side Rendering (SSR) is a powerful technique for rendering WordPress blocks on the server before sending the resulting HTML to the client. This guide covers how to implement SSR with the WP Block to HTML library, optimizing performance and SEO.

## Benefits of Server-Side Rendering

Using SSR with WordPress blocks offers several advantages:

1. **Improved Performance**: Reduces client-side processing time, especially for complex blocks
2. **Better SEO**: Search engines can parse the fully rendered content immediately
3. **Faster First Contentful Paint**: Users see content more quickly
4. **Reduced JavaScript Overhead**: Less client-side JavaScript processing required
5. **Better Core Web Vitals**: Helps improve Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)

## Basic SSR Implementation

### Node.js Environment

Here's a basic implementation of SSR with Node.js:

```typescript
// server.js
import express from 'express';
import { convertBlocks } from 'wp-block-to-html';

const app = express();
const port = 3000;

app.get('/post/:id', async (req, res) => {
  try {
    // Fetch WordPress post data (example implementation)
    const postData = await fetchPostFromWordPress(req.params.id);
    
    // Convert blocks to HTML on the server
    const htmlContent = convertBlocks(postData.blocks, {
      ssrOptions: {
        enabled: true,
        optimizationLevel: 'balanced'
      }
    });
    
    // Render a complete HTML page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${postData.title}</title>
          <meta name="description" content="${postData.excerpt}">
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <header>
            <h1>${postData.title}</h1>
          </header>
          <main id="content">
            ${htmlContent}
          </main>
          <script src="/client.js"></script>
        </body>
      </html>
    `;
    
    // Send the rendered HTML to the client
    res.send(html);
  } catch (error) {
    console.error('Error rendering post:', error);
    res.status(500).send('Error rendering post');
  }
});

// Example function to fetch post data from WordPress
async function fetchPostFromWordPress(postId) {
  const response = await fetch(`https://your-wordpress-site.com/wp-json/wp/v2/posts/${postId}?_fields=id,title,excerpt,blocks`);
  return response.json();
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

### Next.js Implementation

Next.js provides built-in support for SSR, making it easy to integrate with WP Block to HTML:

```typescript
// pages/posts/[id].tsx
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { convertBlocks } from 'wp-block-to-html';

interface PostProps {
  title: string;
  excerpt: string;
  htmlContent: string;
}

export default function Post({ title, excerpt, htmlContent }: PostProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={excerpt} />
      </Head>
      <main>
        <h1>{title}</h1>
        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const postId = context.params?.id as string;
    
    // Fetch post data from WordPress
    const response = await fetch(
      `https://your-wordpress-site.com/wp-json/wp/v2/posts/${postId}?_fields=id,title,excerpt,blocks`
    );
    const postData = await response.json();
    
    // Convert blocks to HTML on the server
    const htmlContent = convertBlocks(postData.blocks, {
      ssrOptions: {
        enabled: true,
        optimizationLevel: 'balanced'
      }
    });
    
    return {
      props: {
        title: postData.title.rendered,
        excerpt: postData.excerpt.rendered,
        htmlContent
      }
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      notFound: true
    };
  }
};
```

## Advanced SSR Configuration

The library provides several options to fine-tune SSR behavior:

```typescript
import { convertBlocks } from 'wp-block-to-html';

const htmlContent = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,                 // Enable SSR
    optimizationLevel: 'maximum',  // Optimization level: 'minimal', 'balanced', or 'maximum'
    lazyLoadMedia: true,           // Add loading="lazy" to images and iframes
    criticalPathOnly: false,       // Only render above-the-fold content
    deferNonCritical: false,       // Defer rendering of below-the-fold content
    preconnect: true,              // Add preconnect for external resources
    removeDuplicateStyles: true,   // Deduplicate inline styles
    minifyOutput: true             // Minify the output HTML
  }
});
```

### Optimization Levels

The `optimizationLevel` option determines how aggressively the library optimizes the output:

- **minimal**: Basic optimizations with focus on correctness
- **balanced**: Moderate optimizations balancing performance and feature parity
- **maximum**: Aggressive optimizations focused on performance, may simplify some blocks

## Hydration Strategies

Hydration is the process of attaching JavaScript event listeners and React/Vue components to server-rendered HTML. The WP Block to HTML library supports several hydration strategies:

### Full Hydration

```typescript
// server.js
const htmlContent = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    prepareForHydration: true // Add data attributes for hydration
  }
});

// Return HTML with block data for hydration
const fullPage = `
  <!DOCTYPE html>
  <html>
    <head>...</head>
    <body>
      <div id="content">${htmlContent}</div>
      <script>
        // Serialize block data for client-side hydration
        window.__INITIAL_BLOCKS__ = ${JSON.stringify(blocks)};
      </script>
      <script src="/client.js"></script>
    </body>
  </html>
`;

// client.js
import { hydrate } from 'wp-block-to-html/hydration';

document.addEventListener('DOMContentLoaded', () => {
  // Hydrate server-rendered content
  hydrate(
    window.__INITIAL_BLOCKS__, 
    document.getElementById('content')
  );
});
```

### Partial Hydration

For better performance, you can selectively hydrate only interactive blocks:

```typescript
// server.js
const htmlContent = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    identifyInteractiveBlocks: true // Mark interactive blocks for selective hydration
  }
});

// client.js
import { hydrateInteractive } from 'wp-block-to-html/hydration';

document.addEventListener('DOMContentLoaded', () => {
  // Only hydrate interactive blocks
  hydrateInteractive(
    window.__INITIAL_BLOCKS__,
    document.getElementById('content')
  );
});
```

### Progressive Hydration

Progressive hydration loads and hydrates blocks based on visibility:

```typescript
// server.js
const htmlContent = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    prepareForProgressiveHydration: true
  }
});

// client.js
import { hydrateProgressively } from 'wp-block-to-html/hydration';

document.addEventListener('DOMContentLoaded', () => {
  // Set up progressive hydration with IntersectionObserver
  hydrateProgressively(
    window.__INITIAL_BLOCKS__,
    document.getElementById('content'),
    {
      rootMargin: '200px', // Start hydrating when within 200px of viewport
      threshold: 0.1        // Hydrate when at least 10% visible
    }
  );
});
```

## Server-Side Rendering with Different Frameworks

### Express + React

```typescript
// server.js
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createReactComponent } from 'wp-block-to-html/react';

const app = express();

app.get('/post/:id', async (req, res) => {
  // Fetch post data from WordPress
  const postData = await fetchPostFromWordPress(req.params.id);
  
  // Create a React component for the blocks
  const BlockContent = createReactComponent(postData.blocks, {
    ssrOptions: {
      enabled: true,
      optimizationLevel: 'balanced'
    }
  });
  
  // Render the React component to an HTML string
  const contentHtml = renderToString(<BlockContent />);
  
  // Send the full HTML page
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${postData.title}</title>
      </head>
      <body>
        <div id="root">${contentHtml}</div>
        <script>
          window.__INITIAL_BLOCKS__ = ${JSON.stringify(postData.blocks)};
        </script>
        <script src="/client.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000);
```

### Nuxt.js + Vue

```typescript
// pages/posts/_id.vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <client-only placeholder="Loading content...">
      <div v-if="blockComponent" :is="blockComponent"></div>
      <div v-else v-html="htmlContent"></div>
    </client-only>
  </div>
</template>

<script>
import { createVueComponent, convertBlocks } from 'wp-block-to-html/vue';

export default {
  async asyncData({ params, $axios }) {
    const { id } = params;
    
    // Fetch post data from WordPress
    const response = await $axios.get(
      `https://your-wordpress-site.com/wp-json/wp/v2/posts/${id}?_fields=id,title,blocks`
    );
    
    // Convert blocks to HTML on the server
    const htmlContent = convertBlocks(response.data.blocks, {
      ssrOptions: {
        enabled: true,
        optimizationLevel: 'balanced'
      }
    });
    
    return {
      title: response.data.title.rendered,
      blocks: response.data.blocks,
      htmlContent
    };
  },
  
  data() {
    return {
      blockComponent: null
    };
  },
  
  mounted() {
    // Create a Vue component on the client side for hydration
    this.blockComponent = createVueComponent(this.blocks, {
      ssrRehydrate: true
    });
  }
};
</script>
```

## Optimizing SSR Performance

### Caching SSR Output

Implementing caching at different levels can significantly improve performance:

```typescript
// Example with Redis caching
import express from 'express';
import { convertBlocks } from 'wp-block-to-html';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

app.get('/post/:id', async (req, res) => {
  const postId = req.params.id;
  const cacheKey = `post:${postId}:html`;
  
  try {
    // Check Redis cache first
    const cachedHtml = await getAsync(cacheKey);
    
    if (cachedHtml) {
      console.log('Cache hit for post', postId);
      return res.send(cachedHtml);
    }
    
    // Cache miss - fetch and render the post
    console.log('Cache miss for post', postId);
    const postData = await fetchPostFromWordPress(postId);
    
    // Convert blocks to HTML
    const htmlContent = convertBlocks(postData.blocks, {
      ssrOptions: {
        enabled: true,
        optimizationLevel: 'maximum'
      }
    });
    
    // Create full HTML page
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${postData.title}</title>
        </head>
        <body>
          <h1>${postData.title}</h1>
          <div id="content">${htmlContent}</div>
        </body>
      </html>
    `;
    
    // Store in Redis cache with 1 hour expiration
    await setAsync(cacheKey, fullHtml, 'EX', 3600);
    
    // Send response
    res.send(fullHtml);
  } catch (error) {
    console.error('Error rendering post:', error);
    res.status(500).send('Error rendering post');
  }
});

app.listen(3000);
```

### Streaming SSR

For large content, streaming SSR can improve Time to First Byte (TTFB):

```typescript
// Example with Node.js streams
import express from 'express';
import { Readable } from 'stream';
import { convertBlocksStream } from 'wp-block-to-html/streams';

const app = express();

app.get('/post/:id', async (req, res) => {
  try {
    const postData = await fetchPostFromWordPress(req.params.id);
    
    // Start sending the response immediately
    res.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${postData.title}</title>
        </head>
        <body>
          <h1>${postData.title}</h1>
          <div id="content">
    `);
    
    // Create a readable stream from blocks
    const blocksStream = Readable.from(postData.blocks);
    
    // Convert blocks to HTML and pipe to response
    const htmlStream = convertBlocksStream(blocksStream, {
      ssrOptions: {
        enabled: true,
        optimizationLevel: 'balanced'
      }
    });
    
    // Handle stream events
    htmlStream.on('data', chunk => {
      res.write(chunk);
    });
    
    htmlStream.on('end', () => {
      res.write(`
          </div>
        </body>
      </html>
      `);
      res.end();
    });
    
    htmlStream.on('error', err => {
      console.error('Stream error:', err);
      res.status(500).end('Error processing stream');
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send('Error fetching post');
  }
});

app.listen(3000);
```

## SEO Optimizations

Server-side rendering provides significant SEO benefits, but you can further enhance them:

```typescript
import { convertBlocks, extractMetadata } from 'wp-block-to-html';

// Fetch post data
const postData = await fetchPostFromWordPress(postId);

// Extract metadata from blocks for SEO
const metadata = extractMetadata(postData.blocks);

// Convert blocks to HTML
const htmlContent = convertBlocks(postData.blocks, {
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'balanced',
    addSchemaMarkup: true // Add structured data
  }
});

// Create full HTML with SEO metadata
const fullHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>${metadata.title || postData.title}</title>
      <meta name="description" content="${metadata.description || postData.excerpt}">
      
      <!-- Open Graph tags -->
      <meta property="og:title" content="${metadata.title || postData.title}">
      <meta property="og:description" content="${metadata.description || postData.excerpt}">
      ${metadata.featuredImage ? `<meta property="og:image" content="${metadata.featuredImage}">` : ''}
      <meta property="og:type" content="article">
      
      <!-- Twitter Card tags -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${metadata.title || postData.title}">
      <meta name="twitter:description" content="${metadata.description || postData.excerpt}">
      ${metadata.featuredImage ? `<meta name="twitter:image" content="${metadata.featuredImage}">` : ''}
      
      ${metadata.canonicalUrl ? `<link rel="canonical" href="${metadata.canonicalUrl}">` : ''}
    </head>
    <body>
      <article>
        <h1>${postData.title}</h1>
        <div id="content">${htmlContent}</div>
      </article>
    </body>
  </html>
`;
```

## Handling Dynamic Content

Some WordPress blocks may require client-side JavaScript to function properly. To handle this:

```typescript
// server.js
const htmlContent = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true,
    handleDynamicBlocks: 'placeholder' // 'placeholder', 'static', or 'clientOnly'
  }
});

// client.js
import { hydrateDynamicBlocks } from 'wp-block-to-html/hydration';

document.addEventListener('DOMContentLoaded', () => {
  // Hydrate only the dynamic blocks
  hydrateDynamicBlocks(
    window.__INITIAL_BLOCKS__,
    document.getElementById('content')
  );
});
```

## Debugging SSR Issues

The library provides debugging tools for SSR:

```typescript
import { convertBlocks } from 'wp-block-to-html';

const htmlContent = convertBlocks(blocks, {
  ssrOptions: {
    enabled: true
  },
  debug: {
    enabled: true,
    logLevel: 'verbose',
    ssrOnly: true,
    logTiming: true
  }
});
```

Common SSR issues and solutions:

1. **Hydration Mismatch**: Ensure the client-side and server-side renders match by using the same configuration options.

2. **Missing Dependencies**: Make sure all required dependencies are available in the server environment.

3. **Environment-Specific Code**: Use conditional checks for browser-only code:

   ```typescript
   const isBrowser = typeof window !== 'undefined';
   
   // Only execute in browser environment
   if (isBrowser) {
     // Browser-specific code
   }
   ```

4. **Memory Leaks**: For high-traffic servers, monitor memory usage and implement proper garbage collection.

## Best Practices

1. **Cache Aggressively**: Implement caching at multiple levels (Redis, CDN, browser cache).

2. **Optimize Critical Path**: Focus on rendering above-the-fold content quickly.

3. **Minimize External Dependencies**: Reduce reliance on external resources during SSR.

4. **Load JavaScript Asynchronously**: Use `async` and `defer` for non-critical scripts.

5. **Monitor Performance**: Track server response times and resource usage.

6. **Use Incremental Static Regeneration**: For frameworks that support it (like Next.js).

7. **Implement Health Checks**: Monitor your SSR server's health and performance.

8. **Scale Horizontally**: Add more server instances for high-traffic sites.

## Next Steps

- Explore [Performance Optimization](/guide/performance) for more tips on improving speed
- Learn about [CSS Framework Integration](/guide/css-frameworks) with server-side rendering
- Check out [Framework Components](/guide/framework-components) for framework-specific SSR approaches
- Review [TypeScript Interfaces](/api/typescript/interfaces) for SSR-related types 