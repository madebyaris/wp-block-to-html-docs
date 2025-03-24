# Internal Architecture

This document provides insights into the internal architecture of the WP Block to HTML library. Understanding the internal architecture can help you extend the library, contribute to its development, or build plugins.

## Overview

WP Block to HTML is designed with a modular, extensible architecture that separates concerns and allows for flexibility. The library consists of several key components:

1. **Core Conversion Engine**: Handles the main conversion logic
2. **Block Transformers**: Convert specific block types to HTML
3. **CSS Framework Adapters**: Map WordPress block attributes to CSS classes
4. **Framework Adapters**: Convert blocks to framework-specific components (React, Vue, etc.)
5. **Server-Side Rendering (SSR) Optimizations**: Enhance performance for server rendering

```
┌─────────────────────────────────────────────────────────┐
│                    WP Block to HTML                     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │    Core     │  │    Block    │  │ CSS Framework  │  │
│  │ Conversion  │──│ Transformer │──│    Adapter     │  │
│  │   Engine    │  │   Registry  │  │                │  │
│  └─────────────┘  └─────────────┘  └────────────────┘  │
│          │                                  │           │
│          │              ┌──────────────────┐│           │
│          └──────────────│   SSR Optimizer  │            │
│                         └──────────────────┘            │
│                                │                        │
│  ┌────────────────────────────┼────────────────────┐   │
│  │                            │                    │   │
│  │  ┌────────────┐  ┌─────────┴─────┐  ┌────────┐ │   │
│  │  │   React    │  │     Vue       │  │ HTML   │ │   │
│  │  │  Adapter   │  │   Adapter     │  │ Output │ │   │
│  │  └────────────┘  └───────────────┘  └────────┘ │   │
│  │                                                 │   │
│  │              Framework Adapters                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Core Conversion Engine

The core conversion engine is responsible for orchestrating the overall conversion process. It:

1. Processes the input WordPress blocks
2. Determines which block transformer to use for each block
3. Applies the appropriate CSS framework classes
4. Handles nested blocks recursively
5. Manages content handling modes (raw, rendered, hybrid)

### Key Components

- **Main Converter**: Centralizes the conversion logic
- **Block Traversal**: Recursively processes nested blocks
- **Options Manager**: Normalizes and validates configuration options
- **Metadata Extractor**: Extracts SEO and structural metadata from blocks

## Block Transformers

Block transformers are specialized modules that convert specific WordPress block types to HTML. The library includes default transformers for all core WordPress blocks, organized by category:

- **Text Blocks**: Paragraph, Heading, List, Quote, etc.
- **Media Blocks**: Image, Gallery, Audio, Video, etc.
- **Layout Blocks**: Group, Columns, Row, etc.
- **Widget Blocks**: Button, Table, Custom HTML, etc.
- **Dynamic Blocks**: Latest Posts, Page Break, etc.

### Block Transformer Interface

Each block transformer implements a standard interface:

```typescript
interface BlockTransformer {
  transform(block: WordPressBlock, options: ConversionOptions): string;
}
```

### Block Transformer Registry

The block transformer registry maintains a mapping of block types to their corresponding transformers. When a block is encountered, the registry is queried to find the appropriate transformer.

## CSS Framework Adapters

CSS framework adapters translate WordPress block attributes to classes for specific CSS frameworks. The library includes adapters for:

- **Default WordPress Classes**
- **Tailwind CSS**
- **Bootstrap**
- **Custom Frameworks**

### Class Mapping Structure

Each CSS framework adapter provides a structured mapping of block attributes to CSS classes:

```typescript
interface ClassMap {
  paragraph: {
    base: string;
    alignLeft: string;
    alignCenter: string;
    alignRight: string;
    // ...
  };
  heading: {
    base: string;
    level1: string;
    level2: string;
    // ...
  };
  // Other block types...
}
```

### Class Application Process

1. The block transformer extracts attributes from the block
2. The CSS framework adapter is queried for appropriate classes
3. Classes are applied to the generated HTML elements

## Framework Adapters

Framework adapters convert WordPress blocks to components for specific JavaScript frameworks. The library includes adapters for:

- **React**
- **Vue**
- **Svelte**
- **Angular**

### Component Mapping

Similar to block transformers, framework adapters maintain a registry of component mappings. This allows for:

- Default components for each block type
- Custom component overrides
- Framework-specific attribute handling

### HTML-to-Component Conversion

For frameworks that require it, the library includes utilities to convert HTML strings to framework-specific component structures.

## Server-Side Rendering (SSR) Optimizations

The SSR optimization module enhances performance for server-rendered applications by:

1. Prioritizing above-the-fold content
2. Adding lazy loading for media elements
3. Setting explicit width and height attributes on images to prevent layout shifts
4. Optimizing rendering order for improved Core Web Vitals

### Optimization Process

1. Block data is passed to the SSR optimizer
2. Blocks are analyzed and optimized based on their type and position
3. Optimized block data is returned for conversion
4. Additional HTML attributes are added during the conversion process

## Extensibility Points

WP Block to HTML offers several extension points:

### Custom Block Transformers

```javascript
import { createBlockHandler, convertBlocks } from 'wp-block-to-html';

