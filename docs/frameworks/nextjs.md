# Next.js Integration

This guide explains how to use WP Block to HTML with Next.js to build high-performance websites with WordPress as a headless CMS.

## Setting Up a Next.js Project

First, create a new Next.js project if you don't have one already:

```bash
npx create-next-app@latest my-wp-nextjs-app
cd my-wp-nextjs-app
```

Next, install WP Block to HTML:

```bash
npm install wp-block-to-html
```

## Server-Side Rendering (SSR)

One of the biggest advantages of using Next.js is server-side rendering. Here's how to use WP Block to HTML with Next.js's `getServerSideProps`:

```jsx
// pages/posts/[slug].js
import Head from 'next/head';
import { convertBlocks } from 'wp-block-to-html';

export default function Post({ title, excerpt, content }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={excerpt} />
      </Head>
      <main>
        <article>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </main>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    // Fetch post data from WordPress
    const res = await fetch(
      `https://your-wordpress-site.com/wp-json/wp/v2/posts?slug=${params.slug}&_fields=id,title,excerpt,content,blocks`
    );
    
    if (!res.ok) {
      return { notFound: true };
    }
    
    const posts = await res.json();
    
    if (!posts.length) {
      return { notFound: true };
    }
    
    const post = posts[0];
    
    // Process content based on what's available
    let content = '';
    
    if (post.content) {
      // Convert blocks to HTML
      content = convertBlocks(post.content, {
        cssFramework: 'tailwind', // Match your project's CSS framework
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
      props: {
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 160),
        content
      }
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { notFound: true };
  }
}
```

## Static Site Generation (SSG)

For even better performance, you can use Static Site Generation with `getStaticProps` and `getStaticPaths`:

```jsx
// pages/posts/[slug].js
import Head from 'next/head';
import { convertBlocks } from 'wp-block-to-html';

export default function Post({ title, excerpt, content }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={excerpt} />
      </Head>
      <main>
        <article>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  // Fetch all post slugs from WordPress
  const res = await fetch(
    'https://your-wordpress-site.com/wp-json/wp/v2/posts?_fields=slug'
  );
  const posts = await res.json();
  
  // Create paths for each post
  const paths = posts.map((post) => ({
    params: { slug: post.slug }
  }));
  
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  try {
    // Fetch post data from WordPress
    const res = await fetch(
      `https://your-wordpress-site.com/wp-json/wp/v2/posts?slug=${params.slug}&_fields=id,title,excerpt,content,blocks`
    );
    
    if (!res.ok) {
      return { notFound: true };
    }
    
    const posts = await res.json();
    
    if (!posts.length) {
      return { notFound: true };
    }
    
    const post = posts[0];
    
    // Process content based on what's available
    let content = '';
    
    if (post.content) {
      // Convert blocks to HTML
      content = convertBlocks(post.content, {
        cssFramework: 'tailwind',
        ssrOptions: {
          enabled: true,
          optimizationLevel: 'maximum',
          lazyLoadMedia: true
        }
      });
    } else if (post.content?.rendered) {
      // Use pre-rendered content if blocks aren't available
      content = post.content.rendered;
    }
    
    return {
      props: {
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 160),
        content
      },
      // Revalidate once per day (in seconds)
      revalidate: 86400
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { notFound: true };
  }
}
```

## Incremental Static Regeneration (ISR)

For the best of both worlds, you can use Incremental Static Regeneration:

```jsx
// In getStaticProps, add the revalidate property
export async function getStaticProps({ params }) {
  // ... (same as above)
  
  return {
    props: {
      title: post.title.rendered,
      excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 160),
      content
    },
    // Revalidate every hour (in seconds)
    revalidate: 3600
  };
}
```

## Using React Components

If you prefer using React components instead of HTML strings, you can use the React integration:

```jsx
// pages/posts/[slug].js
import Head from 'next/head';
import { createReactComponent } from 'wp-block-to-html/react';

export default function Post({ title, excerpt, blocks }) {
  // Create a React component from the blocks
  const BlockContent = blocks ? createReactComponent(blocks, {
    cssFramework: 'tailwind',
    ssrOptions: {
      enabled: true,
      optimizationLevel: 'balanced'
    }
  }) : null;
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={excerpt} />
      </Head>
      <main>
        <article>
          <h1>{title}</h1>
          {BlockContent ? (
            <BlockContent />
          ) : (
            <div className="error">No content available</div>
          )}
        </article>
      </main>
    </>
  );
}

