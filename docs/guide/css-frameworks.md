# CSS Framework Integration

WP Block to HTML offers seamless integration with popular CSS frameworks, allowing you to output HTML that's pre-styled to work with your chosen framework. This guide explains how to use these integrations and customize them for your specific needs.

## Supported CSS Frameworks

The library currently provides built-in support for:

- **Default WordPress Classes**: Standard classes as they appear in WordPress
- **Tailwind CSS**: Utility-first CSS framework
- **Bootstrap**: Popular UI framework
- **Custom Frameworks**: Define your own class mappings

## Using CSS Frameworks

To specify which CSS framework to use, pass the `cssFramework` option when converting blocks:

```javascript
import { convertBlocks } from 'wp-block-to-html';

const blocks = [/* WordPress blocks */];

// With WordPress default classes
const defaultHtml = convertBlocks(blocks);

// With Tailwind CSS
const tailwindHtml = convertBlocks(blocks, { 
  cssFramework: 'tailwind' 
});

// With Bootstrap
const bootstrapHtml = convertBlocks(blocks, { 
  cssFramework: 'bootstrap' 
});
```

## Example Output

Here's how different frameworks transform the same blocks:

### Paragraph Block

```javascript
// Input block
const paragraphBlock = {
  blockName: 'core/paragraph',
  attrs: { 
    align: 'center',
    dropCap: true,
    fontSize: 'large'
  },
  innerContent: ['<p>Sample paragraph text</p>']
};

// Default WordPress output
// <p class="wp-block-paragraph has-text-align-center has-drop-cap has-large-font-size">Sample paragraph text</p>

// Tailwind CSS output
// <p class="text-center text-lg first-letter:float-left first-letter:text-7xl first-letter:pr-1">Sample paragraph text</p>

// Bootstrap output
// <p class="text-center fs-4 dropcap">Sample paragraph text</p>
```

### Button Block

```javascript
// Input block
const buttonBlock = {
  blockName: 'core/button',
  attrs: { 
    style: { 
      color: {
        background: '#0073aa',
        text: '#ffffff'
      }
    }
  },
  innerContent: ['<div class="wp-block-button"><a class="wp-block-button__link">Click me</a></div>']
};

// Default WordPress output
// <div class="wp-block-button">
//   <a class="wp-block-button__link has-text-color has-background" style="color:#ffffff;background-color:#0073aa">Click me</a>
// </div>

// Tailwind CSS output
// <div class="inline-block">
//   <a class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Click me</a>
// </div>

// Bootstrap output
// <div class="d-inline-block">
//   <a class="btn btn-primary">Click me</a>
// </div>
```

## Creating Custom CSS Mappings

You can create your own CSS framework mappings or extend the existing ones:

### Custom Framework

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Define custom class mappings
const customClassMap = {
  'core/paragraph': {
    block: 'my-paragraph',
    align: {
      center: 'my-text-center',
      left: 'my-text-left',
      right: 'my-text-right'
    },
    dropCap: 'my-drop-cap',
    fontSize: {
      small: 'my-small-text',
      medium: 'my-medium-text',
      large: 'my-large-text'
    }
  },
  'core/heading': {
    block: 'my-heading',
    level: {
      '1': 'my-h1',
      '2': 'my-h2',
      '3': 'my-h3',
      '4': 'my-h4',
      '5': 'my-h5',
      '6': 'my-h6'
    }
  }
  // Add mappings for other block types
};

// Use custom mapping
const html = convertBlocks(blocks, {
  cssFramework: 'custom',
  customClassMap: customClassMap
});
```

### Extending Existing Frameworks

You can extend the built-in frameworks with your own customizations:

```javascript
import { convertBlocks } from 'wp-block-to-html';
import { tailwindMapping } from 'wp-block-to-html/frameworks/tailwind';

// Create a deep copy of the Tailwind mapping
const extendedTailwind = JSON.parse(JSON.stringify(tailwindMapping));

// Modify or add mappings
extendedTailwind['core/paragraph'].block = 'my-4 px-4 text-gray-800';
extendedTailwind['core/image'].additionalClass = 'shadow-lg rounded-lg';

// Use the extended mapping
const html = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  customClassMap: { tailwind: extendedTailwind }
});
```

## CSS Mapping Structure

The mapping object structure follows this pattern:

```javascript
{
  [blockName]: {
    // Base class for the block
    block: 'base-class',
    
    // Attribute mappings
    [attributeName]: {
      [attributeValue]: 'class-for-this-value'
    },
    
    // Or direct mapping for boolean attributes
    [booleanAttribute]: 'class-when-true'
  }
}
```

## Hybrid Mode with CSS Frameworks

When using the hybrid content handling mode, you can enhance pre-rendered HTML with framework-specific classes:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Pre-rendered HTML in WordPress blocks
const blocks = {
  rendered: '<p class="has-text-align-center">Pre-rendered paragraph</p>'
};

// Enhance with Tailwind classes
const enhancedHtml = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  contentHandling: 'hybrid'
});

// Output: <p class="has-text-align-center text-center">Pre-rendered paragraph</p>
```

This approach preserves the original WordPress classes while adding framework-specific classes.

## Advanced: Creating a CSS Framework Adapter

For more complex frameworks or special requirements, you can create a complete framework adapter:

```javascript
import { CSSFrameworkAdapter } from 'wp-block-to-html/types';

export const myFrameworkAdapter: CSSFrameworkAdapter = {
  name: 'my-framework',
  
  // Transform WordPress classes to framework classes
  transformClasses(wpClasses) {
    // Transformation logic here
    return myFrameworkClasses;
  },
  
  // Get classes for a specific block
  getClassesForBlock(block, blockName, options) {
    // Custom logic to generate classes based on block attributes
    return generatedClasses;
  },
  
  // Class mappings
  mappings: {
    'core/paragraph': {
      // Mapping details
    },
    // Other block mappings
  }
};

// Register the adapter
import { registerCSSFramework } from 'wp-block-to-html/core';
registerCSSFramework(myFrameworkAdapter);

// Use your framework
const html = convertBlocks(blocks, {
  cssFramework: 'my-framework'
});
```

## CSS Framework Best Practices

1. **Maintain Semantics**: Preserve the semantic meaning of HTML elements when applying framework classes
2. **Responsive Design**: Ensure your mappings include responsive classes where appropriate
3. **Accessibility**: Maintain accessibility features when transforming classes
4. **Performance**: Consider the final CSS size when adding framework classes
5. **Framework Version**: Document which framework version your mappings are designed for

## Comparison of CSS Framework Outputs

Here's a comparison of how different frameworks handle common block types:

| Block Type | WordPress Default | Tailwind CSS | Bootstrap |
|------------|------------------|-------------|-----------|
| Paragraph | `wp-block-paragraph has-text-align-center` | `text-center` | `text-center` |
| Heading (H2) | `wp-block-heading` | `text-3xl font-bold` | `h2` |
| Button | `wp-block-button__link` | `px-4 py-2 rounded bg-blue-600` | `btn btn-primary` |
| Image | `wp-block-image size-large` | `max-w-full h-auto` | `img-fluid` |
| Columns | `wp-block-columns` | `flex flex-wrap` | `row` |
| Column | `wp-block-column` | `flex-1 px-4` | `col` |

## Next Steps

- Learn about [Content Handling Modes](/guide/content-handling-modes) to understand how CSS frameworks interact with different content processing methods
- Explore [Bundle Size Optimization](/guide/bundle-size) to learn how to minimize the impact of CSS framework adapters on your bundle size
- Check out [Framework Components](/frameworks/) for integration with JavaScript frameworks 