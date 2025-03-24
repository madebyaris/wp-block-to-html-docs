# Core Functions API Reference

This page provides detailed documentation for the core functions in the WP Block to HTML library. These functions form the foundation of the library and are essential for converting WordPress blocks to HTML.

## `convertBlocks()`

The main function for converting WordPress blocks to HTML.

### Syntax

```typescript
function convertBlocks(
  blocks: WordPressBlock | WordPressBlock[], 
  options?: ConversionOptions
): string
```

### Parameters

- **blocks** `(WordPressBlock | WordPressBlock[])`: A single WordPress block or an array of WordPress blocks to convert.
- **options** `(ConversionOptions)` *(optional)*: Configuration options for the conversion process.

### Return Value

- `string`: HTML string representation of the converted blocks.

### Description

The `convertBlocks` function processes WordPress block data and converts it to HTML. It handles nested block structures, applies CSS framework classes according to the specified options, and supports different content handling modes.

### Examples

#### Basic Usage

```javascript
import { convertBlocks } from 'wp-block-to-html';

const blocks = [
  {
    blockName: 'core/paragraph',
    attrs: { 
      content: 'Hello World',
      align: 'center'
    },
    innerBlocks: []
  }
];

const html = convertBlocks(blocks);
console.log(html); // <p class="has-text-align-center">Hello World</p>
```

#### With CSS Framework

```javascript
import { convertBlocks } from 'wp-block-to-html';

const blocks = [
  {
    blockName: 'core/paragraph',
    attrs: { 
      content: 'Hello World',
      align: 'center'
    },
    innerBlocks: []
  }
];

const html = convertBlocks(blocks, {
  cssFramework: 'tailwind'
});

console.log(html); // <p class="text-center">Hello World</p>
```

#### Content Handling Modes

```javascript
import { convertBlocks } from 'wp-block-to-html';

// With WordPress REST API response containing rendered content
const post = {
  content: {
    rendered: '<p class="has-text-align-center">This is pre-rendered content</p>'
  },
  blocks: [
    {
      blockName: 'core/paragraph',
      attrs: { 
        content: 'This is block content',
        align: 'center'
      },
      innerBlocks: []
    }
  ]
};

// Raw mode (default) - processes block data
const rawHtml = convertBlocks(post.blocks, {
  contentHandling: 'raw'
});

// Rendered mode - uses the pre-rendered HTML
const renderedHtml = convertBlocks(post.blocks, {
  contentHandling: 'rendered',
  renderedContent: post.content.rendered
});

// Hybrid mode - applies framework classes to rendered HTML
const hybridHtml = convertBlocks(post.blocks, {
  contentHandling: 'hybrid',
  renderedContent: post.content.rendered,
  cssFramework: 'tailwind'
});
```

#### With Custom Block Transformers

```javascript
import { convertBlocks } from 'wp-block-to-html';

const customTransformers = {
  'core/paragraph': {
    transform(block, options) {
      const { attrs = {} } = block;
      const { content = '', align = '' } = attrs;
      
      let className = '';
      if (align && options.cssFramework === 'tailwind') {
        className = `text-${align}`;
      }
      
      return `<p class="${className}">${content}</p>`;
    }
  }
};

const html = convertBlocks(blocks, {
  blockTransformers: customTransformers
});
```

## `processBlocksForSSR()`

Optimizes WordPress blocks for server-side rendering.

### Syntax

```typescript
function processBlocksForSSR(
  blocks: WordPressBlock | WordPressBlock[], 
  options?: SSROptions
): WordPressBlock[]
```

### Parameters

- **blocks** `(WordPressBlock | WordPressBlock[])`: A single WordPress block or an array of WordPress blocks to optimize.
- **options** `(SSROptions)` *(optional)*: Configuration options for the SSR optimization process.

### Return Value

- `WordPressBlock[]`: An optimized array of WordPress blocks.

### Description

The `processBlocksForSSR` function optimizes WordPress blocks for server-side rendering to improve performance metrics like Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Total Blocking Time (TBT). It applies various optimizations based on the specified optimization level.

### Examples

#### Basic Usage

```javascript
import { processBlocksForSSR, convertBlocks } from 'wp-block-to-html';

const blocks = [
  /* WordPress blocks */
];

const optimizedBlocks = processBlocksForSSR(blocks);
const html = convertBlocks(optimizedBlocks);
```

