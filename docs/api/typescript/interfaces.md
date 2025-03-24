# TypeScript Interfaces

This page documents the TypeScript interfaces provided by WP Block to HTML, which you can use when extending the library or ensuring type safety in your applications.

## Core Interfaces

### WordPressBlock

Represents a WordPress Gutenberg block.

```typescript
interface WordPressBlock {
  /**
   * The name of the block (e.g., 'core/paragraph')
   */
  blockName: string;
  
  /**
   * Block attributes containing configuration and content data
   */
  attrs?: Record<string, any>;
  
  /**
   * Nested blocks contained within this block
   */
  innerBlocks?: WordPressBlock[];
  
  /**
   * Array of HTML strings representing the block's content
   */
  innerContent?: string[];
}
```

### ConversionOptions

Configuration options for the block conversion process.

```typescript
interface ConversionOptions {
  /**
   * Output format for the conversion
   * @default 'html'
   */
  outputFormat?: 'html' | 'react' | 'vue' | 'angular' | 'svelte';
  
  /**
   * CSS framework to use for generating class names
   * @default 'none'
   */
  cssFramework?: 'none' | 'tailwind' | 'bootstrap' | 'custom';
  
  /**
   * How block content should be processed
   * @default 'raw'
   */
  contentHandling?: 'raw' | 'rendered' | 'hybrid';
  
  /**
   * Custom CSS class mappings
   */
  customClassMap?: Record<string, any>;
  
  /**
   * Custom block transformers
   */
  blockTransformers?: Record<string, BlockTransformer>;
  
  /**
   * Server-side rendering options
   */
  ssrOptions?: SSROptions | boolean;
  
  /**
   * Incremental rendering options
   */
  incrementalOptions?: IncrementalRenderingOptions;
  
  /**
   * Enable debug output
   * @default false
   */
  debug?: boolean;
  
  /**
   * Include verbose comments in output
   * @default false
   */
  verboseOutput?: boolean;
}
```

### BlockTransformer

Interface for custom block transformation logic.

```typescript
interface BlockTransformer {
  /**
   * Transform a WordPress block into HTML or a framework-specific component
   * @param block The WordPress block to transform
   * @param options Configuration options
   * @returns The transformed output
   */
  transform(block: WordPressBlock, options: ConversionOptions): string | any;
  
  /**
   * CSS class mappings for different frameworks
   */
  cssMapping?: {
    [framework: string]: {
      [property: string]: any;
    };
  };
}
```

### SSROptions

Options for server-side rendering optimizations.

```typescript
interface SSROptions {
  /**
   * Enable SSR optimizations
   * @default false
   */
  enabled?: boolean;
  
  /**
   * Optimization level
   * @default 'balanced'
   */
  optimizationLevel?: 'minimal' | 'balanced' | 'maximum';
  
  /**
   * Add lazy loading to media elements
   * @default true
   */
  lazyLoadMedia?: boolean;
  
  /**
   * Remove client-side scripts that shouldn't execute during SSR
   * @default true
   */
  stripClientScripts?: boolean;
  
  /**
   * Inline critical CSS styles
   * @default false
   */
  inlineCriticalCSS?: boolean;
  
  /**
   * Custom function to pre-process HTML before standard optimizations
   */
  preProcessHTML?: (html: string, options: SSROptions) => string;
  
  /**
   * Custom function to post-process HTML after standard optimizations
   */
  postProcessHTML?: (html: string, options: SSROptions) => string;
}
```

### IncrementalRenderingOptions

Options for incremental rendering of large content sets.

```typescript
interface IncrementalRenderingOptions {
  /**
   * Enable incremental rendering
   * @default false
   */
  enabled?: boolean;
  
  /**
   * Number of blocks to render in the initial pass
   * @default 10
   */
  initialRenderCount?: number;
  
  /**
   * Number of blocks to render in each subsequent batch
   * @default 5
   */
  batchSize?: number;
  
  /**
   * Delay in milliseconds between batch rendering
   * @default 50
   */
  batchDelay?: number;
  
  /**
   * Use IntersectionObserver to lazy-load blocks when they come into view
   * @default false
   */
  useIntersectionObserver?: boolean;
  
  /**
   * DOM selector for the container where content should be rendered
   */
  containerSelector?: string;
  
  /**
   * Custom callback for rendering incremental content
   */
  renderCallback?: (content: string, options: IncrementalRenderingOptions) => void;
}
```

