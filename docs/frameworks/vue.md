# Vue Integration

This guide covers how to integrate WP Block to HTML with Vue applications for converting WordPress blocks into Vue components.

## Installation

To use WP Block to HTML with Vue, install the core package and Vue integration:

```bash
# Using npm
npm install wp-block-to-html

# Using yarn
yarn add wp-block-to-html

# Using pnpm
pnpm add wp-block-to-html
```

Note that `vue` is a peer dependency and should already be installed in your project.

## Basic Usage

Here's how to convert WordPress blocks to Vue components:

```vue
<template>
  <div class="wordpress-content">
    <component 
      v-for="(component, index) in components" 
      :key="index" 
      :is="component.component"
      v-bind="component.props"
    />
  </div>
</template>

<script>
import { convertBlocksToVue } from 'wp-block-to-html/vue';

export default {
  name: 'WordPressContent',
  props: {
    blocks: {
      type: Array,
      required: true
    }
  },
  computed: {
    components() {
      // Convert blocks to Vue components
      return convertBlocksToVue(this.blocks, {
        cssFramework: 'tailwind'
      });
    }
  }
}
</script>
```

## Configuration Options

The `convertBlocksToVue` function accepts the same options as the core `convertBlocks` function, with additional Vue-specific options:

```vue
<script>
import { convertBlocksToVue } from 'wp-block-to-html/vue';

export default {
  name: 'WordPressContent',
  props: {
    blocks: {
      type: Array,
      required: true
    }
  },
  computed: {
    components() {
      return convertBlocksToVue(this.blocks, {
        // Core options
        cssFramework: 'tailwind',
        classMap: this.customClassMap,
        contentHandling: 'raw',
        
        // Vue-specific options
        components: {
          // Custom component mapping
          'core/image': () => import('@/components/CustomImage.vue')
        },
        wrapBlocks: true,
        globalProps: {
          // Props to pass to all components
          className: 'my-custom-class'
        }
      });
    }
  }
}
</script>
```

### Vue-Specific Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `components` | `Object` | `{}` | Map of block names to custom Vue components |
| `wrapBlocks` | `Boolean` | `false` | Whether to wrap each block in a div with data attributes |
| `globalProps` | `Object` | `{}` | Props to pass to all generated components |

## Using Custom Components

You can provide custom Vue components for specific blocks:

```vue
<!-- CustomImage.vue -->
<template>
  <div class="image-wrapper">
    <img 
      :src="src" 
      :alt="alt" 
      :width="width" 
      :height="height"
      :class="className"
      loading="lazy"
    />
    <div class="image-caption" v-if="alt">{{ alt }}</div>
  </div>
</template>

<script>
export default {
  name: 'CustomImage',
  props: {
    src: String,
    alt: String,
    width: Number,
    height: Number,
    className: String
  }
}
</script>
```

Then use it in your content component:

```vue
<script>
import { convertBlocksToVue } from 'wp-block-to-html/vue';
import CustomImage from '@/components/CustomImage.vue';

export default {
  computed: {
    components() {
      return convertBlocksToVue(this.blocks, {
        components: {
          'core/image': CustomImage
        }
      });
    }
  }
}
</script>
```

## Handling Events

Vue components can include event handlers:

```vue
<!-- CustomButton.vue -->
<template>
  <a 
    :href="url" 
    :class="className"
    @click="handleClick"
  >
    {{ text }}
  </a>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    url: String,
    text: String,
    className: String
  },
  methods: {
    handleClick(e) {
      console.log('Button clicked:', this.text);
      // Add analytics tracking or other functionality
      this.$emit('button-click', { text: this.text, url: this.url });
    }
  }
}
</script>
```

Use the component in your main content component:

```vue
<template>
  <div class="buttons-section">
    <component 
      v-for="(component, index) in buttonComponents"
      :key="index"
      :is="component.component"
      v-bind="component.props"
      @button-click="trackButtonClick"
    />
  </div>
</template>

<script>
import { convertBlocksToVue } from 'wp-block-to-html/vue';
import CustomButton from '@/components/CustomButton.vue';

export default {
  props: {
    blocks: Array
  },
  computed: {
    buttonComponents() {
      return convertBlocksToVue(this.blocks, {
        components: {
          'core/button': CustomButton
        }
      });
    }
  },
  methods: {
    trackButtonClick(data) {
      // Track button click events
      console.log('Button click tracked:', data);
    }
  }
}
</script>
```

## Server-Side Rendering with Vue

For server-side rendering in frameworks like Nuxt.js:

