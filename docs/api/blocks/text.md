# Text Blocks

This page documents the text block handlers available in WP Block to HTML.

## Overview

Text blocks are the most common blocks in WordPress content, including paragraphs, headings, lists, quotes, and more. WP Block to HTML provides optimized handlers for all WordPress core text blocks.

## Importing Text Block Handlers

You can import individual text block handlers for optimized bundle size:

```javascript
import { paragraphBlockHandler } from 'wp-block-to-html/blocks/text';
import { headingBlockHandler } from 'wp-block-to-html/blocks/text';
import { listBlockHandler } from 'wp-block-to-html/blocks/text';
```

Or import all text block handlers at once:

```javascript
import * as textBlockHandlers from 'wp-block-to-html/blocks/text';
```

## Available Text Block Handlers

### Paragraph Block

Handles the core/paragraph block type.

```javascript
// Example input
const paragraphBlock = {
  blockName: 'core/paragraph',
  attrs: {
    align: 'center',
    fontSize: 'medium',
    style: {
      color: {
        text: '#333333'
      }
    }
  },
  innerContent: ['<p class="has-text-align-center has-medium-font-size" style="color:#333333">This is a paragraph with custom styles.</p>']
};

// Example output with default CSS
// <p class="has-text-align-center has-medium-font-size" style="color:#333333">This is a paragraph with custom styles.</p>

// Example output with Tailwind CSS
// <p class="text-center text-lg text-[#333333]">This is a paragraph with custom styles.</p>
```

### Heading Block

Handles the core/heading block type.

```javascript
// Example input
const headingBlock = {
  blockName: 'core/heading',
  attrs: {
    level: 2,
    align: 'left',
    textColor: 'primary'
  },
  innerContent: ['<h2 class="has-text-align-left has-primary-color">This is a heading</h2>']
};

// Example output with default CSS
// <h2 class="has-text-align-left has-primary-color">This is a heading</h2>

// Example output with Tailwind CSS
// <h2 class="text-left text-primary-500">This is a heading</h2>
```

### List Block

Handles the core/list block type.

```javascript
// Example input
const listBlock = {
  blockName: 'core/list',
  attrs: {
    ordered: false,
    values: ['Item 1', 'Item 2', 'Item 3']
  },
  innerContent: ['<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>']
};

// Example output
// <ul>
//   <li>Item 1</li>
//   <li>Item 2</li>
//   <li>Item 3</li>
// </ul>
```

### Quote Block

Handles the core/quote block type.

```javascript
// Example input
const quoteBlock = {
  blockName: 'core/quote',
  attrs: {
    align: 'center',
    citation: 'Author Name'
  },
  innerContent: [
    '<blockquote class="wp-block-quote has-text-align-center"><p>This is a quotation from someone famous.</p><cite>Author Name</cite></blockquote>'
  ]
};

// Example output with default CSS
// <blockquote class="wp-block-quote has-text-align-center">
//   <p>This is a quotation from someone famous.</p>
//   <cite>Author Name</cite>
// </blockquote>

// Example output with Tailwind CSS
// <blockquote class="pl-4 border-l-4 border-gray-300 text-center">
//   <p>This is a quotation from someone famous.</p>
//   <cite class="block mt-2 text-sm text-gray-600">Author Name</cite>
// </blockquote>
```

### Code Block

Handles the core/code block type.

```javascript
// Example input
const codeBlock = {
  blockName: 'core/code',
  attrs: {},
  innerContent: ['<pre class="wp-block-code"><code>function hello() {\n  console.log("Hello, world!");\n}</code></pre>']
};

// Example output with default CSS
// <pre class="wp-block-code">
//   <code>function hello() {
//   console.log("Hello, world!");
// }</code>
// </pre>

// Example output with Tailwind CSS
// <pre class="p-4 bg-gray-100 rounded overflow-auto">
//   <code class="text-sm font-mono">function hello() {
//   console.log("Hello, world!");
// }</code>
// </pre>
```

### Preformatted Block

Handles the core/preformatted block type.

