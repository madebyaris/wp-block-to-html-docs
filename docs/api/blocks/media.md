# Media Blocks

This page documents the media block handlers available in WP Block to HTML.

## Overview

Media blocks handle various forms of media content in WordPress, such as images, galleries, audio, video, and more. WP Block to HTML provides optimized handlers for all WordPress core media blocks.

## Importing Media Block Handlers

You can import individual media block handlers for optimized bundle size:

```javascript
import { imageBlockHandler } from 'wp-block-to-html/blocks/media';
import { galleryBlockHandler } from 'wp-block-to-html/blocks/media';
import { coverBlockHandler } from 'wp-block-to-html/blocks/media';
```

Or import all media block handlers at once:

```javascript
import * as mediaBlockHandlers from 'wp-block-to-html/blocks/media';
```

## Available Media Block Handlers

### Image Block

Handles the core/image block type.

```javascript
// Example input
const imageBlock = {
  blockName: 'core/image',
  attrs: {
    id: 123,
    url: 'https://example.com/image.jpg',
    alt: 'Example image',
    width: 800,
    height: 600,
    align: 'center',
    caption: 'An example image'
  },
  innerContent: ['<figure class="wp-block-image aligncenter size-full"><img src="https://example.com/image.jpg" alt="Example image" width="800" height="600"/><figcaption>An example image</figcaption></figure>']
};

// Example output with default CSS
// <figure class="wp-block-image aligncenter size-full">
//   <img src="https://example.com/image.jpg" alt="Example image" width="800" height="600"/>
//   <figcaption>An example image</figcaption>
// </figure>

// Example output with Tailwind CSS
// <figure class="mx-auto">
//   <img src="https://example.com/image.jpg" alt="Example image" width="800" height="600" class="w-full"/>
//   <figcaption class="text-center text-sm text-gray-600">An example image</figcaption>
// </figure>
```

### Gallery Block

Handles the core/gallery block type.

```javascript
// Example input
const galleryBlock = {
  blockName: 'core/gallery',
  attrs: {
    ids: [123, 456, 789],
    columns: 3,
    linkTo: 'none'
  },
  innerContent: [/* ... */],
  innerBlocks: [
    // Each gallery item is a separate block
    {
      blockName: 'core/image',
      attrs: {
        id: 123,
        url: 'https://example.com/image1.jpg',
        alt: 'Image 1'
      },
      innerContent: [/* ... */]
    },
    // More gallery items...
  ]
};

// Example output with Tailwind CSS
// <figure class="wp-block-gallery">
//   <ul class="grid grid-cols-3 gap-4">
//     <li class="block">
//       <figure>
//         <img src="https://example.com/image1.jpg" alt="Image 1" class="w-full h-auto"/>
//       </figure>
//     </li>
//     <!-- More gallery items... -->
//   </ul>
// </figure>
```

### Cover Block

Handles the core/cover block type.

```javascript
// Example input
const coverBlock = {
  blockName: 'core/cover',
  attrs: {
    url: 'https://example.com/background.jpg',
    id: 123,
    dimRatio: 50,
    overlayColor: 'primary',
    minHeight: 400,
    align: 'full'
  },
  innerContent: [/* ... */],
  innerBlocks: [
    {
      blockName: 'core/paragraph',
      attrs: {
        align: 'center',
        placeholder: 'Write title…',
        fontSize: 'large'
      },
      innerContent: ['<p class="has-text-align-center has-large-font-size">Cover Title</p>']
    }
  ]
};

// Example output with Tailwind CSS
// <div class="relative flex items-center justify-center p-8 overflow-hidden bg-cover bg-center min-h-[400px] w-full"
//      style="background-image: url('https://example.com/background.jpg')">
//   <div class="absolute inset-0 bg-primary-500 opacity-50"></div>
//   <div class="relative z-10 w-full">
//     <p class="text-center text-2xl text-white">Cover Title</p>
//   </div>
// </div>
```

### Video Block

Handles the core/video block type.

