# Advanced Examples

This page demonstrates advanced usage patterns and techniques for WP Block to HTML. These examples go beyond basic integration to show how to handle complex scenarios and customize the library for specific needs.

## Incremental Rendering for Large Content

When dealing with large WordPress content, incremental rendering can improve performance by breaking the rendering into smaller batches:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Fetch large content from WordPress
const fetchLargeContent = async () => {
  const response = await fetch('https://your-wordpress-site.com/wp-json/wp/v2/pages/123?_fields=blocks');
  const data = await response.json();
  return data.blocks;
};

// Render incrementally
const renderIncrementally = async () => {
  const contentContainer = document.getElementById('content');
  const loadingIndicator = document.getElementById('loading');
  
  // Show loading indicator
  loadingIndicator.style.display = 'block';
  
  try {
    const blocks = await fetchLargeContent();
    
    // Convert blocks with incremental rendering options
    const html = convertBlocks(blocks, {
      cssFramework: 'tailwind',
      incrementalOptions: {
        enabled: true,
        initialRenderCount: 10, // Render the first 10 blocks immediately
        batchSize: 5,          // Then render 5 blocks at a time
        renderDelay: 100,      // Wait 100ms between batches
        onProgress: (progress) => {
          // Update a progress bar
          const progressBar = document.getElementById('progress-bar');
          progressBar.style.width = `${progress * 100}%`;
        }
      }
    });
    
    // Update DOM
    contentContainer.innerHTML = html;
  } catch (error) {
    console.error('Error rendering content:', error);
    contentContainer.innerHTML = '<p>Error loading content. Please try again later.</p>';
  } finally {
    // Hide loading indicator
    loadingIndicator.style.display = 'none';
  }
};

renderIncrementally();
```

## Server-Side Rendering with Optimizations

When rendering on the server, you can optimize the output for better performance:

```javascript
// Node.js server example (Express)
import express from 'express';
import { convertBlocks } from 'wp-block-to-html';
import fetch from 'node-fetch';

const app = express();

