# Gatsby Integration

This guide explains how to use WP Block to HTML with Gatsby to build high-performance websites with WordPress as a headless CMS.

## Setting Up a Gatsby Project

First, create a new Gatsby project if you don't have one already:

```bash
# Install the Gatsby CLI if you haven't already
npm install -g gatsby-cli

# Create a new Gatsby site
gatsby new my-wp-gatsby-site
cd my-wp-gatsby-site
```

Next, install WP Block to HTML and other required packages:

```bash
npm install wp-block-to-html gatsby-source-wordpress
```

## Configuring the WordPress Source Plugin

Configure the WordPress source plugin in your `gatsby-config.js` file:

```javascript
// gatsby-config.js
module.exports = {
  siteMetadata: {
    title: `WordPress Gatsby Blog`,
    description: `A blog built with Gatsby and WordPress`,
    author: `@yourhandle`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        url: `https://your-wordpress-site.com/graphql`,
        schema: {
          perPage: 20,
          timeout: 60000,
        },
        html: {
          useGatsbyImage: true,
          createStaticFiles: true,
        },
        type: {
          Post: {
            limit: 50,
          },
        },
      },
    },
    // other plugins...
  ],
}
```

## Basic GraphQL Query

Create a GraphQL query to fetch WordPress post data including blocks:

```javascript
// Example GraphQL query in your page template
export const query = graphql`
  query PostBySlug($slug: String!) {
    wpPost(slug: { eq: $slug }) {
      id
      title
      content
      excerpt
      date
      blocks {
        name
        originalContent
        innerBlocks {
          name
          originalContent
          innerBlocks {
            name
            originalContent
          }
          attributesJSON
        }
        attributesJSON
      }
      featuredImage {
        node {
          sourceUrl
          localFile {
            childImageSharp {
              gatsbyImageData(
                width: 1200
                quality: 80
                placeholder: BLURRED
                formats: [AUTO, WEBP]
              )
            }
          }
        }
      }
    }
  }
`
```

## Creating a Post Template

Create a template for rendering WordPress posts:

```jsx
// src/templates/post.js
import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../components/layout'
import SEO from '../components/seo'
import { convertBlocks } from 'wp-block-to-html'

const PostTemplate = ({ data }) => {
  const post = data.wpPost
  const featuredImage = post.featuredImage?.node?.localFile
    ? getImage(post.featuredImage.node.localFile)
    : null

  // Convert blocks to HTML if available
  let renderedContent = post.content
  
  if (post.blocks && post.blocks.length > 0) {
    try {
      // Transform the blocks data structure to match what WP Block to HTML expects
      const blocksData = post.blocks.map(block => {
        // Parse attributes
        const attrs = block.attributesJSON ? JSON.parse(block.attributesJSON) : {}
        
        // Process inner blocks recursively
        const processInnerBlocks = (innerBlocks) => {
          if (!innerBlocks || !innerBlocks.length) return []
          
          return innerBlocks.map(inner => {
            const innerAttrs = inner.attributesJSON ? JSON.parse(inner.attributesJSON) : {}
            
            return {
              blockName: inner.name,
              attrs: innerAttrs,
              innerBlocks: processInnerBlocks(inner.innerBlocks),
              innerContent: [inner.originalContent]
            }
          })
        }
        
        return {
          blockName: block.name,
          attrs,
          innerBlocks: processInnerBlocks(block.innerBlocks),
          innerContent: [block.originalContent]
        }
      })
      
      // Convert blocks to HTML
      renderedContent = convertBlocks(blocksData, {
        cssFramework: 'tailwind', // or your preferred framework
        contentHandling: 'html',
        ssrOptions: {
          enabled: true,
          optimizationLevel: 'balanced',
          lazyLoadMedia: true
        }
      })
    } catch (error) {
      console.error('Error converting blocks to HTML:', error)
      // Fallback to the default rendered content
    }
  }

  return (
    <Layout>
      <SEO
        title={post.title}
        description={post.excerpt.replace(/<[^>]*>/g, '')}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-8">
          {new Date(post.date).toLocaleDateString()}
        </p>
        
        {featuredImage && (
          <div className="mb-8">
            <GatsbyImage
              image={featuredImage}
              alt={post.title}
              className="rounded-lg shadow-lg"
            />
          </div>
        )}
        
        <div 
          className="prose lg:prose-xl mx-auto"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </article>
    </Layout>
  )
}

export default PostTemplate