```vue
<!-- pages/_slug.vue -->
<template>
  <article>
    <h1 v-html="post.title.rendered"></h1>
    <div class="post-meta">
      <time :datetime="post.date">{{ formatDate(post.date) }}</time>
    </div>
    <div class="post-content">
      <component 
        v-for="(component, index) in contentComponents" 
        :key="index" 
        :is="component.component"
        v-bind="component.props"
      />
    </div>
  </article>
</template>

<script>
import { convertBlocksToVue } from 'wp-block-to-html/vue';
import { processBlocksForSSR } from 'wp-block-to-html';

export default {
  async asyncData({ params, $axios }) {
    // Fetch post data from WordPress API
    const response = await $axios.$get(
      `https://your-wp-site.com/wp-json/wp/v2/posts?slug=${params.slug}&_embed=wp:blockdata`
    );
    
    if (response.length === 0) {
      return { notFound: true };
    }
    
    const post = response[0];
    let blocks = [];
    
    if (post._embedded && post._embedded['wp:blockdata']) {
      blocks = post._embedded['wp:blockdata'];
      
      // Apply SSR optimizations
      blocks = processBlocksForSSR(blocks, {
        optimizationLevel: 'balanced'
      });
    }
    
    return {
      post,
      blocks
    };
  },
  computed: {
    contentComponents() {
      return convertBlocksToVue(this.blocks, {
        cssFramework: 'tailwind'
      });
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }
}
</script>
```

## CSS Framework Integration

WP Block to HTML works well with various CSS frameworks in Vue:

### Tailwind CSS

```vue
<template>
  <div class="prose lg:prose-xl">
    <component 
      v-for="(component, index) in components" 
      :key="index" 
      :is="component.component"
      v-bind="component.props"
    />
  </div>
</template>

<script>
import { convertBlocksToVue } from 'wp-block-to-html/vue';

export default {
  props: {
    blocks: Array
  },
  computed: {
    components() {
      return convertBlocksToVue(this.blocks, {
        cssFramework: 'tailwind'
      });
    }
  }
}
</script>
```

### Bootstrap

```vue
<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <component 
          v-for="(component, index) in components" 
          :key="index" 
          :is="component.component"
          v-bind="component.props"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { convertBlocksToVue } from 'wp-block-to-html/vue';
import 'bootstrap/dist/css/bootstrap.min.css';

export default {
  props: {
    blocks: Array
  },
  computed: {
    components() {
      return convertBlocksToVue(this.blocks, {
        cssFramework: 'bootstrap'
      });
    }
  }
}
</script>
```

### Custom CSS Framework

```vue
<script>
import { convertBlocksToVue } from 'wp-block-to-html/vue';
import { getClassMap } from 'wp-block-to-html';

export default {
  props: {
    blocks: Array
  },
  computed: {
    customClassMap() {
      // Get the base class map for Tailwind
      const tailwindClasses = getClassMap('tailwind');
      
      // Create custom class map
      return {
        ...tailwindClasses,
        paragraph: {
          base: 'my-custom-paragraph mb-4 text-gray-800',
          alignLeft: 'text-left',
          alignCenter: 'text-center',
          alignRight: 'text-right'
        },
        heading: {
          base: 'font-display',
          level1: 'text-4xl mb-6',
          level2: 'text-3xl mb-5',
          level3: 'text-2xl mb-4',
          level4: 'text-xl mb-3',
          level5: 'text-lg mb-2',
          level6: 'text-base mb-2'
        }
      };
    },
    components() {
      return convertBlocksToVue(this.blocks, {
        classMap: this.customClassMap
      });
    }
  }
}
</script>
```

## Composition API Support

WP Block to HTML works with Vue's Composition API:

```vue
<template>
  <div class="wordpress-content">
    <component 
      v-for="(component, index) in components" 
      :key="index" 
      :is="component.component"
      v-bind="component.props"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { convertBlocksToVue } from 'wp-block-to-html/vue';

const props = defineProps({
  blocks: Array
});

const components = computed(() => {
  return convertBlocksToVue(props.blocks, {
    cssFramework: 'tailwind'
  });
});
</script>
```

## TypeScript Support

WP Block to HTML includes TypeScript definitions for Vue integration:

```vue
<template>
  <div class="wordpress-content">
    <component 
      v-for="(component, index) in components" 
      :key="index" 
      :is="component.component"
      v-bind="component.props"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { convertBlocksToVue, VueConversionOptions } from 'wp-block-to-html/vue';
import { WordPressBlock } from 'wp-block-to-html';

interface CustomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default defineComponent({
  name: 'WordPressContent',
  props: {
    blocks: {
      type: Array as PropType<WordPressBlock[]>,
      required: true
    }
  },
  setup(props) {
    const options: VueConversionOptions = {
      cssFramework: 'tailwind'
    };
    
    const components = computed(() => {
      return convertBlocksToVue(props.blocks, options);
    });
    
    return {
      components
    };
  }
});
</script>
```

## Performance Optimization

For optimal performance with Vue:

1. **Component Caching**: Use `v-once` for static components

```vue
<template>
  <div class="static-content">
    <component 
      v-for="(component, index) in staticComponents" 
      :key="index" 
      :is="component.component"
      v-bind="component.props"
      v-once
    />
  </div>
