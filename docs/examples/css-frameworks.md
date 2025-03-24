# CSS Framework Examples

This page provides practical examples of using WP Block to HTML with different CSS frameworks. These examples demonstrate how to convert WordPress Gutenberg blocks to HTML that works seamlessly with your preferred CSS framework.

## Tailwind CSS

Tailwind CSS is a utility-first CSS framework that can be used with WP Block to HTML to create clean, responsive designs.

### Basic Tailwind Example

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress blocks data
const blocks = [
  {
    blockName: 'core/heading',
    attrs: { level: 1, content: 'Welcome to My Blog' },
    innerBlocks: [],
    innerContent: ['<h1>Welcome to My Blog</h1>']
  },
  {
    blockName: 'core/paragraph',
    attrs: {},
    innerBlocks: [],
    innerContent: ['<p>This is a Tailwind CSS styled WordPress blog.</p>']
  },
  {
    blockName: 'core/columns',
    attrs: { columns: 2 },
    innerBlocks: [
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>This is the first column content.</p>']
          }
        ],
        innerContent: ['', '']
      },
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>This is the second column content.</p>']
          }
        ],
        innerContent: ['', '']
      }
    ],
    innerContent: ['', '', '']
  }
];

// Convert to Tailwind-styled HTML
const html = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  contentHandling: 'html'
});

console.log(html);
```

### Result

The HTML output will use Tailwind CSS classes:

```html
<div class="wp-block-wrapper">
  <h1 class="text-4xl font-bold mb-6">Welcome to My Blog</h1>
  <p class="mb-4">This is a Tailwind CSS styled WordPress blog.</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <p class="mb-4">This is the first column content.</p>
    </div>
    <div>
      <p class="mb-4">This is the second column content.</p>
    </div>
  </div>
</div>
```

## Bootstrap

Bootstrap is a popular CSS framework that provides pre-designed components.

### Basic Bootstrap Example

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress blocks data - same as the Tailwind example
const blocks = [
  {
    blockName: 'core/heading',
    attrs: { level: 1, content: 'Welcome to My Blog' },
    innerBlocks: [],
    innerContent: ['<h1>Welcome to My Blog</h1>']
  },
  {
    blockName: 'core/paragraph',
    attrs: {},
    innerBlocks: [],
    innerContent: ['<p>This is a Bootstrap styled WordPress blog.</p>']
  },
  {
    blockName: 'core/columns',
    attrs: { columns: 2 },
    innerBlocks: [
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>This is the first column content.</p>']
          }
        ],
        innerContent: ['', '']
      },
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>This is the second column content.</p>']
          }
        ],
        innerContent: ['', '']
      }
    ],
    innerContent: ['', '', '']
  }
];

// Convert to Bootstrap-styled HTML
const html = convertBlocks(blocks, {
  cssFramework: 'bootstrap',
  contentHandling: 'html'
});

console.log(html);
```

### Result

The HTML output will use Bootstrap classes:

```html
<div class="wp-block-wrapper">
  <h1 class="display-4 mb-4">Welcome to My Blog</h1>
  <p class="lead mb-4">This is a Bootstrap styled WordPress blog.</p>
  
  <div class="row">
    <div class="col-md-6">
      <p class="mb-4">This is the first column content.</p>
    </div>
    <div class="col-md-6">
      <p class="mb-4">This is the second column content.</p>
    </div>
  </div>
</div>
```

## Bulma

Bulma is a modern CSS framework based on Flexbox.

### Basic Bulma Example

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress blocks data - same as previous examples
const blocks = [
  {
    blockName: 'core/heading',
    attrs: { level: 1, content: 'Welcome to My Blog' },
    innerBlocks: [],
    innerContent: ['<h1>Welcome to My Blog</h1>']
  },
  {
    blockName: 'core/paragraph',
    attrs: {},
    innerBlocks: [],
    innerContent: ['<p>This is a Bulma styled WordPress blog.</p>']
  },
  {
    blockName: 'core/columns',
    attrs: { columns: 2 },
    innerBlocks: [
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>This is the first column content.</p>']
          }
        ],
        innerContent: ['', '']
      },
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>This is the second column content.</p>']
          }
        ],
        innerContent: ['', '']
      }
    ],
    innerContent: ['', '', '']
  }
];

// Convert to Bulma-styled HTML
const html = convertBlocks(blocks, {
  cssFramework: 'bulma',
  contentHandling: 'html'
});

console.log(html);
```

### Result

The HTML output will use Bulma classes:

```html
<div class="wp-block-wrapper">
  <h1 class="title is-1">Welcome to My Blog</h1>
  <p class="content">This is a Bulma styled WordPress blog.</p>
  
  <div class="columns">
    <div class="column">
      <p class="content">This is the first column content.</p>
    </div>
    <div class="column">
      <p class="content">This is the second column content.</p>
    </div>
  </div>
