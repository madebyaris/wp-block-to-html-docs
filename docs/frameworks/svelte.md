# Svelte Integration

This guide explains how to integrate WP Block to HTML with Svelte applications for building high-performance websites with WordPress as a headless CMS.

## Setting Up a Svelte Project

First, create a new Svelte project if you don't have one already:

```bash
# For Svelte with SvelteKit (recommended)
npm create svelte@latest my-wp-svelte-app
cd my-wp-svelte-app

# For standalone Svelte
npm create vite@latest my-wp-svelte-app -- --template svelte
cd my-wp-svelte-app
```

Next, install WP Block to HTML:

```bash
npm install wp-block-to-html
```

## Basic Integration

The simplest approach is to convert WordPress blocks to HTML strings and use Svelte's `{@html}` syntax to render them:

```svelte
<!-- src/routes/posts/[slug]/+page.svelte -->
<script>
  export let data;

  // Data is provided by the +page.js or +page.server.js file
  const { post } = data;
</script>

<article>
  <h1>{@html post.title}</h1>
  <div class="content">
    {@html post.content}
  </div>
</article>

<style>
  .content :global(img) {
    max-width: 100%;
    height: auto;
  }
  
  /* Additional styling for WordPress content */
  .content :global(figure) {
    margin: 2rem 0;
  }
  
  .content :global(blockquote) {
    border-left: 4px solid #ccc;
    padding-left: 1rem;
    font-style: italic;
  }
</style>
```

Create a page loader that fetches and processes the WordPress content:

```javascript
// src/routes/posts/[slug]/+page.js (for client-side rendering)
// or +page.server.js (for server-side rendering)
import { error } from '@sveltejs/kit';
import { convertBlocks } from 'wp-block-to-html';

export async function load({ params, fetch }) {
  const { slug } = params;
  
  try {
    const response = await fetch(`https://your-wordpress-site.com/wp-json/wp/v2/posts?slug=${slug}&_fields=id,title,excerpt,content,blocks`);
    
    if (!response.ok) {
      throw error(404, 'Post not found');
    }
    
    const posts = await response.json();
    
    if (!posts.length) {
      throw error(404, 'Post not found');
    }
    
    const post = posts[0];
    
    // Process content based on what's available
    let content = '';
    
    if (post.content) {
      // Process blocks with WP Block to HTML
      content = convertBlocks(post.content, {
        cssFramework: 'tailwind', // Or whichever CSS framework you're using
        contentHandling: 'html'
      });
    } else if (post.content?.rendered) {
      // Use pre-rendered content if blocks aren't available
      content = post.content.rendered;
    }
    
    return {
      post: {
        id: post.id,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
        content
      }
    };
  } catch (err) {
    console.error('Error loading post:', err);
    throw error(500, 'Error loading post');
  }
}
```

## Server-Side Rendering (SSR) with SvelteKit

SvelteKit provides excellent server-side rendering capabilities. To optimize WordPress content for SSR:

```javascript
// src/routes/posts/[slug]/+page.server.js
import { error } from '@sveltejs/kit';
import { convertBlocks } from 'wp-block-to-html';

export async function load({ params, fetch }) {
  const { slug } = params;
  
  try {
    const response = await fetch(`https://your-wordpress-site.com/wp-json/wp/v2/posts?slug=${slug}&_fields=id,title,excerpt,content,blocks`);
    
    if (!response.ok) {
      throw error(404, 'Post not found');
    }
    
    const posts = await response.json();
    
    if (!posts.length) {
      throw error(404, 'Post not found');
    }
    
    const post = posts[0];
    
    // Process content based on what's available
    let content = '';
    
    if (post.content) {
      // Process blocks with WP Block to HTML
      content = convertBlocks(post.content, {
        cssFramework: 'tailwind',
        contentHandling: 'html',
        ssrOptions: {
          enabled: true,
          optimizationLevel: 'balanced',
          lazyLoadMedia: true
        }
      });
    } else if (post.content?.rendered) {
      // Use pre-rendered content if blocks aren't available
      content = post.content.rendered;
    }
    
    return {
      post: {
        id: post.id,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
        content
      }
    };
  } catch (err) {
    console.error('Error loading post:', err);
    throw error(500, 'Error loading post');
  }
}
```

## Creating a WordPress Service

To better organize your code, create a WordPress service for handling API requests:

```javascript
// src/lib/services/wordpress.js
import { convertBlocks } from 'wp-block-to-html';