export const query = graphql`
  query PostBySlug($slug: String!) {
    wpPost(slug: { eq: $slug }) {
      id
      title
      content
      excerpt
      date
      blocks {
        name
        originalContent
        innerBlocks {
          name
          originalContent
          innerBlocks {
            name
            originalContent
          }
          attributesJSON
        }
        attributesJSON
      }
      featuredImage {
        node {
          sourceUrl
          localFile {
            childImageSharp {
              gatsbyImageData(
                width: 1200
                quality: 80
                placeholder: BLURRED
                formats: [AUTO, WEBP]
              )
            }
          }
        }
      }
    }
  }
`
```

## Creating Pages from WordPress Posts

Create pages for each WordPress post in `gatsby-node.js`:

```javascript
// gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allWpPost {
        nodes {
          id
          slug
        }
      }
    }
  `)

  if (result.errors) {
    console.error(result.errors)
    throw new Error('There was an error fetching posts from WordPress')
  }

  const posts = result.data.allWpPost.nodes

  posts.forEach(post => {
    createPage({
      path: `/blog/${post.slug}`,
      component: require.resolve('./src/templates/post.js'),
      context: {
        id: post.id,
        slug: post.slug,
      },
    })
  })
}
```

## Creating a WordPress Data Hook

Create a custom hook for processing WordPress blocks:

```jsx
// src/hooks/use-wordpress-content.js
import { useState, useEffect } from 'react'
import { convertBlocks } from 'wp-block-to-html'

export const useWordPressContent = (blocks, content, options = {}) => {
  const [renderedContent, setRenderedContent] = useState(content || '')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!blocks || !blocks.length) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Transform the blocks data structure
      const blocksData = blocks.map(block => {
        // Parse attributes
        const attrs = block.attributesJSON ? JSON.parse(block.attributesJSON) : {}
        
        // Process inner blocks recursively
        const processInnerBlocks = (innerBlocks) => {
          if (!innerBlocks || !innerBlocks.length) return []
          
          return innerBlocks.map(inner => {
            const innerAttrs = inner.attributesJSON ? JSON.parse(inner.attributesJSON) : {}
            
            return {
              blockName: inner.name,
              attrs: innerAttrs,
              innerBlocks: processInnerBlocks(inner.innerBlocks),
              innerContent: [inner.originalContent]
            }
          })
        }
        
        return {
          blockName: block.name,
          attrs,
          innerBlocks: processInnerBlocks(block.innerBlocks),
          innerContent: [block.originalContent]
        }
      })
      
      // Convert blocks to HTML
      const result = convertBlocks(blocksData, {
        cssFramework: options.cssFramework || 'tailwind',
        contentHandling: options.contentHandling || 'html',
        ssrOptions: {
          enabled: false, // We're on the client now
          optimizationLevel: options.optimizationLevel || 'balanced',
          lazyLoadMedia: options.lazyLoadMedia || true
        }
      })
      
      setRenderedContent(result)
    } catch (err) {
      console.error('Error processing WordPress blocks:', err)
      setError(err)
    } finally {
      setIsProcessing(false)
    }
  }, [blocks, content, options])

  return { renderedContent, isProcessing, error }
}
```

Using the hook in your components:

```jsx
// Using the hook in your post template
import { useWordPressContent } from '../hooks/use-wordpress-content'

const PostTemplate = ({ data }) => {
  const post = data.wpPost
  
  const { renderedContent, isProcessing, error } = useWordPressContent(
    post.blocks,
    post.content,
    {
      cssFramework: 'tailwind',
      optimizationLevel: 'maximum',
      lazyLoadMedia: true
    }
  )
  
  return (
    <Layout>
      <SEO title={post.title} description={post.excerpt.replace(/<[^>]*>/g, '')} />
      <article className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        {isProcessing ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
            <p>There was an error rendering the content. Showing fallback content.</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ) : (
          <div 
            className="prose lg:prose-xl mx-auto"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        )}
      </article>
    </Layout>
  )
}
```

## CSS Framework Integration

### Tailwind CSS

If you're using Tailwind CSS with Gatsby:

1. Install Tailwind CSS:

```bash
npm install tailwindcss postcss autoprefixer gatsby-plugin-postcss
npx tailwindcss init -p
```

2. Configure `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

3. Configure PostCSS in `gatsby-config.js`:

```javascript
// gatsby-config.js
module.exports = {
  // ...other config
  plugins: [
    `gatsby-plugin-postcss`,
    // ...other plugins
  ],
}
```

4. Create a global CSS file:

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. Import the global CSS in your `gatsby-browser.js` file:

```javascript
// gatsby-browser.js
import './src/styles/global.css'
```

6. Configure WP Block to HTML to use Tailwind:

```javascript
convertBlocks(blocksData, {
  cssFramework: 'tailwind',
  // other options...
})
```

## Image Optimization

For optimal image handling with WordPress content:

```jsx
// src/components/wordpress-image.js
import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const WordPressImage = ({ image, alt, className }) => {
  if (!image) return null
  
  // Check if this is a Gatsby image
  if (image.childImageSharp) {
    const gatsbyImage = getImage(image)
    return (
      <GatsbyImage
        image={gatsbyImage}
        alt={alt || ''}
        className={className}
      />
    )
  }
  
  // Fallback to regular img tag
  return (
    <img
      src={image.sourceUrl || image}
      alt={alt || ''}
      className={className}
      loading="lazy"
    />
  )
}

