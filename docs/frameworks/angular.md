# Angular Integration

This guide explains how to integrate WP Block to HTML with Angular applications.

## Setting Up an Angular Project

First, create a new Angular project if you don't have one already:

```bash
ng new my-wp-angular-app
cd my-wp-angular-app
```

Next, install WP Block to HTML:

```bash
npm install wp-block-to-html
```

## Basic Integration

The most straightforward way to use WP Block to HTML with Angular is by converting WordPress blocks to HTML strings and using Angular's `[innerHTML]` property to render them:

```typescript
// src/app/services/wordpress.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertBlocks } from 'wp-block-to-html';

@Injectable({
  providedIn: 'root'
})
export class WordPressService {
  private apiUrl = 'https://your-wordpress-site.com/wp-json/wp/v2';

  constructor(private http: HttpClient) {}

  getPost(slug: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/posts?slug=${slug}&_fields=id,title,excerpt,content,blocks`)
      .pipe(
        map(posts => {
          if (!posts || posts.length === 0) {
            throw new Error('Post not found');
          }
          
          const post = posts[0];
          
          // Process content based on what's available
          let content = '';
          
          if (post.blocks) {
            // Convert blocks to HTML
            content = convertBlocks(post.blocks, {
              cssFramework: 'bootstrap', // Match your Angular project's CSS framework
              contentHandling: 'html'
            });
          } else if (post.content?.rendered) {
            // Use pre-rendered content if blocks aren't available
            content = post.content.rendered;
          }
          
          return {
            id: post.id,
            title: post.title.rendered,
            excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
            content: content
          };
        })
      );
  }
}
```

Then, create a component to display the post:

```typescript
// src/app/components/post/post.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordPressService } from '../../services/wordpress.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-post',
  template: `
    <div class="container mt-4" *ngIf="post">
      <h1 [innerHTML]="post.title"></h1>
      <div [innerHTML]="safeContent"></div>
    </div>
    <div class="container mt-4" *ngIf="!post && !error">
      <p>Loading...</p>
    </div>
    <div class="container mt-4 alert alert-danger" *ngIf="error">
      <p>{{ error }}</p>
    </div>
  `,
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post: any = null;
  safeContent: SafeHtml | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private wpService: WordPressService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error = 'No post slug provided';
      return;
    }

    this.wpService.getPost(slug).subscribe({
      next: (post) => {
        this.post = post;
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(post.content);
      },
      error: (err) => {
        this.error = 'Error loading post: ' + err.message;
      }
    });
  }
}
```

Make sure to configure your Angular routing:

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from './components/post/post.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'posts/:slug', component: PostComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

And update your `app.module.ts` to include the HttpClientModule:

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PostComponent } from './components/post/post.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Creating a Dedicated WordPress Module

For larger applications, you might want to create a dedicated WordPress module:

```typescript
// src/app/wordpress/wordpress.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WordPressService } from './services/wordpress.service';
import { PostComponent } from './components/post/post.component';
import { PostListComponent } from './components/post-list/post-list.component';

@NgModule({
  declarations: [
    PostComponent,
    PostListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    PostComponent,
    PostListComponent
  ],
  providers: [
    WordPressService
  ]
})
export class WordPressModule { }
```

## Creating a Specialized Component for WordPress Blocks

You can create an Angular component specifically for rendering WordPress blocks:

```typescript
// src/app/wordpress/components/wp-blocks/wp-blocks.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { convertBlocks } from 'wp-block-to-html';

@Component({
  selector: 'app-wp-blocks',
  template: '<div [innerHTML]="safeContent"></div>',
  styles: [':host ::ng-deep img { max-width: 100%; height: auto; }']
})
export class WpBlocksComponent implements OnChanges {
  @Input() blocks: any[] | null = null;
  @Input() cssFramework: 'bootstrap' | 'tailwind' | 'foundation' | 'bulma' | 'none' = 'bootstrap';
  @Input() fallbackContent: string | null = null;
  
