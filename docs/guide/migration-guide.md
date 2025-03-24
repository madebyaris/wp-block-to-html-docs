# Migrating from WordPress to Headless

This guide provides a step-by-step approach to migrating from a traditional WordPress site to a headless architecture using WP Block to HTML.

## Understanding Headless WordPress

In a headless architecture, WordPress serves as a content management system (CMS) for content creation, while a separate frontend application (built with React, Vue, Next.js, etc.) handles the presentation layer. This separation offers several benefits:

- Improved performance
- Better developer experience
- Enhanced security
- Greater scalability
- Freedom to use modern frontend frameworks

## Migration Strategy Overview

A successful migration typically follows these phases:

1. **Assessment & Planning**: Evaluate your current WordPress site and plan the migration
2. **API Configuration**: Set up WordPress REST API for content delivery
3. **Frontend Development**: Build your headless frontend using WP Block to HTML
4. **Content Migration**: Transfer your content to the new system
5. **Testing & QA**: Ensure the new site functions correctly
6. **Deployment & Launch**: Go live with your headless site

## Phase 1: Assessment & Planning

### Inventory Your Content

Start by cataloging your WordPress content:

```javascript
// Example: Script to inventory content (using WordPress REST API)
async function inventoryContent() {
  const contentTypes = ['posts', 'pages', 'media'];
  const inventory = {};
  
  for (const type of contentTypes) {
    const response = await fetch(`https://your-wp-site.com/wp-json/wp/v2/${type}?per_page=100`);
    const items = await response.json();
    inventory[type] = items.length;
    console.log(`Found ${items.length} ${type}`);
  }
  
  return inventory;
}
```

### Identify Block Types

Determine which WordPress blocks are used throughout your site:

```javascript
// Example: Script to identify block types in use
async function identifyBlockTypes() {
  const response = await fetch('https://your-wp-site.com/wp-json/wp/v2/posts?_embed=wp:blockdata&per_page=100');
  const posts = await response.json();
  
  const blockTypes = new Set();
  
  posts.forEach(post => {
    if (post._embedded && post._embedded['wp:blockdata']) {
      const extractBlockTypes = (blocks) => {
        blocks.forEach(block => {
          if (block.blockName) {
            blockTypes.add(block.blockName);
          }
          if (block.innerBlocks && block.innerBlocks.length > 0) {
            extractBlockTypes(block.innerBlocks);
          }
        });
      };
      
      extractBlockTypes(post._embedded['wp:blockdata']);
    }
  });
  
  return Array.from(blockTypes);
}
```

### Choose Your Frontend Framework

Select a frontend framework based on your team's expertise and project requirements:

| Framework | Pros | Cons |
|-----------|------|------|
| React | Large ecosystem, WP Block to HTML has best support | Steeper learning curve |
| Vue | Easy to learn, good performance | Smaller ecosystem than React |
| Next.js | Built-in SSR, great SEO | More complex deployment |
| Gatsby | Excellent for static sites | Rebuild required for content changes |

## Phase 2: API Configuration

### Enable and Extend WordPress REST API

Ensure your WordPress site has REST API enabled and properly configured:

1. Verify REST API is functioning:
   ```bash
   curl https://your-wp-site.com/wp-json/wp/v2/posts
   ```

2. Install and activate necessary plugins:
   - **WP REST API Blocks**: Exposes block data via API
   - **Advanced Custom Fields to REST API**: Adds ACF fields to API responses
   - **JWT Authentication for WP REST API**: Secures your API

3. Configure CORS headers to allow your frontend application to access the API:

   Add to your theme's `functions.php`:

   ```php
   function add_cors_headers() {
       header('Access-Control-Allow-Origin: *');
       header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
       header('Access-Control-Allow-Credentials: true');
       header('Access-Control-Allow-Headers: Authorization, Content-Type');
     
       if ('OPTIONS' == $_SERVER['REQUEST_METHOD']) {
           status_header(200);
           exit();
       }
   }
   add_action('send_headers', 'add_cors_headers');
   ```

### Create Custom Endpoints (If Needed)

For specialized content needs, create custom endpoints:

```php
// Example: Custom endpoint for retrieving navigation menus
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/menus', [
        'methods' => 'GET',
        'callback' => 'get_all_menus',
        'permission_callback' => '__return_true'
    ]);
});

function get_all_menus() {
    $menus = get_terms('nav_menu', ['hide_empty' => true]);
    
    if (empty($menus)) {
        return new WP_Error('no_menus', 'No menus found', ['status' => 404]);
    }
    
    $result = [];
    foreach ($menus as $menu) {
        $menu_items = wp_get_nav_menu_items($menu->term_id);
        $result[$menu->slug] = $menu_items;
    }
    
    return $result;
}
```

## Phase 3: Frontend Development

### Setting Up Your Frontend Project

Create your frontend application:

```bash
# Example: Creating a Next.js project
npx create-next-app my-headless-wp
cd my-headless-wp

