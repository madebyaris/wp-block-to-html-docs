# Layout Blocks

This page documents the layout block handlers available in WP Block to HTML.

## Overview

Layout blocks are used to create structural elements and organize content in WordPress. They include columns, groups, spacers, and more. WP Block to HTML provides optimized handlers for all WordPress core layout blocks.

## Importing Layout Block Handlers

You can import individual layout block handlers for optimized bundle size:

```javascript
import { columnsBlockHandler } from 'wp-block-to-html/blocks/layout';
import { groupBlockHandler } from 'wp-block-to-html/blocks/layout';
import { spacerBlockHandler } from 'wp-block-to-html/blocks/layout';
```

Or import all layout block handlers at once:

```javascript
import * as layoutBlockHandlers from 'wp-block-to-html/blocks/layout';
```

## Available Layout Block Handlers

### Columns Block

Handles the core/columns block type and its inner column blocks.

```javascript
// Example input
const columnsBlock = {
  blockName: 'core/columns',
  attrs: {
    verticalAlignment: 'center',
    backgroundColor: 'light-gray',
    isStackedOnMobile: true
  },
  innerContent: ['<div class="wp-block-columns are-vertically-aligned-center has-light-gray-background-color">', '', '', '</div>'],
  innerBlocks: [
    {
      blockName: 'core/column',
      attrs: {
        width: 33.33
      },
      innerContent: ['<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:33.33%">', '</div>'],
      innerBlocks: [
        {
          blockName: 'core/paragraph',
          attrs: {},
          innerContent: ['<p>Column 1 content</p>']
        }
      ]
    },
    {
      blockName: 'core/column',
      attrs: {
        width: 66.67
      },
      innerContent: ['<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:66.67%">', '</div>'],
      innerBlocks: [
        {
          blockName: 'core/paragraph',
          attrs: {},
          innerContent: ['<p>Column 2 content</p>']
        }
      ]
    }
  ]
};

// Example output with default CSS
// <div class="wp-block-columns are-vertically-aligned-center has-light-gray-background-color">
//   <div class="wp-block-column is-vertically-aligned-center" style="flex-basis:33.33%">
//     <p>Column 1 content</p>
//   </div>
//   <div class="wp-block-column is-vertically-aligned-center" style="flex-basis:66.67%">
//     <p>Column 2 content</p>
//   </div>
// </div>

// Example output with Tailwind CSS
// <div class="flex flex-col md:flex-row items-center bg-gray-100">
//   <div class="w-full md:w-1/3 flex items-center p-4">
//     <p>Column 1 content</p>
//   </div>
//   <div class="w-full md:w-2/3 flex items-center p-4">
//     <p>Column 2 content</p>
//   </div>
// </div>
```

### Group Block

Handles the core/group block type.

```javascript
// Example input
const groupBlock = {
  blockName: 'core/group',
  attrs: {
    backgroundColor: 'primary',
    textColor: 'white',
    align: 'wide'
  },
  innerContent: ['<div class="wp-block-group alignwide has-white-color has-primary-background-color has-text-color has-background">', '</div>'],
  innerBlocks: [
    {
      blockName: 'core/heading',
      attrs: {
        level: 2
      },
      innerContent: ['<h2>Group Title</h2>']
    },
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: ['<p>Group content goes here.</p>']
    }
  ]
};

// Example output with default CSS
// <div class="wp-block-group alignwide has-white-color has-primary-background-color has-text-color has-background">
//   <h2>Group Title</h2>
//   <p>Group content goes here.</p>
// </div>

// Example output with Tailwind CSS
// <div class="mx-auto max-w-4xl bg-primary-500 text-white p-4">
//   <h2>Group Title</h2>
//   <p>Group content goes here.</p>
// </div>
```

### Row Block

Handles the core/row block type (introduced in WordPress 5.9).

```javascript
// Example input
const rowBlock = {
  blockName: 'core/row',
  attrs: {
    isStackedOnMobile: true,
    justifyContent: 'space-between'
  },
  innerContent: ['<div class="wp-block-row is-stacked-on-mobile" style="justify-content:space-between">', '', '', '</div>'],
  innerBlocks: [
    // Row item blocks
  ]
};

// Example output with Tailwind CSS
// <div class="flex flex-col md:flex-row md:justify-between">
//   <!-- Row item content -->
// </div>
```

### Buttons Block

Handles the core/buttons block type and its inner button blocks.