  safeContent: SafeHtml | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.renderContent();
  }

  private renderContent(): void {
    let content = '';
    
    if (this.blocks && this.blocks.length > 0) {
      content = convertBlocks(this.blocks, {
        cssFramework: this.cssFramework,
        contentHandling: 'html'
      });
    } else if (this.fallbackContent) {
      content = this.fallbackContent;
    }
    
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
```

And use it in your post component:

```typescript
// Updated post.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordPressService } from '../../services/wordpress.service';

@Component({
  selector: 'app-post',
  template: `
    <div class="container mt-4" *ngIf="post">
      <h1 [innerHTML]="post.title"></h1>
      <app-wp-blocks 
        [blocks]="post.blocks" 
        [fallbackContent]="post.content?.rendered"
        [cssFramework]="'bootstrap'"
      ></app-wp-blocks>
    </div>
    <div class="container mt-4" *ngIf="!post && !error">
      <p>Loading...</p>
    </div>
    <div class="container mt-4 alert alert-danger" *ngIf="error">
      <p>{{ error }}</p>
    </div>
  `,
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post: any = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private wpService: WordPressService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error = 'No post slug provided';
      return;
    }

    this.wpService.getPostRaw(slug).subscribe({
      next: (post) => {
        this.post = post;
      },
      error: (err) => {
        this.error = 'Error loading post: ' + err.message;
      }
    });
  }
}
```

Update the service to provide the raw blocks:

```typescript
// Update WordPressService to add a getPostRaw method
getPostRaw(slug: string): Observable<any> {
  return this.http.get<any[]>(`${this.apiUrl}/posts?slug=${slug}&_fields=id,title,excerpt,content,blocks`)
    .pipe(
      map(posts => {
        if (!posts || posts.length === 0) {
          throw new Error('Post not found');
        }
        
        return {
          id: posts[0].id,
          title: posts[0].title.rendered,
          excerpt: posts[0].excerpt.rendered.replace(/<[^>]+>/g, ''),
          content: posts[0].content,
          blocks: posts[0].blocks
        };
      })
    );
}
```

## Server-Side Rendering with Angular Universal

For improved performance and SEO, you can use Angular Universal with WP Block to HTML:

1. First, add Angular Universal to your project:

```bash
ng add @nguniversal/express-engine
```

2. Update your `wordpress.service.ts` to support server-side rendering:

```typescript
// src/app/services/wordpress.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { convertBlocks } from 'wp-block-to-html';

@Injectable({
  providedIn: 'root'
})
export class WordPressService {
  private apiUrl = 'https://your-wordpress-site.com/wp-json/wp/v2';
  private isServer: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  getPost(slug: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/posts?slug=${slug}&_fields=id,title,excerpt,content,blocks`)
      .pipe(
        map(posts => {
          if (!posts || posts.length === 0) {
            throw new Error('Post not found');
          }
          
          const post = posts[0];
          
          // Process content based on what's available
          let content = '';
          
          if (post.blocks) {
            // Convert blocks to HTML with SSR optimizations when on server
            content = convertBlocks(post.blocks, {
              cssFramework: 'bootstrap',
              contentHandling: 'html',
              ssrOptions: {
                enabled: this.isServer,
                optimizationLevel: 'balanced',
                lazyLoadMedia: true
              }
            });
          } else if (post.content?.rendered) {
            // Use pre-rendered content if blocks aren't available
            content = post.content.rendered;
          }
          
          return {
            id: post.id,
            title: post.title.rendered,
            excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
            content: content
          };
        })
      );
  }
}
```

## Handling Styles

### Using with Bootstrap

If you're using Bootstrap with Angular, make sure to install it:

```bash
npm install bootstrap
```

And include it in your `angular.json` file:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.scss"
]
```

Then configure WP Block to HTML to use Bootstrap:

```typescript
convertBlocks(blocks, {
  cssFramework: 'bootstrap',
  // other options...
});
```

### Using with Tailwind CSS

For Tailwind CSS, first set it up with Angular:

```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init
```

Configure your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update your `styles.scss`:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Then configure WP Block to HTML to use Tailwind:

```typescript
convertBlocks(blocks, {
  cssFramework: 'tailwind',
  // other options...
});
```

## Advanced Features

### Custom Block Transformer

You can create custom block transformers for specific WordPress blocks:

```typescript
// src/app/wordpress/transformers/custom-transformer.ts
import { BlockTransformer } from 'wp-block-to-html';

export const customParagraphTransformer: BlockTransformer = {
  transform: (block, options) => {
    if (block.blockName !== 'core/paragraph') {
      return null;
    }
    
    const classes = options.cssFramework === 'bootstrap' 
      ? 'lead my-4' 
      : 'text-lg my-4';
      
    const content = block.innerContent[0] || '';
    
    return `<p class="${classes}">${content}</p>`;
  }
};

// Usage in your service or component
import { convertBlocks } from 'wp-block-to-html';
import { customParagraphTransformer } from './transformers/custom-transformer';

const content = convertBlocks(blocks, {
  cssFramework: 'bootstrap',
  blockTransformers: [
    customParagraphTransformer
  ]
});
```

### Creating a Global Configuration Provider

For consistent configuration across your application:

```typescript
// src/app/wordpress/services/wp-config.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WpConfigService {
  readonly conversionOptions = {
    cssFramework: 'bootstrap' as const,
    contentHandling: 'html' as const,
    ssrOptions: {
      enabled: true,
      optimizationLevel: 'balanced' as const,
      lazyLoadMedia: true
    }
  };
  
