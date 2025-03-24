# TypeScript Interfaces

This page documents the TypeScript interfaces available in WP Block to HTML.

## Overview

WP Block to HTML is written in TypeScript and provides type definitions for all its public APIs. These type definitions help ensure type safety and provide better IDE support with autocompletion and documentation.

## Installation

The TypeScript definitions are included with the package and will be automatically available when you install the library:

```bash
npm install wp-block-to-html
```

## Core Interfaces

### Block Interfaces

```typescript
/**
 * Interface representing a WordPress block.
 */
export interface WordPressBlock {
  /**
   * The name of the block, e.g., 'core/paragraph'.
   */
  blockName: string;

  /**
   * The attributes of the block.
   */
  attrs?: Record<string, any>;

  /**
   * The inner HTML content of the block.
   */
  innerContent?: string[];

  /**
   * The inner blocks of this block.
   */
  innerBlocks?: WordPressBlock[];
}

/**
 * Interface for a block handler used to transform a block into HTML.
 */
export interface BlockTransformer {
  /**
   * Transform a WordPress block into HTML.
   * 
   * @param block - The WordPress block to transform.
   * @param options - Configuration options for the transformation.
   * @returns The transformed HTML.
   */
  transform(block: WordPressBlock, options: ConversionOptions): string;
}
```

### Configuration Interfaces

```typescript
/**
 * Options for converting WordPress blocks to HTML.
 */
export interface ConversionOptions {
  /**
   * The CSS framework to use for styling.
   * Supported values: 'default', 'tailwind', 'bootstrap'
   */
  cssFramework?: 'default' | 'tailwind' | 'bootstrap' | string;

  /**
   * Custom class mappings to override the default ones.
   */
  customClassMap?: ClassMap;

  /**
   * How to handle content rendering.
   * - 'raw': Process raw block data (default)
   * - 'rendered': Use pre-rendered HTML
   * - 'hybrid': Combine pre-rendered HTML with framework classes
   */
  contentHandlingMode?: 'raw' | 'rendered' | 'hybrid';

  /**
   * Server-side rendering optimization options.
   */
  ssrOptions?: SSROptions;

  /**
   * Custom block transformers to override the default ones.
   */
  blockTransformers?: Record<string, BlockTransformer>;

  /**
   * Configuration for responsive design.
   */
  responsiveBreakpoints?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };

  /**
   * Configuration for container width classes.
   */
  containerWidths?: {
    wide?: string;
    full?: string;
    default?: string;
  };
}

/**
 * Options for server-side rendering optimizations.
 */
export interface SSROptions {
  /**
   * Whether SSR optimizations are enabled.
   */
  enabled?: boolean;

  /**
   * The level of optimization to apply.
   * - 'minimal': Basic optimizations
   * - 'balanced': Good balance between performance and content (default)
   * - 'maximum': Aggressive optimizations for best performance
   */
  level?: 'minimal' | 'balanced' | 'maximum';

  /**
   * Whether to optimize images (add loading="lazy", srcset, etc.).
   */
  optimizeImages?: boolean;

  /**
   * Whether to add placeholders for late-loading content.
   */
  addPlaceholders?: boolean;

  /**
   * Function to run before applying SSR optimizations.
   */
  preOptimize?: (html: string) => string;

  /**
   * Function to run after applying SSR optimizations.
   */
  postOptimize?: (html: string) => string;
}
```

### CSS Framework Interfaces

```typescript
/**
 * Interface for CSS class mapping.
 */
export interface ClassMap {
  /**
   * Maps alignment values to CSS classes.
   */
  alignments?: {
    left?: string;
    center?: string;
    right?: string;
    wide?: string;
    full?: string;
  };

  /**
   * Maps font sizes to CSS classes.
   */
  fontSizes?: {
    small?: string;
    medium?: string;
    large?: string;
    xlarge?: string;
  };

  /**
   * Maps block-specific classes.
   */
  blocks?: {
    paragraph?: Record<string, string>;
    heading?: Record<string, string>;
    image?: Record<string, string>;
    list?: Record<string, string>;
    columns?: Record<string, string>;
    // ... other blocks
  };

  /**
   * Maps common element classes.
   */
  elements?: {
    container?: string;
    button?: string;
    image?: string;
    link?: string;
    // ... other elements
  };
}
```

## Framework-Specific Interfaces

### React Integration