```javascript
// Example input
const buttonsBlock = {
  blockName: 'core/buttons',
  attrs: {
    align: 'center',
    orientation: 'horizontal'
  },
  innerContent: ['<div class="wp-block-buttons is-content-justification-center is-layout-flex">', '', '', '</div>'],
  innerBlocks: [
    {
      blockName: 'core/button',
      attrs: {
        backgroundColor: 'primary',
        textColor: 'white',
        url: 'https://example.com/page1'
      },
      innerContent: ['<div class="wp-block-button"><a class="wp-block-button__link has-white-color has-primary-background-color has-text-color has-background">Primary Button</a></div>']
    },
    {
      blockName: 'core/button',
      attrs: {
        backgroundColor: 'secondary',
        textColor: 'white',
        url: 'https://example.com/page2'
      },
      innerContent: ['<div class="wp-block-button"><a class="wp-block-button__link has-white-color has-secondary-background-color has-text-color has-background">Secondary Button</a></div>']
    }
  ]
};

// Example output with Tailwind CSS
// <div class="flex flex-wrap justify-center gap-4">
//   <div>
//     <a href="https://example.com/page1" class="inline-block px-4 py-2 bg-primary-500 text-white rounded-md no-underline">Primary Button</a>
//   </div>
//   <div>
//     <a href="https://example.com/page2" class="inline-block px-4 py-2 bg-secondary-500 text-white rounded-md no-underline">Secondary Button</a>
//   </div>
// </div>
```

### Spacer Block

Handles the core/spacer block type.

```javascript
// Example input
const spacerBlock = {
  blockName: 'core/spacer',
  attrs: {
    height: '50px'
  },
  innerContent: ['<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>']
};

// Example output with default CSS
// <div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>

// Example output with Tailwind CSS
// <div class="h-[50px]" aria-hidden="true"></div>
```

### Separator Block

Handles the core/separator block type.

```javascript
// Example input
const separatorBlock = {
  blockName: 'core/separator',
  attrs: {
    align: 'center',
    style: {
      color: {
        text: '#cc0000'
      }
    }
  },
  innerContent: ['<hr class="wp-block-separator has-text-color has-alpha-channel-opacity has-text-align-center" style="color:#cc0000"/>']
};

// Example output with default CSS
// <hr class="wp-block-separator has-text-color has-alpha-channel-opacity has-text-align-center" style="color:#cc0000"/>

// Example output with Tailwind CSS
// <hr class="mx-auto w-1/4 border-t-2 border-[#cc0000] my-4" />
```

## CSS Framework Integration

Layout blocks have specific mappings for different CSS frameworks:

### Tailwind CSS

```javascript
// Columns block with Tailwind CSS
const html = convertBlocks(columnsBlock, { cssFramework: 'tailwind' });
// <div class="flex flex-col md:flex-row items-center bg-gray-100">
//   <!-- Column content -->
// </div>
```

### Bootstrap

```javascript
// Group block with Bootstrap
const html = convertBlocks(groupBlock, { cssFramework: 'bootstrap' });
// <div class="mx-auto container-xl bg-primary text-white p-3">
//   <!-- Group content -->
// </div>
```

## Responsive Design

Layout blocks in WP Block to HTML include responsive behavior support:

```javascript
// Example of columns with responsive behavior
const html = convertBlocks(columnsBlock, { 
  cssFramework: 'tailwind',
  responsiveBreakpoints: {
    mobile: 'sm',
    tablet: 'lg'
  }
});
// <div class="flex flex-col sm:flex-row items-center bg-gray-100">
//   <div class="w-full sm:w-1/3 flex items-center p-4">
//     <!-- Column content -->
//   </div>
//   <div class="w-full sm:w-2/3 flex items-center p-4">
//     <!-- Column content -->
//   </div>
// </div>
```

## Container Width Handling

Custom container width handling for layout blocks:

```javascript
// Example of handling container width with Tailwind CSS
const html = convertBlocks(groupBlock, { 
  cssFramework: 'tailwind',
  containerWidths: {
    wide: 'max-w-5xl mx-auto',
    full: 'w-full',
    default: 'max-w-prose mx-auto'
  }
});
```

## Custom Layout Block Handlers

You can create custom layout block handlers for specific needs:

```javascript
import { createBlockHandler, convertBlocks } from 'wp-block-to-html';

const customGroupHandler = createBlockHandler('core/group', {
  transform(block, options) {
    const { attrs = {}, innerBlocks = [] } = block;
    const { backgroundColor = '', align = '' } = attrs;
    
    // Process inner blocks
    const innerContent = innerBlocks.map(block => 
      convertBlocks(block, options)
    ).join('');
    
    // Add custom container classes based on alignment
    let containerClass = '';
    if (align === 'wide') {
      containerClass = 'custom-wide-container';
    } else if (align === 'full') {
      containerClass = 'custom-full-container';
    }
    
    return `
      <div class="custom-group ${containerClass} ${backgroundColor ? `bg-${backgroundColor}` : ''}">
        ${innerContent}
      </div>
    `;
  }
});

const html = convertBlocks(blockData, {
  blockTransformers: {
    'core/group': customGroupHandler
  }
});
``` 