  getConversionOptions() {
    return { ...this.conversionOptions };
  }
}

// Usage in components
constructor(private wpConfigService: WpConfigService) {}

ngOnInit() {
  const options = this.wpConfigService.getConversionOptions();
  const content = convertBlocks(blocks, options);
}
```

## Performance Optimization

For optimal performance in Angular applications:

```typescript
import { convertBlocks } from 'wp-block-to-html';

// In your component or service
const content = convertBlocks(blocks, {
  cssFramework: 'bootstrap',
  ssrOptions: {
    enabled: true,
    optimizationLevel: 'maximum',
    lazyLoadMedia: true,
    criticalPathOnly: true,
    preconnect: true
  },
  incrementalOptions: {
    enabled: true,
    initialRenderCount: 5,
    batchSize: 3,
    renderDelay: 100
  }
});
```

## Example: Complete Angular Post Component

Here's a complete example of an Angular component that fetches and displays WordPress content:

```typescript
// src/app/components/post/post.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordPressService } from '../../services/wordpress.service';
import { DomSanitizer, SafeHtml, Title, Meta } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-post',
  template: `
    <div class="container mt-4">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
          <li class="breadcrumb-item active" aria-current="page">{{ post?.title || 'Post' }}</li>
        </ol>
      </nav>
      
      <div *ngIf="post">
        <h1 class="display-4 mb-3" [innerHTML]="post.title"></h1>
        <div class="lead mb-4" *ngIf="post.excerpt" [innerHTML]="post.excerpt"></div>
        <hr>
        <div class="post-content" [innerHTML]="safeContent"></div>
      </div>
      
      <div class="d-flex justify-content-center my-5" *ngIf="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div class="alert alert-danger" *ngIf="error">
        <h4 class="alert-heading">Error</h4>
        <p>{{ error }}</p>
        <button class="btn btn-outline-danger" (click)="retryLoading()">Try Again</button>
      </div>
      
      <div class="related-posts mt-5" *ngIf="relatedPosts && relatedPosts.length > 0">
        <h3 class="mb-4">Related Posts</h3>
        <div class="row">
          <div class="col-md-4" *ngFor="let relatedPost of relatedPosts">
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title">{{ relatedPost.title }}</h5>
                <p class="card-text">{{ relatedPost.excerpt }}</p>
                <a [routerLink]="['/posts', relatedPost.slug]" class="btn btn-primary">Read More</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post: any = null;
  safeContent: SafeHtml | null = null;
  loading = true;
  error: string | null = null;
  relatedPosts: any[] = [];
  private currentSlug: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private wpService: WordPressService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.loading = true;
        this.error = null;
        this.currentSlug = params.get('slug');
        
        if (!this.currentSlug) {
          this.error = 'No post slug provided';
          this.loading = false;
          return of(null);
        }
        
        return this.wpService.getPost(this.currentSlug);
      })
    ).subscribe({
      next: (post) => {
        if (post) {
          this.post = post;
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(post.content);
          
          // Set meta tags for SEO
          this.titleService.setTitle(post.title);
          this.metaService.updateTag({ name: 'description', content: post.excerpt });
          
          // Load related posts
          this.loadRelatedPosts(post.id);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading post: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadRelatedPosts(postId: number): void {
    this.wpService.getRelatedPosts(postId, 3).subscribe({
      next: (posts) => {
        this.relatedPosts = posts;
      },
      error: () => {
        // Silent fail for related posts
        this.relatedPosts = [];
      }
    });
  }

  retryLoading(): void {
    if (this.currentSlug) {
      this.loading = true;
      this.error = null;
      
      this.wpService.getPost(this.currentSlug).subscribe({
        next: (post) => {
          this.post = post;
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(post.content);
          this.loading = false;
          
          // Load related posts
          this.loadRelatedPosts(post.id);
        },
        error: (err) => {
          this.error = 'Error loading post: ' + err.message;
          this.loading = false;
        }
      });
    }
  }
}
```

Add the related posts method to your service:

```typescript
// Add to WordPressService
getRelatedPosts(postId: number, count: number = 3): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/posts?exclude=${postId}&per_page=${count}&_fields=id,title,slug,excerpt`
  ).pipe(
    map(posts => posts.map(post => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 100)
    })))
  );
}
```

## Next Steps

- Check out the [Server-Side Rendering guide](/guide/server-side-rendering) for more advanced SSR techniques.
- Learn about [CSS Framework Integration](/guide/css-frameworks) for styling options.
- Explore [Performance Optimization](/guide/performance) strategies for high-traffic sites.
- Read about [Custom Block Transformers](/guide/custom-transformers) to customize block rendering for your Angular app. 