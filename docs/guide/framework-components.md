# Framework Components

WP Block to HTML provides specialized integrations for popular JavaScript frameworks, allowing you to seamlessly convert WordPress blocks into framework-specific components. This guide shows you how to use these integrations.

## Overview

The library offers these framework integrations:

- **React**: Generate React components or JSX
- **Vue**: Create Vue components
- **Framework-agnostic HTML**: Use in any JavaScript application

## React Integration

### Basic Usage

```javascript
import { convertBlocksToReact } from 'wp-block-to-html/react';

// WordPress blocks from API or other source
const blocks = [
  {
    blockName: 'core/paragraph',
    attrs: { align: 'center' },
    innerContent: ['<p>Hello from React!</p>']
  },
  {
    blockName: 'core/heading',
    attrs: { level: 2 },
    innerContent: ['<h2>WordPress + React</h2>']
  }
];

// In your React component
function WordPressContent() {
  const content = convertBlocksToReact(blocks, {
    cssFramework: 'tailwind'
  });
  
  return (
    <div className="wordpress-content">
      {content}
    </div>
  );
}
```

### Advanced React Integration

For more complex scenarios, you can use the component creator:

```javascript
import { createReactComponent } from 'wp-block-to-html/react';
import { useState, useEffect } from 'react';

function WordPressPostViewer({ postId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await fetch(`https://example.com/wp-json/wp/v2/posts/${postId}?_fields=id,title,content,blocks`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`);
        }
        
        const postData = await response.json();
        setPost(postData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPost();
  }, [postId]);
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  if (!post) {
    return <div className="not-found">Post not found</div>;
  }
  
  // Create the content component
  const ContentComponent = post.content
    ? createReactComponent(post.content, { cssFramework: 'tailwind' })
    : () => <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />;
  
  return (
    <article className="post">
      <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <ContentComponent />
    </article>
  );
}
```

### React with Next.js

Here's how to use the library in a Next.js project:

```javascript
// pages/posts/[slug].js
import { createReactComponent } from 'wp-block-to-html/react';

export default function Post({ post }) {
  // Create a React component from WordPress blocks
  const ContentComponent = post.content
    ? createReactComponent(post.content, { cssFramework: 'tailwind' })
    : () => <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />;
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6" 
          dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <ContentComponent />
    </div>
  );
}

// Get data at build time (SSG)
export async function getStaticProps({ params }) {
  const response = await fetch(`https://example.com/wp-json/wp/v2/posts?slug=${params.slug}&_fields=id,title,content,blocks`);
  const posts = await response.json();
  
  if (!posts.length) {
    return { notFound: true };
  }
  
  return {
    props: {
      post: posts[0]
    },
    revalidate: 3600 // Re-generate page every hour
  };
}

export async function getStaticPaths() {
  const response = await fetch('https://example.com/wp-json/wp/v2/posts?_fields=slug');
  const posts = await response.json();
  
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking'
  };
}
```

## Vue Integration

### Basic Usage

```javascript
import { convertBlocksToVue } from 'wp-block-to-html/vue';

// WordPress blocks from API or other source
const blocks = [
  {
    blockName: 'core/paragraph',
    attrs: { align: 'center' },
    innerContent: ['<p>Hello from Vue!</p>']
  },
  {
    blockName: 'core/heading',
    attrs: { level: 2 },
    innerContent: ['<h2>WordPress + Vue</h2>']
  }
];

// In your Vue component
export default {
  data() {
    return {
      blocks: []
    };
  },
  computed: {
    content() {
      return convertBlocksToVue(this.blocks, {
        cssFramework: 'tailwind'
      });
    }
  },
  async mounted() {
    const response = await fetch('https://example.com/wp-json/wp/v2/posts/1?_fields=blocks');
    const post = await response.json();
    this.blocks = post.blocks;
  },
  template: `
    <div class="wordpress-content">
      <component :is="content" />
    </div>
  `
};
```

### Advanced Vue Integration

For more complex scenarios, you can use the component creator:

```javascript
import { createVueComponent } from 'wp-block-to-html/vue';