</div>
```

## Foundation

Foundation is a responsive front-end framework.

### Basic Foundation Example

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress blocks data - same as previous examples
const blocks = [
  {
    blockName: 'core/heading',
    attrs: { level: 1, content: 'Welcome to My Blog' },
    innerBlocks: [],
    innerContent: ['<h1>Welcome to My Blog</h1>']
  },
  {
    blockName: 'core/paragraph',
    attrs: {},
    innerBlocks: [],
    innerContent: ['<p>This is a Foundation styled WordPress blog.</p>']
  },
  {
    blockName: 'core/columns',
    attrs: { columns: 2 },
    innerBlocks: [
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>This is the first column content.</p>']
          }
        ],
        innerContent: ['', '']
      },
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>This is the second column content.</p>']
          }
        ],
        innerContent: ['', '']
      }
    ],
    innerContent: ['', '', '']
  }
];

// Convert to Foundation-styled HTML
const html = convertBlocks(blocks, {
  cssFramework: 'foundation',
  contentHandling: 'html'
});

console.log(html);
```

### Result

The HTML output will use Foundation classes:

```html
<div class="wp-block-wrapper">
  <h1 class="h1">Welcome to My Blog</h1>
  <p class="lead">This is a Foundation styled WordPress blog.</p>
  
  <div class="grid-x grid-margin-x">
    <div class="cell medium-6">
      <p>This is the first column content.</p>
    </div>
    <div class="cell medium-6">
      <p>This is the second column content.</p>
    </div>
  </div>
</div>
```

## Custom CSS Framework

You can also create a custom CSS framework adapter for your own styling needs.

### Custom CSS Framework Example

```javascript
import { convertBlocks, registerCSSFramework } from 'wp-block-to-html';

// Define custom CSS mapping
const customFrameworkMapping = {
  heading: {
    h1: 'custom-heading custom-h1',
    h2: 'custom-heading custom-h2',
    h3: 'custom-heading custom-h3',
    h4: 'custom-heading custom-h4',
    h5: 'custom-heading custom-h5',
    h6: 'custom-heading custom-h6',
  },
  paragraph: 'custom-paragraph',
  columns: 'custom-row',
  column: 'custom-column',
  image: 'custom-image',
  button: 'custom-button',
  list: 'custom-list',
  listItem: 'custom-list-item',
  quote: 'custom-quote',
  table: 'custom-table',
  wrapper: 'custom-wrapper'
};

// Register custom CSS framework
registerCSSFramework('custom', customFrameworkMapping);

// WordPress blocks data - same as previous examples
const blocks = [
  {
    blockName: 'core/heading',
    attrs: { level: 1, content: 'Welcome to My Blog' },
    innerBlocks: [],
    innerContent: ['<h1>Welcome to My Blog</h1>']
  },
  {
    blockName: 'core/paragraph',
    attrs: {},
    innerBlocks: [],
    innerContent: ['<p>This is a custom styled WordPress blog.</p>']
  },
  {
    blockName: 'core/columns',
    attrs: { columns: 2 },
    innerBlocks: [
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>This is the first column content.</p>']
          }
        ],
        innerContent: ['', '']
      },
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>This is the second column content.</p>']
          }
        ],
        innerContent: ['', '']
      }
    ],
    innerContent: ['', '', '']
  }
];

// Convert to custom-styled HTML
const html = convertBlocks(blocks, {
  cssFramework: 'custom',
  contentHandling: 'html'
});

console.log(html);
```

### Result

The HTML output will use your custom classes:

```html
<div class="custom-wrapper">
  <h1 class="custom-heading custom-h1">Welcome to My Blog</h1>
  <p class="custom-paragraph">This is a custom styled WordPress blog.</p>
  
  <div class="custom-row">
    <div class="custom-column">
      <p class="custom-paragraph">This is the first column content.</p>
    </div>
    <div class="custom-column">
      <p class="custom-paragraph">This is the second column content.</p>
    </div>
  </div>
</div>
```

## Real-World Example