```typescript
/**
 * Options for converting WordPress blocks to React components.
 * Extends the base ConversionOptions.
 */
export interface ReactConversionOptions extends ConversionOptions {
  /**
   * Whether to use React.createElement or JSX strings.
   */
  useCreateElement?: boolean;

  /**
   * React component mapping for specific blocks.
   */
  componentMap?: Record<string, React.ComponentType<any>>;
}

/**
 * Function to convert WordPress blocks to React components.
 * 
 * @param blocks - WordPress blocks to convert.
 * @param options - Configuration options.
 * @returns React element or JSX string.
 */
export function convertBlocksToReact(
  blocks: WordPressBlock | WordPressBlock[],
  options?: ReactConversionOptions
): React.ReactElement | string;
```

### Vue Integration

```typescript
/**
 * Options for converting WordPress blocks to Vue components.
 * Extends the base ConversionOptions.
 */
export interface VueConversionOptions extends ConversionOptions {
  /**
   * Vue component mapping for specific blocks.
   */
  componentMap?: Record<string, Component>;

  /**
   * Whether to use Vue's h() function or template strings.
   */
  useRenderFunction?: boolean;
}

/**
 * Function to convert WordPress blocks to Vue components.
 * 
 * @param blocks - WordPress blocks to convert.
 * @param options - Configuration options.
 * @returns Vue component or template string.
 */
export function convertBlocksToVue(
  blocks: WordPressBlock | WordPressBlock[],
  options?: VueConversionOptions
): Component | string;
```

## Using TypeScript with WP Block to HTML

### Basic Usage

```typescript
import { convertBlocks, WordPressBlock, ConversionOptions } from 'wp-block-to-html';

// Define your block with TypeScript
const block: WordPressBlock = {
  blockName: 'core/paragraph',
  attrs: {
    align: 'center'
  },
  innerContent: ['<p class="has-text-align-center">TypeScript example</p>']
};

// Define conversion options with TypeScript
const options: ConversionOptions = {
  cssFramework: 'tailwind',
  contentHandlingMode: 'raw',
  ssrOptions: {
    enabled: true,
    level: 'balanced'
  }
};

// Convert the block to HTML
const html = convertBlocks(block, options);
```

### Creating a Custom Block Handler

```typescript
import { 
  createBlockHandler, 
  WordPressBlock, 
  BlockTransformer, 
  ConversionOptions 
} from 'wp-block-to-html';

// Create a custom block handler with TypeScript
const customHeadingHandler: BlockTransformer = {
  transform(block: WordPressBlock, options: ConversionOptions): string {
    const { attrs = {} } = block;
    const { level = 2, content = '', align = '' } = attrs;
    
    let className = '';
    if (align === 'center') {
      className = options.cssFramework === 'tailwind' ? 'text-center' : 'has-text-align-center';
    }
    
    return `<h${level} class="${className}">${content}</h${level}>`;
  }
};

// Alternative using the createBlockHandler factory
const customHeadingHandler2 = createBlockHandler('core/heading', {
  transform(block: WordPressBlock, options: ConversionOptions): string {
    // Implementation here
    return ''; // Return transformed HTML
  }
});
```

### Type-Safe Class Maps

```typescript
import { ClassMap, convertBlocks } from 'wp-block-to-html';

// Define a custom class map with TypeScript
const customClassMap: ClassMap = {
  alignments: {
    left: 'custom-left',
    center: 'custom-center',
    right: 'custom-right'
  },
  fontSizes: {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  },
  blocks: {
    paragraph: {
      default: 'custom-paragraph',
      drop: 'custom-drop-paragraph'
    },
    heading: {
      default: 'custom-heading'
    }
  }
};

// Use the custom class map
const html = convertBlocks(blockData, { 
  cssFramework: 'tailwind',
  customClassMap 
});
```

## Type Exports

The following types are exported from the library:

```typescript
// Core interfaces
export type { WordPressBlock };
export type { BlockTransformer };
export type { ConversionOptions };
export type { SSROptions };
export type { ClassMap };

// Framework-specific interfaces
export type { ReactConversionOptions };
export type { VueConversionOptions };

// Utility types
export type { ContentHandlingMode }; // 'raw' | 'rendered' | 'hybrid'
export type { OptimizationLevel }; // 'minimal' | 'balanced' | 'maximum'
export type { CSSFramework }; // 'default' | 'tailwind' | 'bootstrap' | string
``` 