```javascript
// Example input
const videoBlock = {
  blockName: 'core/video',
  attrs: {
    id: 123,
    src: 'https://example.com/video.mp4',
    poster: 'https://example.com/poster.jpg',
    caption: 'Example video'
  },
  innerContent: [/* ... */]
};

// Example output
// <figure class="wp-block-video">
//   <video controls src="https://example.com/video.mp4" poster="https://example.com/poster.jpg"></video>
//   <figcaption>Example video</figcaption>
// </figure>
```

### Audio Block

Handles the core/audio block type.

```javascript
// Example input
const audioBlock = {
  blockName: 'core/audio',
  attrs: {
    id: 123,
    src: 'https://example.com/audio.mp3',
    caption: 'Example audio'
  },
  innerContent: [/* ... */]
};

// Example output
// <figure class="wp-block-audio">
//   <audio controls src="https://example.com/audio.mp3"></audio>
//   <figcaption>Example audio</figcaption>
// </figure>
```

### Media & Text Block

Handles the core/media-text block type.

```javascript
// Example input
const mediaTextBlock = {
  blockName: 'core/media-text',
  attrs: {
    mediaId: 123,
    mediaUrl: 'https://example.com/image.jpg',
    mediaPosition: 'left',
    mediaWidth: 50
  },
  innerContent: [/* ... */],
  innerBlocks: [
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: ['<p>Content next to media</p>']
    }
  ]
};

// Example output with Tailwind CSS
// <div class="grid grid-cols-2 gap-4 items-center">
//   <div class="col-span-1">
//     <figure>
//       <img src="https://example.com/image.jpg" alt="" class="w-full"/>
//     </figure>
//   </div>
//   <div class="col-span-1">
//     <p>Content next to media</p>
//   </div>
// </div>
```

### Embed Block

Handles the core/embed block type and its variations (YouTube, Vimeo, Twitter, etc.).

```javascript
// Example input
const embedBlock = {
  blockName: 'core/embed',
  attrs: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'video',
    providerNameSlug: 'youtube',
    responsive: true,
    align: 'wide'
  },
  innerContent: [/* ... */]
};

// Example output
// <figure class="wp-block-embed is-type-video is-provider-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio alignwide">
//   <div class="wp-block-embed__wrapper">
//     <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
//             frameborder="0" allowfullscreen></iframe>
//   </div>
// </figure>
```

## Lazy Loading Media Elements

::: tip
The SSR optimization module automatically adds `loading="lazy"` to images and other media elements (except the first one for LCP).
:::

To manually add lazy loading to media elements:

```javascript
import { convertBlocks } from 'wp-block-to-html';

const html = convertBlocks(blockData, {
  ssrOptions: {
    enabled: true,
    optimizeImages: true
  }
});
```

## CSS Framework Integration

Media blocks have specific mappings for different CSS frameworks:

### Tailwind CSS

```javascript
// Image block with Tailwind CSS
const html = convertBlocks(imageBlock, { cssFramework: 'tailwind' });
// <figure class="mx-auto">
//   <img src="..." alt="..." class="w-full h-auto" />
//   <figcaption class="text-center text-sm text-gray-600">...</figcaption>
// </figure>
```

### Bootstrap

```javascript
// Image block with Bootstrap
const html = convertBlocks(imageBlock, { cssFramework: 'bootstrap' });
// <figure class="figure text-center">
//   <img src="..." alt="..." class="figure-img img-fluid" />
//   <figcaption class="figure-caption">...</figcaption>
// </figure>
```

## Custom Media Block Handlers

You can create custom media block handlers for specific needs:

```javascript
import { createBlockHandler, convertBlocks } from 'wp-block-to-html';

const customImageHandler = createBlockHandler('core/image', {
  transform(block, options) {
    const { attrs = {}, innerContent = [] } = block;
    const { url, alt = '', width, height, align } = attrs;
    
    // Example: Add a lightbox attribute to all images
    return `
      <figure class="${align === 'center' ? 'text-center' : ''}">
        <img src="${url}" alt="${alt}" width="${width}" height="${height}" class="lightbox-image" data-lightbox="gallery" />
        ${attrs.caption ? `<figcaption>${attrs.caption}</figcaption>` : ''}
      </figure>
    `;
  }
});

const html = convertBlocks(blockData, {
  blockTransformers: {
    'core/image': customImageHandler
  }
});
``` 