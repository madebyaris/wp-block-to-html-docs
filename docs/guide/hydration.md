# Client-Side Hydration

:::info NEW IN v1.0.0
🎉 **Client-side hydration is a major new feature in v1.0.0!** This makes WP Block to HTML the first WordPress block converter with production-ready hydration capabilities for SSR scenarios.
:::

Client-side hydration allows you to progressively add interactivity to server-rendered content, providing optimal performance by loading interactive components only when needed.

## Overview

The hydration system in WP Block to HTML v1.0.0 provides four distinct strategies to optimize when and how interactive components are loaded:

- **Immediate**: Hydrate components immediately on page load
- **Viewport**: Hydrate when components enter the viewport
- **Interaction**: Hydrate on user interaction (hover, click, focus)
- **Idle**: Hydrate during browser idle time

## Quick Start

```javascript
import { convertBlocks } from 'wp-block-to-html';
import { HydrationManager } from 'wp-block-to-html/hydration';

// Convert blocks with hydration configuration
const html = convertBlocks(blocks, {
  hydration: {
    strategy: 'viewport',
    priorityBlocks: ['core/button', 'core/gallery']
  }
});

// Initialize hydration manager
const hydrationManager = new HydrationManager({
  strategy: 'viewport',
  rootSelector: '#app',
  throttle: 100
});

// Start hydration
await hydrationManager.hydrateAll();
```

## Hydration Strategies

### Immediate Hydration

Hydrates components immediately on page load. Best for critical interactive components that users expect to work immediately.

```javascript
const hydrationManager = new HydrationManager({
  strategy: 'immediate',
  rootSelector: '#app'
});

await hydrationManager.hydrateAll();
```

### Viewport-Based Hydration

Hydrates components when they enter the viewport using IntersectionObserver. Ideal for performance optimization with long-form content.

```javascript
const hydrationManager = new HydrationManager({
  strategy: 'viewport',
  rootSelector: '#app',
  viewportOptions: {
    threshold: 0.1,
    rootMargin: '50px'
  }
});

await hydrationManager.hydrateAll();
```

### Interaction-Based Hydration

Hydrates components on user interaction events (hover, click, focus). Perfect for components that are only interactive on demand.

```javascript
const hydrationManager = new HydrationManager({
  strategy: 'interaction',
  rootSelector: '#app',
  interactionEvents: ['mouseenter', 'click', 'focusin']
});

await hydrationManager.hydrateAll();
```

### Idle Hydration

Hydrates components during browser idle time using requestIdleCallback. Best for non-critical interactive components.

```javascript
const hydrationManager = new HydrationManager({
  strategy: 'idle',
  rootSelector: '#app',
  idleTimeout: 5000 // Fallback timeout
});

await hydrationManager.hydrateAll();
```

## Advanced Configuration

### Priority Blocks

Specify which block types should be hydrated first for optimal user experience:

```javascript
const html = convertBlocks(blocks, {
  hydration: {
    strategy: 'progressive',
    priorityBlocks: [
      'core/button',
      'core/gallery', 
      'core/video',
      'core/audio'
    ],
    fallbackStrategy: 'idle'
  }
});
```

### Mixed Strategies

Use different strategies for different types of blocks:

```javascript
const hydrationManager = new HydrationManager({
  strategy: 'mixed',
  strategyMap: {
    'core/button': 'immediate',
    'core/gallery': 'viewport',
    'core/video': 'interaction',
    'core/embed': 'idle'
  },
  defaultStrategy: 'viewport'
});
```

### Custom Hydration Logic

Implement custom hydration logic for specific use cases:

```javascript
const hydrationManager = new HydrationManager({
  strategy: 'custom',
  customHydrator: async (blockElement, blockType) => {
    // Custom logic based on block type, user preferences, etc.
    if (blockType === 'core/gallery' && window.innerWidth < 768) {
      // Mobile-specific hydration
      await hydrateForMobile(blockElement);
    } else {
      // Default hydration
      await hydrateBlock(blockElement, blockType);
    }
  }
});
```

## Framework Integration

### React Components

```javascript
import { createReactComponent } from 'wp-block-to-html/react';
import { HydrationManager } from 'wp-block-to-html/hydration';

const BlockComponent = createReactComponent(blocks, {
  cssFramework: 'tailwind',
  hydration: {
    strategy: 'viewport',
    reactOptions: {
      suspense: true,
      errorBoundary: true
    }
  }
});

// Hydrate React components
const hydrationManager = new HydrationManager({
  strategy: 'viewport',
  framework: 'react',
  rootSelector: '#react-app'
});
```

### Vue Components

```javascript
import { createVueComponent } from 'wp-block-to-html/vue';
import { HydrationManager } from 'wp-block-to-html/hydration';

const BlockComponent = createVueComponent(blocks, {
  cssFramework: 'tailwind',
  hydration: {
    strategy: 'interaction',
    vueOptions: {
      async: true,
      teleport: true
    }
  }
});

// Hydrate Vue components
const hydrationManager = new HydrationManager({
  strategy: 'interaction',
  framework: 'vue',
  rootSelector: '#vue-app'
});
```

## Performance Optimization

### Throttling and Debouncing

```javascript
const hydrationManager = new HydrationManager({
  strategy: 'viewport',
  throttle: 100, // Throttle viewport checks
  debounce: 250  // Debounce hydration calls
});
```

### Batch Hydration