// WordPressContent.vue
<script>
export default {
  props: {
    postId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      post: null,
      ContentComponent: null
    };
  },
  methods: {
    async fetchPost() {
      try {
        this.loading = true;
        const response = await fetch(`https://example.com/wp-json/wp/v2/posts/${this.postId}?_fields=id,title,content,blocks`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`);
        }
        
        this.post = await response.json();
        
        if (this.post.content) {
          this.ContentComponent = createVueComponent(this.post.content, {
            cssFramework: 'tailwind'
          });
        }
        
        this.error = null;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  },
  async created() {
    await this.fetchPost();
  },
  watch: {
    postId: {
      async handler() {
        await this.fetchPost();
      }
    }
  }
};
</script>

<template>
  <div class="wordpress-post">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>
    <div v-else-if="!post" class="not-found">Post not found</div>
    <article v-else class="post">
      <h1 v-html="post.title.rendered"></h1>
      <component v-if="ContentComponent" :is="ContentComponent" />
      <div v-else v-html="post.content.rendered"></div>
    </article>
  </div>
</template>
```

### Vue with Nuxt.js

Here's how to use the library in a Nuxt.js project:

```javascript
// pages/posts/_slug.vue
<script>
import { createVueComponent } from 'wp-block-to-html/vue';

export default {
  async asyncData({ params, $axios }) {
    try {
      const response = await $axios.get(`https://example.com/wp-json/wp/v2/posts?slug=${params.slug}&_fields=id,title,content,blocks`);
      
      if (!response.data.length) {
        return { post: null };
      }
      
      const post = response.data[0];
      let ContentComponent = null;
      
      if (post.content) {
        ContentComponent = createVueComponent(post.content, {
          cssFramework: 'tailwind'
        });
      }
      
      return {
        post,
        ContentComponent
      };
    } catch (error) {
      console.error('Error fetching post:', error);
      return { post: null, error: error.message };
    }
  },
  head() {
    if (!this.post) return {};
    
    return {
      title: this.post.title.rendered,
      meta: [
        { hid: 'description', name: 'description', content: this.post.excerpt?.rendered || '' }
      ]
    };
  }
};
</script>

<template>
  <div class="container mx-auto py-8">
    <div v-if="error" class="error">Error: {{ error }}</div>
    <div v-else-if="!post" class="not-found">Post not found</div>
    <article v-else class="post">
      <h1 class="text-4xl font-bold mb-6" v-html="post.title.rendered"></h1>
      <component v-if="ContentComponent" :is="ContentComponent" />
      <div v-else v-html="post.content.rendered"></div>
    </article>
  </div>
</template>
```

## Framework-agnostic HTML

You can also generate plain HTML for use in any JavaScript framework:

```javascript
import { convertBlocks } from 'wp-block-to-html';

async function loadWordPressContent(postId, container) {
  try {
    const response = await fetch(`https://example.com/wp-json/wp/v2/posts/${postId}?_fields=id,title,content,blocks`);
    const post = await response.json();
    
    let html = '';
    
    if (post.content) {
      // Generate HTML from blocks
      html = convertBlocks(post.content, {
        cssFramework: 'tailwind'
      });
    } else if (post.content?.rendered) {
      // Use rendered content
      html = post.content.rendered;
    }
    
    // Set the HTML content
    container.innerHTML = html;
    
    // If you need to initialize any scripts or components after rendering
    initializeComponents(container);
  } catch (error) {
    console.error('Error loading content:', error);
    container.innerHTML = `<div class="error">Failed to load content: ${error.message}</div>`;
  }
}

function initializeComponents(container) {
  // Initialize any client-side components or scripts
  // e.g., lightbox for images, syntax highlighting for code blocks, etc.
}

// Usage
const contentContainer = document.getElementById('wordpress-content');
loadWordPressContent(123, contentContainer);
```

## SEO Optimization in Framework Components

For better SEO, you can extract metadata from WordPress blocks:

```javascript
import { convertBlocksToReact } from 'wp-block-to-html/react';
import { extractMetadata } from 'wp-block-to-html/seo';

function WordPressPost({ blocks, postTitle }) {
  // Extract metadata like description, images, etc.
  const metadata = extractMetadata(blocks);
  
  // Create React component
  const content = convertBlocksToReact(blocks, {
    cssFramework: 'tailwind'
  });
  
  return (
    <>
      {/* Use metadata for SEO */}
      <Head>
        <title>{postTitle}</title>
        <meta name="description" content={metadata.description} />
        {metadata.images[0] && (
          <meta property="og:image" content={metadata.images[0].url} />
        )}
      </Head>
      
      <article className="post-content">
        {content}
      </article>
    </>
  );
}
```

## Performance Optimization

For large content sets, consider using incremental rendering:

```javascript
import { convertBlocksToReact } from 'wp-block-to-html/react';

function LargeWordPressContent({ blocks }) {
  const content = convertBlocksToReact(blocks, {
    cssFramework: 'tailwind',
    incrementalOptions: {
      enabled: true,
      initialRenderCount: 5,
      batchSize: 3
    }
  });
  
  return (
    <div className="large-content">
      {content}
    </div>
  );
}
```

## Framework Integration Best Practices

1. **Error Handling**: Always implement proper error handling for API requests
2. **Loading States**: Show loading indicators while content is being fetched and processed
3. **SSR/SSG Support**: For frameworks supporting server-side rendering or static generation, process content on the server when possible
4. **CSS Framework Consistency**: Use the same CSS framework in both your WordPress content and your application
5. **Component Hydration**: If using incremental rendering, ensure components properly hydrate in a progressive manner

## Next Steps

- Explore [React Integration](/frameworks/react) for more detailed React examples
- Check out [Vue Integration](/frameworks/vue) for comprehensive Vue documentation
- Learn about [SSR Optimizations](/guide/ssr-optimizations) for server-side rendered applications
- Understand [Bundle Size Optimization](/guide/bundle-size) for efficiently importing only what you need 