const customTransformer = createBlockHandler('my-plugin/custom-block', {
  transform(block, options) {
    // Custom transformation logic
    return '<div>Custom HTML output</div>';
  }
});

const html = convertBlocks(blocks, {
  blockTransformers: {
    'my-plugin/custom-block': customTransformer
  }
});
```

### Custom CSS Framework Mappings

```javascript
import { getClassMap, convertBlocks } from 'wp-block-to-html';

// Get default class mappings as a base
const defaultClasses = getClassMap('default');

// Create custom class map
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

### Custom Framework Components

```javascript
import { convertBlocksToReact } from 'wp-block-to-html/react';

// Custom React component
function CustomHeading({ level, content, className }) {
  const HeadingTag = `h${level}`;
  return <HeadingTag className={className}>{content}</HeadingTag>;
}

// Use the custom component
const components = convertBlocksToReact(blocks, {
  components: {
    'core/heading': CustomHeading
  }
});
```

### SSR Optimization Hooks

```javascript
import { processBlocksForSSR, convertBlocks } from 'wp-block-to-html';

const optimizedBlocks = processBlocksForSSR(blocks, {
  preProcess: (block) => {
    // Custom pre-processing logic
    if (block.blockName === 'core/image') {
      block.attrs = block.attrs || {};
      block.attrs.fetchPriority = 'high';
    }
    return block;
  },
  postProcess: (block) => {
    // Custom post-processing logic
    return block;
  }
});

const html = convertBlocks(optimizedBlocks);
```

## Module Structure

The library is organized into a modular structure that allows for tree-shaking and selective imports:

```
wp-block-to-html/
├── core/            # Core functionality
│   ├── converter.js # Main conversion engine
│   ├── traversal.js # Block traversal utilities
│   └── options.js   # Options handling
├── blocks/          # Block handlers by category
│   ├── text/        # Text block handlers
│   ├── media/       # Media block handlers
│   ├── layout/      # Layout block handlers
│   └── widget/      # Widget block handlers
├── frameworks/      # CSS framework integrations
│   ├── tailwind/    # Tailwind CSS class mappings
│   └── bootstrap/   # Bootstrap class mappings
├── react/           # React-specific functionality
├── vue/             # Vue-specific functionality
└── ssr/             # Server-side rendering optimizations
```

## Processing Flow

The conversion process follows these steps:

1. **Input Validation**: Validate and normalize the input blocks
2. **Options Processing**: Process and normalize configuration options
3. **SSR Optimization**: Apply SSR optimizations if enabled
4. **Content Handling Selection**: Determine the content handling mode
5. **Block Processing**:
   - For raw mode: Process each block with its transformer
   - For rendered mode: Return the pre-rendered content
   - For hybrid mode: Apply CSS framework classes to pre-rendered content
6. **Recursive Traversal**: Process nested blocks recursively
7. **CSS Class Application**: Apply framework-specific CSS classes
8. **Framework Adaptation**: Convert to framework components if requested
9. **Output Generation**: Generate the final HTML or component output

## Performance Considerations

The library is designed with performance in mind:

1. **Tree-Shaking**: Modular structure allows bundlers to eliminate unused code
2. **Lazy Loading**: Framework-specific code is only loaded when needed
3. **Memoization**: Frequently used operations are memoized to avoid redundant processing
4. **CSS Framework Optimization**: CSS class mappings are optimized for minimal output
5. **SSR Performance**: Dedicated optimizations for server-side rendering

## Testing Architecture

The library includes a comprehensive testing suite:

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test the interaction between different modules
3. **Performance Benchmarks**: Measure and track performance metrics
4. **Compatibility Tests**: Ensure compatibility with different WordPress block versions
5. **Framework-Specific Tests**: Test integration with various JavaScript frameworks

## Future Architecture Directions

The WP Block to HTML architecture is designed to evolve with future requirements:

1. **Plugin System**: Enhanced plugin architecture for third-party extensions
2. **Stream Processing**: Support for streaming large content sets
3. **Web Workers**: Offloading processing to background threads
4. **Advanced Caching**: Intelligent caching of processed blocks
5. **Block Editor Integration**: Direct integration with the WordPress block editor 