Here's a more complex example with different block types:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress blocks data with more block types
const blocks = [
  {
    blockName: 'core/heading',
    attrs: { level: 1, content: 'Travel Blog: My European Adventure' },
    innerBlocks: [],
    innerContent: ['<h1>Travel Blog: My European Adventure</h1>']
  },
  {
    blockName: 'core/paragraph',
    attrs: {},
    innerBlocks: [],
    innerContent: ['<p>Join me as I share my incredible journey through Europe\'s most beautiful cities.</p>']
  },
  {
    blockName: 'core/image',
    attrs: {
      url: 'https://example.com/images/paris.jpg',
      alt: 'Eiffel Tower at sunset',
      caption: 'The iconic Eiffel Tower at sunset'
    },
    innerBlocks: [],
    innerContent: ['<figure class="wp-block-image"><img src="https://example.com/images/paris.jpg" alt="Eiffel Tower at sunset"/><figcaption>The iconic Eiffel Tower at sunset</figcaption></figure>']
  },
  {
    blockName: 'core/heading',
    attrs: { level: 2, content: 'Paris: City of Lights' },
    innerBlocks: [],
    innerContent: ['<h2>Paris: City of Lights</h2>']
  },
  {
    blockName: 'core/paragraph',
    attrs: {},
    innerBlocks: [],
    innerContent: ['<p>Our journey began in Paris, where we spent three magical days exploring the city.</p>']
  },
  {
    blockName: 'core/quote',
    attrs: { citation: 'Ernest Hemingway' },
    innerBlocks: [],
    innerContent: ['<blockquote class="wp-block-quote"><p>Paris is a moveable feast.</p><cite>Ernest Hemingway</cite></blockquote>']
  },
  {
    blockName: 'core/columns',
    attrs: { columns: 3 },
    innerBlocks: [
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/heading',
            attrs: { level: 3, content: 'Day 1' },
            innerBlocks: [],
            innerContent: ['<h3>Day 1</h3>']
          },
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>Visited the Louvre and Notre Dame.</p>']
          }
        ],
        innerContent: ['', '']
      },
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/heading',
            attrs: { level: 3, content: 'Day 2' },
            innerBlocks: [],
            innerContent: ['<h3>Day 2</h3>']
          },
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>Explored Montmartre and the Eiffel Tower.</p>']
          }
        ],
        innerContent: ['', '']
      },
      {
        blockName: 'core/column',
        attrs: {},
        innerBlocks: [
          {
            blockName: 'core/heading',
            attrs: { level: 3, content: 'Day 3' },
            innerBlocks: [],
            innerContent: ['<h3>Day 3</h3>']
          },
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>Visited Versailles Palace.</p>']
          }
        ],
        innerContent: ['', '']
      }
    ],
    innerContent: ['', '', '', '']
  },
  {
    blockName: 'core/list',
    attrs: { ordered: false },
    innerBlocks: [],
    innerContent: [
      '<ul><li>Favorite museum: The Louvre</li><li>Best meal: Dinner at a small bistro near the Seine</li><li>Most memorable moment: Watching the sunset from the Sacré-Cœur</li></ul>'
    ]
  },
  {
    blockName: 'core/button',
    attrs: {
      url: '#',
      text: 'View Paris Photo Gallery'
    },
    innerBlocks: [],
    innerContent: ['<div class="wp-block-button"><a class="wp-block-button__link" href="#">View Paris Photo Gallery</a></div>']
  }
];

// Convert to Tailwind-styled HTML
const html = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  contentHandling: 'html'
});

console.log(html);
```

## Advanced Usage

### Custom Block Transformers

You can create custom transformers for specific blocks:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Custom transformer for an Instagram embed block
const instagramTransformer = {
  transform: (block, options) => {
    if (block.blockName !== 'core-embed/instagram') {
      return null;
    }
    
    const { url } = block.attrs;
    
    // Create a responsive wrapper with appropriate classes
    const classes = options.cssFramework === 'tailwind'
      ? 'my-8 max-w-xl mx-auto rounded overflow-hidden shadow-lg'
      : options.cssFramework === 'bootstrap'
        ? 'mb-4 card'
        : 'instagram-embed';
    
    return `
      <div class="${classes}">
        <iframe 
          src="${url}/embed" 
          class="instagram-media w-full aspect-square"
          frameborder="0"
          scrolling="no"
          allowtransparency="true"
        ></iframe>
      </div>
    `;
  }
};

// WordPress blocks with Instagram embed
const blocks = [
  {
    blockName: 'core/heading',
    attrs: { level: 2, content: 'Check out my latest Instagram post!' },
    innerBlocks: [],
    innerContent: ['<h2>Check out my latest Instagram post!</h2>']
  },
  {
    blockName: 'core-embed/instagram',
    attrs: { url: 'https://www.instagram.com/p/example123/' },
    innerBlocks: [],
    innerContent: ['']
  }
];

// Convert to Tailwind-styled HTML with custom transformer
const html = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  contentHandling: 'html',
  blockTransformers: [instagramTransformer]
});

console.log(html);
```

## CSS Framework Comparison

Here's a comparison of how the same WordPress blocks are rendered across different CSS frameworks:

| Block Type | Tailwind | Bootstrap | Bulma | Foundation |
|------------|----------|-----------|-------|------------|
| Heading (H1) | `text-4xl font-bold mb-6` | `display-4 mb-4` | `title is-1` | `h1` |
| Paragraph | `mb-4` | `lead mb-4` | `content` | None |
| Image | `w-full h-auto rounded` | `img-fluid rounded` | `image` | None |
| Button | `py-2 px-4 bg-blue-500 text-white rounded` | `btn btn-primary` | `button is-primary` | `button` |
| Columns Container | `grid grid-cols-1 md:grid-cols-[n] gap-4` | `row` | `columns` | `grid-x grid-margin-x` |
| Column | `none` | `col-md-x` | `column` | `cell medium-x` |
| Quote | `border-l-4 border-gray-300 pl-4 italic` | `blockquote` | `block` | `blockquote` |

## Further Resources

- [WP Block to HTML API documentation](/api/configuration)
- [CSS Framework Integration Guide](/guide/css-frameworks)
- [Custom Transformers Documentation](/guide/custom-transformers)
- [Server-Side Rendering Guide](/guide/server-side-rendering) 