```javascript
// Hydrate multiple blocks in batches for better performance
const hydrationManager = new HydrationManager({
  strategy: 'viewport',
  batchSize: 5,
  batchDelay: 16 // ~60fps
});

await hydrationManager.hydrateBatch(['block-1', 'block-2', 'block-3']);
```

### Memory Management

```javascript
// Automatic cleanup of hydrated components
const hydrationManager = new HydrationManager({
  strategy: 'viewport',
  autoCleanup: true,
  cleanupDelay: 30000 // Clean up after 30s outside viewport
});

// Manual cleanup
hydrationManager.cleanup('block-id');
hydrationManager.cleanupAll();
```

## Error Handling

```javascript
const hydrationManager = new HydrationManager({
  strategy: 'viewport',
  onError: (error, blockId, blockType) => {
    console.error(`Hydration failed for ${blockType} (${blockId}):`, error);
    
    // Report to error tracking service
    errorTracker.report(error, { blockId, blockType });
    
    // Fallback to static rendering
    return false; // Don't retry
  },
  retryAttempts: 3,
  retryDelay: 1000
});
```

## Monitoring and Analytics

```javascript
const hydrationManager = new HydrationManager({
  strategy: 'viewport',
  onHydrationStart: (blockId, blockType) => {
    performance.mark(`hydration-start-${blockId}`);
  },
  onHydrationComplete: (blockId, blockType, duration) => {
    performance.mark(`hydration-end-${blockId}`);
    performance.measure(`hydration-${blockId}`, 
      `hydration-start-${blockId}`, 
      `hydration-end-${blockId}`
    );
    
    // Send analytics
    analytics.track('block_hydrated', {
      blockType,
      duration,
      strategy: 'viewport'
    });
  }
});
```

## Best Practices

### 1. Choose the Right Strategy

- **Immediate**: Critical navigation, forms, buttons above the fold
- **Viewport**: Galleries, videos, maps, interactive content below fold
- **Interaction**: Tooltips, modals, expandable content
- **Idle**: Analytics, tracking, non-critical widgets

### 2. Optimize Bundle Size

```javascript
// Import only the hydration features you need
import { HydrationManager } from 'wp-block-to-html/hydration/core';
import { ViewportStrategy } from 'wp-block-to-html/hydration/strategies/viewport';

const hydrationManager = new HydrationManager({
  strategy: new ViewportStrategy({
    threshold: 0.1,
    rootMargin: '50px'
  })
});
```

### 3. Progressive Enhancement

```javascript
// Ensure graceful degradation
const html = convertBlocks(blocks, {
  hydration: {
    strategy: 'progressive',
    fallbackToStatic: true, // Render static version if hydration fails
    enableNoScript: true    // Include noscript fallbacks
  }
});
```

### 4. Test Performance

```javascript
// Measure hydration impact
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.includes('hydration')) {
      console.log(`${entry.name}: ${entry.duration}ms`);
    }
  }
});

observer.observe({ entryTypes: ['measure'] });
```

## API Reference

### HydrationManager

```typescript
interface HydrationManagerOptions {
  strategy: 'immediate' | 'viewport' | 'interaction' | 'idle' | 'mixed' | 'custom';
  rootSelector: string;
  framework?: 'react' | 'vue' | 'angular' | 'svelte';
  throttle?: number;
  debounce?: number;
  batchSize?: number;
  batchDelay?: number;
  autoCleanup?: boolean;
  cleanupDelay?: number;
  retryAttempts?: number;
  retryDelay?: number;
  onHydrationStart?: (blockId: string, blockType: string) => void;
  onHydrationComplete?: (blockId: string, blockType: string, duration: number) => void;
  onError?: (error: Error, blockId: string, blockType: string) => boolean;
}
```

### Methods

```typescript
class HydrationManager {
  // Hydrate all blocks
  async hydrateAll(): Promise<void>;
  
  // Hydrate specific block
  async hydrateBlock(blockId: string): Promise<void>;
  
  // Hydrate batch of blocks
  async hydrateBatch(blockIds: string[]): Promise<void>;
  
  // Cleanup hydrated blocks
  cleanup(blockId: string): void;
  cleanupAll(): void;
  
  // Check if block is hydrated
  isHydrated(blockId: string): boolean;
  
  // Get hydration stats
  getStats(): HydrationStats;
}
```

## Migration from Server-Only Rendering

If you're migrating from server-only rendering to hydration:

1. **Start with Idle Strategy**: Begin with `idle` hydration to ensure no performance regression
2. **Identify Critical Components**: Move important interactive elements to `immediate`
3. **Optimize Progressively**: Use `viewport` for below-fold content
4. **Add Interaction Loading**: Use `interaction` for secondary features
5. **Monitor Performance**: Track Core Web Vitals and hydration timing

```javascript
// Migration-friendly configuration
const html = convertBlocks(blocks, {
  hydration: {
    strategy: 'progressive',
    migrationMode: true, // Enables additional safety checks
    fallbackToStatic: true,
    performanceMonitoring: true
  }
});
```

## Troubleshooting

### Common Issues

1. **Hydration Mismatch**: Server and client HTML don't match
2. **Double Hydration**: Components hydrated multiple times
3. **Memory Leaks**: Hydrated components not cleaned up
4. **Performance Regression**: Hydration blocking main thread

### Debug Mode

```javascript
const hydrationManager = new HydrationManager({
  strategy: 'viewport',
  debug: true, // Enables console logging
  debugLevel: 'verbose' // 'minimal' | 'normal' | 'verbose'
});
```

The hydration system in WP Block to HTML v1.0.0 provides powerful tools for optimizing interactive content loading while maintaining excellent performance and user experience. 