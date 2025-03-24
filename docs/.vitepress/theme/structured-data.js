// JSON-LD structured data for SEO
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "WP Block to HTML",
  "applicationCategory": "DeveloperApplication",
  "applicationSubCategory": "WordPress Tool",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "A powerful utility for converting WordPress block data to framework-agnostic HTML or framework-specific components with advanced optimization features.",
  "author": {
    "@type": "Person",
    "name": "Aris Setiawan",
    "url": "https://madebyaris.com"
  },
  "softwareVersion": "1.0.0",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "ratingCount": "1",
    "reviewCount": "1"
  },
  "review": {
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": "Aris Setiawan"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5"
    },
    "reviewBody": "This library makes it easy to convert WordPress Gutenberg blocks to clean HTML or framework components."
  }
};

// Organization data
export const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Made by Aris",
  "url": "https://madebyaris.com",
  "logo": "https://madebyaris.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://madebyaris.com/contact"
  }
};

// Website data
export const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "WP Block to HTML Documentation",
  "url": "https://docs-block.madebyaris.com/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://docs-block.madebyaris.com/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}; 