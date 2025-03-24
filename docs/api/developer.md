# Developer Guide

This comprehensive guide is designed to help developers understand the internal architecture of WP Block to HTML, contribute to the library, and extend its functionality with plugins and custom block handlers.

## Getting Started as a Developer

### Prerequisites

Before you begin working with the WP Block to HTML codebase, ensure you have:

- Node.js 14+ installed
- Git installed
- Familiarity with TypeScript
- Basic understanding of WordPress blocks
- Knowledge of modern JavaScript development practices

### Setting Up the Development Environment

```bash
# Clone the repository
git clone https://github.com/madebyaris/wp-block-to-html.git

# Navigate to the project directory
cd wp-block-to-html

# Install dependencies
npm install

# Run tests to verify your setup
npm test

# Start the development environment
npm run dev
```

## Project Structure

The library follows a modular architecture with clear separation of concerns:

```
wp-block-to-html/
├── src/
│   ├── core/              # Core functionality
│   │   ├── text/          # Text-related blocks
│   │   ├── media/         # Media-related blocks
│   │   ├── layout/        # Layout-related blocks
│   │   └── ...
│   ├── frameworks/        # CSS framework adapters
│   │   ├── tailwind.ts    # Tailwind CSS mappings
│   │   ├── bootstrap.ts   # Bootstrap mappings
│   │   └── ...
│   ├── integrations/      # Framework integrations
│   │   ├── react/         # React integration
│   │   ├── vue/           # Vue integration
│   │   └── ...
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   └── index.ts           # Main entry point
├── tests/                 # Test files
├── examples/              # Example usage
├── docs/                  # Documentation
└── scripts/               # Build and utility scripts
```

## Core Architecture

The library is built around these key components:

### 1. Block Handlers

Block handlers are responsible for transforming WordPress block data into HTML or framework-specific components:

```typescript
// Example block handler for a paragraph block
import { BlockHandler } from '../../types';

export const paragraphBlockHandler: BlockHandler = {
  transform(block, options) {
    const { attrs, innerContent } = block;
    const align = attrs?.align;
    const classes = getClassesForBlock(block, 'core/paragraph', options);
    
    return `<p class="${classes}">${innerContent.join('')}</p>`;
  },
  
  // CSS framework mappings
  cssMapping: {
    tailwind: {
      block: '',
      align: {
        center: 'text-center',
        left: 'text-left',
        right: 'text-right'
      }
    },
    bootstrap: {
      block: '',
      align: {
        center: 'text-center',
        left: 'text-start',
        right: 'text-end'
      }
    }
  }
};
```

### 2. Core Conversion Engine

The core conversion engine orchestrates the transformation process:

```typescript
// Simplified view of the core conversion logic
export function convertBlocks(blocks, options) {
  // Setup options with defaults
  const resolvedOptions = {
    outputFormat: 'html',
    cssFramework: 'none',
    contentHandling: 'raw',
    ...options
  };
  
  // Process each block
  return blocks.map(block => {
    // Get the appropriate handler for this block
    const handler = getBlockHandler(block.blockName);
    
    if (!handler) {
      // Fall back to default handling
      return defaultBlockHandler(block, resolvedOptions);
    }
    
    // Transform the block using its handler
    return handler.transform(block, resolvedOptions);
  }).join('\n');
}
```

### 3. CSS Framework Integration

CSS framework integration is handled through mapping objects:

```typescript
// Example of Tailwind CSS mappings
export const tailwindMapping = {
  'core/paragraph': {
    block: '',
    align: {
      center: 'text-center',
      left: 'text-left',
      right: 'text-right'
    },
    dropCap: 'first-letter:float-left first-letter:text-7xl first-letter:pr-1'
  },
  'core/heading': {
    block: '',
    level: {
      '1': 'text-4xl font-bold',
      '2': 'text-3xl font-bold',
      '3': 'text-2xl font-bold',
      '4': 'text-xl font-bold',
      '5': 'text-lg font-bold',
      '6': 'font-bold'
    }
  }
  // ... other block mappings
};
```

### 4. Framework Integration

Framework integration allows output in various formats:

```typescript
// Example React integration
export function convertBlocksToReact(blocks, options) {
  const html = convertBlocks(blocks, {
    ...options,
    outputFormat: 'html'
  });
  
  return React.createElement('div', {
    dangerouslySetInnerHTML: { __html: html }
  });
}
```

## Creating a Custom Block Handler

To create a custom block handler:

1. **Understand the Block Structure:** Examine the WordPress block data structure for the block you want to handle
2. **Create the Handler:** Implement the BlockHandler interface
3. **Register the Handler:** Register your handler with the library

### Example: Custom Button Block Handler