</template>
```

2. **Async Components**: Use Vue's async component loading for heavy components

```vue
<script>
export default {
  computed: {
    components() {
      return convertBlocksToVue(this.blocks, {
        components: {
          'core/gallery': () => import('@/components/Gallery.vue')
        }
      });
    }
  }
}
</script>
```

3. **Keep Components Simple**: Avoid unnecessary reactivity

## Vuex Integration for State Management

If you're using Vuex for state management:

```vue
<script>
import { mapState } from 'vuex';
import { convertBlocksToVue } from 'wp-block-to-html/vue';

export default {
  computed: {
    ...mapState(['blocks']),
    components() {
      return convertBlocksToVue(this.blocks, {
        cssFramework: 'tailwind'
      });
    }
  }
}
</script>
```

Vuex store setup:

```js
// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    blocks: [],
    post: null
  },
  mutations: {
    SET_BLOCKS(state, blocks) {
      state.blocks = blocks;
    },
    SET_POST(state, post) {
      state.post = post;
    }
  },
  actions: {
    async fetchPost({ commit }, slug) {
      try {
        const response = await fetch(
          `https://your-wp-site.com/wp-json/wp/v2/posts?slug=${slug}&_embed=wp:blockdata`
        );
        const posts = await response.json();
        
        if (posts.length > 0) {
          const post = posts[0];
          commit('SET_POST', post);
          
          if (post._embedded && post._embedded['wp:blockdata']) {
            commit('SET_BLOCKS', post._embedded['wp:blockdata']);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }
  }
});
```

## Complete Example

Here's a complete example of using WP Block to HTML with Vue:

```vue
<!-- components/WordPressPost.vue -->
<template>
  <article v-if="post" class="wordpress-post">
    <header>
      <h1 v-html="post.title.rendered"></h1>
      <div class="post-meta">
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      </div>
    </header>
    
    <div class="post-content">
      <component 
        v-for="(component, index) in contentComponents" 
        :key="index" 
        :is="component.component"
        v-bind="component.props"
      />
    </div>
  </article>
  <div v-else-if="loading" class="loading">Loading post...</div>
  <div v-else class="not-found">Post not found</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { convertBlocksToVue } from 'wp-block-to-html/vue';
import { processBlocksForSSR } from 'wp-block-to-html';

export default {
  name: 'WordPressPost',
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const post = ref(null);
    const blocks = ref([]);
    const loading = ref(true);
    const error = ref(null);
    
    const contentComponents = computed(() => {
      return convertBlocksToVue(blocks.value, {
        cssFramework: 'tailwind',
        contentHandling: 'raw'
      });
    });
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };
    
    const fetchPost = async () => {
      try {
        loading.value = true;
        const response = await fetch(
          `https://your-wp-site.com/wp-json/wp/v2/posts?slug=${props.slug}&_embed=wp:blockdata`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const posts = await response.json();
        
        if (posts.length > 0) {
          post.value = posts[0];
          
          if (post.value._embedded && post.value._embedded['wp:blockdata']) {
            // Apply SSR optimizations to blocks
            blocks.value = processBlocksForSSR(
              post.value._embedded['wp:blockdata'],
              { optimizationLevel: 'balanced' }
            );
          }
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };
    
    onMounted(fetchPost);
    
    return {
      post,
      loading,
      error,
      contentComponents,
      formatDate
    };
  }
}
</script>

<style scoped>
.wordpress-post {
  max-width: 800px;
  margin: 0 auto;
}

.post-meta {
  color: #666;
  margin-bottom: 2rem;
}

.loading, .not-found {
  text-align: center;
  padding: 2rem;
}
</style>
```

## Troubleshooting Vue Integration

### Common Issues

1. **Components Not Rendering**: Ensure blocks array has the correct format with blockName property
2. **Missing Block Handlers**: If custom blocks aren't rendering, make sure they have appropriate handlers
3. **SSR Hydration Issues**: For SSR, ensure Vue components produce the same output as the server-rendered HTML

### Hydration Solutions

For Vue 3 and Nuxt 3, prevent hydration mismatches:

```vue
<template>
  <div>
    <client-only>
      <component 
        v-for="(component, index) in components" 
        :key="index" 
        :is="component.component"
        v-bind="component.props"
      />
    </client-only>
    
    <template #fallback>
      <div v-html="staticHtml"></div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { convertBlocksToVue } from 'wp-block-to-html/vue';
import { convertBlocks } from 'wp-block-to-html';

const props = defineProps({
  blocks: Array
});

const components = computed(() => {
  return convertBlocksToVue(props.blocks, {
    cssFramework: 'tailwind'
  });
});

const staticHtml = computed(() => {
  return convertBlocks(props.blocks, {
    cssFramework: 'tailwind'
  });
});
</script>
``` 