## Framework-Specific Interfaces

### ReactComponentOptions

Options for React component creation.

```typescript
interface ReactComponentOptions extends ConversionOptions {
  /**
   * Use React.memo for the component
   * @default true
   */
  memo?: boolean;
  
  /**
   * Additional props to pass to the component
   */
  additionalProps?: Record<string, any>;
  
  /**
   * Custom component wrapper
   */
  wrapper?: React.ComponentType<any>;
}
```

### VueComponentOptions

Options for Vue component creation.

```typescript
interface VueComponentOptions extends ConversionOptions {
  /**
   * Additional component options
   */
  componentOptions?: Record<string, any>;
  
  /**
   * Custom component wrapper
   */
  wrapper?: any;
}
```

## Extension Interfaces

### CSSFrameworkAdapter

Interface for creating custom CSS framework adapters.

```typescript
interface CSSFrameworkAdapter {
  /**
   * Unique name for the framework
   */
  name: string;
  
  /**
   * Transform WordPress classes to framework-specific classes
   */
  transformClasses?: (wpClasses: string, blockName: string, options: ConversionOptions) => string;
  
  /**
   * Get classes for a specific block
   */
  getClassesForBlock?: (block: WordPressBlock, blockName: string, options: ConversionOptions) => string;
  
  /**
   * Class mappings for different block types
   */
  mappings: {
    [blockName: string]: {
      [attributeOrProperty: string]: any;
    };
  };
}
```

### PluginOptions

Interface for plugin configuration.

```typescript
interface PluginOptions {
  /**
   * Plugin name
   */
  name: string;
  
  /**
   * Plugin version
   */
  version?: string;
  
  /**
   * Plugin initialization hook
   */
  init?: (api: PluginAPI) => void;
  
  /**
   * Plugin configuration options
   */
  options?: Record<string, any>;
}
```

### PluginAPI

API provided to plugins for interacting with the library.

```typescript
interface PluginAPI {
  /**
   * Register a block handler
   */
  registerBlockHandler: (blockName: string, handler: BlockTransformer) => void;
  
  /**
   * Register a CSS framework adapter
   */
  registerCSSFramework: (framework: CSSFrameworkAdapter) => void;
  
  /**
   * Get a block handler
   */
  getBlockHandler: (blockName: string) => BlockTransformer | undefined;
  
  /**
   * Get a CSS framework adapter
   */
  getCSSFramework: (frameworkName: string) => CSSFrameworkAdapter | undefined;
}
```

## Usage Examples

### Using WordPressBlock interface

```typescript
import { WordPressBlock, convertBlocks } from 'wp-block-to-html';

// Type-safe block definition
const blocks: WordPressBlock[] = [
  {
    blockName: 'core/paragraph',
    attrs: { align: 'center' },
    innerContent: ['<p>Hello TypeScript!</p>']
  }
];

const html = convertBlocks(blocks);
```

### Creating a custom block transformer

```typescript
import { BlockTransformer, WordPressBlock, ConversionOptions } from 'wp-block-to-html';

const customButtonTransformer: BlockTransformer = {
  transform(block: WordPressBlock, options: ConversionOptions): string {
    const { attrs } = block;
    const text = attrs?.text || 'Button';
    const url = attrs?.url || '#';
    
    // Type-safe access to options
    const classes = options.cssFramework === 'tailwind'
      ? 'px-4 py-2 bg-blue-500 text-white rounded'
      : 'button';
    
    return `<a href="${url}" class="${classes}">${text}</a>`;
  }
};
```

### Working with ConversionOptions

```typescript
import { ConversionOptions, convertBlocks } from 'wp-block-to-html';

// Type-safe options
const options: ConversionOptions = {
  cssFramework: 'tailwind',
  contentHandling: 'hybrid',
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'balanced'
  }
};

const html = convertBlocks(blocks, options);
```

## Next Steps

- Check out [TypeScript Types](/api/typescript/types) for type aliases and utility types
- Learn about [Core Functions](/api/core-functions) to understand the available API methods
- Explore how to [extend the library](/api/plugin-development) with custom functionality 