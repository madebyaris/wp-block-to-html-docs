#!/usr/bin/env node

/**
 * Documentation Build Script
 * 
 * This script builds the documentation site using VitePress
 * and can be extended to perform additional tasks such as:
 * - Copying additional assets
 * - Deploying to GitHub Pages
 * - Generating a sitemap
 * - etc.
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, resolve } from 'path';

// Configuration
const config = {
  // Base directories
  docsDir: 'docs',
  outputDir: 'docs/.vitepress/dist',
  publicDir: 'docs/public',
  
  // Assets to copy
  assets: [
    { src: 'docs/public/logo.svg', dest: 'docs/.vitepress/dist/logo.svg' },
    // Add more assets if needed
  ],
  
  // Commands to run
  commands: {
    clean: 'rm -rf docs/.vitepress/dist',
    build: 'vitepress build docs',
  }
};

/**
 * Main build function
 */
async function build() {
  try {
    console.log('📝 Building documentation site...');
    
    // 1. Clean the output directory
    console.log('🧹 Cleaning output directory...');
    execSync(config.commands.clean, { stdio: 'inherit' });
    
    // 2. Build the documentation
    console.log('🔨 Building VitePress site...');
    execSync(config.commands.build, { stdio: 'inherit' });
    
    // 3. Copy additional assets if needed
    console.log('📦 Copying additional assets...');
    copyAssets();
    
    // 4. Generate sitemap (optional)
    // generateSitemap();
    
    console.log('✅ Documentation built successfully!');
    console.log(`📂 Output directory: ${resolve(config.outputDir)}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

/**
 * Copy additional assets to the output directory
 */
function copyAssets() {
  config.assets.forEach(asset => {
    const destDir = asset.dest.split('/').slice(0, -1).join('/');
    
    // Create destination directory if it doesn't exist
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    // Copy the asset
    copyFileSync(asset.src, asset.dest);
    console.log(`  Copied ${asset.src} to ${asset.dest}`);
  });
}

/**
 * Generate a sitemap (example, not implemented)
 */
function generateSitemap() {
  console.log('📊 Generating sitemap...');
  // Implementation would go here
}

// Run the build process
build().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 