```typescript
import { BlockHandler, WordPressBlock, ConversionOptions } from 'wp-block-to-html';

// Step 1: Create the handler
const customButtonBlockHandler: BlockHandler = {
  transform(block: WordPressBlock, options: ConversionOptions): string {
    const { attrs } = block;
    const text = attrs?.text || 'Button';
    const url = attrs?.url || '#';
    const style = attrs?.style || {};
    
    // Get CSS classes based on framework
    let classes = '';
    
    switch(options.cssFramework) {
      case 'tailwind':
        classes = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
        break;
      case 'bootstrap':
        classes = 'btn btn-primary';
        break;
      default:
        classes = 'button';
    }
    
    // Add custom classes if provided
    if (attrs?.className) {
      classes += ` ${attrs.className}`;
    }
    
    // Generate the HTML
    return `<a href="${url}" class="${classes}">${text}</a>`;
  },
  
  // CSS framework mappings
  cssMapping: {
    tailwind: {
      block: 'inline-block px-4 py-2 rounded',
      style: {
        default: 'bg-blue-500 text-white hover:bg-blue-600',
        outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600'
      }
    },
    bootstrap: {
      block: 'btn',
      style: {
        default: 'btn-primary',
        outline: 'btn-outline-primary',
        secondary: 'btn-secondary'
      }
    }
  }
};

// Step 2: Register the handler
import { registerBlockHandler } from 'wp-block-to-html';

registerBlockHandler('my-theme/custom-button', customButtonBlockHandler);
```

## Performance Optimization

When developing for WP Block to HTML, consider these performance best practices:

1. **Optimize Block Handlers**: Keep transformation logic simple and efficient
2. **Memoize Expensive Operations**: Cache results of complex operations
3. **Use Incremental Rendering**: For large content sets, use the incremental rendering feature
4. **Optimize Bundle Size**: Leverage the modular architecture to reduce bundle size

Example of optimized block handler:

```typescript
import { BlockHandler } from '../../types';
import { memoize } from '../../utils/memoize';

// Memoize class generation for better performance
const getClassesForBlock = memoize((blockName, attrs, options) => {
  // Class computation logic here
  return computedClasses;
});

export const optimizedParagraphHandler: BlockHandler = {
  transform(block, options) {
    const { attrs, innerContent } = block;
    
    // Use memoized function for class generation
    const classes = getClassesForBlock(block.blockName, attrs, options);
    
    return `<p class="${classes}">${innerContent.join('')}</p>`;
  },
  // CSS mappings...
};
```

## Testing Your Changes

The library uses a comprehensive testing suite to ensure quality:

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run performance benchmarks
npm run benchmark
```

### Writing Tests

When adding new features or fixing bugs, include appropriate tests:

```typescript
// Example test for a custom block handler
import { convertBlocks } from '../../src';
import { registerBlockHandler } from '../../src/core';
import { customButtonBlockHandler } from './customButtonHandler';

describe('Custom Button Block Handler', () => {
  beforeAll(() => {
    registerBlockHandler('my-theme/custom-button', customButtonBlockHandler);
  });
  
  test('renders a basic button correctly', () => {
    const blocks = [
      {
        blockName: 'my-theme/custom-button',
        attrs: {
          text: 'Click Me',
          url: 'https://example.com'
        },
        innerBlocks: [],
        innerContent: []
      }
    ];
    
    const html = convertBlocks(blocks);
    expect(html).toContain('Click Me');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('class="button"');
  });
  
  test('applies Tailwind CSS classes correctly', () => {
    const blocks = [/* ... */];
    const html = convertBlocks(blocks, { cssFramework: 'tailwind' });
    expect(html).toContain('class="inline-block px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"');
  });
});
```

## Contribution Workflow

Follow these steps to contribute to the project:

1. **Fork the Repository**: Create your own fork of the main repository
2. **Create a Branch**: Make your changes in a new branch
3. **Write Tests**: Add tests for your changes
4. **Follow Code Standards**: Ensure your code follows the project's coding standards
5. **Submit a Pull Request**: Create a pull request with a clear description of your changes

### Pull Request Guidelines

- Keep PRs focused on a single feature or bug fix
- Include tests for new functionality
- Update documentation as needed
- Follow the established code style
- Write clear commit messages
- Reference related issues in your PR description

## Next Steps

Now that you understand the developer-focused aspects of the library, you might want to:

- Explore the [Internal Architecture](/api/internal-architecture) in more detail
- Learn more about [Plugin Development](/api/plugin-development)
- Review the [Contribution Guidelines](/api/contribution-guidelines)
- Understand [Performance Optimization](/api/performance-optimization) techniques
- Check out the [Testing Guide](/api/testing-guide) for comprehensive testing strategies 