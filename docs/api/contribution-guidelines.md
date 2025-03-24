# Contribution Guidelines

Thank you for your interest in contributing to WP Block to HTML! This document provides guidelines for contributing to the project, whether you're fixing bugs, adding features, improving documentation, or helping with other aspects of development.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Pull Request Process](#pull-request-process)
5. [Coding Standards](#coding-standards)
6. [Testing](#testing)
7. [Documentation](#documentation)
8. [Issue Guidelines](#issue-guidelines)
9. [Community](#community)

## Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors. By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Value different viewpoints and experiences
- Give and accept constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm (v7.x or higher) or yarn (v1.22.x or higher)
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/wp-block-to-html.git
   cd wp-block-to-html
   ```
3. Add the original repository as a remote:
   ```bash
   git remote add upstream https://github.com/original-owner/wp-block-to-html.git
   ```
4. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
5. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

### Project Structure

```
wp-block-to-html/
├── src/                  # Source code
│   ├── core/             # Core functionality
│   │   ├── text/         # Text block handlers
│   │   ├── media/        # Media block handlers
│   │   ├── layout/       # Layout block handlers
│   │   └── widget/       # Widget block handlers
│   ├── frameworks/       # CSS framework adapters
│   ├── react/            # React integration
│   ├── vue/              # Vue integration
│   └── ssr/              # Server-side rendering optimizations
├── test/                 # Test files
├── docs/                 # Documentation source
├── examples/             # Example usage
├── scripts/              # Build and development scripts
├── package.json
├── tsconfig.json
├── .eslintrc.js
└── README.md
```

## Development Process

### Development Workflow

1. **Sync with upstream**: Before starting work, ensure your fork is up to date:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a branch**: Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Develop**: Make your changes, following the [Coding Standards](#coding-standards)

4. **Test**: Run tests to ensure your changes work as expected:
   ```bash
   npm test
   # or
   yarn test
   ```

5. **Build**: Ensure the project builds successfully:
   ```bash
   npm run build
   # or
   yarn build
   ```

6. **Commit**: Commit your changes with a descriptive message:
   ```bash
   git add .
   git commit -m "feat: add support for custom block type"
   ```

7. **Push**: Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Pull Request**: Create a pull request from your fork to the main repository

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```
feat(blocks): add support for custom blocks
fix(ssr): resolve issue with image lazy loading
docs(api): update API documentation for createBlockHandler
```

## Pull Request Process

1. **Create a PR**: Submit a pull request from your fork to the main repository
2. **PR Description**: Include a detailed description of your changes
3. **Link Issues**: Link any related issues using keywords like "Fixes #123" or "Relates to #456"
4. **CI Checks**: Ensure all automated CI checks pass
5. **Code Review**: Address any feedback from code reviews
6. **Approval**: Wait for approval from maintainers
7. **Merge**: Once approved, a maintainer will merge your PR

### PR Checklist

Before submitting a PR, ensure:

- [ ] Your code follows the project's coding standards
- [ ] You've added/updated tests for your changes
- [ ] All tests pass locally and in CI
- [ ] You've updated documentation to reflect your changes
- [ ] Your branch is up to date with the latest main branch
- [ ] Your commits follow the conventional commit format

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for new code
- Follow the project's ESLint and Prettier configurations
- Use ES6+ features where appropriate
- Prefer async/await over Promise chains
- Add JSDoc comments for public APIs

### Naming Conventions

- **Files**: Use kebab-case for filenames (e.g., `block-handler.ts`)
- **Interfaces/Types**: Use PascalCase (e.g., `BlockTransformer`)
- **Functions/Variables**: Use camelCase (e.g., `convertBlocks`)
- **Constants**: Use UPPER_SNAKE_CASE for true constants (e.g., `DEFAULT_OPTIONS`)

### Code Style

```typescript
// Good
import { WordPressBlock } from '../types';

/**
 * Transforms a WordPress paragraph block to HTML
 * @param block The WordPress block to transform
 * @param options Conversion options
 * @returns HTML string
 */
export function transformParagraphBlock(block: WordPressBlock, options: ConversionOptions): string {
  const { attrs = {} } = block;
  const { align = '', content = '' } = attrs;
  
  // Apply classes based on alignment
  let className = '';
  if (align) {
    className = `has-text-align-${align}`;
  }
  
  return `<p class="${className}">${content}</p>`;
}

// Bad
export function transform_paragraph(b, o) {
  var a = b.attrs || {};
  var c = a.content || '';
  var cls = a.align ? 'has-text-align-' + a.align : '';
  return '<p class="' + cls + '">' + c + '</p>';
}
```

## Testing

We use Jest for testing. All new features and bug fixes should include tests.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

- Place test files adjacent to the code they test with a `.test.ts` or `.spec.ts` suffix
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies

Example:

```typescript
// src/core/converter.test.ts
import { convertBlocks } from './converter';

describe('convertBlocks', () => {
  it('should convert a paragraph block', () => {
    // Arrange
    const block = {
      blockName: 'core/paragraph',
      attrs: { content: 'Test content', align: 'center' },
      innerBlocks: []
    };

    // Act
    const result = convertBlocks(block);

    // Assert
    expect(result).toContain('<p');
    expect(result).toContain('has-text-align-center');
    expect(result).toContain('Test content');
  });

  it('should handle missing attributes', () => {
    // Arrange
    const block = {
      blockName: 'core/paragraph',
      attrs: {},
      innerBlocks: []
    };

    // Act
    const result = convertBlocks(block);

    // Assert
    expect(result).toContain('<p');
    expect(result).not.toContain('has-text-align');
  });
});
```

### Performance Testing

For performance-sensitive changes, include benchmark tests:

```typescript
// src/benchmarks/converter.bench.ts
import { Suite } from 'benchmark';
import { convertBlocks } from '../core/converter';
import { testBlocks } from './fixtures/test-blocks';

const suite = new Suite();

suite
  .add('convertBlocks - small content', () => {
    convertBlocks(testBlocks.small);
  })
  .add('convertBlocks - large content', () => {
    convertBlocks(testBlocks.large);
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
```

## Documentation

Documentation is a crucial part of the project. Please update documentation to reflect your changes.

### API Documentation

- Use JSDoc comments for all public APIs
- Include examples where appropriate
- Document parameters, return values, and exceptions

### User Documentation

For significant features or changes affecting users:

1. Update the relevant documentation in the `docs/` directory
2. Add examples showing how to use the new feature
3. Include any performance considerations or best practices

## Issue Guidelines

### Creating Issues

When creating issues, please use the provided templates and include:

- **Bug Reports**: Clear steps to reproduce, expected vs. actual behavior, and environment details
- **Feature Requests**: Clear description of the feature and why it would be valuable
- **Questions**: Clear, specific questions with any relevant context

### Issue Labels

- `bug`: Something isn't working as expected
- `feature`: New feature request
- `enhancement`: Improvement to existing functionality
- `documentation`: Improvements or additions to documentation
- `help wanted`: Extra attention is needed
- `good first issue`: Good for newcomers

## Community

### Communication Channels

- **GitHub Issues**: For bug reports, feature requests, and specific questions
- **GitHub Discussions**: For general questions and community discussions
- **Slack Channel**: For real-time communication and collaboration

### Contributing Beyond Code

There are many ways to contribute besides writing code:

- Improving documentation
- Reporting bugs
- Testing new releases
- Helping other users
- Providing feedback on issues and pull requests
- Sharing the project with others

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to WP Block to HTML! Your efforts help make this project better for everyone. 