const API_URL = 'https://your-wordpress-site.com/wp-json/wp/v2';

export async function getPost(slug, options = {}) {
  const response = await fetch(`${API_URL}/posts?slug=${slug}&_fields=id,title,excerpt,content,blocks`);
  
  if (!response.ok) {
    throw new Error('Post not found');
  }
  
  const posts = await response.json();
  
  if (!posts.length) {
    throw new Error('Post not found');
  }
  
  const post = posts[0];
  
  // Process content based on what's available
  let content = '';
  
  if (post.content) {
    // Process blocks with WP Block to HTML
    content = convertBlocks(post.content, {
      cssFramework: options.cssFramework || 'tailwind',
      contentHandling: 'html',
      ssrOptions: {
        enabled: options.ssr || false,
        optimizationLevel: options.optimizationLevel || 'balanced',
        lazyLoadMedia: options.lazyLoadMedia || true
      }
    });
  } else if (post.content?.rendered) {
    // Use pre-rendered content if blocks aren't available
    content = post.content.rendered;
  }
  
  return {
    id: post.id,
    title: post.title.rendered,
    excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
    content
  };
}

export async function getPosts(category = '', page = 1, perPage = 10, options = {}) {
  let url = `${API_URL}/posts?page=${page}&per_page=${perPage}&_fields=id,title,excerpt,slug,date`;
  
  if (category) {
    url += `&categories=${category}`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  const posts = await response.json();
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
  
  return {
    posts: posts.map(post => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
      slug: post.slug,
      date: new Date(post.date)
    })),
    totalPages
  };
}
```

Then use it in your page loader:

```javascript
// src/routes/posts/[slug]/+page.server.js
import { error } from '@sveltejs/kit';
import { getPost } from '$lib/services/wordpress';

export async function load({ params }) {
  const { slug } = params;
  
  try {
    const post = await getPost(slug, {
      cssFramework: 'tailwind',
      ssr: true,
      optimizationLevel: 'balanced',
      lazyLoadMedia: true
    });
    
    return { post };
  } catch (err) {
    console.error('Error loading post:', err);
    throw error(err.message === 'Post not found' ? 404 : 500, err.message);
  }
}
```

## Creating a WordPress Block Component

Create a reusable Svelte component to handle WordPress blocks:

```svelte
<!-- src/lib/components/WordPressBlocks.svelte -->
<script>
  import { onMount } from 'svelte';
  import { convertBlocks } from 'wp-block-to-html';
  
  export let blocks = null;
  export let fallbackContent = null;
  export let cssFramework = 'tailwind';
  export let ssr = true;
  
  let content = '';
  
  function processContent() {
    if (blocks) {
      content = convertBlocks(blocks, {
        cssFramework,
        contentHandling: 'html',
        ssrOptions: {
          enabled: ssr,
          optimizationLevel: 'balanced',
          lazyLoadMedia: true
        }
      });
    } else if (fallbackContent) {
      content = fallbackContent;
    }
  }
  
  $: if (blocks || fallbackContent) {
    processContent();
  }
  
  onMount(() => {
    // Additional client-side enhancements can be added here
  });
</script>

<div class="wp-content">
  {@html content}
</div>

<style>
  .wp-content :global(img) {
    max-width: 100%;
    height: auto;
  }
  
  /* Additional styling for WordPress content */
  .wp-content :global(figure) {
    margin: 2rem 0;
  }
  
  .wp-content :global(blockquote) {
    border-left: 4px solid #ccc;
    padding-left: 1rem;
    font-style: italic;
  }
</style>
```

Using the component in your pages:

```svelte
<!-- src/routes/posts/[slug]/+page.svelte -->
<script>
  import WordPressBlocks from '$lib/components/WordPressBlocks.svelte';
  export let data;
  const { post } = data;
</script>

<article>
  <h1>{@html post.title}</h1>
  <WordPressBlocks 
    blocks={post.content}
    fallbackContent={post.content?.rendered}
    cssFramework="tailwind"
    ssr={true}
  />
