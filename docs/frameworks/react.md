# React Integration

This guide covers how to integrate WP Block to HTML with React applications to efficiently convert WordPress blocks into React components.

## Installation

To use WP Block to HTML with React, install the core package and React integration:

```bash
# Using npm
npm install wp-block-to-html

# Using yarn
yarn add wp-block-to-html

# Using pnpm
pnpm add wp-block-to-html
```

Note that `react` and `react-dom` are peer dependencies and should already be installed in your project.

## Basic Usage

Here's how to convert WordPress blocks to React components:

```jsx
import React from 'react';
import { convertBlocksToReact } from 'wp-block-to-html/react';

// Your WordPress blocks data
const blocks = [
  {
    blockName: 'core/paragraph',
    attrs: { 
      content: 'Hello from WordPress!',
      align: 'center'
    },
    innerBlocks: []
  }
];

function WordPressContent() {
  // Convert blocks to React components
  const components = convertBlocksToReact(blocks);
  
  return (
    <div className="wordpress-content">
      {components}
    </div>
  );
}

export default WordPressContent;
```

## Configuration Options

The `convertBlocksToReact` function accepts the same options as the core `convertBlocks` function, with additional React-specific options:

```jsx
import { convertBlocksToReact } from 'wp-block-to-html/react';

const components = convertBlocksToReact(blocks, {
  // Core options
  cssFramework: 'tailwind',
  classMap: customClassMap,
  contentHandling: 'raw',
  
  // React-specific options
  components: {
    // Custom component mapping
    'core/image': MyCustomImageComponent
  },
  wrapBlocks: true,
  componentProps: {
    // Props to pass to all components
    className: 'my-custom-class'
  }
});
```

### React-Specific Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `components` | `Object` | `{}` | Map of block names to custom React components |
| `wrapBlocks` | `Boolean` | `false` | Whether to wrap each block in a div with data attributes |
| `componentProps` | `Object` | `{}` | Props to pass to all generated components |

## Using Custom Components

You can provide custom React components for specific blocks:

```jsx
import React from 'react';
import { convertBlocksToReact } from 'wp-block-to-html/react';

// Custom image component
function CustomImage({ src, alt, width, height, className }) {
  return (
    <div className="image-wrapper">
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        className={className}
        loading="lazy"
      />
      <div className="image-caption">{alt}</div>
    </div>
  );
}

// Map block types to custom components
const customComponents = {
  'core/image': CustomImage
};

function WordPressContent({ blocks }) {
  const components = convertBlocksToReact(blocks, {
    components: customComponents
  });
  
  return (
    <div className="wordpress-content">
      {components}
    </div>
  );
}
```

## Handling Events

React components can include event handlers:

```jsx
import React from 'react';
import { convertBlocksToReact } from 'wp-block-to-html/react';

function CustomButton({ url, text, className }) {
  const handleClick = (e) => {
    console.log('Button clicked:', text);
    // Add analytics tracking or other functionality
  };
  
  return (
    <a 
      href={url} 
      className={className}
      onClick={handleClick}
    >
      {text}
    </a>
  );
}

const customComponents = {
  'core/button': CustomButton
};

function ButtonsSection({ blocks }) {
  return (
    <div className="buttons-section">
      {convertBlocksToReact(blocks, {
        components: {
          'core/button': CustomButton
        }
      })}
    </div>
  );
}
```

## Server-Side Rendering

For server-side rendering (SSR) in frameworks like Next.js or Remix:

```jsx
// pages/[slug].js
import { convertBlocksToReact } from 'wp-block-to-html/react';
import { processBlocksForSSR } from 'wp-block-to-html';

export async function getServerSideProps({ params }) {
  // Fetch post data from WordPress API
  const response = await fetch(`https://your-wp-site.com/wp-json/wp/v2/posts?slug=${params.slug}`);
  const posts = await response.json();
  
  if (posts.length === 0) {
    return { notFound: true };
  }
  
  const post = posts[0];
  let blocks = [];
  
  if (post._embedded && post._embedded['wp:blockdata']) {
    blocks = post._embedded['wp:blockdata'];
    
    // Apply SSR optimizations
    blocks = processBlocksForSSR(blocks, {
      optimizationLevel: 'balanced'
    });
  }
  
  return {
    props: {
      post,
      blocks
    }
  };
}