export async function getStaticProps({ params }) {
  try {
    // Fetch post data from WordPress
    const res = await fetch(
      `https://your-wordpress-site.com/wp-json/wp/v2/posts?slug=${params.slug}&_fields=id,title,excerpt,blocks`
    );
    
    if (!res.ok) {
      return { notFound: true };
    }
    
    const posts = await res.json();
    
    if (!posts.length) {
      return { notFound: true };
    }
    
    const post = posts[0];
    
    // If no blocks are available, return rendered content
    if (!post.content) {
      return {
        props: {
          title: post.title.rendered,
          excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 160),
          content: post.content?.rendered || '',
          blocks: null
        },
        revalidate: 3600
      };
    }
    
    return {
      props: {
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 160),
        blocks: post.content
      },
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { notFound: true };
  }
}
```

## CSS Framework Integration

### Tailwind CSS

If you're using Tailwind CSS with Next.js, make sure to specify Tailwind in your WP Block to HTML configuration:

```jsx
const content = convertBlocks(post.content, {
  cssFramework: 'tailwind',
  ssrOptions: {
    enabled: true
  }
});
```

### Bootstrap

If you're using Bootstrap, update your configuration accordingly:

```jsx
const content = convertBlocks(post.content, {
  cssFramework: 'bootstrap',
  ssrOptions: {
    enabled: true
  }
});
```

## Optimizing for Core Web Vitals

To optimize your Next.js app for Core Web Vitals, use these WP Block to HTML features:

```jsx
const content = convertBlocks(post.content, {
  cssFramework: 'tailwind',
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'maximum',
    lazyLoadMedia: true,
    preconnect: true,
    criticalPathOnly: true,
    removeDuplicateStyles: true
  }
});
```

## API Routes for Preview Mode

You can create an API route to handle WordPress preview mode:

```jsx
// pages/api/preview.js
export default async function handler(req, res) {
  const { secret, id, slug } = req.query;
  
  // Check the secret and next parameters
  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET || !id) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});
  
  // Redirect to the post
  res.redirect(`/posts/${slug || id}`);
}
```

Then update your getStaticProps function to handle preview mode:

```jsx
export async function getStaticProps({ params, preview = false, previewData }) {
  // Fetch parameters to pass to the WordPress API
  const apiParams = new URLSearchParams({
    slug: params.slug,
    _fields: 'id,title,excerpt,content,blocks'
  });
  
  // Add preview-specific parameters
  if (preview) {
    apiParams.append('status', 'any');
    // Add authentication if needed
  }
  
  const res = await fetch(
    `https://your-wordpress-site.com/wp-json/wp/v2/posts?${apiParams.toString()}`
  );
  
  // Rest of the function remains the same
}
```

## Bundle Size Optimization

For optimal bundle size, use selective imports from the library:

```jsx
// Import only what you need
import { convertBlocks } from 'wp-block-to-html/core';
import { paragraphHandler, headingHandler } from 'wp-block-to-html/blocks/text';
import { imageHandler } from 'wp-block-to-html/blocks/media';
import { tailwindMapping } from 'wp-block-to-html/frameworks/tailwind';

// Register only the block handlers you need
registerBlockHandler('core/paragraph', paragraphHandler);
registerBlockHandler('core/heading', headingHandler);
registerBlockHandler('core/image', imageHandler);

// Use with custom configuration
const content = convertBlocks(post.content, {
  cssFramework: 'tailwind',
  customClassMap: { tailwind: tailwindMapping }
});
```

## Complete Example

Here's a complete example of a Next.js page that integrates with WordPress:

```jsx
// pages/posts/[slug].js
import Head from 'next/head';
import Link from 'next/link';
import { convertBlocks } from 'wp-block-to-html';

export default function Post({ post, morePosts }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
      </Head>
      
      <Link href="/" className="text-blue-500 hover:underline mb-8 block">
        ← Back to Home
      </Link>
      
      <main>
        <article>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="prose lg:prose-xl max-w-none"
               dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
      
      {morePosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">More Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {morePosts.map((relatedPost) => (
              <Link href={`/posts/${relatedPost.slug}`} key={relatedPost.id}
                    className="border p-4 rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold">{relatedPost.title}</h3>
                <p className="mt-2 text-gray-600">{relatedPost.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch(
    'https://your-wordpress-site.com/wp-json/wp/v2/posts?_fields=slug'
  );
  const posts = await res.json();
  
  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug }
    })),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  try {
    // Fetch main post
    const res = await fetch(
      `https://your-wordpress-site.com/wp-json/wp/v2/posts?slug=${params.slug}&_fields=id,title,slug,excerpt,content,blocks`
    );
    
    if (!res.ok) {
      return { notFound: true };
    }
    
    const posts = await res.json();
    
    if (!posts.length) {
      return { notFound: true };
    }
    
    const post = posts[0];
    
    // Process content
    let content = '';
    
    if (post.content) {
      content = convertBlocks(post.content, {
        cssFramework: 'tailwind',
        ssrOptions: {
          enabled: true,
          optimizationLevel: 'balanced',
          lazyLoadMedia: true
        }
      });
    } else if (post.content?.rendered) {
      content = post.content.rendered;
    }
    
    // Fetch related posts
    const relatedRes = await fetch(
      `https://your-wordpress-site.com/wp-json/wp/v2/posts?exclude=${post.id}&_fields=id,title,slug,excerpt&per_page=3`
    );
    const relatedPosts = await relatedRes.json();
    
    return {
      props: {
        post: {
          title: post.title.rendered,
          excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 160),
          content
        },
        morePosts: relatedPosts.map((p) => ({
          id: p.id,
          title: p.title.rendered,
          slug: p.slug,
          excerpt: p.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 100)
        }))
      },
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { notFound: true };
  }
}
```

## Next Steps

- Learn about [Server-Side Rendering](/guide/server-side-rendering) for more optimization techniques
- Explore [Performance Optimization](/guide/performance) for high-traffic sites
- Check out [CSS Framework Integration](/guide/css-frameworks) for styling options
- Read about [React Integration](/frameworks/react) for more React-specific features 