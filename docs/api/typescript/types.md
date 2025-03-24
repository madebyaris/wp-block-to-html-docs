# TypeScript Types

This page documents the TypeScript types and type aliases provided by WP Block to HTML for enhancing type safety in your applications.

## Core Types

### OutputFormat

Type defining the possible output formats.

```typescript
/**
 * Possible output formats for the conversion process
 */
type OutputFormat = 'html' | 'react' | 'vue' | 'angular' | 'svelte';
```

### CSSFramework

Type defining the supported CSS frameworks.

```typescript
/**
 * Supported CSS frameworks
 */
type CSSFramework = 'none' | 'tailwind' | 'bootstrap' | 'custom';
```

### ContentHandlingMode

Type defining the content handling modes.

```typescript
/**
 * How block content should be processed
 */
type ContentHandlingMode = 'raw' | 'rendered' | 'hybrid';
```

### OptimizationLevel

Type defining the server-side rendering optimization levels.

```typescript
/**
 * SSR optimization levels
 */
type OptimizationLevel = 'minimal' | 'balanced' | 'maximum';
```

### ClassMap

Type defining the CSS class mapping structure.

```typescript
/**
 * CSS class mapping for blocks and attributes
 */
type ClassMap = {
  [blockName: string]: {
    block?: string;
    [attributeName: string]: string | {
      [attributeValue: string]: string;
    } | undefined;
  };
};
```

### BlockTransformerFunction

Type for a block transformation function.

```typescript
/**
 * Function for transforming a WordPress block
 */
type BlockTransformerFunction = (
  block: WordPressBlock, 
  options: ConversionOptions
) => string | any;
```

### HTMLProcessFunction

Type for HTML processing functions.

```typescript
/**
 * Function for processing HTML content
 */
type HTMLProcessFunction = (
  html: string, 
  options: Record<string, any>
) => string;
```

## Utility Types

### DeepPartial

Utility type for making all properties in an object structure optional at any depth.

```typescript
/**
 * Makes all properties in T optional, including nested properties
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### BlockHandlerMap

Type for mapping block names to their handlers.

```typescript
/**
 * Maps block names to their handlers
 */
type BlockHandlerMap = Record<string, BlockTransformer>;
```

### CSSFrameworkMap

Type for mapping CSS framework names to their adapters.

```typescript
/**
 * Maps CSS framework names to their adapters
 */
type CSSFrameworkMap = Record<string, CSSFrameworkAdapter>;
```

### PluginMap

Type for mapping plugin names to their configurations.

```typescript
/**
 * Maps plugin names to their configurations
 */
type PluginMap = Record<string, PluginOptions>;
```

## Advanced Types

### ReactComponentType

Type for a React functional component that renders WordPress blocks.

```typescript
/**
 * React component type for rendering WordPress blocks
 */
type ReactComponentType = React.ComponentType<{
  additionalProps?: Record<string, any>;
  className?: string;
  [key: string]: any;
}>;
```

### VueComponentType

Type for a Vue component that renders WordPress blocks.

```typescript
/**
 * Vue component type for rendering WordPress blocks
 */
type VueComponentType = {
  name?: string;
  props?: Record<string, any>;
  setup?: (props: any, context: any) => any;
  render?: () => any;
  [key: string]: any;
};
```

### BlockAttributeValue

Union type representing all possible attribute values in a WordPress block.

```typescript
/**
 * Possible attribute values in a WordPress block
 */
type BlockAttributeValue = 
  | string
  | number
  | boolean
  | null
  | BlockAttributeValue[]
  | { [key: string]: BlockAttributeValue };
```

### BlockAttributes

Type for block attributes.

```typescript
/**
 * WordPress block attributes
 */
type BlockAttributes = Record<string, BlockAttributeValue>;
```

## Type Guards

The library provides several type guard functions to check types at runtime:

### isWordPressBlock

Type guard to check if an object is a WordPress block.

```typescript
/**
 * Type guard to check if an object is a WordPress block
 */
