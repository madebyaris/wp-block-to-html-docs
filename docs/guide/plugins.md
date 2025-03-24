# Plugin Development

WP Block to HTML provides a plugin system that allows you to extend its functionality without modifying the core code. This guide explains how to create, use, and distribute plugins for the library.

## Plugin System Overview

The plugin system allows developers to:

- Register custom block handlers
- Add support for new CSS frameworks
- Modify the conversion process
- Extend the core API with new functionality

## Creating a Basic Plugin

A plugin is essentially a JavaScript module that exports a `pluginOptions` object and optionally a default function that initializes the plugin.

### Minimal Plugin Structure

```typescript
// my-custom-plugin.ts
import { PluginOptions, PluginAPI } from 'wp-block-to-html';

// Plugin metadata and initialization function
export const pluginOptions: PluginOptions = {
  name: 'my-custom-plugin',
  version: '1.0.0',
  description: 'A custom plugin for WP Block to HTML'
};

// Plugin initialization function
export default function initPlugin(api: PluginAPI) {
  // Plugin initialization code
  console.log('Plugin initialized!');
  
  // Register custom block handlers or CSS frameworks
  // api.registerBlockHandler(...);
  // api.registerCSSFramework(...);
}
```

### Registering the Plugin

```typescript
import { registerPlugin } from 'wp-block-to-html';
import myCustomPlugin from './my-custom-plugin';

// Register the plugin
registerPlugin(myCustomPlugin);

// Continue with normal usage
const html = convertBlocks(blocks, options);
```

## Creating a Block Handler Plugin

One of the most common use cases for plugins is to add support for custom block types.

```typescript
// custom-blocks-plugin.ts
import { 
  PluginOptions, 
  PluginAPI, 
  BlockTransformer, 
  WordPressBlock 
} from 'wp-block-to-html';

export const pluginOptions: PluginOptions = {
  name: 'custom-blocks-plugin',
  version: '1.0.0',
  description: 'Adds support for custom block types'
};

// Custom block handler for a "my-plugin/feature-box" block
const featureBoxHandler: BlockTransformer = {
  // Define which block this handler processes
  blockName: 'my-plugin/feature-box',
  
  // Transform function
  transform: (block: WordPressBlock, options) => {
    const { attrs } = block;
    const { title, content, iconName } = attrs;
    
    // CSS classes based on the selected framework
    const cssClasses = options.cssFramework === 'tailwind'
      ? 'bg-white rounded-lg p-6 shadow-md'
      : 'feature-box';
      
    // Generate HTML for the block
    return `
      <div class="${cssClasses}">
        ${iconName ? `<i class="icon-${iconName}"></i>` : ''}
        <h3>${title || 'Feature'}</h3>
        <div>${content || ''}</div>
      </div>
    `;
  },
  
  // Custom CSS mapping for different frameworks
  cssMapping: {
    tailwind: {
      block: 'bg-white rounded-lg p-6 shadow-md',
      theme: {
        light: 'bg-white text-gray-800',
        dark: 'bg-gray-800 text-white'
      }
    },
    bootstrap: {
      block: 'card p-3',
      theme: {
        light: 'bg-light',
        dark: 'bg-dark text-white'
      }
    }
  }
};

// Custom block handler for a "my-plugin/pricing-table" block
const pricingTableHandler: BlockTransformer = {
  blockName: 'my-plugin/pricing-table',
  transform: (block, options) => {
    // Implementation for pricing table block
    return `<div class="pricing-table">...</div>`;
  }
};

// Plugin initialization function
export default function initPlugin(api: PluginAPI) {
  // Register custom block handlers
  api.registerBlockHandler(featureBoxHandler);
  api.registerBlockHandler(pricingTableHandler);
}
```

## Creating a CSS Framework Plugin

You can add support for additional CSS frameworks through plugins.