function PostPage({ post, blocks }) {
  return (
    <article>
      <h1>{post.title.rendered}</h1>
      <div className="post-content">
        {convertBlocksToReact(blocks, {
          cssFramework: 'tailwind'
        })}
      </div>
    </article>
  );
}

export default PostPage;
```

## CSS Framework Integration

WP Block to HTML works well with various CSS frameworks in React:

### Tailwind CSS

```jsx
import { convertBlocksToReact } from 'wp-block-to-html/react';

function WordPressContent({ blocks }) {
  return (
    <div className="prose lg:prose-xl">
      {convertBlocksToReact(blocks, {
        cssFramework: 'tailwind'
      })}
    </div>
  );
}
```

### Bootstrap

```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { convertBlocksToReact } from 'wp-block-to-html/react';

function WordPressContent({ blocks }) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {convertBlocksToReact(blocks, {
            cssFramework: 'bootstrap'
          })}
        </div>
      </div>
    </div>
  );
}
```

### Custom CSS Framework

```jsx
import { convertBlocksToReact } from 'wp-block-to-html/react';
import { getClassMap } from 'wp-block-to-html';

// Get the base class map for Tailwind
const tailwindClasses = getClassMap('tailwind');

// Create custom class map
const customClassMap = {
  ...tailwindClasses,
  paragraph: {
    base: 'my-custom-paragraph mb-4 text-gray-800',
    alignLeft: 'text-left',
    alignCenter: 'text-center',
    alignRight: 'text-right'
  },
  heading: {
    base: 'font-display',
    level1: 'text-4xl mb-6',
    level2: 'text-3xl mb-5',
    level3: 'text-2xl mb-4',
    level4: 'text-xl mb-3',
    level5: 'text-lg mb-2',
    level6: 'text-base mb-2'
  }
};

function WordPressContent({ blocks }) {
  return (
    <div className="custom-content">
      {convertBlocksToReact(blocks, {
        classMap: customClassMap
      })}
    </div>
  );
}
```

## Handling Media

React components can manage media loading states:

```jsx
import React, { useState } from 'react';