#### Optimization Levels

```javascript
import { processBlocksForSSR } from 'wp-block-to-html';

// Minimal optimization
const minimalOptimization = processBlocksForSSR(blocks, {
  optimizationLevel: 'minimal'
});

// Balanced optimization (default)
const balancedOptimization = processBlocksForSSR(blocks, {
  optimizationLevel: 'balanced'
});

// Maximum optimization
const maximumOptimization = processBlocksForSSR(blocks, {
  optimizationLevel: 'maximum'
});
```

#### Custom Optimization Settings

```javascript
import { processBlocksForSSR } from 'wp-block-to-html';

const optimizedBlocks = processBlocksForSSR(blocks, {
  optimizationLevel: 'balanced',
  lazyLoadMedia: true,
  optimizeImages: true,
  prioritizeAboveTheFold: true,
  preserveFirstImage: true,
  optimizationDepth: 3,
  preProcess: (block) => {
    // Custom pre-processing logic
    return block;
  },
  postProcess: (block) => {
    // Custom post-processing logic
    return block;
  }
});
```

## `createBlockHandler()`

Creates a custom block transformer for a specific block type.

### Syntax

```typescript
function createBlockHandler(
  blockType: string, 
  handler: BlockTransformer
): BlockTransformer
```

### Parameters

- **blockType** `(string)`: The name of the block type (e.g., 'core/paragraph').
- **handler** `(BlockTransformer)`: The transformer object with a transform method.

### Return Value

- `BlockTransformer`: A block transformer object that can be used with the `convertBlocks` function.

### Description

The `createBlockHandler` function creates a block transformer for a specific WordPress block type. Block transformers are responsible for converting a WordPress block to HTML. This function helps organize and maintain custom block transformers.

### Examples

#### Creating a Custom Block Handler

```javascript
import { createBlockHandler, convertBlocks } from 'wp-block-to-html';

const paragraphHandler = createBlockHandler('core/paragraph', {
  transform(block, options) {
    const { attrs = {} } = block;
    const { content = '', align = '' } = attrs;
    
    let className = '';
    if (align) {
      className = options.cssFramework === 'tailwind' 
        ? `text-${align}` 
        : `has-text-align-${align}`;
    }
    
    return `<p class="${className}">${content}</p>`;
  }
});

const html = convertBlocks(blocks, {
  blockTransformers: {
    'core/paragraph': paragraphHandler
  }
});
```

#### Handling Custom WordPress Blocks

```javascript
import { createBlockHandler, convertBlocks } from 'wp-block-to-html';

// Handler for a custom testimonial block
const testimonialHandler = createBlockHandler('acme/testimonial', {
  transform(block, options) {
    const { attrs = {} } = block;
    const { author = '', quote = '' } = attrs;
    
    return `
      <div class="testimonial">
        <blockquote>${quote}</blockquote>
        <cite>${author}</cite>
      </div>
    `;
  }
});

const html = convertBlocks(blocks, {
  blockTransformers: {
    'acme/testimonial': testimonialHandler
  }
});
```

## `getClassMap()`

Retrieves the class mapping for a specific CSS framework.

### Syntax

```typescript
function getClassMap(framework: string): ClassMap
```

### Parameters

- **framework** `(string)`: The name of the CSS framework ('default', 'tailwind', 'bootstrap', etc.).

### Return Value

- `ClassMap`: An object containing class mappings for the specified framework.

### Description

The `getClassMap` function returns the class mapping for a specific CSS framework. Class mappings define how WordPress block attributes are translated to CSS classes for that framework.

### Examples

#### Getting a Framework Class Map

```javascript
import { getClassMap } from 'wp-block-to-html';

// Get Tailwind CSS class mappings
const tailwindClasses = getClassMap('tailwind');
console.log(tailwindClasses.paragraph.alignCenter); // 'text-center'

// Get Bootstrap class mappings
const bootstrapClasses = getClassMap('bootstrap');
console.log(bootstrapClasses.paragraph.alignCenter); // 'text-center'
```

#### Using as a Base for Custom Class Map