function isWordPressBlock(obj: any): obj is WordPressBlock {
  return (
    obj && 
    typeof obj === 'object' && 
    typeof obj.blockName === 'string'
  );
}
```

### isBlockArray

Type guard to check if an object is an array of WordPress blocks.

```typescript
/**
 * Type guard to check if an object is an array of WordPress blocks
 */
function isBlockArray(obj: any): obj is WordPressBlock[] {
  return (
    Array.isArray(obj) && 
    (obj.length === 0 || isWordPressBlock(obj[0]))
  );
}
```

### isRenderedContent

Type guard to check if an object represents rendered content.

```typescript
/**
 * Type guard to check if an object represents rendered content
 */
function isRenderedContent(obj: any): obj is { rendered: string } {
  return (
    obj && 
    typeof obj === 'object' && 
    typeof obj.rendered === 'string'
  );
}
```

## Usage Examples

### Using Type Aliases

```typescript
import { 
  OutputFormat, 
  CSSFramework, 
  ContentHandlingMode, 
  convertBlocks 
} from 'wp-block-to-html';

// Type-safe output format
const outputFormat: OutputFormat = 'html';

// Type-safe CSS framework
const cssFramework: CSSFramework = 'tailwind';

// Type-safe content handling mode
const contentHandling: ContentHandlingMode = 'hybrid';

const html = convertBlocks(blocks, {
  outputFormat,
  cssFramework,
  contentHandling
});
```

### Using ClassMap Type

```typescript
import { ClassMap, convertBlocks } from 'wp-block-to-html';

// Type-safe class mapping
const customClassMap: ClassMap = {
  'core/paragraph': {
    block: 'my-paragraph',
    align: {
      center: 'my-center',
      left: 'my-left',
      right: 'my-right'
    },
    dropCap: 'my-drop-cap'
  },
  'core/heading': {
    block: 'my-heading',
    level: {
      '1': 'my-h1',
      '2': 'my-h2',
      '3': 'my-h3'
    }
  }
};

const html = convertBlocks(blocks, {
  cssFramework: 'custom',
  customClassMap
});
```

### Using Type Guards

```typescript
import { 
  isWordPressBlock, 
  isBlockArray, 
  isRenderedContent,
  convertBlocks 
} from 'wp-block-to-html';

// In a function that might receive different types of data
function processContent(content: any) {
  if (isBlockArray(content)) {
    // It's an array of WordPress blocks
    return convertBlocks(content);
  } else if (isWordPressBlock(content)) {
    // It's a single WordPress block
    return convertBlocks([content]);
  } else if (isRenderedContent(content)) {
    // It's rendered content
    return convertBlocks(content, { contentHandling: 'rendered' });
  } else {
    throw new Error('Unsupported content format');
  }
}
```

### Using DeepPartial for Options

```typescript
import { DeepPartial, ConversionOptions, convertBlocks } from 'wp-block-to-html';

// Function that accepts partial options
function convertWithDefaults(
  blocks: WordPressBlock[], 
  partialOptions?: DeepPartial<ConversionOptions>
) {
  // Default options
  const defaultOptions: ConversionOptions = {
    outputFormat: 'html',
    cssFramework: 'tailwind',
    contentHandling: 'raw'
  };
  
  // Merge partial options with defaults
  const options = {
    ...defaultOptions,
    ...partialOptions,
    ssrOptions: {
      ...defaultOptions.ssrOptions,
      ...partialOptions?.ssrOptions
    }
  };
  
  return convertBlocks(blocks, options);
}
```

## Integration with TypeScript Project Configuration

When using WP Block to HTML in a TypeScript project, ensure you have the correct configuration in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react", // If using React
    "lib": ["dom", "dom.iterable", "esnext"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## Next Steps

- Check out [TypeScript Interfaces](/api/typescript/interfaces) for object interfaces
- Learn about [Custom Block Handlers](/api/plugin-development#creating-custom-block-handlers) to extend the library
- Explore [Framework Integrations](/frameworks/) for framework-specific usage 