# Install WP Block to HTML
npm install wp-block-to-html
```

### Fetching WordPress Content

Set up API communication:

```javascript
// lib/api.js
const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(endpoint, params = {}) {
  const queryString = Object.keys(params).map(key => 
    `${key}=${encodeURIComponent(params[key])}`
  ).join('&');
  
  const url = `${API_URL}${endpoint}?${queryString}&_embed=wp:blockdata`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

export async function getAllPosts() {
  return fetchAPI('/posts', { per_page: 100 });
}

export async function getPostBySlug(slug) {
  const posts = await fetchAPI('/posts', { slug });
  return posts.length > 0 ? posts[0] : null;
}

export async function getAllPages() {
  return fetchAPI('/pages', { per_page: 100 });
}

export async function getPageBySlug(slug) {
  const pages = await fetchAPI('/pages', { slug });
  return pages.length > 0 ? pages[0] : null;
}
```

### Using WP Block to HTML for Content Rendering

Integrate WP Block to HTML to convert WordPress blocks to frontend components:

```jsx
// components/PostContent.js
import { convertBlocksToReact } from 'wp-block-to-html/react';
import { processBlocksForSSR } from 'wp-block-to-html';

export default function PostContent({ blocks }) {
  // Apply SSR optimizations if needed
  const optimizedBlocks = processBlocksForSSR(blocks, {
    optimizationLevel: 'balanced',
    lazyLoadMedia: true
  });
  
  // Convert blocks to React components
  const content = convertBlocksToReact(optimizedBlocks, {
    cssFramework: 'tailwind', // Use your preferred CSS framework
    contentHandling: 'raw'
  });
  
  return (
    <div className="post-content">
      {content}
    </div>
  );
}
```

### Creating Page Templates

Build templates for different content types:

```jsx
// pages/posts/[slug].js
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getPostBySlug, getAllPosts } from '../../lib/api';
import PostContent from '../../components/PostContent';

export default function Post({ post }) {
  const router = useRouter();
  
  if (router.isFallback || !post) {
    return <div>Loading...</div>;
  }
  
  const blocks = post._embedded && post._embedded['wp:blockdata'] 
    ? post._embedded['wp:blockdata'] 
    : [];
  
  return (
    <>
      <Head>
        <title>{post.title.rendered}</title>
      </Head>
      <article>
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <div className="post-meta">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString()}
          </time>
        </div>
        <PostContent blocks={blocks} />
      </article>
    </>
  );
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    props: { post },
    revalidate: 60 // Re-generate page every 60 seconds if content changes
  };
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  
  return {
    paths: posts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: 'blocking'
  };
}
```

## Phase 4: Content Migration

### Handling Media Assets

Migrate media files with proper optimization:

```javascript
// Example: Script to download and optimize media files
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import sharp from 'sharp';

async function downloadMedia() {
  const response = await fetch('https://your-wp-site.com/wp-json/wp/v2/media?per_page=100');
  const media = await response.json();
  
  for (const item of media) {
    try {
      const imageUrl = item.source_url;
      const fileName = path.basename(imageUrl);
      
      // Download original image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.buffer();
      
      // Save original
      fs.writeFileSync(`./public/media/original/${fileName}`, imageBuffer);
      
      // Create optimized versions
      const image = sharp(imageBuffer);
      
      // Create webp version (better compression)
      await image
        .webp({ quality: 80 })
        .toFile(`./public/media/webp/${path.parse(fileName).name}.webp`);
      
      // Create responsive versions for different screen sizes
      const sizes = [480, 768, 1024, 1920];
      for (const width of sizes) {
        await image
          .resize(width)
          .webp({ quality: 80 })
          .toFile(`./public/media/webp/${path.parse(fileName).name}-${width}.webp`);
      }
      
      console.log(`Processed: ${fileName}`);
    } catch (error) {
      console.error(`Error processing ${item.source_url}:`, error);
    }
  }
}
```

### Custom Post Types and Taxonomies

Handle custom content types in your migration:

```javascript
// Example: Fetching custom post types
async function fetchCustomPostType(type) {
  const response = await fetch(`https://your-wp-site.com/wp-json/wp/v2/${type}?per_page=100&_embed=wp:blockdata`);
  return response.json();
}

// Example: Fetching taxonomies
async function fetchTaxonomies() {
  const response = await fetch('https://your-wp-site.com/wp-json/wp/v2/taxonomies');
  return response.json();
}
```

## Phase 5: Testing & QA

### Setting Up Testing Environment

Create a comprehensive testing plan:

1. Set up environment variables for different environments:

```
# .env.development
WORDPRESS_API_URL=https://staging-wp-site.com/wp-json/wp/v2

# .env.production
WORDPRESS_API_URL=https://production-wp-site.com/wp-json/wp/v2
```

2. Implement automated tests for API integration:

```javascript
// __tests__/api.test.js
import { getAllPosts, getPostBySlug } from '../lib/api';

jest.mock('node-fetch');