```javascript
import { getClassMap, convertBlocks } from 'wp-block-to-html';

// Get default class mappings as a base
const defaultClasses = getClassMap('default');

// Create custom class map extending the default
const customClasses = {
  ...defaultClasses,
  paragraph: {
    ...defaultClasses.paragraph,
    base: 'custom-paragraph',
    alignCenter: 'custom-center'
  }
};

const html = convertBlocks(blocks, {
  classMap: customClasses
});
```

## `createCustomClassMap()`

Creates a custom class map by extending a base class map.

### Syntax

```typescript
function createCustomClassMap(
  baseMap: ClassMap, 
  customMap: Partial<ClassMap>
): ClassMap
```

### Parameters

- **baseMap** `(ClassMap)`: The base class map to extend.
- **customMap** `(Partial<ClassMap>)`: The custom class mappings to apply.

### Return Value

- `ClassMap`: A new class map combining the base and custom mappings.

### Description

The `createCustomClassMap` function creates a custom class map by extending a base class map with custom mappings. This allows for targeted customization while inheriting most mappings from an existing framework.

### Examples

#### Creating a Custom Class Map

```javascript
import { getClassMap, createCustomClassMap, convertBlocks } from 'wp-block-to-html';

// Get Tailwind CSS class mappings as a base
const tailwindClasses = getClassMap('tailwind');

// Create custom class map extending Tailwind
const customClasses = createCustomClassMap(tailwindClasses, {
  paragraph: {
    base: 'text-gray-800 mb-4',
    alignCenter: 'text-center mx-auto max-w-2xl'
  },
  heading: {
    base: 'font-display',
    level1: 'text-4xl font-bold mb-6'
  }
});

const html = convertBlocks(blocks, {
  classMap: customClasses
});
```

#### Combining Multiple Frameworks

```javascript
import { getClassMap, createCustomClassMap, convertBlocks } from 'wp-block-to-html';

// Get Tailwind CSS class mappings for layout
const tailwindClasses = getClassMap('tailwind');

// Get Bootstrap class mappings for components
const bootstrapClasses = getClassMap('bootstrap');

// Create hybrid class map
const hybridClasses = createCustomClassMap(tailwindClasses, {
  button: bootstrapClasses.button,
  table: bootstrapClasses.table
});

const html = convertBlocks(blocks, {
  classMap: hybridClasses
});
```

## Type Definitions

### `WordPressBlock`

Represents a WordPress block.

```typescript
interface WordPressBlock {
  blockName: string | null;
  attrs?: Record<string, any>;
  innerBlocks?: WordPressBlock[];
  innerContent?: Array<string | null>;
  [key: string]: any;
}
```

### `ConversionOptions`

Options for the `convertBlocks` function.

```typescript
interface ConversionOptions {
  cssFramework?: 'default' | 'tailwind' | 'bootstrap' | 'custom';
  classMap?: ClassMap;
  contentHandling?: 'raw' | 'rendered' | 'hybrid';
  renderedContent?: string;
  blockTransformers?: Record<string, BlockTransformer>;
  fallbackHandler?: (block: WordPressBlock, options: ConversionOptions) => string;
  ssrOptions?: SSROptions;
  [key: string]: any;
}
```

### `SSROptions`

Options for the `processBlocksForSSR` function.

```typescript
interface SSROptions {
  optimizationLevel?: 'minimal' | 'balanced' | 'maximum';
  lazyLoadMedia?: boolean;
  optimizeImages?: boolean;
  prioritizeAboveTheFold?: boolean;
  preserveFirstImage?: boolean;
  optimizationDepth?: number;
  preProcess?: (block: WordPressBlock) => WordPressBlock;
  postProcess?: (block: WordPressBlock) => WordPressBlock;
  [key: string]: any;
}
```

### `BlockTransformer`

Interface for block transformers.

```typescript
interface BlockTransformer {
  transform(block: WordPressBlock, options: ConversionOptions): string;
  [key: string]: any;
}
```

### `ClassMap`

Structure for CSS framework class mappings.

```typescript
interface ClassMap {
  paragraph: {
    base: string;
    alignLeft: string;
    alignCenter: string;
    alignRight: string;
    // Other paragraph-specific classes
  };
  heading: {
    base: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
    level6: string;
    // Other heading-specific classes
  };
  // Other block type classes
  [key: string]: Record<string, string>;
}
``` 