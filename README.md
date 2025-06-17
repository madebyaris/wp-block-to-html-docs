# WP Block to HTML Documentation (v1.0.0)

This directory contains the documentation website for the **WP Block to HTML** library — **v1.0.0 stable release** — built with VitePress. The v1.0.0 milestone introduces **client-side hydration** and solidifies production-ready status.

## Structure

- **Home (/)**: Overview of the library and its features
- **Guide (/guide/)**: Getting started guides and tutorials
  - **NEW**: [Client-Side Hydration](/guide/hydration) 💧
- **API (/api/)**: API reference and developer documentation
- **Frameworks (/frameworks/)**: Framework-specific integration guides
- **Examples (/examples/)**: Code examples for common use cases

## Key Documentation Features (v1.0.0)

- **Client-Side Hydration Guide**: Progressive hydration strategies with React, Vue, Angular, Svelte examples
- **Comprehensive API Reference**: Detailed documentation of all public APIs with TypeScript annotations
- **Framework Integration Guides**: Guides for React, Vue, Angular, and Svelte
- **CSS Framework Integration**: Documentation for Tailwind CSS and Bootstrap
- **Performance Optimization**: Strategies for achieving 947 blocks/ms processing speed
- **Migration Guides**: Step-by-step guides for migrating from WordPress to headless

## Development

To run the documentation site locally:

```bash
# Navigate to the documentation directory
cd web-documentation

# Install dependencies
npm install

# Start the development server
npm run docs:dev
```

The site will be available at http://localhost:5173/.

## Building

To build the documentation site:

```bash
# Navigate to the documentation directory
cd web-documentation

# Build the site
npm run docs:build
```

The built site will be in the `web-documentation/docs/.vitepress/dist` directory.

## Contributing to Documentation

We welcome contributions to the documentation! To contribute:

1. Fork the repository
2. Create a branch for your changes
3. Make your changes to the documentation
4. Submit a pull request

When contributing to documentation, please:

- Follow the existing structure and style
- Provide clear, concise explanations
- Include code examples where appropriate
- Ensure links work correctly
- Test any code examples

## Documentation TODOs

- [ ] Add video tutorials
- [ ] Create more complex examples
- [ ] Add internationalization

## License

The documentation is licensed under the MIT License, the same as the WP Block to HTML library itself. 