describe('WordPress API Integration', () => {
  test('getAllPosts returns array of posts', async () => {
    const posts = await getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
  });
  
  test('getPostBySlug returns a single post', async () => {
    const post = await getPostBySlug('sample-post');
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
  });
});
```

3. Test content rendering with different content types

## Phase 6: Deployment & Launch

### Deployment Options

Choose an appropriate hosting solution:

| Type | Examples | Best For |
|------|----------|----------|
| Static Hosting | Netlify, Vercel, GitHub Pages | Simple sites, blogs |
| Serverless | Vercel, AWS Lambda + API Gateway | Dynamic sites with API routes |
| Container | Docker + Kubernetes, AWS ECS | Complex applications |

Example deployment to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Implementing Incremental Static Regeneration (ISR)

For Next.js projects, use ISR to keep content fresh:

```javascript
// pages/[...slug].js
export async function getStaticProps({ params }) {
  const { slug } = params;
  
  // Try to get page first
  let content = await getPageBySlug(slug.join('/'));
  let type = 'page';
  
  // If not a page, try post
  if (!content) {
    content = await getPostBySlug(slug[slug.length - 1]);
    type = 'post';
  }
  
  if (!content) {
    return { notFound: true };
  }
  
  return {
    props: { content, type },
    revalidate: 60 // Regenerate page after 60 seconds
  };
}
```

### Setting Up a Preview System

Create a preview environment for editors:

```javascript
// pages/api/preview.js
export default async function handler(req, res) {
  const { secret, id, type = 'post' } = req.query;

  // Check the secret and next parameters
  if (secret !== process.env.PREVIEW_SECRET || !id) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  // Fetch the content
  let content;
  try {
    const response = await fetch(
      `${process.env.WORDPRESS_API_URL}/${type}s/${id}?_embed=wp:blockdata`
    );
    content = await response.json();
  } catch (error) {
    return res.status(401).json({ message: 'Error fetching content' });
  }
  
  if (!content) {
    return res.status(401).json({ message: 'Content not found' });
  }
  
  // Enable Preview Mode
  res.setPreviewData({});
  
  // Redirect to the content path
  const path = type === 'page' 
    ? `/${content.slug}`
    : `/posts/${content.slug}`;
    
  res.redirect(path);
}
```

Add to WordPress functions.php:

```php
function add_preview_button($post) {
  $post_type = get_post_type($post);
  $preview_url = get_site_url() . '/api/preview?' . http_build_query([
    'secret' => 'YOUR_PREVIEW_SECRET',
    'id' => $post->ID,
    'type' => $post_type
  ]);
  
  echo '<a href="' . esc_url($preview_url) . '" target="_blank" class="button">Preview on Headless</a>';
}

add_action('post_submitbox_misc_actions', 'add_preview_button');
```

## Performance Comparison

Track performance improvements:

```javascript
// Example: Script to compare performance
async function comparePerformance() {
  const sites = [
    { name: 'WordPress Site', url: 'https://your-wp-site.com/' },
    { name: 'Headless Site', url: 'https://your-headless-site.com/' }
  ];
  
  for (const site of sites) {
    console.log(`Testing ${site.name}...`);
    
    // You can use Lighthouse programmatically here or another tool
    // For simplicity, we're just measuring load time
    const start = Date.now();
    await fetch(site.url);
    const loadTime = Date.now() - start;
    
    console.log(`Load time: ${loadTime}ms`);
  }
}
```

## Common Challenges and Solutions

### SEO Considerations

Maintain and improve SEO during migration:

1. Implement proper meta tags:

```jsx
// components/SEO.js
import Head from 'next/head';

export default function SEO({ title, description, canonical, ogImage }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
```

2. Set up proper redirects:

```js
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
      // More redirects from your WordPress site...
    ];
  },
};
```

### Authentication and Protected Content

Handle user authentication if needed:

```jsx
// lib/auth.js
import { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('auth_token');
      if (token) {
        try {
          const response = await fetch('https://your-wp-site.com/wp-json/wp/v2/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      }
      setLoading(false);
    }
    
    loadUserFromCookies();
  }, []);
  
  const login = async (username, password) => {
    try {
      const response = await fetch('https://your-wp-site.com/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.token) {
        Cookies.set('auth_token', data.token, { expires: 7 });
        setUser(data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };
  
  const logout = () => {
    Cookies.remove('auth_token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Forms and Dynamic Features

Implement forms that submit back to WordPress:

```jsx
// components/ContactForm.js
import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch('https://your-wp-site.com/wp-json/contact-form-7/v1/contact-forms/123/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'your-name': name,
          'your-email': email,
          'your-message': message
        })
      });
      
      const data = await response.json();
      
      setStatus(data.status);
      
      if (data.status === 'mail_sent') {
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch (error) {
      console.error('Form submission error', error);
      setStatus('error');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {status === 'mail_sent' && <div className="success">Message sent successfully!</div>}
      {status === 'error' && <div className="error">Failed to send message. Please try again.</div>}
      
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input 
          type="text" 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea 
          id="message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      
      <button 
        type="submit" 
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

## Conclusion

Migrating from WordPress to a headless architecture using WP Block to HTML offers significant benefits in terms of performance, developer experience, and scalability. By following this guide, you can systematically transition your website while maintaining content integrity and improving the overall user experience.

Remember that this is an iterative process - you can start with a small section of your site and gradually migrate the rest as you become more comfortable with the headless approach. 