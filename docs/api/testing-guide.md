# Testing Guide

This document outlines the testing strategies and best practices for the WP Block to HTML library. Whether you're a contributor to the library or building applications with it, effective testing ensures reliability and performance.

## Testing Philosophy

The WP Block to HTML library follows these testing principles:

- **Comprehensive Coverage**: Test all public APIs and critical internal components
- **Real-world Block Testing**: Use actual WordPress block data in tests
- **Visual Regression**: Ensure HTML output remains consistent across versions
- **Performance Benchmarking**: Monitor and optimize performance
- **Cross-framework Compatibility**: Verify functionality across supported frameworks

## Test Types

### Unit Tests

Unit tests verify the correct functioning of individual components and functions in isolation.

```javascript
// Example unit test for a paragraph block transformer
describe('paragraphBlockHandler', () => {
  it('should transform a basic paragraph block', () => {
    const block = {
      blockName: 'core/paragraph',
      attrs: { align: 'center', content: 'Test paragraph' },
      innerBlocks: []
    };
    
    const result = paragraphBlockHandler.transform(block, defaultOptions);
    
    expect(result).toContain('<p');
    expect(result).toContain('text-center');
    expect(result).toContain('Test paragraph');
  });
});
```

### Integration Tests

Integration tests verify that different components work correctly together.

```javascript
describe('convertBlocks integration', () => {
  it('should process nested blocks correctly', () => {
    const blocks = [
      {
        blockName: 'core/group',
        attrs: { className: 'test-group' },
        innerBlocks: [
          {
            blockName: 'core/paragraph',
            attrs: { content: 'Nested content' },
            innerBlocks: []
          }
        ]
      }
    ];
    
    const result = convertBlocks(blocks, defaultOptions);
    
    expect(result).toContain('<div class="test-group');
    expect(result).toContain('Nested content');
  });
});
```

### Snapshot Tests

Snapshot tests ensure that the HTML output remains consistent between releases.

```javascript
describe('Snapshot tests', () => {
  it('should match snapshot for complex layout', () => {
    const blocks = loadFixture('complex-layout.json');
    const result = convertBlocks(blocks, defaultOptions);
    
    expect(result).toMatchSnapshot();
  });
});
```

### Performance Tests

Performance tests measure the efficiency of the library in various scenarios.

```javascript
describe('Performance tests', () => {
  it('should process 1000 blocks within acceptable time', () => {
    const blocks = generateManyBlocks(1000);
    
    const startTime = performance.now();
    convertBlocks(blocks, defaultOptions);
    const endTime = performance.now();
    
    const processingTime = endTime - startTime;
    expect(processingTime).toBeLessThan(1000); // Less than 1 second
  });
});
```

### Cross-framework Tests

Tests that ensure the library works correctly with all supported frameworks.

```javascript
describe('React integration', () => {
  it('should render React components correctly', () => {
    const blocks = loadFixture('basic-blocks.json');
    const components = convertBlocksToReact(blocks, {
      outputFormat: 'react'
    });
    
    const wrapper = mount(<div>{components}</div>);
    expect(wrapper.find('p').length).toBeGreaterThan(0);
    expect(wrapper.find('img').length).toBeGreaterThan(0);
  });
});
```

## Test Infrastructure

### Test Fixtures

The project uses test fixtures to represent real-world WordPress block data. Fixtures are stored in the `test/fixtures` directory.

```
test/
  fixtures/
    basic-blocks.json
    complex-layout.json
    media-blocks.json
    nested-blocks.json
```

### Test Utilities

Helper functions to simplify test writing:

```javascript
// Example utility to load test fixtures
function loadFixture(fixtureName) {
  const path = `./fixtures/${fixtureName}`;
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

// Example utility to generate blocks for performance testing
function generateManyBlocks(count) {
  const blocks = [];
  for (let i = 0; i < count; i++) {
    blocks.push({
      blockName: 'core/paragraph',
      attrs: { content: `Test paragraph ${i}` },
      innerBlocks: []
    });
  }
  return blocks;
}
```

## Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm test -- --watch

# Run specific test file
npm test -- core-functions.test.js

# Run tests with coverage report
npm test -- --coverage
```

### Testing Specific Components

```bash
# Test block transformers
npm test -- block-transformers

# Test CSS framework adapters
npm test -- css-adapters

# Test framework adapters
npm test -- framework-adapters
```

## Writing Effective Tests

### Test Structure

Follow the AAA pattern (Arrange, Act, Assert):

```javascript
it('should apply custom class mapping', () => {
  // Arrange
  const block = createParagraphBlock('Test content');
  const customClassMap = {
    'core/paragraph': {
      block: 'custom-paragraph'
    }
  };
  
  // Act
  const result = convertBlocks([block], {
    cssFramework: 'custom',
    customClassMap
  });
  
  // Assert
  expect(result).toContain('class="custom-paragraph"');
});
```

### Testing Tips

1. **Test Behavior, Not Implementation**: Focus on what functions do, not how they do it.

2. **Isolate Tests**: Each test should be independent; don't rely on state from other tests.

3. **Use Meaningful Assertions**: Be specific about what you're checking.

```javascript
// Good
expect(result).toContain('class="text-center"');

