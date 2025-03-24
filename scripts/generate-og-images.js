/**
 * Generate Open Graph and Twitter card images for the documentation site
 * This script uses the Canvas API to create images with the library name and description
 */

import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOGImage() {
  try {
    // Create a canvas for OG image (1200x630 is recommended for Open Graph)
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add a color band at the top
    ctx.fillStyle = '#3eaf7c';
    ctx.fillRect(0, 0, canvas.width, 8);

    // Try to load a logo if it exists
    try {
      const logo = await loadImage(path.join(__dirname, '../docs/public/logo.svg'));
      // Draw logo
      ctx.drawImage(logo, 100, 100, 200, 200);
    } catch (err) {
      console.log('Logo not found, continuing without it');
    }

    // Set up text
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 60px Arial';
    ctx.fillText('WP Block to HTML', 100, 380);

    ctx.font = '30px Arial';
    ctx.fillText('Convert WordPress blocks to framework-agnostic HTML', 100, 450);
    ctx.fillText('or framework-specific components', 100, 500);

    // Add website URL at the bottom
    ctx.fillStyle = '#666666';
    ctx.font = '24px Arial';
    ctx.fillText('docs-block.madebyaris.com', 100, 570);

    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../docs/public/og-image.png'), buffer);
    console.log('Created Open Graph image');

    // Create a smaller version for Twitter
    const twitterCanvas = createCanvas(800, 418);
    const twitterCtx = twitterCanvas.getContext('2d');

    // Set background color
    twitterCtx.fillStyle = '#ffffff';
    twitterCtx.fillRect(0, 0, twitterCanvas.width, twitterCanvas.height);

    // Add a color band at the top
    twitterCtx.fillStyle = '#3eaf7c';
    twitterCtx.fillRect(0, 0, twitterCanvas.width, 6);

    // Try to load a logo if it exists
    try {
      const logo = await loadImage(path.join(__dirname, '../docs/public/logo.svg'));
      // Draw logo
      twitterCtx.drawImage(logo, 60, 60, 120, 120);
    } catch (err) {
      console.log('Logo not found, continuing without Twitter card');
    }

    // Set up text
    twitterCtx.fillStyle = '#333333';
    twitterCtx.font = 'bold 40px Arial';
    twitterCtx.fillText('WP Block to HTML', 60, 240);

    twitterCtx.font = '20px Arial';
    twitterCtx.fillText('Convert WordPress blocks to framework-agnostic HTML', 60, 290);
    twitterCtx.fillText('or framework-specific components', 60, 320);

    // Add website URL at the bottom
    twitterCtx.fillStyle = '#666666';
    twitterCtx.font = '16px Arial';
    twitterCtx.fillText('docs-block.madebyaris.com', 60, 370);

    // Save the Twitter image
    const twitterBuffer = twitterCanvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../docs/public/twitter-card.png'), twitterBuffer);
    console.log('Created Twitter card image');
  } catch (error) {
    console.error('Error generating images:', error);
  }
}

// Run the function
generateOGImage().catch(console.error);