</article>
```

Update your loader to pass the raw blocks:

```javascript
// src/routes/posts/[slug]/+page.server.js
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
  const { slug } = params;
  
  try {
    const response = await fetch(`https://your-wordpress-site.com/wp-json/wp/v2/posts?slug=${slug}&_fields=id,title,excerpt,content,blocks`);
    
    if (!response.ok) {
      throw error(404, 'Post not found');
    }
    
    const posts = await response.json();
    
    if (!posts.length) {
      throw error(404, 'Post not found');
    }
    
    const post = posts[0];
    
    return {
      post: {
        id: post.id,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
        content: post.content,
        blocks: post.blocks
      }
    };
  } catch (err) {
    console.error('Error loading post:', err);
    throw error(500, 'Error loading post');
  }
}
```

## CSS Framework Integration

### Tailwind CSS

If you're using Tailwind CSS with Svelte:

1. Install Tailwind CSS:

```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Configure `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. Add the directives to your CSS:

```css
/* src/app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. Import the CSS in your layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css';
</script>

<slot />
```

5. Configure WP Block to HTML to use Tailwind:

```javascript
convertBlocks(blocks, {
  cssFramework: 'tailwind',
  // other options...
});
```

### Bootstrap

For Bootstrap with Svelte:

1. Install Bootstrap:

```bash
npm install bootstrap
```

2. Import Bootstrap in your layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import 'bootstrap/dist/css/bootstrap.min.css';
</script>

<slot />
```

3. Configure WP Block to HTML to use Bootstrap:

```javascript
convertBlocks(blocks, {
  cssFramework: 'bootstrap',
  // other options...
});
```

## Custom Block Transformers

Create custom transformers for specific WordPress blocks:

```javascript
// src/lib/transformers/custom-transformers.js
import { convertBlocks } from 'wp-block-to-html';

export const customParagraphTransformer = {
  transform: (block, options) => {
    if (block.blockName !== 'core/paragraph') {
      return null;
    }
    
    const classes = options.cssFramework === 'tailwind' 
      ? 'text-lg my-4 leading-relaxed' 
      : 'lead my-4';
      
    const content = block.innerContent[0] || '';
    
    return `<p class="${classes}">${content}</p>`;
  }
};

export const customHeadingTransformer = {
  transform: (block, options) => {
    if (block.blockName !== 'core/heading') {
      return null;
    }
    
    const level = block.attrs?.level || 2;
    const content = block.innerContent[0] || '';
    
    // Add a custom ID for anchor links
    const text = content.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i, '$1');
    const id = text.toLowerCase()
      .replace(/<[^>]+>/g, '') // Remove HTML tags
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-'); // Replace multiple hyphens with single hyphen
    
    let classes = '';
    
    if (options.cssFramework === 'tailwind') {
      classes = level === 1 ? 'text-4xl font-bold my-6' :
               level === 2 ? 'text-3xl font-semibold my-5' :
               level === 3 ? 'text-2xl font-medium my-4' :
               level === 4 ? 'text-xl font-medium my-3' :
               'text-lg font-medium my-2';
    } else {
      // Bootstrap classes
      classes = `h${level}`;
    }
    
    return `<h${level} id="${id}" class="${classes}">${content.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i, '$1')}</h${level}>`;
  }
};

// Usage
const content = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  blockTransformers: [
    customParagraphTransformer,
    customHeadingTransformer
  ]
});
```

## Performance Optimization

For optimal performance in Svelte applications:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// In your component or service
const content = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'maximum',
    lazyLoadMedia: true,
    criticalPathOnly: true
  },
  incrementalOptions: {
    enabled: true,
    initialRenderCount: 5,
    batchSize: 3,
    renderDelay: 100
  }
});
```

## Complete Example: Blog with Svelte and WordPress

Here's a complete example of a Svelte blog system using WP Block to HTML:

### Post List Page

```svelte
<!-- src/routes/+page.svelte -->
<script>
  export let data;
  
  const { posts, currentPage, totalPages } = data;
</script>

<svelte:head>
  <title>My WordPress Blog</title>
  <meta name="description" content="WordPress blog with Svelte and WP Block to HTML">
</svelte:head>

<section class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8">Latest Posts</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each posts as post}
      <a href="/posts/{post.slug}" class="card">
        <h2 class="text-2xl font-semibold mb-2">{@html post.title}</h2>
        <p class="text-gray-500 mb-2">{new Date(post.date).toLocaleDateString()}</p>
        <p>{@html post.excerpt}</p>
        <span class="mt-4 inline-block text-blue-600 hover:underline">Read more →</span>
      </a>
    {/each}
  </div>
  
  {#if totalPages > 1}
    <div class="pagination mt-12 flex justify-center">
      {#each Array(totalPages) as _, i}
        <a 
          href="/?page={i + 1}" 
          class="px-4 py-2 mx-1 {currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded"
        >
          {i + 1}
        </a>
      {/each}
    </div>
  {/if}
</section>

<style>
  .card {
    @apply block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300;
  }
</style>
```

### Post List Loader

```javascript
// src/routes/+page.server.js
import { getPosts } from '$lib/services/wordpress';

export async function load({ url }) {
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  
  try {
    const { posts, totalPages } = await getPosts('', page, 9);
    
    return {
      posts,
      currentPage: page,
      totalPages
    };
  } catch (err) {
    console.error('Error loading posts:', err);
    return {
      posts: [],
      currentPage: 1,
      totalPages: 0
    };
  }
}
```

### Single Post Page

```svelte
<!-- src/routes/posts/[slug]/+page.svelte -->
<script>
  import WordPressBlocks from '$lib/components/WordPressBlocks.svelte';
  export let data;
  
  const { post, relatedPosts } = data;
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.excerpt}>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <a href="/" class="text-blue-600 hover:underline mb-8 inline-block">← Back to All Posts</a>
  
  <article class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-6">{@html post.title}</h1>
    
    <WordPressBlocks 
      blocks={post.content}
      fallbackContent={post.content?.rendered}
      cssFramework="tailwind"
      ssr={true}
    />
  </article>
  
  {#if relatedPosts && relatedPosts.length > 0}
    <div class="mt-12 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Related Posts</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each relatedPosts as relatedPost}
          <a href="/posts/{relatedPost.slug}" class="card">
            <h3 class="text-xl font-semibold mb-2">{@html relatedPost.title}</h3>
            <p>{@html relatedPost.excerpt}</p>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .card {
    @apply block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300;
  }
  
  /* Style WordPress content */
  :global(.wp-content h2) {
    @apply text-2xl font-semibold my-4;
  }
  
  :global(.wp-content h3) {
    @apply text-xl font-semibold my-3;
  }
  
  :global(.wp-content p) {
    @apply my-3 leading-relaxed;
  }
  
  :global(.wp-content img) {
    @apply my-4 rounded;
  }
  
  :global(.wp-content ul) {
    @apply list-disc pl-5 my-3;
  }
  
  :global(.wp-content ol) {
    @apply list-decimal pl-5 my-3;
  }
  
  :global(.wp-content a) {
    @apply text-blue-600 hover:underline;
  }
  
  :global(.wp-content blockquote) {
    @apply border-l-4 border-gray-300 pl-4 italic my-4;
  }