// Better
expect(result).toMatch(/<p[^>]*class="[^"]*text-center[^"]*"[^>]*>/);
```

4. **Test Edge Cases**: Include tests for empty blocks, malformed data, and boundary conditions.

```javascript
it('should handle empty block arrays', () => {
  const result = convertBlocks([], defaultOptions);
  expect(result).toBe('');
});

it('should handle blocks with missing names', () => {
  const block = { attrs: {}, innerBlocks: [] };
  const result = convertBlocks([block], defaultOptions);
  expect(result).toBe('');
});
```

5. **Mock External Dependencies**: Use mocks for API calls or filesystem operations.

```javascript
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => '{"sample": "data"}')
}));
```

## Visual Regression Testing

For visual components, consider using visual regression testing tools:

```javascript
describe('Visual regression', () => {
  it('should render complex layout correctly', async () => {
    const blocks = loadFixture('complex-layout.json');
    const html = convertBlocks(blocks, defaultOptions);
    
    // Render HTML to browser
    document.body.innerHTML = html;
    
    // Take screenshot and compare with baseline
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });
});
```

## Performance Testing

### Benchmarking

Measure performance across different scenarios:

```javascript
describe('Benchmark', () => {
  const scenarios = [
    { name: '10 simple blocks', fixture: 'simple-10.json' },
    { name: '100 simple blocks', fixture: 'simple-100.json' },
    { name: '10 complex blocks', fixture: 'complex-10.json' },
    { name: '100 complex blocks', fixture: 'complex-100.json' }
  ];
  
  scenarios.forEach(scenario => {
    it(`should process ${scenario.name} efficiently`, () => {
      const blocks = loadFixture(scenario.fixture);
      
      const times = [];
      for (let i = 0; i < 5; i++) {
        const start = performance.now();
        convertBlocks(blocks, defaultOptions);
        times.push(performance.now() - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log(`${scenario.name}: ${avgTime.toFixed(2)}ms`);
      
      // Define appropriate thresholds for each scenario
      const thresholds = {
        'simple-10.json': 50,
        'simple-100.json': 300,
        'complex-10.json': 100,
        'complex-100.json': 600
      };
      
      expect(avgTime).toBeLessThan(thresholds[scenario.fixture]);
    });
  });
});
```

### Memory Usage

Monitor memory consumption:

```javascript
it('should have acceptable memory usage', () => {
  const blocks = loadFixture('large-page.json');
  
  const memBefore = process.memoryUsage().heapUsed;
  convertBlocks(blocks, defaultOptions);
  const memAfter = process.memoryUsage().heapUsed;
  
  const memUsed = (memAfter - memBefore) / 1024 / 1024; // MB
  console.log(`Memory used: ${memUsed.toFixed(2)}MB`);
  
  expect(memUsed).toBeLessThan(50); // Less than 50MB
});
```

## Continuous Integration

The library uses GitHub Actions for CI/CD:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v1
```

## Testing Custom Extensions

When developing plugins or extensions for WP Block to HTML:

```javascript
import { convertBlocks } from 'wp-block-to-html';
import myCustomTransformer from './my-transformer';

describe('My custom transformer', () => {
  it('should transform custom blocks correctly', () => {
    const block = {
      blockName: 'my-plugin/custom-block',
      attrs: { /* custom attributes */ },
      innerBlocks: []
    };
    
    const result = convertBlocks([block], {
      blockTransformers: {
        'my-plugin/custom-block': myCustomTransformer
      }
    });
    
    expect(result).toContain('expected-output');
  });
});
```

## Testing in Applications

### React Application Tests

```jsx
import { convertBlocksToReact } from 'wp-block-to-html';

describe('WordPress Post Component', () => {
  it('should render post content correctly', () => {
    const post = {
      title: 'Test Post',
      blocks: [...] // WordPress blocks
    };
    
    const { getByText, container } = render(
      <WordPressPost post={post} />
    );
    
    expect(getByText('Test Post')).toBeInTheDocument();
    expect(container.querySelector('p')).toBeInTheDocument();
  });
});
```

### Vue Application Tests

```javascript
import { mount } from '@vue/test-utils';
import WordPressPost from './WordPressPost.vue';

describe('WordPressPost.vue', () => {
  it('renders post content correctly', () => {
    const post = {
      title: 'Test Post',
      blocks: [...] // WordPress blocks
    };
    
    const wrapper = mount(WordPressPost, {
      propsData: { post }
    });
    
    expect(wrapper.text()).toContain('Test Post');
    expect(wrapper.find('p').exists()).toBe(true);
  });
});
```

## Conclusion

A comprehensive testing strategy ensures WP Block to HTML remains reliable and performant. By following these testing practices, developers can confidently extend the library or build applications with it.

For additional questions or to report issues with testing, please [open an issue](https://github.com/yourusername/wp-block-to-html/issues) on GitHub. 