export default WordPressImage
```

## Performance Optimization

For optimal performance with Gatsby and WordPress:

```javascript
// In your gatsby-node.js or other processing code
const optimizedContent = convertBlocks(blocksData, {
  cssFramework: 'tailwind',
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'maximum',
    lazyLoadMedia: true,
    preconnect: true,
    criticalPathOnly: true,
    removeDuplicateStyles: true
  }
})
```

## Building a WordPress Category Page

Create a template for WordPress category pages:

```jsx
// src/templates/category.js
import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'

const CategoryTemplate = ({ data, pageContext }) => {
  const { categoryName, categorySlug } = pageContext
  const posts = data.allWpPost.nodes

  return (
    <Layout>
      <SEO
        title={`${categoryName} Archives`}
        description={`Browse all posts in the ${categoryName} category`}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-bold mb-8">Category: {categoryName}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">
                <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-500 text-sm mb-3">
                {new Date(post.date).toLocaleDateString()}
              </p>
              <div 
                className="text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
              <Link 
                to={`/blog/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default CategoryTemplate

export const query = graphql`
  query PostsByCategory($categoryId: String!) {
    allWpPost(
      filter: {categories: {nodes: {elemMatch: {id: {eq: $categoryId}}}}}
      sort: {date: DESC}
    ) {
      nodes {
        id
        title
        excerpt
        slug
        date
      }
    }
  }
`
```

Update your `gatsby-node.js` to create category pages:

```javascript
// In gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Create post pages (as shown previously)
  // ...

  // Create category pages
  const categoryResult = await graphql(`
    {
      allWpCategory {
        nodes {
          id
          name
          slug
        }
      }
    }
  `)

  if (!categoryResult.errors) {
    const categories = categoryResult.data.allWpCategory.nodes

    categories.forEach(category => {
      createPage({
        path: `/category/${category.slug}`,
        component: require.resolve('./src/templates/category.js'),
        context: {
          categoryId: category.id,
          categoryName: category.name,
          categorySlug: category.slug,
        },
      })
    })
  }
}
```

## Complete Example: Blog Home Page

Create a home page for your WordPress blog:

```jsx
// src/pages/index.js
import React from 'react'
import { graphql, Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../components/layout'
import SEO from '../components/seo'

const HomePage = ({ data }) => {
  const posts = data.allWpPost.nodes
  const featuredPost = posts[0]
  const otherPosts = posts.slice(1)
  
  const featuredImage = featuredPost.featuredImage?.node?.localFile
    ? getImage(featuredPost.featuredImage.node.localFile)
    : null

  return (
    <Layout>
      <SEO title="Home" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured Post</h2>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {featuredImage && (
              <GatsbyImage
                image={featuredImage}
                alt={featuredPost.title}
                className="w-full h-96 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">
                <Link to={`/blog/${featuredPost.slug}`} className="hover:text-blue-600">
                  {featuredPost.title}
                </Link>
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {new Date(featuredPost.date).toLocaleDateString()}
              </p>
              <div 
                className="text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: featuredPost.excerpt }}
              />
              <Link 
                to={`/blog/${featuredPost.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </Link>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map(post => {
              const postImage = post.featuredImage?.node?.localFile
                ? getImage(post.featuredImage.node.localFile)
                : null
                
              return (
                <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  {postImage && (
                    <GatsbyImage
                      image={postImage}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                    <div 
                      className="text-gray-700 mb-4"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/blog"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              View All Posts
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default HomePage

export const query = graphql`
  query HomePageQuery {
    allWpPost(
      sort: {date: DESC}
      limit: 7
    ) {
      nodes {
        id
        title
        excerpt
        slug
        date
        featuredImage {
          node {
            sourceUrl
            localFile {
              childImageSharp {
                gatsbyImageData(
                  width: 1200
                  height: 628
                  quality: 80
                  placeholder: BLURRED
                  formats: [AUTO, WEBP]
                )
              }
            }
          }
        }
      }
    }
  }
`
```

## Next Steps

- Learn about [Server-Side Rendering](/guide/server-side-rendering) for additional optimization techniques.
- Explore [Performance Optimization](/guide/performance) for high-traffic sites.
- Check out [CSS Framework Integration](/guide/css-frameworks) for styling options.
- Read about [Custom Block Transformers](/guide/custom-transformers) to customize block rendering for your Gatsby site. 