```javascript
// Example input
const preformattedBlock = {
  blockName: 'core/preformatted',
  attrs: {},
  innerContent: ['<pre class="wp-block-preformatted">This is preformatted text.\nIt preserves spaces and line breaks.</pre>']
};

// Example output
// <pre class="wp-block-preformatted">This is preformatted text.
// It preserves spaces and line breaks.</pre>
```

### Verse Block

Handles the core/verse block type.

```javascript
// Example input
const verseBlock = {
  blockName: 'core/verse',
  attrs: {},
  innerContent: ['<pre class="wp-block-verse">Roses are red,\nViolets are blue,\nThis is a verse block,\nJust for you.</pre>']
};

// Example output with default CSS
// <pre class="wp-block-verse">Roses are red,
// Violets are blue,
// This is a verse block,
// Just for you.</pre>

// Example output with Tailwind CSS
// <pre class="font-serif italic p-4">Roses are red,
// Violets are blue,
// This is a verse block,
// Just for you.</pre>
```

### Table Block

Handles the core/table block type.

```javascript
// Example input
const tableBlock = {
  blockName: 'core/table',
  attrs: {
    hasFixedLayout: true,
    head: [
      {
        cells: [
          {
            content: 'Header 1',
            tag: 'th'
          },
          {
            content: 'Header 2',
            tag: 'th'
          }
        ]
      }
    ],
    body: [
      {
        cells: [
          {
            content: 'Row 1, Cell 1',
            tag: 'td'
          },
          {
            content: 'Row 1, Cell 2',
            tag: 'td'
          }
        ]
      },
      {
        cells: [
          {
            content: 'Row 2, Cell 1',
            tag: 'td'
          },
          {
            content: 'Row 2, Cell 2',
            tag: 'td'
          }
        ]
      }
    ]
  },
  innerContent: ['<figure class="wp-block-table"><table class="has-fixed-layout"><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Row 1, Cell 1</td><td>Row 1, Cell 2</td></tr><tr><td>Row 2, Cell 1</td><td>Row 2, Cell 2</td></tr></tbody></table></figure>']
};

// Example output with Tailwind CSS
// <figure class="overflow-x-auto">
//   <table class="w-full table-fixed border-collapse">
//     <thead>
//       <tr class="bg-gray-100">
//         <th class="border p-2">Header 1</th>
//         <th class="border p-2">Header 2</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td class="border p-2">Row 1, Cell 1</td>
//         <td class="border p-2">Row 1, Cell 2</td>
//       </tr>
//       <tr>
//         <td class="border p-2">Row 2, Cell 1</td>
//         <td class="border p-2">Row 2, Cell 2</td>
//       </tr>
//     </tbody>
//   </table>
// </figure>
```

## CSS Framework Integration

Text blocks have specific mappings for different CSS frameworks:

### Tailwind CSS

```javascript
// Paragraph block with Tailwind CSS
const html = convertBlocks(paragraphBlock, { cssFramework: 'tailwind' });
// <p class="text-center text-base">This is a paragraph with custom styles.</p>
```

### Bootstrap

```javascript
// Heading block with Bootstrap
const html = convertBlocks(headingBlock, { cssFramework: 'bootstrap' });
// <h2 class="text-start text-primary">This is a heading</h2>
```

## Custom Text Block Handlers

You can create custom text block handlers for specific needs:

```javascript
import { createBlockHandler, convertBlocks } from 'wp-block-to-html';

const customParagraphHandler = createBlockHandler('core/paragraph', {
  transform(block, options) {
    const { attrs = {}, innerContent = [] } = block;
    const text = innerContent[0].replace(/<\/?p[^>]*>/g, '');
    
    // Example: Add a highlight effect to specific paragraphs
    if (text.includes('highlight')) {
      return `<p class="highlight-paragraph">${text}</p>`;
    }
    
    return `<p>${text}</p>`;
  }
});

const html = convertBlocks(blockData, {
  blockTransformers: {
    'core/paragraph': customParagraphHandler
  }
});
``` 