app.get('/post/:slug', async (req, res) => {
  try {
    // Fetch post data from WordPress
    const response = await fetch(
      `https://your-wordpress-site.com/wp-json/wp/v2/posts?slug=${req.params.slug}&_fields=id,title,blocks`
    );
    
    if (!response.ok) {
      return res.status(404).send('Post not found');
    }
    
    const posts = await response.json();
    
    if (!posts.length) {
      return res.status(404).send('Post not found');
    }
    
    const post = posts[0];
    
    // Convert blocks with SSR optimizations
    const content = convertBlocks(post.blocks, {
      cssFramework: 'tailwind',
      ssrOptions: {
        enabled: true,                 // Enable SSR optimizations
        optimizationLevel: 'maximum',  // Apply all optimizations
        lazyLoadMedia: true,           // Add loading="lazy" to images
        preconnect: true,              // Add preconnect hints
        criticalPathOnly: true,        // Only include critical CSS
        removeDuplicateStyles: true    // Remove duplicate style blocks
      }
    });
    
    // Render full HTML page
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${post.title.rendered}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-100">
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold mb-6">${post.title.rendered}</h1>
          <div class="bg-white p-6 rounded-lg shadow-md">
            ${content}
          </div>
        </div>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    console.error('Error rendering post:', error);
    res.status(500).send('Error rendering post');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Custom Block Transformation Pipeline

Create a custom transformation pipeline for specialized needs:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Custom transformers
const customTransformers = [
  // Add syntax highlighting to code blocks
  {
    transform: (block, options) => {
      if (block.blockName !== 'core/code') {
        return null;
      }
      
      const { content, language } = block.attrs;
      const escapedContent = escapeHTML(content || '');
      const langClass = language ? `language-${language}` : '';
      
      return `
        <pre class="wp-block-code ${langClass}">
          <code class="${langClass}">${escapedContent}</code>
        </pre>
        <script>
          // This assumes Prism.js is loaded on the page
          if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
          }
        </script>
      `;
    }
  },
  
  // Transform tables to be sortable
  {
    transform: (block, options) => {
      if (block.blockName !== 'core/table') {
        return null;
      }
      
      // Extract the original table HTML
      const originalTable = block.innerContent[0] || '';
      
      // Add classes based on the CSS framework
      let tableClass = '';
      
      switch (options.cssFramework) {
        case 'tailwind':
          tableClass = 'min-w-full divide-y divide-gray-200 sortable-table';
          break;
        case 'bootstrap':
          tableClass = 'table table-striped table-hover sortable-table';
          break;
        default:
          tableClass = 'sortable-table';
      }
      
      // Replace the table tag with one that includes the class
      const enhancedTable = originalTable.replace(
        '<table', 
        `<table class="${tableClass}"`
      );
      
      return `
        ${enhancedTable}
        <script>
          // This assumes a table sorter library is available
          if (typeof initSortableTables === 'function') {
            initSortableTables();
          }
        </script>
      `;
    }
  }
];

// Usage with WordPress content
const renderEnhancedContent = (blocks) => {
  return convertBlocks(blocks, {
    cssFramework: 'tailwind',
    blockTransformers: customTransformers,
    contentHandling: 'html'
  });
};
```

## Integration with Custom CSS Framework

Create an adapter for a custom CSS framework:

```javascript
import { convertBlocks, registerCSSFramework } from 'wp-block-to-html';

// Define your custom framework mapping
const materialUIMapping = {
  heading: {
    h1: 'MuiTypography-h1',
    h2: 'MuiTypography-h2',
    h3: 'MuiTypography-h3',
    h4: 'MuiTypography-h4',
    h5: 'MuiTypography-h5',
    h6: 'MuiTypography-h6',
  },
  paragraph: 'MuiTypography-body1',
  columns: 'MuiGrid-container',
  column: 'MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6',
  image: 'MuiCardMedia-root',
  button: 'MuiButton-root MuiButton-contained',
  list: 'MuiList-root',
  listItem: 'MuiListItem-root',
  quote: 'MuiBox-quote',
  table: 'MuiTable-root',
  wrapper: 'MuiBox-root'
};

// Register custom framework
registerCSSFramework('material-ui', materialUIMapping);

// Use with WordPress blocks
const renderWithMaterialUI = (blocks) => {
  return convertBlocks(blocks, {
    cssFramework: 'material-ui',
    contentHandling: 'html'
  });
};
```

## Advanced Plugin Integration

Create a plugin system to extend functionality:

```javascript
import { 
  convertBlocks, 
  registerPlugin, 
  registerBlockHandler 
} from 'wp-block-to-html';

// Create a plugin for handling YouTube embeds
const youtubePlugin = {
  name: 'youtube-embed-handler',
  init: (api) => {
    // Register a custom block handler for YouTube embeds
    api.registerBlockHandler('core-embed/youtube', {
      transform: (block, options) => {
        const { url } = block.attrs;
        
        // Extract YouTube video ID
        const videoId = extractYouTubeId(url);
        
        if (!videoId) {
          return null;
        }
        
        // Create responsive wrapper based on CSS framework
        let wrapperClass = '';
        let videoClass = '';
        
        switch (options.cssFramework) {
          case 'tailwind':
            wrapperClass = 'relative pb-56.25 h-0 overflow-hidden max-w-full mb-6';
            videoClass = 'absolute top-0 left-0 w-full h-full';
            break;
          case 'bootstrap':
            wrapperClass = 'ratio ratio-16x9 mb-4';
            videoClass = '';
            break;
          default:
            wrapperClass = 'video-wrapper';
            videoClass = 'video-embed';
        }
        
        return `
          <div class="${wrapperClass}">
            <iframe 
              class="${videoClass}"
              src="https://www.youtube.com/embed/${videoId}" 
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        `;
      }
    });
    
    // Helper function to extract YouTube ID
    function extractYouTubeId(url) {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
  }
};

// Register and use the plugin
registerPlugin(youtubePlugin);

// Later, use convertBlocks normally - the plugin handlers will be used automatically
const html = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  contentHandling: 'html'
});
```

## Processing Content with Different Output Formats

Handle different output formats based on the target platform:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Function to render content for different platforms
const renderForPlatform = (blocks, platform) => {
  switch (platform) {
    case 'web':
      return convertBlocks(blocks, {
        cssFramework: 'tailwind',
        contentHandling: 'html',
        ssrOptions: {
          enabled: true,
          optimizationLevel: 'balanced'
        }
      });
      
    case 'amp':
      return convertBlocks(blocks, {
        cssFramework: 'none', // AMP has its own styling constraints
        contentHandling: 'html',
        outputFormat: 'html',
        customClassMap: {
          image: 'amp-img',
          video: 'amp-video'
        },
        // Custom transformers for AMP compatibility
        blockTransformers: [
          {
            transform: (block, options) => {
              if (block.blockName !== 'core/image') {
                return null;
              }
              
              const { url, alt, width, height } = block.attrs;
              
              return `
                <amp-img
                  src="${url}"
                  alt="${alt || ''}"
                  width="${width || 800}"
                  height="${height || 600}"
                  layout="responsive"
                ></amp-img>
              `;
            }
          }
        ]
      });
      
    case 'email':
      return convertBlocks(blocks, {
        cssFramework: 'none', // Email clients have limited CSS support
        contentHandling: 'html',
        outputFormat: 'html',
        // Email-specific transformers for compatibility
        blockTransformers: [
          {
            transform: (block, options) => {
              if (block.blockName !== 'core/button') {
                return null;
              }
              
              const { url, text } = block.attrs;
              
              // Email-safe button with inline styles
              return `
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0;">
                  <tr>
                    <td style="background-color: #0066CC; border-radius: 4px; padding: 12px 24px;">
                      <a href="${url}" style="color: #ffffff; text-decoration: none; font-weight: bold; display: inline-block;">
                        ${text || 'Click here'}
                      </a>
                    </td>
                  </tr>
                </table>
              `;
            }
          }
        ]
      });
      
    default:
      return convertBlocks(blocks, {
        cssFramework: 'tailwind',
        contentHandling: 'html'
      });
  }
};

// Usage example
const renderContent = (blocks, platform) => {
  const content = renderForPlatform(blocks, platform);
  return content;
};
```

## Dynamic Block Loading

Load block handlers dynamically to reduce bundle size:

```javascript
import { convertBlocks, registerBlockHandler } from 'wp-block-to-html';

// Function to dynamically load block handlers based on content
const renderWithDynamicHandlers = async (blocks) => {
  // Analyze blocks to see what types are present
  const blockTypes = new Set();
  
  const analyzeBlocks = (blocksToAnalyze) => {
    for (const block of blocksToAnalyze) {
      if (block.blockName) {
        blockTypes.add(block.blockName);
      }
      
      if (block.innerBlocks && block.innerBlocks.length) {
        analyzeBlocks(block.innerBlocks);
      }
    }
  };
  
  analyzeBlocks(blocks);
  
  // Load handlers dynamically
  const loadHandlers = async () => {
    const promises = [];
    
    // Text blocks
    if (blockTypes.has('core/paragraph') || blockTypes.has('core/heading')) {
      promises.push(
        import('./handlers/text-handlers.js').then(module => {
          if (blockTypes.has('core/paragraph')) {
            registerBlockHandler('core/paragraph', module.paragraphHandler);
          }
          if (blockTypes.has('core/heading')) {
            registerBlockHandler('core/heading', module.headingHandler);
          }
        })
      );
    }
    
    // Media blocks
    if (blockTypes.has('core/image') || blockTypes.has('core/video')) {
      promises.push(
        import('./handlers/media-handlers.js').then(module => {
          if (blockTypes.has('core/image')) {
            registerBlockHandler('core/image', module.imageHandler);
          }
          if (blockTypes.has('core/video')) {
            registerBlockHandler('core/video', module.videoHandler);
          }
        })
      );
    }
    
    // Layout blocks
    if (blockTypes.has('core/columns') || blockTypes.has('core/group')) {
      promises.push(
        import('./handlers/layout-handlers.js').then(module => {
          if (blockTypes.has('core/columns')) {
            registerBlockHandler('core/columns', module.columnsHandler);
          }
          if (blockTypes.has('core/group')) {
            registerBlockHandler('core/group', module.groupHandler);
          }
        })
      );
    }
    
    await Promise.all(promises);
  };
  
  // Load necessary handlers
  await loadHandlers();
  
  // Now render content with loaded handlers
  return convertBlocks(blocks, {
    cssFramework: 'tailwind',
    contentHandling: 'html',
    ssrOptions: {
      enabled: false // We're loading handlers on demand client-side
    }
  });
};

// Usage
const renderContent = async () => {
  const blocks = await fetchBlocks();
  const html = await renderWithDynamicHandlers(blocks);
  document.getElementById('content').innerHTML = html;
};
```

## Next Steps

- [Custom Transformers Documentation](/guide/custom-transformers)
- [Server-Side Rendering Guide](/guide/server-side-rendering)
- [Performance Optimization Guide](/guide/performance)
- [Framework Components Guide](/guide/framework-components) 