function OptimizedImage({ src, alt, width, height, className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className={`image-container ${!isLoaded ? 'image-loading' : ''}`}>
      {!isLoaded && <div className="image-placeholder" style={{ width, height }}></div>}
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height} 
        className={`${className} ${isLoaded ? 'image-loaded' : 'image-loading'}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

// Use this component in your block conversion
const customComponents = {
  'core/image': OptimizedImage
};

function MediaGallery({ blocks }) {
  return (
    <div className="media-gallery">
      {convertBlocksToReact(blocks, {
        components: customComponents
      })}
    </div>
  );
}
```

## TypeScript Support

WP Block to HTML includes TypeScript definitions for React integration:

```tsx
import React from 'react';
import { convertBlocksToReact, ReactConversionOptions } from 'wp-block-to-html/react';
import { WordPressBlock } from 'wp-block-to-html';

interface CustomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, width, height, className }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height}
      className={className}
    />
  );
};

interface WordPressContentProps {
  blocks: WordPressBlock[];
}

const WordPressContent: React.FC<WordPressContentProps> = ({ blocks }) => {
  const options: ReactConversionOptions = {
    cssFramework: 'tailwind',
    components: {
      'core/image': CustomImage
    }
  };
  
  const components = convertBlocksToReact(blocks, options);
  
  return (
    <div className="wordpress-content">
      {components}
    </div>
  );
};

export default WordPressContent;
```

## Performance Optimization

For optimal performance with React:

1. **Memoization**: Use `React.memo` for custom components to prevent unnecessary re-renders

```jsx
const MemoizedImage = React.memo(function Image({ src, alt, width, height }) {
  return <img src={src} alt={alt} width={width} height={height} loading="lazy" />;
});

const customComponents = {
  'core/image': MemoizedImage
};
```

2. **Lazy Loading**: Use dynamic imports for heavy components

```jsx
import React, { Suspense, lazy } from 'react';

const LazyGallery = lazy(() => import('./components/Gallery'));

function CustomGalleryHandler({ images }) {
  return (
    <Suspense fallback={<div>Loading gallery...</div>}>
      <LazyGallery images={images} />
    </Suspense>
  );
}

const customComponents = {
  'core/gallery': CustomGalleryHandler
};
```

3. **Code Splitting**: Split component mapping by block category

```jsx
import { convertBlocksToReact } from 'wp-block-to-html/react';

// Split component mapping by category
const textComponents = {
  'core/paragraph': CustomParagraph,
  'core/heading': CustomHeading
};

const mediaComponents = {
  'core/image': CustomImage,
  'core/gallery': CustomGallery
};

function WordPressContent({ blocks }) {
  // Determine which component mappings to use based on blocks
  const hasMediaBlocks = blocks.some(block => 
    block.blockName?.startsWith('core/image') || 
    block.blockName?.startsWith('core/gallery')
  );
  
  const componentMapping = {
    ...textComponents,
    ...(hasMediaBlocks ? mediaComponents : {})
  };
  
  return (
    <div className="content">
      {convertBlocksToReact(blocks, {
        components: componentMapping
      })}
    </div>
  );
}
```

## Complete Example

Here's a complete example of using WP Block to HTML with React:

```jsx
import React, { useState, useEffect } from 'react';
import { convertBlocksToReact } from 'wp-block-to-html/react';
import { processBlocksForSSR } from 'wp-block-to-html';

// Custom components
const CustomHeading = ({ level, content, className }) => {
  const HeadingTag = `h${level}`;
  return <HeadingTag className={className}>{content}</HeadingTag>;
};

const CustomImage = ({ src, alt, width, height, className }) => {
  return (
    <figure className="image-figure">
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        className={className}
        loading="lazy"
      />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  );
};

// Component mapping
const customComponents = {
  'core/heading': CustomHeading,
  'core/image': CustomImage
};

function WordPressPostViewer({ postId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [blocks, setBlocks] = useState([]);
  
  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://your-wp-site.com/wp-json/wp/v2/posts/${postId}?_embed=wp:blockdata`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const postData = await response.json();
        setPost(postData);
        
        if (postData._embedded && postData._embedded['wp:blockdata']) {
          // Apply SSR optimizations to blocks
          const optimizedBlocks = processBlocksForSSR(
            postData._embedded['wp:blockdata'],
            { optimizationLevel: 'balanced' }
          );
          setBlocks(optimizedBlocks);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPost();
  }, [postId]);
  
  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!post) return <div className="not-found">Post not found</div>;
  
  return (
    <article className="wordpress-post">
      <header>
        <h1 className="post-title">{post.title.rendered}</h1>
        <div className="post-meta">
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
        </div>
      </header>
      
      <div className="post-content">
        {convertBlocksToReact(blocks, {
          cssFramework: 'tailwind',
          components: customComponents,
          wrapBlocks: true,
          componentProps: {
            className: 'post-block'
          }
        })}
      </div>
    </article>
  );
}

export default WordPressPostViewer;
```

## Troubleshooting React Integration

### Common Issues

1. **Components Not Rendering**: Ensure blocks array has the correct format with blockName property
2. **Missing Block Handlers**: If custom blocks aren't rendering, make sure they have appropriate handlers
3. **Hydration Errors**: For SSR, ensure React components produce the same output as the server-rendered HTML
4. **Performance Issues**: Use React DevTools to identify and optimize frequently re-rendering components

### Hydration Solutions

When using SSR frameworks like Next.js, prevent hydration mismatches:

```jsx
import { useEffect, useState } from 'react';
import { convertBlocksToReact } from 'wp-block-to-html/react';

function HydrationSafeContent({ blocks }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Render with minimal interactivity on server
  if (!isClient) {
    return (
      <div className="wordpress-content" dangerouslySetInnerHTML={{
        __html: convertBlocks(blocks, { contentHandling: 'raw' })
      }} />
    );
  }
  
  // Render full React components on client
  return (
    <div className="wordpress-content">
      {convertBlocksToReact(blocks, {
        contentHandling: 'raw',
        components: customComponents
      })}
    </div>
  );
}
``` 