```typescript
// bulma-framework-plugin.ts
import { 
  PluginOptions, 
  PluginAPI, 
  CSSFrameworkAdapter 
} from 'wp-block-to-html';

export const pluginOptions: PluginOptions = {
  name: 'bulma-framework-plugin',
  version: '1.0.0',
  description: 'Adds support for Bulma CSS framework'
};

// Create a CSS framework adapter for Bulma
const bulmaAdapter: CSSFrameworkAdapter = {
  name: 'bulma',
  
  // Method to transform WordPress classes to Bulma classes
  transformClasses: (wpClasses, blockName) => {
    // Implementation to convert WordPress classes to Bulma
    const bulmaClasses = [];
    
    if (wpClasses.includes('has-text-align-center')) {
      bulmaClasses.push('has-text-centered');
    }
    
    // More class transformations...
    
    return bulmaClasses.join(' ');
  },
  
  // Method to get block-specific classes
  getClassesForBlock: (block) => {
    const { blockName, attrs } = block;
    
    // Handle specific blocks
    if (blockName === 'core/paragraph') {
      return 'content';
    }
    
    if (blockName === 'core/heading') {
      const level = attrs.level || 2;
      return `title is-${level}`;
    }
    
    if (blockName === 'core/button') {
      let buttonClass = 'button';
      
      // Handle button styles
      if (attrs.style?.color?.background) {
        if (attrs.style.color.background === '#3273dc') {
          buttonClass += ' is-link';
        } else if (attrs.style.color.background === '#48c774') {
          buttonClass += ' is-success';
        }
      }
      
      return buttonClass;
    }
    
    return '';
  }
};

// Plugin initialization function
export default function initPlugin(api: PluginAPI) {
  // Register the Bulma CSS framework adapter
  api.registerCSSFramework(bulmaAdapter);
}
```

## Advanced Plugin Features

### Plugin Configuration Options

You can create configurable plugins by accepting options during initialization.

```typescript
// configurable-plugin.ts
import { PluginOptions, PluginAPI } from 'wp-block-to-html';

// Plugin configuration type
type MyPluginConfig = {
  enableFeature1: boolean;
  enableFeature2: boolean;
  customOption: string;
};

// Default configuration
const defaultConfig: MyPluginConfig = {
  enableFeature1: true,
  enableFeature2: false,
  customOption: 'default'
};

export const pluginOptions: PluginOptions = {
  name: 'configurable-plugin',
  version: '1.0.0',
  description: 'A configurable plugin'
};

// Plugin factory function that accepts custom configuration
export function createPlugin(customConfig?: Partial<MyPluginConfig>) {
  // Merge default and custom configurations
  const config = { ...defaultConfig, ...customConfig };
  
  // Return the plugin initialization function
  return function initPlugin(api: PluginAPI) {
    // Use configuration in the plugin
    if (config.enableFeature1) {
      // Initialize feature 1
    }
    
    if (config.enableFeature2) {
      // Initialize feature 2
    }
    
    // Use custom option
    console.log(`Using custom option: ${config.customOption}`);
  };
}

// Default export for simple use cases
export default function initPlugin(api: PluginAPI) {
  // Use default configuration
  return createPlugin()(api);
}
```

Usage with custom configuration:

```typescript
import { registerPlugin } from 'wp-block-to-html';
import { createPlugin } from './configurable-plugin';

// Register with custom configuration
registerPlugin(createPlugin({
  enableFeature2: true,
  customOption: 'custom value'
}));
```

### Plugin Hooks

Some plugins may need to hook into different parts of the conversion process.

```typescript
// hook-plugin.ts
import { PluginOptions, PluginAPI } from 'wp-block-to-html';

export const pluginOptions: PluginOptions = {
  name: 'hook-plugin',
  version: '1.0.0',
  description: 'Demonstrates plugin hooks'
};

export default function initPlugin(api: PluginAPI) {
  // Hook that runs before block conversion
  api.hooks.beforeBlockConversion.register((block, options) => {
    // Modify block or options before conversion
    console.log(`Processing block: ${block.blockName}`);
    return { block, options };
  });
  
  // Hook that runs after block conversion
  api.hooks.afterBlockConversion.register((html, block, options) => {
    // Modify the generated HTML
    console.log(`Generated HTML for block: ${block.blockName}`);
    
    // For example, add a wrapper div to all images
    if (block.blockName === 'core/image') {
      return `<div class="image-wrapper">${html}</div>`;
    }
    
    return html;
  });
  
  // Hook that runs after all blocks are converted
  api.hooks.afterFullConversion.register((fullHtml, blocks, options) => {
    // Modify the complete HTML
    console.log(`Full conversion completed: ${blocks.length} blocks`);
    
    // For example, add metadata or analytics code
    return `
      <!-- Generated by WP Block to HTML with hook-plugin -->
      ${fullHtml}
      <!-- End of generated content -->
    `;
  });
}
```

## Testing Plugins

Here's a recommended approach for testing your plugins:

```typescript
import { 
  convertBlocks, 
  registerPlugin, 
  WordPressBlock 
} from 'wp-block-to-html';
import myPlugin from './my-plugin';

// Register your plugin
registerPlugin(myPlugin);

// Create test block data
const testBlocks: WordPressBlock[] = [
  {
    blockName: 'my-plugin/feature-box',
    attrs: {
      title: 'Test Feature',
      content: 'This is a test feature',
      iconName: 'star'
    },
    innerBlocks: [],
    innerHTML: ''
  }
];

// Test the conversion
const html = convertBlocks(testBlocks);
console.log(html);

// Expected output should match what your plugin generates
const expectedHtml = `
  <div class="bg-white rounded-lg p-6 shadow-md">
    <i class="icon-star"></i>
    <h3>Test Feature</h3>
    <div>This is a test feature</div>
  </div>
`;

// Simple assertion
console.assert(
  html.trim() === expectedHtml.trim(),
  'Plugin output does not match expected HTML'
);
```

## Debugging Plugins

The library provides debug options that can help with plugin development:

```typescript
import { convertBlocks, registerPlugin } from 'wp-block-to-html';
import myPlugin from './my-plugin';

// Register your plugin
registerPlugin(myPlugin);

// Enable debug mode
const html = convertBlocks(blocks, {
  debug: {
    enabled: true,
    logLevel: 'verbose',
    logPluginActivity: true
  }
});
```

This will output detailed logging information about the plugin's activity during the conversion process.

## Publishing Plugins

When your plugin is ready for others to use, you can publish it as an npm package.

Package structure example:

```
my-wp-block-plugin/
├── src/
│   ├── index.ts         # Main entry point
│   ├── block-handlers/  # Custom block handlers
│   └── css-frameworks/  # Custom CSS frameworks
├── dist/                # Compiled JavaScript
├── package.json         # npm package configuration
├── README.md            # Documentation
└── LICENSE              # License information
```

Example `package.json`:

```json
{
  "name": "wp-block-to-html-my-plugin",
  "version": "1.0.0",
  "description": "Custom plugin for WP Block to HTML",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc",
    "test": "jest"
  },
  "keywords": [
    "wordpress",
    "gutenberg",
    "blocks",
    "html",
    "wp-block-to-html",
    "plugin"
  ],
  "peerDependencies": {
    "wp-block-to-html": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^4.5.4",
    "jest": "^27.4.5"
  }
}
```

## Plugin Integration Examples

### Integration with Other Plugins

Plugins can work together to provide enhanced functionality:

```typescript
// integration-example.ts
import { registerPlugin, convertBlocks } from 'wp-block-to-html';
import bulmaFrameworkPlugin from 'wp-block-to-html-bulma';
import customBlocksPlugin from './custom-blocks-plugin';

// Register multiple plugins
registerPlugin(bulmaFrameworkPlugin);
registerPlugin(customBlocksPlugin);

// Use the enhanced functionality
const html = convertBlocks(blocks, {
  cssFramework: 'bulma' // Now available thanks to the bulma plugin
});
```

### React Components with Plugins

```typescript
// react-integration.tsx
import React from 'react';
import { createReactComponent, registerPlugin } from 'wp-block-to-html';
import customBlocksPlugin from './custom-blocks-plugin';

// Register your plugin
registerPlugin(customBlocksPlugin);

// Create a React component with plugin support
const BlockRenderer = createReactComponent(blocks, {
  cssFramework: 'tailwind',
  memo: true // Memoize the component for better performance
});

// Use in your React application
function App() {
  return (
    <div className="app">
      <h1>My WordPress Content</h1>
      <BlockRenderer className="content-wrapper" />
    </div>
  );
}

export default App;
```

## Best Practices for Plugin Development

1. **Follow Semantic Versioning**: Use proper versioning for your plugin to communicate changes clearly.

2. **Document Your Plugin**: Include clear documentation on how to install, configure, and use your plugin.

3. **Write Tests**: Ensure your plugin works correctly by writing comprehensive tests.

4. **Handle Errors Gracefully**: Catch and handle errors in your plugin to prevent breaking the conversion process.

5. **Performance Considerations**: Keep your plugin efficient, especially for operations that run on each block.

6. **Respect the Plugin API**: Only use documented API methods for better forward compatibility.

7. **Keep Dependencies Minimal**: Avoid unnecessary dependencies to keep the plugin lightweight.

8. **Provide TypeScript Types**: Include proper TypeScript types for a better developer experience.

## Next Steps

- Learn about [TypeScript Interfaces](/api/typescript/interfaces) for plugin development
- Explore [CSS Framework Integration](/guide/css-frameworks) for custom framework support
- Check out the [Configuration API](/api/configuration) for advanced options 