</style>
```

### Single Post Loader

```javascript
// src/routes/posts/[slug]/+page.server.js
import { error } from '@sveltejs/kit';
import { getPost } from '$lib/services/wordpress';

export async function load({ params, fetch }) {
  const { slug } = params;
  
  try {
    // Fetch the main post
    const post = await getPost(slug, {
      cssFramework: 'tailwind',
      ssr: true
    });
    
    // Fetch related posts
    let relatedPosts = [];
    try {
      const response = await fetch(`https://your-wordpress-site.com/wp-json/wp/v2/posts?exclude=${post.id}&per_page=3&_fields=id,title,slug,excerpt`);
      if (response.ok) {
        const posts = await response.json();
        relatedPosts = posts.map(p => ({
          id: p.id,
          title: p.title.rendered,
          slug: p.slug,
          excerpt: p.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 100)
        }));
      }
    } catch (err) {
      console.error('Error fetching related posts:', err);
      // Silently fail for related posts
    }
    
    return {
      post,
      relatedPosts
    };
  } catch (err) {
    console.error('Error loading post:', err);
    throw error(err.message === 'Post not found' ? 404 : 500, err.message);
  }
}
```

## Next Steps

- Learn about [Server-Side Rendering](/guide/server-side-rendering) for additional optimization techniques.
- Explore [Performance Optimization](/guide/performance) for high-traffic sites.
- Check out [CSS Framework Integration](/guide/css-frameworks) for styling options.
- Read about [Custom Block Transformers](/guide/custom-transformers) to customize block rendering for your site. 